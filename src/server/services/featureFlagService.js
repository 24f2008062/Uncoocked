import { getSystemSetting, setSystemSetting, getAllSystemSettings } from "./systemSettingsService.js";

const FLAG_PREFIX = "FEATURE_";

// Production Catalog of Feature Flags with Safe Defaults
export const KNOWN_FEATURE_FLAGS = {
  RECOMMENDATIONS_ENGINE: {
    description: "Enable AI-driven event recommendation engine",
    defaultValue: true,
  },
  HOST_AUTO_VERIFICATION: {
    description: "Enable automatic AI verification for host KYC applications",
    defaultValue: false,
  },
  ADVANCED_ANALYTICS: {
    description: "Enable real-time platform telemetry aggregation",
    defaultValue: true,
  },
  MAINTENANCE_MODE_BANNER: {
    description: "Display global maintenance mode warning banner to users",
    defaultValue: true,
  },
};

export function normalizeFlagKey(flagKey) {
  const cleanKey = flagKey.toUpperCase().trim();
  return cleanKey.startsWith(FLAG_PREFIX) ? cleanKey : `${FLAG_PREFIX}${cleanKey}`;
}

export async function isFeatureEnabled(flagKey, defaultValue = null) {
  const fullKey = normalizeFlagKey(flagKey);
  const catalogKey = fullKey.replace(FLAG_PREFIX, "");
  const fallback = defaultValue ?? (KNOWN_FEATURE_FLAGS[catalogKey]?.defaultValue ?? false);

  return getSystemSetting(fullKey, fallback);
}

export async function setFeatureFlag(flagKey, enabled, adminId, description = null) {
  const fullKey = normalizeFlagKey(flagKey);
  const catalogKey = fullKey.replace(FLAG_PREFIX, "");
  const flagDesc = description || KNOWN_FEATURE_FLAGS[catalogKey]?.description || `Feature flag ${catalogKey}`;

  // Delegate directly to setSystemSetting to handle validation, $transaction, audit logging, & cache invalidation
  return setSystemSetting(
    fullKey,
    Boolean(enabled),
    adminId,
    "BOOLEAN",
    flagDesc,
    `Toggled feature flag ${catalogKey} to ${Boolean(enabled)}`
  );
}

export async function getAllFeatureFlags() {
  const allSettings = await getAllSystemSettings();
  const flags = {};

  // Populate from known catalog first to guarantee safe defaults
  for (const [catalogKey, meta] of Object.entries(KNOWN_FEATURE_FLAGS)) {
    const fullKey = `${FLAG_PREFIX}${catalogKey}`;
    flags[catalogKey] = {
      key: catalogKey,
      fullKey,
      enabled: allSettings[fullKey] ?? meta.defaultValue,
      description: meta.description,
      isCatalog: true,
    };
  }

  // Include any dynamic flags created at runtime
  for (const [key, value] of Object.entries(allSettings)) {
    if (key.startsWith(FLAG_PREFIX)) {
      const catalogKey = key.replace(FLAG_PREFIX, "");
      if (!flags[catalogKey]) {
        flags[catalogKey] = {
          key: catalogKey,
          fullKey: key,
          enabled: value,
          description: `Custom feature flag ${catalogKey}`,
          isCatalog: false,
        };
      }
    }
  }

  return flags;
}

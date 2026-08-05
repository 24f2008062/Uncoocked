import { getSystemSetting, setSystemSetting, getAllSystemSettings } from "./systemSettingsService.js";
import { prisma } from "../db/prisma.js";

export const KILL_SWITCHES = {
  MAINTENANCE_MODE: "MAINTENANCE_MODE",
  DISABLE_REGISTRATIONS: "KILL_SWITCH_REGISTRATIONS",
  DISABLE_HOST_APPLICATIONS: "KILL_SWITCH_HOST_APPLICATIONS",
  DISABLE_PAYMENTS: "KILL_SWITCH_PAYMENTS",
};

export async function getOperationalStatus() {
  const allSettings = await getAllSystemSettings();
  return {
    maintenanceMode: Boolean(allSettings[KILL_SWITCHES.MAINTENANCE_MODE] ?? false),
    registrationsDisabled: Boolean(allSettings[KILL_SWITCHES.DISABLE_REGISTRATIONS] ?? false),
    hostApplicationsDisabled: Boolean(allSettings[KILL_SWITCHES.DISABLE_HOST_APPLICATIONS] ?? false),
    paymentsDisabled: Boolean(allSettings[KILL_SWITCHES.DISABLE_PAYMENTS] ?? false),
  };
}

export async function toggleKillSwitch(switchKey, enabled, adminId, reason = null) {
  if (!Object.values(KILL_SWITCHES).includes(switchKey) && !switchKey.startsWith("KILL_SWITCH_")) {
    throw new Error(`Invalid kill switch key: ${switchKey}`);
  }

  const previousValue = await getSystemSetting(switchKey, false);
  const stringValue = String(Boolean(enabled));

  // Atomic transaction ensuring zero silent audit drop
  const [updatedSwitch] = await prisma.$transaction([
    prisma.systemSetting.upsert({
      where: { key: switchKey },
      update: { value: stringValue, type: "BOOLEAN", updatedBy: adminId, description: reason },
      create: { key: switchKey, value: stringValue, type: "BOOLEAN", updatedBy: adminId, description: reason },
    }),
    prisma.auditLog.create({
      data: {
        adminId,
        action: enabled ? "KILL_SWITCH_ACTIVATED" : "KILL_SWITCH_DEACTIVATED",
        previousStatus: String(previousValue),
        newStatus: stringValue,
        reason: reason ? `[Switch: ${switchKey}] ${reason}` : `Operational switch ${switchKey} set to ${enabled}`,
      },
    }),
  ]);

  // Synchronize cache immediately
  await setSystemSetting(switchKey, Boolean(enabled), adminId, "BOOLEAN", reason);

  return updatedSwitch;
}

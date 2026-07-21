-- Add failed-login protection fields to the User model.
-- failedLoginAttempts: consecutive failed credential attempts (reset on success)
-- lockedUntil: timestamp until which login is blocked for this account (null = not locked)

ALTER TABLE "User" ADD COLUMN "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "lockedUntil" TIMESTAMP(3);

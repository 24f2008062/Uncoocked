import { prisma } from "@/server/db/prisma";

export async function createNotification({ userId, title, message, type = "SYSTEM" }) {
  if (!userId || !title || !message) return null;

  try {
    return await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
  } catch (error) {
    console.error("Create Notification Error:", error);
    return null;
  }
}

export async function getUserNotifications(userId, { page = 1, limit = 15 } = {}) {
  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where: { userId } }),
    prisma.notification.count({ where: { userId, read: false } }),
  ]);

  return {
    notifications,
    unreadCount,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function markNotificationAsRead(notificationId, userId) {
  try {
    return await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { read: true },
    });
  } catch (error) {
    console.error("Mark Notification Read Error:", error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(userId) {
  try {
    return await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  } catch (error) {
    console.error("Mark All Notifications Read Error:", error);
    throw error;
  }
}

export async function deleteNotification(notificationId, userId) {
  try {
    return await prisma.notification.deleteMany({
      where: { id: notificationId, userId },
    });
  } catch (error) {
    console.error("Delete Notification Error:", error);
    throw error;
  }
}

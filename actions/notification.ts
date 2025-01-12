'use server';

import { prisma } from '@/lib/prisma';
import { getUserId } from './user';

export async function getNotification() {
  try {
    const userId = await getUserId();
    if (!userId) return [];

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            image: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return notifications;
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERROR IN GETTING NOTIFICATIONS:');
    }
  }
}

export async function notificationRead(notificationsId: string[]) {
  try {
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationsId,
        },
      },
      data: {
        read: true,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERROR IN MARKING NOTIFS AS READ:', error.stack);
    }
  }
}

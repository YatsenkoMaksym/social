'use server';

import { prisma } from '@/lib/prisma';
import { auth, User } from '@clerk/nextjs/server';

export default async function syncClerkWithDB(user: User) {
  try {
    if (!user || !user.id) {
      return;
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });
    if (existingUser) return existingUser;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split('@')[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });
    return dbUser;
  } catch (error) {
    if (error instanceof Error) {
      console.log('THIS ERROR IS in SYNC OF DB AND CLERK:', error.stack);
    }
  }
}

export async function userFromClerk(clerkId: string) {
  return await prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
}

export async function getUserIdFromDB() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error('Unauthorized');
  const user = await prisma.user.findUnique({
    where: {
      clerkId,
    },
    select: {
      id: true,
    },
  });

  if (!user) throw new Error('User was not found');
  return user.id;
}

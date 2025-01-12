'use server';

import { prisma } from '@/lib/prisma';
import { auth, User } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

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

export async function getUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
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

export async function getRandomUsers(amount: number) {
  try {
    const userId = await getUserId();
    if (!userId) return [];
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: amount,
    });
    return users;
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERROR IN CREATE POST:', error.stack);
    }
    return [];
  }
}

export async function toggleFollow(personToFollow: string) {
  try {
    const userId = await getUserId();
    if (!userId) return null;
    if (userId === personToFollow) throw new Error("Can't follow yourself");

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: personToFollow,
        },
      },
    });
    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: personToFollow,
          },
        },
      });
    } else {
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: personToFollow,
          },
        }),
        prisma.notification.create({
          data: {
            type: 'FOLLOW',
            userId: personToFollow,
            creatorId: userId,
          },
        }),
      ]);
    }
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERROR IN FOLLOWING/UNFOLLOWING:' + error.stack);
    }
    return { success: false };
  }
}

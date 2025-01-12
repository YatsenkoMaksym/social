'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { getUserId } from './user';

//! we user url to get username
export async function getProfile(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        location: true,
        website: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERROR IN FETCHING PROFILE:', error.stack);
    }
  }
}

export async function getCreatedPosts(userId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return posts;
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERROR IN LOADING USERS POSTS:', error.stack);
    }
  }
}

export async function getLikedPosts(userId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: { likes: { some: { userId } } },
      include: {
        author: {
          select: { id: true, name: true, username: true, image: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, username: true, image: true },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        likes: {
          select: { userId: true },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return posts;
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERROR IN FETCHING LIKED POSTS:', error.stack);
    }
  }
}

export async function updateProfile(formData: FormData) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error('Unauthorized');
    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;
    const location = formData.get('location') as string;
    const website = formData.get('website') as string;
    const user = await prisma.user.update({
      where: { clerkId },
      data: {
        name,
        bio,
        location,
        website,
      },
    });
    revalidatePath('/profile');
    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERROR IN UPDATING PROFILE:', error.stack);
    }
  }
}

export async function isFollowing(userId: string) {
  try {
    const currentUserId = await getUserId();
    if (!currentUserId) return false;
    const follow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });
    return !!follow;
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERROR IN CHECKING IF THE USER FOLLOWS', error.stack);
    }
    return false;
  }
}

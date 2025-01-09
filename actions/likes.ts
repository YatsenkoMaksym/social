'use server';

import { prisma } from '@/lib/prisma';
import { getUserIdFromDB } from './user';
import { revalidatePath } from 'next/cache';

export async function toggleLike(postId: string) {
  try {
    const userId = await getUserIdFromDB();
    if (!userId)
      throw new Error('Something went wrong, please contact support');
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    if (!post) throw new Error('Post not found :(');

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: 'LIKE',
                  userId: post.authorId,
                  creatorId: userId,
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }
    revalidatePath('/');
    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERROR IN LIKE TOGGLE:', error.stack);
    }
  }
}

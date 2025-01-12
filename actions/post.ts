'use server';

import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { getUserId } from './user';

// Define the type for the getPosts query
export type GetPostsType = Prisma.PromiseReturnType<typeof getPosts>;
export async function deletePost(postId: string) {
  try {
    const userId = await getUserId();
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    if (!post) throw new Error('Post not found');
    if (post.authorId !== userId)
      throw new Error('You are not permited to delete this post');

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    revalidatePath('/');
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERROR IN DELETING POST:' + error.stack);
    }
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
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
    });
    console.log(typeof posts);
    return posts;
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERROR IN FETCHING POSTS:', error.stack);
    }
    return [];
  }
}

export async function createPost({
  content,
  imageUrl,
}: {
  content: string;
  imageUrl: string;
}): Promise<ReturnType<typeof prisma.post.create> | null> {
  const user = await currentUser();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });
  if (!dbUser) throw new Error('User was not found in the DB!');

  const post = await prisma.post.create({
    data: {
      authorId: dbUser.id,
      content,
      image: imageUrl,
    },
  });
  revalidatePath('/');
  return post;
}

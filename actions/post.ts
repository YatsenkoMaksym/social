'use server';

import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

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

export async function deletePost(postId: string) {
  try {
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

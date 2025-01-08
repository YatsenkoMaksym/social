'use server';

import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export async function createPost({
  content,
  imageUrl,
}: {
  content: string;
  imageUrl: string;
}) {
  const user = await currentUser();
  if (!user) throw new Error('Unauthorized');

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

  return post;
}

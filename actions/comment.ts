'use server';

import { prisma } from '@/lib/prisma';
import { getUserId } from './user';
import { revalidatePath } from 'next/cache';

export async function createComment(postId: string, content: string) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error('Auth to comment on this post');
    if (!content) throw new Error('Need content to comment');

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    //! we'll user post to do:
    //* Check if post exists
    //* S end a notification to post creator (if it's not the user themselfs)

    if (!post) throw new Error('Post not found');
    const [comment] = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          content,
          postId,
          authorId: userId,
        },
      });
      if (post.authorId !== userId) {
        //! need to send a notif when comment on your own post :(
        await tx.notification.create({
          data: {
            type: 'COMMENT',
            userId: post.authorId,
            creatorId: userId,
            postId,
            commentId: newComment.id,
          },
        });
      }
      return [newComment];
    });
    revalidatePath('/');
    return comment;
  } catch (error) {
    if (error instanceof Error) {
      console.log('ERROR IN COMMENT CREATION:', error.stack);
    }
  }
}

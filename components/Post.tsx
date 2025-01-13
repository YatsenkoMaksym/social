'use client';
import { formatDistanceToNow } from 'date-fns';
import { Dot, MessageSquareIcon } from 'lucide-react';
import UserImage from './userImage';
import Link from 'next/link';
import DeleteButton from './Buttons/DeleteButton';
import Image from 'next/image';
import LikeButton from './Buttons/LikeButton';
import CommentButton from './Buttons/CommentButton';
import { GetPostsType } from '@/actions/post';
import { useState } from 'react';
import { Button } from './ui/button';
import { SignInButton, useUser } from '@clerk/nextjs';

interface PostProps {
  post: GetPostsType[number]; // Use the type for a single post
  dbUserId: string | null;
}
function Post({ post, dbUserId }: PostProps) {
  const { user } = useUser();
  const [newComment, setNewComment] = useState('');
  const hasLiked = post.likes.some((like) => like.userId === dbUserId);
  const [showComments, setShowComments] = useState(false);

  return (
    <article className='border-foreground border rounded-2xl p-3 py-5 w-full '>
      <div className='flex gap-4 px-5 items-center'>
        <UserImage imageUrl={post.author.image} />
        <span className='flex flex-col'>
          <Link href={`profile/${post.author.username}`}>
            {post.author.username ? post.author.username : post.author.name}
          </Link>
          <Link
            className='xl:text-foreground dark:text-stone-400 text-stone-800 text-sm'
            href={`profile/${post.author.username}`}
          >
            @{post.author.username}
          </Link>
        </span>
        <p className='xl:flex hidden'>
          <Dot />
          {formatDistanceToNow(new Date(post.createdAt))}
        </p>
        <span className='ml-auto'>
          {dbUserId === post.author.id && <DeleteButton postId={post.id} />}
        </span>
      </div>
      <div className='mt-8 mb-4 flex flex-col '>
        {post.content}
        {post.image && (
          <span>
            <img
              width={80}
              height={80}
              className='w-full h-full'
              src={post.image}
              alt='Failed to load image'
            />
          </span>
        )}
      </div>
      <div className='flex gap-5 ml-[10%]'>
        {user ? (
          <>
            <LikeButton
              hasLikedProp={hasLiked}
              amount={post._count.likes}
              postId={post.id}
            />
            <Button
              onClick={() => {
                setShowComments(!showComments);
              }}
            >
              <MessageSquareIcon />
            </Button>
          </>
        ) : (
          <SignInButton mode='modal'>
            <Button variant='ghost' className='text-muted-foreground'>
              Sign in!
            </Button>
          </SignInButton>
        )}
      </div>

      {showComments && (
        <div className='space-y-4 pt-4 border-t'>
          <div className='space-y-4'>
            {post.comments.map((comment) => (
              <div key={comment.id} className='flex space-x-3'>
                <UserImage
                  imageUrl={comment.author.image}
                  className='!size-8'
                />
                <div className='flex-1 min-w-0'>
                  <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                    <span className='font-medium text-sm'>
                      {comment.author.name}
                    </span>
                    <span className='text-sm text-muted-foreground'>
                      @{comment.author.username}
                    </span>
                    <span className='text-sm text-muted-foreground'>
                      <Dot />
                    </span>
                    <span className='text-sm text-muted-foreground'>
                      {formatDistanceToNow(new Date(comment.createdAt))} ago
                    </span>
                  </div>
                  <p className='text-sm break-words'>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
          {user ? (
            <div className='flex space-x-3'>
              <UserImage
                imageUrl={user.imageUrl}
                className='flex-shrink-0 size-8'
              />
              <div className='flex-1'>
                <textarea
                  className='min-h-[4rem]  text-foreground p-5 rounded-2xl max-h-[300px] h-[200px] bg-primary-foreground'
                  value={newComment}
                  onChange={(e) => {
                    setNewComment(e.target.value);
                  }}
                  placeholder='What do you think?'
                />
                <div className='flex justify-end mt-2'>
                  <Button
                    asChild
                    onClick={() => {
                      setNewComment('');
                    }}
                    disabled={!newComment.trim()}
                  >
                    <CommentButton
                      postId={post.id}
                      newComment={newComment}
                      onCommentPosted={() => setNewComment('')}
                    />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      )}
    </article>
  );
}

export default Post;

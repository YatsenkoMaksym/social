import { Dot } from 'lucide-react';
import UserImage from './userImage';
import Link from 'next/link';
import DeleteButton from './Buttons/DeleteButton';
import Image from 'next/image';
import LikeButton from './Buttons/LikeButton';
import CommentButton from './Buttons/CommentButton';
import { GetPostsType } from '@/actions/post';

interface dbUserType {
  id: string;
  email: string;
  username: string;
  clerkId: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
}

interface PostProps {
  post: GetPostsType[number]; // Use the type for a single post
  dbUser: dbUserType | null;
}
function Post({ post, dbUser }: PostProps) {
  if (!dbUser) return null;
  const hasLiked = post.likes.some((like) => like.userId === dbUser.id);
  return (
    <li className='border-foreground border rounded-2xl p-3 py-5 w-full '>
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
          Post creation time
        </p>
        <span className='ml-auto'>
          <DeleteButton postId={post.id} />
        </span>
      </div>
      <div className='mt-8 mb-4 flex flex-col '>
        {post.content}
        {post.image && (
          <span>
            <Image
              width={80}
              height={80}
              className='w-full h-full'
              src={post.image}
              alt='Failed to load image'
            />
          </span>
        )}
      </div>
      <div className='flex gap-5 bg-emerald-500'>
        <LikeButton
          hasLikedProp={hasLiked}
          amount={post._count.likes}
          postId={post.id}
        />
        <CommentButton />
      </div>
    </li>
  );
}

export default Post;

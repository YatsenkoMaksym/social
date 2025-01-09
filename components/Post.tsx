import { Command, DeleteIcon, Dot, Heart } from 'lucide-react';
import UserImage from './userImage';
import Link from 'next/link';
import DeleteButton from './Buttons/DeleteButton';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface postType {
  id: string;
  authorId: string;
  content: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

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
  post: postType;
  dbUser: dbUserType | null;
}

function Post({ post, dbUser }: PostProps) {
  if (!dbUser) return null;
  const { id, authorId, content, image, createdAt, updatedAt } = post;
  return (
    <li className='border-foreground border rounded-2xl p-3 py-5 w-full '>
      <div className='flex gap-4 px-5 items-center'>
        <UserImage imageUrl={dbUser.image} />
        <Link href={`profile/${dbUser.username}`}>
          {dbUser.username ? dbUser.username : dbUser.name}
        </Link>
        <Link href={`profile/${dbUser.username}`}>@{dbUser.username}</Link>
        <Dot />
        Post creation time
        <span className='ml-auto'>
          <DeleteButton postId={id} />
        </span>
      </div>
      <div className='my-16 flex flex-col '>
        <span className={cn([!image && '', !image && 'bg-violet-500'], {})}>
          {content}
        </span>
        {image && (
          <span>
            <Image
              width={80}
              height={80}
              className='w-full h-full'
              src={image}
              alt='Failed to load image'
            />
          </span>
        )}
      </div>
      <div className='flex gap-5'>
        <span className='flex gap-1'>
          <Heart /> amount of likes
        </span>
        <span className='flex gap-1'>
          <Command /> comments
        </span>
      </div>
    </li>
  );
}

export default Post;

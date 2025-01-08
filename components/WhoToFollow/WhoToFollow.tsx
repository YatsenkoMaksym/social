import { getRandomUsers } from '@/actions/user';
import Link from 'next/link';
import React from 'react';
import UserImage from '../userImage';
import FollowButton from '../FollowButton';

async function WhoToFollow() {
  const users = await getRandomUsers(5);
  if (users.length === 0) return null;
  return (
    <section className='line-clamp-1 border-foreground border rounded-2xl flex flex-col justify-center items-start gap-3 p-3 py-5'>
      {users.map((user) => (
        <div
          key={user.id}
          className='flex justify-between w-full items-center p-2'
        >
          <span className='flex gap-3 items-center'>
            <UserImage imageUrl={user.image} alt={user.username} />
            <span>
              <p>
                <Link href={`/profile/${user.username}`}>{user.username}</Link>
              </p>
              <p className='text-sm text-gray-500'>
                <Link href={`/profile/${user.username}`}>@{user.username}</Link>
              </p>
              <p className='text-sm text-gray-500'>
                followers: {user._count.followers}
              </p>
            </span>
          </span>
          <FollowButton userId={user.id} />
        </div>
      ))}
    </section>
  );
}

export default WhoToFollow;

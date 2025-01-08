/* eslint-disable @next/next/no-img-element */
import { currentUser } from '@clerk/nextjs/server';
import { userFromClerk } from '@/actions/user';
import SidebarNotAuthed from './SidebarNotAuthed';
import Link from 'next/link';
import { LinkIcon, MapPin } from 'lucide-react';

async function Sidebar() {
  const user = await currentUser();
  if (!user) {
    return <SidebarNotAuthed />;
  }
  const dbUser = await userFromClerk(user.id);
  if (!dbUser) return null;
  return (
    <section className='line-clamp-1 border-foreground border rounded-2xl flex flex-col justify-center items-center gap-3 p-3 py-5'>
      <div className='flex flex-col gap-2 justify-center items-center'>
        <img
          width={80}
          height={80}
          className='rounded-full'
          src={dbUser.image || '/avatar.png'}
          alt={`${dbUser.username}'s profile image`}
        />
        <h2 className='text-2xl font-semibold text-center '>
          <Link
            href={`/profile/${
              dbUser.username ??
              user.emailAddresses[0].emailAddress.split('@')[0]
            }`}
          >
            {dbUser.name}
          </Link>
        </h2>
        <h3>
          <Link
            href={`/profile/${
              dbUser.username ??
              user.emailAddresses[0].emailAddress.split('@')[0]
            }`}
          >
            {dbUser.username}
          </Link>
        </h3>
        <p>{dbUser.bio}</p>
      </div>
      <hr className='border w-full' />
      <div className='flex justify-around w-full'>
        <span>Following:{dbUser._count.following} </span>
        <span>Followers:{dbUser._count.followers}</span>
      </div>
      <hr className='border w-full' />
      <div className='flex flex-col items-start w-full'>
        <span className='flex items-center gap-2'>
          <MapPin />
          {dbUser.location || 'Not specified'}
        </span>
        <span className='flex items-center gap-2'>
          <LinkIcon className='min-w-[16px]' />
          <Link
            className=' line-clamp-1 max-w-[40ch]'
            href={dbUser.website || ''}
          >
            {dbUser.website || 'No website'}
          </Link>
          {dbUser.website}
        </span>
      </div>
    </section>
  );
}

export default Sidebar;

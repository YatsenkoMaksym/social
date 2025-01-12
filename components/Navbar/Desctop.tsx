import { currentUser } from '@clerk/nextjs/server';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Bell, HomeIcon, User } from 'lucide-react';
import { userFromClerk } from '@/actions/user';
async function Desctop() {
  const user = await currentUser();
  let dbUser;
  if (user?.id) {
    dbUser = await userFromClerk(user?.id);
  }
  return (
    <>
      {user ? (
        <ul className='md:flex hidden flex-row gap-5 items-center'>
          <li>
            <Link href='/' className='flex gap-1'>
              Home <HomeIcon />
            </Link>
          </li>
          <li>
            <Link href='/notifications' className='flex gap-1'>
              Notifications <Bell />
            </Link>
          </li>
          <li>
            <Link className='flex gap-1' href={`/profile/${dbUser?.username}`}>
              Profile
              <User />
            </Link>
          </li>
          <li>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </li>
        </ul>
      ) : (
        <div className='hidden md:block'>
          <SignedOut>
            <SignInButton mode='modal'>
              <Button className='m-3'>Sign in</Button>
            </SignInButton>
          </SignedOut>
        </div>
      )}
    </>
  );
}
export default Desctop;

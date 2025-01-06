import React from 'react';
import { SignedOut, SignInButton, SignOutButton } from '@clerk/nextjs';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { currentUser } from '@clerk/nextjs/server';
import { Bell, Home, LogOut, User } from 'lucide-react';
import Link from 'next/link';
async function Mobile() {
  const user = await currentUser();
  return (
    <div className='block md:hidden'>
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>This is the title here, just so you know</SheetTitle>
            <SheetDescription className='flex flex-col justify-center items-center'>
              {user ? (
                <article>
                  <ul className='flex flex-col gap-5 mt-3 text-xl text-foreground'>
                    <li className='flex items-center gap-5 '>
                      <Home /> <Link href='/'>Home</Link>
                    </li>
                    <li className='flex items-center gap-5 '>
                      <Bell /> <Link href='/notifications'>Notifications</Link>
                    </li>
                    <li className='flex items-center gap-5 '>
                      <User />{' '}
                      <Link href={`/users/${user.username}`}>Profile</Link>
                    </li>
                    <li className='flex items-center gap-5 '>
                      <LogOut /> <SignOutButton />
                    </li>
                  </ul>
                </article>
              ) : (
                <div>
                  <div className='flex bg-emerald-600 items-center gap-5 my-3 text-xl text-foreground'>
                    <Home /> <Link href='/'>Home</Link>
                  </div>
                  <SignedOut>
                    <SignInButton mode='modal'>
                      <Button className='m-3'>Sign up</Button>
                    </SignInButton>
                  </SignedOut>
                </div>
              )}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Mobile;

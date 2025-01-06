import { currentUser } from '@clerk/nextjs/server';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from '../ui/button';
async function Desctop() {
  const user = await currentUser();
  return (
    <>
      {user ? (
        <ul className='md:flex hidden flex-row gap-5 items-center'>
          <li>Home home</li>
          <li>Notifications Notifs</li>
          <li>Profile profike</li>
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
              <Button className='m-3'>Sign up</Button>
            </SignInButton>
          </SignedOut>
        </div>
      )}
    </>
  );
}
export default Desctop;

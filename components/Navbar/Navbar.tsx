import ThemeToggle from '../ThemeToggle';
import Desctop from './Desctop';
import Mobile from './Mobile';
import { currentUser } from '@clerk/nextjs/server';
import syncClerkWithDB from '@/actions/user';
import { Podcast } from 'lucide-react';
import Link from 'next/link';
async function Navbar() {
  const clerkUser = await currentUser();
  if (clerkUser) syncClerkWithDB(clerkUser);

  return (
    <header className='sticky top-10 mb-10'>
      <nav className='gap-4 flex flex-row px-6 items-center p-5 '>
        <div className='mr-auto'>
          <Link href='/' className='flex items-center gap-3'>
            <Podcast className='size-12' />
            Stream
          </Link>
        </div>
        <ThemeToggle />
        <Desctop />
        <Mobile />
      </nav>
    </header>
  );
}

export default Navbar;

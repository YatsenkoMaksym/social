import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <section className='w-screen h-screen grid place-items-center text-center'>
      <span>
        <h2 className='text-2xl'>Page was not found</h2>
        <Button className='mt-2' variant='outline'>
          <Link href='/'>Go to the main page</Link>
        </Button>
      </span>
    </section>
  );
}

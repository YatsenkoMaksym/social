import { Loader } from 'lucide-react';
import React from 'react';

export default function loading() {
  return (
    <section className='w-screen h-screen grid place-items-center'>
      <Loader className='animate-spin size-16' />
    </section>
  );
}

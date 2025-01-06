'use client';

import ThemeToggle from './ThemeToggle';

function Item() {
  console.log('444');
  return (
    <div className=' flex items-center gap-5'>
      Item <ThemeToggle />
    </div>
  );
}

export default Item;

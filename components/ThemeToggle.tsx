'use client';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant='outline'
      size='icon'
      onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}
      className='relative'
    >
      <Sun className='absolute dark:scale-0 duration-150 rotate-0 scale-100 transition-all dark:-rotate-90' />
      <Moon className='dark:scale-100 duration-150 scale-0 rotate-90 transition-all dark:rotate-0' />
    </Button>
  );
}

export default ThemeToggle;

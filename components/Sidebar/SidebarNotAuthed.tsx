import { Button } from '../ui/button';
import { SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
function SidebarNotAuthed() {
  return (
    <div className='gap-3 border-foreground border rounded-2xl flex py-3 flex-col text-center items-center'>
      <h2 className='text-xl'>Welcome Back!</h2>
      <p className='max-w-[20ch]'>
        Lorem ipsum dolor sit. This is boilerplate text, please don&apos;t read
        anything longer that 4 words
      </p>
      <SignedOut>
        <SignInButton>
          <Button className='min-w-12 w-3/4 max-w-[200px]' variant='default'>
            Login
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedOut>
        <SignUpButton>
          <Button className='min-w-12 w-3/4 max-w-[200px]' variant='outline'>
            Sign up
          </Button>
        </SignUpButton>
      </SignedOut>
    </div>
  );
}

export default SidebarNotAuthed;

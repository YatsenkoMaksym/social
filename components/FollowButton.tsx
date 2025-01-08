'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Loader } from 'lucide-react';
import { toggleFollow } from '@/actions/user';
import { useToast } from '@/hooks/use-toast';

interface FollowButtonProps {
  userId: string;
}

function FollowButton({ userId }: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      await toggleFollow(userId);
      toast({
        title: `New user followed`,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(
          'THIS ERROR IS FROM LOADING USERS TO FOLLOW RECOMENDATION:' +
            error.stack
        );
      }
      toast({
        title: 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button disabled={isLoading} onClick={handleFollow} className='w-24'>
      {isLoading ? <Loader className='animate-spin w-full' /> : 'Follow'}
    </Button>
  );
}

export default FollowButton;

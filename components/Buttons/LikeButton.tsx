'use client';

import { Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { toggleLike } from '@/actions/likes';
import { useState } from 'react';
interface LikeButtonProps {
  amount: number;
  postId: string;
  hasLikedProp: boolean;
}
function LikeButton({ amount, postId, hasLikedProp }: LikeButtonProps) {
  if (!amount) {
    amount = 0;
  }
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(hasLikedProp);
  const [optimisticLikes, setOptimisticLikes] = useState(amount);

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked(!hasLiked);
      setOptimisticLikes((prev) => prev + (hasLiked ? -1 : 1));
      await toggleLike(postId);
    } catch (error) {
      setOptimisticLikes(amount);
      setHasLiked(false);
      if (error instanceof Error) {
        console.log('error in liking:', error.stack);
      }
    } finally {
      setIsLiking(false);
    }
  };
  return (
    <Button
      className='flex items-center gap-3 border border-foreground'
      variant='outline'
      onClick={handleLike}
    >
      <Heart />
      {optimisticLikes}
    </Button>
  );
}

export default LikeButton;

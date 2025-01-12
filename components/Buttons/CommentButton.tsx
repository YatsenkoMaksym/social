'use client';

import { createComment } from '@/actions/comment';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Button } from '../ui/button';
import { MessageSquarePlus } from 'lucide-react';

interface CommentButtonProps {
  newComment: string;
  postId: string;
  onCommentPosted: () => void; // Add a callback prop
}

function CommentButton({
  newComment,
  postId,
  onCommentPosted,
}: CommentButtonProps) {
  const [isCommenting, setIsCommenting] = useState(false);

  const handleComment = async () => {
    if (!newComment.trim() || isCommenting) return;
    try {
      setIsCommenting(true);
      const result = await createComment(postId, newComment); //! take post.id and comment content as props
      toast({
        title: 'Comment created',
        content: `${result?.content}`,
      });
      onCommentPosted(); // Call the callback to clear the textarea
    } catch (error) {
      if (error instanceof Error) {
        console.log('ERROR IN POSTING COMMENT (frontend):', error.stack);
      }
      toast({
        title: 'Failed to comment',
      });
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <Button onClick={handleComment}>
      <MessageSquarePlus />
      {isCommenting ? 'Posting...' : 'Comment'}
    </Button>
  );
}

export default CommentButton;

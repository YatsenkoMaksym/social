'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { deletePost } from '@/actions/post';
import DeleteAlertDialog from '../DeleteAlertDialog';
interface postId {
  postId: string;
}
function DeleteButton({ postId }: postId) {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await deletePost(postId);
    } catch (error) {
      if (error instanceof Error) {
        console.log('ERROR IN DELETING POST (frontend):', error.stack);
      }
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Button onClick={handleDelete} asChild>
      <DeleteAlertDialog isDeleting={isDeleting} onDelete={handleDelete} />
    </Button>
  );
}

export default DeleteButton;

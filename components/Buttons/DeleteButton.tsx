'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Delete } from 'lucide-react';
import { deletePost } from '@/actions/post';
interface postId {
  postId: string;
}
function DeleteButton({ postId }: postId) {
  const handleDelete = async () => {
    await deletePost(postId);
  };
  return (
    <Button onClick={handleDelete}>
      Pseudo Delete
      <Delete />
    </Button>
  );
}

export default DeleteButton;

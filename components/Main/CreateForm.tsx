'use client';
import React, { useState } from 'react';
import UserImage from '../userImage';
import { Button } from '../ui/button';
import { ImageIcon, PodcastIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { createPost } from '@/actions/post';
import ImageUpload from './ImageUpload';

function CreateForm() {
  const { user } = useUser();
  const [content, setcontent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  if (!user) return null;
  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPosting(true);
    try {
      await createPost({ content, imageUrl });
      setcontent('');
      setImageUrl('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-background border border-foreground rounded-2xl p-6 flex flex-col gap-5'
    >
      <div className=' flex shrink-0 flex-0 gap-3'>
        <UserImage imageUrl={user.imageUrl} />
        <textarea
          value={content}
          onChange={(e) => {
            setcontent(e.target.value);
          }}
          disabled={isPosting}
          name='content'
          className='min-h-[4rem] w-full text-foreground p-5 rounded-2xl max-h-[300px] h-[200px] bg-primary-foreground'
        />
      </div>
      {(showImageUpload || imageUrl) && (
        <div className='border rounded-2xl p-4'>
          <ImageUpload
            endpoint='postImage'
            value={imageUrl}
            onChange={(url) => {
              setImageUrl(url);
              if (!url) {
                setShowImageUpload(false);
              }
            }}
          />
        </div>
      )}
      <div className='flex justify-around '>
        <Button
          type='button'
          onClick={() => {
            setShowImageUpload(!showImageUpload);
          }}
          disabled={isPosting}
        >
          <ImageIcon /> Photo
        </Button>
        <Button
          disabled={(!content.trim() && !imageUrl) || isPosting}
          variant='ghost'
          className='border border-foreground'
          type='submit'
        >
          <PodcastIcon />
          Submit
        </Button>
      </div>
    </form>
  );
}

export default CreateForm;

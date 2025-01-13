'use client';

import { UploadDropzone } from '@/lib/uploadthing';
import { error } from 'console';
import { X } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: 'postImage';
}
export default function ImageUpload({
  onChange,
  value,
  endpoint,
}: ImageUploadProps) {
  if (value)
    return (
      <div className='relative size-40'>
        <img src={value} alt='Uploaded image' />
        <button
          onClick={() => {
            onChange('');
          }}
          className='absolute top-0 right-0 p-1 bg-red-500 rounded-full shadow-sm'
          type='button'
        >
          <X className='size-4 text-white' />
        </button>
      </div>
    );
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) =>
        console.log('ERROR IN UPLOADING IMAGE (frontend):', error.stack)
      }
    />
  );
}

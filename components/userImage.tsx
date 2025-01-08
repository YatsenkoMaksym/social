import { cn } from '@/lib/utils';
import Image from 'next/image';
interface UserImageProps {
  className?: string;
  imageUrl?: string | null;
  alt?: string;
}
function UserImage({ imageUrl, alt, className }: UserImageProps) {
  return (
    <Image
      alt={alt ? `${alt}'s profile image` : ''}
      width={80}
      height={80}
      className={cn(className, 'rounded-full w-12 h-12')}
      src={imageUrl ?? '/avatar.png'}
    />
  );
}

export default UserImage;

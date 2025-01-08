import Image from 'next/image';
interface UserImageProps {
  imageUrl: string;
  width?: number;
  heigth?: number;
}
function UserImage({ imageUrl, heigth, width }: UserImageProps) {
  return (
    <Image
      alt=''
      width={width || 80}
      height={heigth || 80}
      className='rounded-full w-12 h-12'
      src={imageUrl}
    />
  );
}

export default UserImage;

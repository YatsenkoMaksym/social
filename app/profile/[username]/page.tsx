import {
  getCreatedPosts,
  getLikedPosts,
  getProfile,
  isFollowing,
} from '@/actions/profile';
import ProfilePage from '@/components/ProfilePage';
import { notFound } from 'next/navigation';

interface pageProps {
  params: { username: string };
}
export default async function page({ params }: pageProps) {
  const user = await getProfile(params.username);
  if (!user) notFound();
  const [createdPosts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getCreatedPosts(user.id),
    getLikedPosts(user.id),
    isFollowing(user.id),
  ]);
  return (
    <ProfilePage
      user={user}
      createdPosts={createdPosts}
      likedPosts={likedPosts}
      initialFollowing={isCurrentUserFollowing}
    />
  );
}

'use client';

import { getCreatedPosts, getProfile, updateProfile } from '@/actions/profile';
import { toggleFollow } from '@/actions/user';
import { toast } from '@/hooks/use-toast';
import { SignInButton, useUser } from '@clerk/nextjs';
import { format } from 'date-fns';
import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import UserImage from './userImage';
import { Button } from './ui/button';
import {
  Calendar,
  EditIcon,
  FileText,
  Heart,
  LinkIcon,
  MapPin,
} from 'lucide-react';
import Post from './Post';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { DialogClose } from '@radix-ui/react-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';

type User = Awaited<ReturnType<typeof getProfile>>;
type Posts = Awaited<ReturnType<typeof getCreatedPosts>>;
interface ProfilePageProps {
  user: NonNullable<User>;
  createdPosts: Posts;
  likedPosts: Posts;
  initialFollowing: boolean;
}
export default function ProfilePage({
  user,
  likedPosts = [],
  createdPosts = [],
  initialFollowing,
}: ProfilePageProps) {
  const { user: currentUser } = useUser();

  const [showEditing, setShowEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name || '',
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
  });

  const handleEdit = async () => {
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const result = await updateProfile(formData);
    if (result) {
      setShowEditing(false);
      toast({
        title: 'Profile updated',
      });
    }
  };
  const handleFollow = async () => {
    if (!currentUser) return;
    try {
      setIsUpdating(true);
      await toggleFollow(user.id);
      setIsFollowing(!isFollowing);
    } catch (error) {
      if (error instanceof Error) {
        console.log('ERROR IN FOLLOWING (profile,frontend):', error.stack);
      }
    } finally {
      setIsUpdating(false);
    }
  };
  const isOwner =
    currentUser?.username === user.username ||
    currentUser?.emailAddresses[0].emailAddress.split('@')[0] === user.username;

  const formattedDate = format(new Date(user.createdAt), 'MMMM yyyy');

  return (
    <section className='max-w-3xl mx-auto'>
      <div className='grid grid-cols-1 gap-6'>
        <div className='w-full max-w-lg mx-auto'>
          <Card className='bg-card'>
            <CardContent className='pt-6'>
              <div className='flex flex-col items-center text-center'>
                <UserImage imageUrl={user.image} />
                <h1 className='mt-4 text-2xl font-bold'>
                  {user.name ?? user.username}
                </h1>
                <p className='text-muted-foreground'>@{user.username}</p>
                <p className='mt-2 text-sm'>{user.bio}</p>

                <div className='w-full mt-6'>
                  <div className='flex justify-between mb-4'>
                    <div>
                      <div className='font-semibold'>
                        {user._count.following.toLocaleString()}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        Following
                      </div>
                    </div>
                    <Separator orientation='vertical' />
                    <div>
                      <div className='font-semibold'>
                        {user._count.followers.toLocaleString()}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        Followers
                      </div>
                    </div>
                    <Separator orientation='vertical' />
                    <div>
                      <div className='font-semibold'>
                        {user._count.posts.toLocaleString()}
                      </div>
                      <div className='text-sm text-muted-foreground'>Posts</div>
                    </div>
                  </div>
                </div>

                {/* "FOLLOW & EDIT PROFILE" BUTTONS */}
                {!currentUser ? (
                  <SignInButton mode='modal'>
                    <Button className='w-full mt-4'>Follow</Button>
                  </SignInButton>
                ) : isOwner ? (
                  <Button
                    className='w-full mt-4'
                    onClick={() => setShowEditing(true)}
                  >
                    <EditIcon className='size-4 mr-2' />
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    className='w-full mt-4'
                    onClick={handleFollow}
                    disabled={isUpdating}
                    variant={isFollowing ? 'outline' : 'default'}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                )}

                {/* LOCATION & WEBSITE */}
                <div className='w-full mt-6 space-y-2 text-sm'>
                  {user.location && (
                    <div className='flex items-center text-muted-foreground'>
                      <MapPin className='size-4 mr-2' />
                      {user.location}
                    </div>
                  )}
                  {user.website && (
                    <div className='flex items-center text-muted-foreground'>
                      <LinkIcon className='size-4 mr-2' />
                      <a
                        href={
                          user.website.startsWith('http')
                            ? user.website
                            : `https://${user.website}`
                        }
                        className='hover:underline'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                  <div className='flex items-center text-muted-foreground'>
                    <Calendar className='size-4 mr-2' />
                    Joined {formattedDate}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue='posts' className='w-full'>
          <TabsList className='w-full justify-start border-b rounded-none h-auto p-0 bg-transparent'>
            <TabsTrigger
              value='posts'
              className='flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
               data-[state=active]:bg-transparent px-6 font-semibold'
            >
              <FileText className='size-4' />
              Posts
            </TabsTrigger>
            <TabsTrigger
              value='likes'
              className='flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
               data-[state=active]:bg-transparent px-6 font-semibold'
            >
              <Heart className='size-4' />
              Likes
            </TabsTrigger>
          </TabsList>

          <TabsContent value='posts' className='mt-6'>
            <div className='space-y-6'>
              {createdPosts.length > 0 ? (
                createdPosts.map((post) => (
                  <Post key={post.id} post={post} dbUserId={user.id} />
                ))
              ) : (
                <div className='text-center py-8 text-muted-foreground'>
                  No posts yet
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value='likes' className='mt-6'>
            <div className='space-y-6'>
              {likedPosts.length > 0 ? (
                likedPosts.map((post) => (
                  <Post key={post.id} post={post} dbUserId={user.id} />
                ))
              ) : (
                <div className='text-center py-8 text-muted-foreground'>
                  No liked posts to show
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={showEditing} onOpenChange={setShowEditing}>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label>Name</Label>
                <Input
                  name='name'
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder='Your name'
                />
              </div>
              <div className='space-y-2'>
                <Label>Bio</Label>
                <textarea
                  name='bio'
                  className='min-h-[4rem] w-full text-foreground p-5 rounded-2xl max-h-[300px] h-[200px] bg-primary-foreground'
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  placeholder='Tell us about yourself'
                />
              </div>
              <div className='space-y-2'>
                <Label>Location</Label>
                <Input
                  name='location'
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  placeholder='Where are you based?'
                />
              </div>
              <div className='space-y-2'>
                <Label>Website</Label>
                <Input
                  name='website'
                  value={editForm.website}
                  onChange={(e) =>
                    setEditForm({ ...editForm, website: e.target.value })
                  }
                  placeholder='Your personal website'
                />
              </div>
            </div>
            <div className='flex justify-end gap-3'>
              <DialogClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogClose>
              <Button onClick={handleEdit}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

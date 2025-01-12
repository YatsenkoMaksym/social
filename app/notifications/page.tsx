'use client';
import { getNotification, notificationRead } from '@/actions/notification';
import NotificationSkeleton from '@/components/NotificationSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import UserImage from '@/components/userImage';
import { toast } from '@/hooks/use-toast';
import { Notification } from '@/types/notifications';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageSquare, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'LIKE':
        return <Heart className='size-4 text-red-500' />;
      case 'COMMENT':
        return <MessageSquare className='size-4 text-blue-500' />;
      case 'FOLLOW':
        return <UserPlus className='size-4 text-green-500' />;
      default:
        return null;
    }
  };
  useEffect(() => {
    const getNotifs = async () => {
      try {
        const data = await getNotification();
        if (!data) return null;

        setNotifications(data);

        const unreadIds = data.filter((n) => !n.read).map((n) => n.id);
        if (unreadIds.length > 0) await notificationRead(unreadIds);
      } catch (error) {
        if (error instanceof Error) {
          console.log('ERROR IN FETCHING NOTIFS (frontend):', error.stack);
        }
        toast({
          title: 'Failed to load notifications',
        });
      } finally {
        setIsLoading(false);
      }
    };
    getNotifs();
  }, []);
  if (isLoading) return <NotificationSkeleton />;
  return (
    <div className='space-y-4 '>
      <Card>
        <CardHeader className='border-b'>
          <div className='flex items-center justify-between'>
            <CardTitle>Notifications</CardTitle>
            <span className='text-sm text-muted-foreground'>
              {notifications.filter((n) => !n.read).length} unread
            </span>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <ScrollArea className='h-[calc(100vh-12rem)]'>
            {notifications.length === 0 ? (
              <div className='p-4 text-center text-muted-foreground'>
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 border-b hover:bg-muted/25 transition-colors ${
                    !notification.read ? 'bg-muted/50' : ''
                  }`}
                >
                  <UserImage imageUrl={notification.creator.image} />
                  <div className='flex-1 space-y-1'>
                    <div className='flex items-center gap-2'>
                      {getNotificationIcon(notification.type)}
                      <span>
                        <span className='font-medium'>
                          {notification.creator.username ??
                            notification.creator.name}
                        </span>{' '}
                        {notification.type === 'FOLLOW'
                          ? 'started following you'
                          : notification.type === 'LIKE'
                          ? 'liked your post'
                          : 'commented on your post'}
                      </span>
                    </div>

                    {notification.post &&
                      (notification.type === 'LIKE' ||
                        notification.type === 'COMMENT') && (
                        <div className='pl-6 space-y-2'>
                          <div className='text-sm text-muted-foreground rounded-md p-2 bg-muted/30 mt-2'>
                            <p>{notification.post.content}</p>
                            {notification.post.image && (
                              <Image
                                src={notification.post.image}
                                alt='Post content'
                                className='mt-2 rounded-md w-full max-w-[200px] h-auto object-cover'
                              />
                            )}
                          </div>

                          {notification.type === 'COMMENT' &&
                            notification.comment && (
                              <div className='text-sm p-2 bg-accent/50 rounded-md'>
                                {notification.comment.content}
                              </div>
                            )}
                        </div>
                      )}

                    <p className='text-sm text-muted-foreground pl-6'>
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

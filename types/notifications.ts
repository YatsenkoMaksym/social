import { getNotification } from '@/actions/notification';

type ArrayElementType<T> = T extends (infer U)[] ? U : never;

export type Notifications = Awaited<ReturnType<typeof getNotification>>;
export type Notification = ArrayElementType<Notifications>;

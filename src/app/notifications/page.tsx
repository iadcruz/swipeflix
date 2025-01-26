"use client";

import React, { useEffect, useState } from 'react'
import { NotificationsSkeleton } from '@/components/NotificationSkeleton';
import { getNotifications, markNotificationsAsRead } from '@/actions/notification.action'
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HeartIcon, UserPlusIcon } from 'lucide-react';
import { formatDistanceToNow } from "date-fns";

type Notifications = Awaited<ReturnType<typeof getNotifications>>
type Notification = Notifications[number]

const getNotificationIcon = (type: string) => {
    switch (type) {
      case "LIKE":
        return <HeartIcon className="size-4 text-red-500" />;
      case "FOLLOW":
        return <UserPlusIcon className="size-4 text-green-500" />;
      default:
        return null;
    }
};

function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getNotifications();
                setNotifications(data);

                const unreadIds = data.filter(n => !n.read).map(n=>n.id);
                if (unreadIds.length > 0) {
                    await markNotificationsAsRead(unreadIds);
                }
            } catch (error) {
                toast.error("Failed to fetch Notifications");
            } finally {
                setIsLoading(false);
            }
        }

        fetchNotifications();
    }, [])

    if (isLoading) {
        return <NotificationsSkeleton />
    }
    return (
        <div className="space-y-4">
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              <span className="text-sm text-muted-foreground">
                {notifications.filter((n) => !n.read).length} unread
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 border-b hover:bg-muted/25 transition-colors ${
                      !notification.read ? "bg-muted/50" : ""
                    }`}
                  >
                    <Avatar className="mt-1">
                      <AvatarImage src={notification.creator.image ?? "/avatar.png"} />
                    </Avatar>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                        {getNotificationIcon(notification.type)}
                        <span>
                            <span className="font-medium">
                            {notification.creator.name ?? notification.creator.username}
                            </span>{" "}
                            {notification.type === "FOLLOW"
                            ? "started following you"
                            : "added a movie to Watch Later"}
                        </span>
                        </div>

                        {(notification.type == "LIKE") && (
                            <div className="pl-6 space-y-2">
                                <div className="text-sm text-muted-foreground rounded-md p-2 bg-muted/30 mt-2">
                                    <p>{notification.movie}</p>
                                </div> 
                            </div>
                        )}
                      <p className="text-sm text-muted-foreground pl-6">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    )
}

export default NotificationsPage;

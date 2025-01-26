"use client";

import getLaters from '@/actions/movie.action';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Later } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Image from "next/image";

function ProfilePage({ params }:{ params: {username: string} }) {
    const [laters, setLaters] = useState<Later[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLaters = async () => {
            try {
                const data = await getLaters();
                if (data) {
                    setLaters(data);
                }
            } catch (error) {
                toast.error("Failed to fetch Notifications");
            } finally {
                setIsLoading(false);
            }
        }

        fetchLaters();
    }, [])

    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }
    return (
        <div>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                    <CardTitle>Watch List</CardTitle>
                    </div>
                </CardHeader>
            </Card>

            <ScrollArea className="h-[calc(100vh-12rem)] pt-2">
            <div className="grid grid-cols-3 gap-1">
                {laters.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No movies added yet!</div>
                ) : (
                    laters.map((later) => (
                        <div key={later.id} className="lg:col-span-1">
                            <Card className="h-full flex flex-col">
                                <div className="p-4 flex-1 flex flex-col justify-between text-center">
                                    <Image
                                        src={`https://image.tmdb.org/t/p/w500${later.path}`}
                                        width={500}
                                        height={500}
                                        alt={`${later.movie} poster`}
                                        className="object-cover"
                                    />
                                    <div className="mt-2">
                                        <CardTitle className="text-xl font-semibold line-clamp-2 h-[3rem]">
                                            {later.movie}
                                        </CardTitle>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))
                )}
            </div>
            </ScrollArea>
        </div>
    )
}

export default ProfilePage

"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncUser() {
    try {
        const {userId} = await auth()
        const user = await currentUser();
        if (!userId || !user) {
            return;
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                clerkId:userId
            }
        })

        if (existingUser) {
            return existingUser;
        }
        const dbUser = await prisma.user.create({
            data: {
                clerkId: userId,
                name: `${user.firstName || ""} ${user.lastName || ""}`,
                username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
                email: user.emailAddresses[0].emailAddress,
                image: user.imageUrl
            }
        })

        return dbUser;
    } catch (error) {
        console.log("Erorr in syncUser", error);
    }
}

export async function getUserByClerkId(clerkId:string) {
    return prisma.user.findUnique({
        where: {
            clerkId:clerkId,
        },
        include: {
            _count: {
                select: {
                    followers:true,
                    following:true,
                    watchLater:true,
                    likes:true
                }
            }
        }
    })
}

export async function getDbUserId() {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
        throw new Error("Unauthorized");
    }

    const user = await getUserByClerkId(clerkId);

    if (!user) {
        throw new Error("User not found");
    }

    return user.id;
}

export async function getUsersToFollow() {
    try {
        const userId = await getDbUserId();

        const users = await prisma.user.findMany({
            where: {
                AND:[
                    {NOT:{id:userId}},
                    {NOT: {
                        followers:{
                            some:{
                                followerId: userId
                            }
                        }
                    }

                    }
                ]
            },
            select:{
                id:true,
                name:true,
                username:true,
                image:true,
                _count:{
                    select:{
                        followers:true
                    },
                }
            },
            take: 3
        })

        return users;
    } catch (error) {
        console.log("Error fetching users to follow", error);
        return [];
    }
}

export async function toggleFollow(currUserId:string) {
    try {
        const userId = await getDbUserId();
        if (userId == currUserId) {
            throw new Error("Unable to follow own account");
        }
        const existingFollow = await prisma.follows.findUnique({
            where:{
                followerId_followingId: {
                    followerId: userId,
                    followingId: currUserId
                }
            }
        })

        if (existingFollow) {
            await prisma.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: userId,
                        followingId: currUserId
                    }
                }
            })
        } else {
            await prisma.$transaction([
                prisma.follows.create({
                    data:{
                        followerId: userId,
                        followingId: currUserId
                    }
                }),

                prisma.notification.create({
                    data:{
                        type:"FOLLOW",
                        userId: currUserId,
                        creatorId: userId
                    }
                })
            ])
        }
        revalidatePath("/");
        return{success:true};
    } catch(error) {
        console.log("Error in follow/unfollow", error);
        return{success:false, error: "Error in follow/unfollow"};
    }
}
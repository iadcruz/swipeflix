"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { getDbUserId } from "./user.action";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function getRandom() {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${Math.floor(
        Math.random() * 500 + 1
      )}`
    );
    return response.data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getSimilar() {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const likes = await prisma.like.findMany({ where: { authorId: userId } });
    const similarMovies = [];

    for (const like of likes) {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${like.movieId}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=${Math.floor(
          Math.random() * 5 + 1
        )}`
      );
      similarMovies.push(...response.data.results);
    }

    return similarMovies.length > 0 ? similarMovies : await getRandom();
  } catch (error) {
    return [];
  }
}

export async function getUserLikes() {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    return user?.hasLikes || false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function addLike(movie: string, movieId: number, poster_path: string) {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    const like = await prisma.like.create({
      data: { authorId: userId, movie, movieId, path: poster_path },
    });
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        hasLikes: true,
        likes: { connect: { id: like.id } },
      },
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function addLater(movie: string, movieId: number, poster_path: string) {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    const later = await prisma.later.create({
      data: { authorId: userId, movie, movieId, path: poster_path },
    });

    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        hasLikes: true,
        watchLater: { connect: { id: later.id } },
      },
    });

    let currId = await getDbUserId();
    const followers = await prisma.follows.findMany({
      where: {
        followingId:currId
      },
      include: {
        follower: {
          select: {
            id: true
          }
        }
      }
    })

    for (let follower of followers) {
      await prisma.notification.create({
        data:{
          type:"LIKE",
          userId: follower.followerId,
          creatorId: currId,
          movie: movie
        }
      })
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export default async function getLaters() {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const laters = await prisma.later.findMany({
      where: { authorId: userId },
    });

    return laters;

  } catch(error) {
    console.log("Error fetching watch list", error);
  }
}

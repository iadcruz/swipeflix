"use client";

import { addLater, addLike, getRandom, getSimilar, getUserLikes } from "@/actions/movie.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ThumbsDown, ThumbsUp, Heart } from "lucide-react";
import { Separator } from "./ui/separator";

export default function Main() {
  type Movie = {
    id: number;
    title: string;
    overview: string;
    backdrop_path: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
  };

  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      let fetchedMovies: Movie[];
      const userHasLikes = await getUserLikes();

      if (userHasLikes) {
        fetchedMovies = await getSimilar();
      } else {
        fetchedMovies = await getRandom();
      }

      setMovies(fetchedMovies);
      setMovie(fetchedMovies[0]);
    };

    fetchMovies();
  }, []);

  const handleGenerateNext = async () => {
    const updatedMovies = movies.slice(1);

    if (updatedMovies.length === 0) {
      const newMovies = await getRandom();
      setMovies(newMovies);
      setMovie(newMovies[0]);
    } else {
      setMovies(updatedMovies);
      setMovie(updatedMovies[0]);
    }
  };

  const likeAndHandle = async () => {
    if (movie) {
      await addLike(movie.title, movie.id, movie.poster_path);
    }
    await handleGenerateNext();
  };

  const laterAndHandle = async () => {
    if (movie) {
      await addLater(movie.title, movie.id, movie.poster_path);
    }
    await handleGenerateNext();
  }

  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <div className="sticky top-20">
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-1">
          <div className="lg:block lg:col-span-4">
            <div className="p-4">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                width={500}
                height={500}
                alt={`${movie.title} poster`}
              />
              <div className="text-center p-3">
                <p className="flex justify-center items-center space-x-2">
                  <Star className="text-yellow-500" />
                  <span className="text-lg font-semibold">
                    {movie.vote_average ? movie.vote_average.toFixed(1) : "No rating available"}
                  </span>
                </p>
              </div>
              <div className="text-center p-3">
                <p className="italic text-xs text-muted-foreground">
                  Released: {movie.release_date}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:block lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{movie.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">{movie.overview}</p>
            </CardContent>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 pb-3">
          <Button onClick={handleGenerateNext} className="col-span-1 text-gray-600 bg-inherit">
            <ThumbsDown />
          </Button>
          <Button onClick={laterAndHandle} className="col-span-1 text-gray-600 bg-inherit">
            <Heart />
          </Button>
          <Button onClick={likeAndHandle} className="col-span-1 text-gray-600 bg-inherit">
            <ThumbsUp />
          </Button>
        </div>
      </Card>
    </div>
  );
}

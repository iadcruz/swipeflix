import MovieCard from "@/components/MovieCard";

export default async function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
      <MovieCard />
    </div>
  )
}

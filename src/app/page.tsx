import MovieCard from "@/components/MovieCard";
import WhoToFollow from "@/components/WhoToFollow";
import { currentUser } from "@clerk/nextjs/server"

export default async function Home() {
  const user = await currentUser();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
      <div className="lg:col-span-6">
        {user ? <MovieCard /> : null}
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <WhoToFollow />
      </div> 
    </div>
  )
}

import MovieCard from "@/components/MovieCard";
import WhoToFollow from "@/components/WhoToFollow";
import { currentUser } from "@clerk/nextjs/server"

export default async function Home() {
  const user = await currentUser();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
      <div className="lg:col-span-4">
        {user ? <MovieCard /> : null}
      </div>
      <div className="hidden lg:block lg:col-span-2 sticky top-20">
        <WhoToFollow />
      </div> 
    </div>
  )
}

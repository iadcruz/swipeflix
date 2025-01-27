## What is SwipeFlix?

SwipeFlix is an app that provides personalized movie and tv-show recommendations based on your previous swipe history, with the ability to follow other users and be notified of the shows and movies they add to their watch list. On the 'Home' screen, you should see random suggestions to start, with the option to dislike, heart, or like the movie/show; liking/hearting something results in similar recommendations in the future, with hearting adds the specific movie/show to a watchlist visible under 'Profile'. The 'Notifications' page is for letting you know that you've gained a follower or that someone you follow has added something to their watchlist.

## Features

1. User Authentication with Clerk
2. Responsive UI components (Shadcn, React, Node)
3. Integration with Database using postgresql (for storing user information, followers, likes, watchlists, etc.)
4. [TMDb API](https://developer.themoviedb.org/reference/intro/getting-started) calls for movie/tv show data
5. App Deployment through Vercel

## Time Spent

~8 hours over the course of a few days

## Running the Project

To view the deployed app, simply visit:

[https://swipeflix.vercel.app](https://swipeflix.vercel.app)

To run the project locally, first run the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

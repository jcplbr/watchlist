import getMovies from "@/hooks/get-movies";
import supabase from "@/lib/supabase";
import { MovieData } from "@/types/movie.types";
import React from "react";
import { Command } from "cmdk";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MovieIcon } from "./icons";
import Item from "@/helpers/cmdk-item";

export const revalidate = 60;

async function fetchMovies() {
  const { data: movies } = await supabase
    .from("movies")
    .select()
    .order("popularity", { ascending: false });

  return movies;
}

export default function Movies({
  moviePage,
  selectMovie,
}: {
  moviePage: Function;
  selectMovie: Function;
}) {
  const [movies, setMovies] = React.useState<Partial<MovieData>[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const movies = async () => {
      await getMovies();

      const fetchedMovies = await fetchMovies();

      setMovies(fetchedMovies ?? []);
      setLoading(false);
    };

    movies();
  }, []);

  return (
    <>
      <Command.Group>
        {loading ? (
          <Command.Loading>
            {Array(6).fill(
              <Item className="skeleton">
                <Skeleton />
              </Item>
            )}
          </Command.Loading>
        ) : (
          movies.map((movie) => {
            return (
              <Item
                key={movie.id}
                onSelect={() => {
                  moviePage();
                  selectMovie(movie);
                }}
              >
                <MovieIcon />
                {movie.title}
              </Item>
            );
          })
        )}
      </Command.Group>
    </>
  );
}

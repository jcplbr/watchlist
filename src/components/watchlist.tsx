import { Command } from "cmdk";
import { MovieIcon, PlusIcon } from "./icons";
import Item from "@/helpers/cmdk-item";
import supabase from "@/lib/supabase";
import React from "react";
import { MovieData } from "@/types/movie.types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const revalidate = 60;

export default function Watchlist({
  list,
  moviePage,
  searchMovies,
  selectMovie,
}: {
  list: string;
  moviePage: Function;
  searchMovies: Function;
  selectMovie: Function;
}) {
  const [movies, setMovies] = React.useState<Partial<MovieData>[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const movies = async () => {
      const { data: movies } = await supabase
        .from("movies")
        .select()
        .eq("current_list", list)
        .order("popularity", { ascending: false });

      setMovies(movies ?? []);
      setLoading(false);
    };

    movies();
  }, [list]);

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
          <>
            <Item
              onSelect={() => {
                searchMovies();
              }}
            >
              <PlusIcon />
              Add New Movie...
            </Item>

            {movies.map((movie) => {
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
            })}
          </>
        )}
      </Command.Group>
    </>
  );
}

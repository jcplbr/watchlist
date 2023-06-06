import Item from "@/helpers/cmdk-item";
import { MovieData } from "@/types/movie.types";
import { Command } from "cmdk";
import { ToWatchIcon, WatchedIcon, WatchingIcon } from "./icons";
import React from "react";
import supabase from "@/lib/supabase";
import { toast } from "sonner";

export default function MoveTo({
  selectedMovie,
  popPage,
}: {
  selectedMovie: MovieData;
  popPage: Function;
}) {
  const [movie, setMovie] = React.useState<MovieData>();
  const [list, setList] = React.useState<string>(selectedMovie.current_list);

  React.useEffect(() => {
    const fetchMovie = async () => {
      const { data: movie } = await supabase
        .from("movies")
        .select()
        .eq("id", selectedMovie?.id)
        .single();

      setMovie(movie!);
    };

    fetchMovie();

    const channel = supabase
      .channel("channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "movies" },
        (payload) => {
          setList(payload.new.current_list);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedMovie?.id]);

  async function changeToToWatch(newList: string) {
    const { data } = await supabase
      .from("movies")
      .update({ current_list: "To Watch" })
      .eq("id", selectedMovie?.id);

    toast.success(
      `'${selectedMovie.title}' successfully moved to '${newList}' List.`
    );
  }

  async function changeToWatching(newList: string) {
    const { data } = await supabase
      .from("movies")
      .update({ current_list: "Watching" })
      .eq("id", selectedMovie?.id);

    toast.success(
      `'${selectedMovie.title}' successfully moved to '${newList}' List.`
    );
  }

  async function changeToWatched(newList: string) {
    const { data } = await supabase
      .from("movies")
      .update({ current_list: "Watched" })
      .eq("id", selectedMovie?.id);

    toast.success(
      `'${selectedMovie.title}' successfully moved to '${newList}' List.`
    );
  }

  return (
    <Command.Group>
      {movie?.current_list !== "To Watch" && (
        <Item
          onSelect={() => {
            changeToToWatch("To Watch");
            popPage();
          }}
        >
          <ToWatchIcon />
          To Watch List
        </Item>
      )}
      {movie?.current_list !== "Watching" && (
        <Item
          onSelect={() => {
            changeToWatching("Watching");
            popPage();
          }}
        >
          <WatchingIcon />
          Watching List
        </Item>
      )}
      {movie?.current_list !== "Watched" && (
        <Item
          onSelect={() => {
            changeToWatched("Watched");
            popPage();
          }}
        >
          <WatchedIcon />
          Watched List
        </Item>
      )}
    </Command.Group>
  );
}

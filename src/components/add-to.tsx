import Item from "@/helpers/cmdk-item";
import { MovieData } from "@/types/movie.types";
import { Command } from "cmdk";
import { ToWatchIcon, WatchedIcon, WatchingIcon } from "./icons";
import React from "react";
import supabase from "@/lib/supabase";
import { toast } from "sonner";

export default function AddTo({
  selectedMovie,
  popPage,
}: {
  selectedMovie: MovieData;
  popPage: Function;
}) {
  const [list, setList] = React.useState<string>(selectedMovie.current_list);

  React.useEffect(() => {
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
  }, []);

  async function changeToToWatch(newList: string) {
    const { data } = await supabase
      .from("movies")
      .update({ current_list: "To Watch" })
      .eq("id", selectedMovie?.id);

    toast.success(
      `'${selectedMovie.title}' successfully added to '${newList}' List.`
    );
  }

  async function changeToWatching(newList: string) {
    const { data } = await supabase
      .from("movies")
      .update({ current_list: "Watching" })
      .eq("id", selectedMovie?.id);

    toast.success(
      `'${selectedMovie.title}' successfully added to '${newList}' List.`
    );
  }

  async function changeToWatched(newList: string) {
    const { data } = await supabase
      .from("movies")
      .update({ current_list: "Watched" })
      .eq("id", selectedMovie?.id);

    toast.success(
      `'${selectedMovie.title}' successfully added to '${newList}' List.`
    );
  }

  return (
    <Command.Group>
      <Item
        onSelect={() => {
          changeToToWatch("To Watch");
          popPage();
        }}
      >
        <ToWatchIcon />
        To Watch List
      </Item>
      <Item
        onSelect={() => {
          changeToWatching("Watching");
          popPage();
        }}
      >
        <WatchingIcon />
        Watching List
      </Item>
      <Item
        onSelect={() => {
          changeToWatched("Watched");
          popPage();
        }}
      >
        <WatchedIcon />
        Watched List
      </Item>
    </Command.Group>
  );
}

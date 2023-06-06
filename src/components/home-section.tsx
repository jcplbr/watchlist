import { Command } from "cmdk";
import {
  LaptopIcon,
  SearchIcon,
  ToWatchIcon,
  WandIcon,
  WatchedIcon,
  WatchingIcon,
} from "./icons";
import Item from "@/helpers/cmdk-item";

export default function Home({
  searchMovies,
  askAI,
  toWatch,
  watching,
  watched,
  theme,
}: {
  searchMovies: Function;
  askAI: Function;
  toWatch: Function;
  watching: Function;
  watched: Function;
  theme: Function;
}) {
  return (
    <>
      <Command.Group heading="Explore">
        <Item
          shortcut="⇧ P"
          onSelect={() => {
            searchMovies();
          }}
        >
          <SearchIcon />
          Browse Popular Movies...
        </Item>
        <Item
          onSelect={() => {
            askAI();
          }}
        >
          <WandIcon />
          Ask AI for recommendations...
        </Item>
      </Command.Group>
      <Command.Group heading="Watchlist">
        <Item
          shortcut="⇧ L"
          onSelect={() => {
            toWatch();
          }}
        >
          <ToWatchIcon />
          Manage To Watch List...
        </Item>
        <Item
          onSelect={() => {
            watching();
          }}
        >
          <WatchingIcon />
          Manage Watching List...
        </Item>
        <Item
          onSelect={() => {
            watched();
          }}
        >
          <WatchedIcon />
          Manage Watched List...
        </Item>
      </Command.Group>
      <Command.Group heading="General">
        <Item
          shortcut="T"
          onSelect={() => {
            theme();
          }}
        >
          <LaptopIcon />
          Change Theme...
        </Item>
      </Command.Group>
    </>
  );
}

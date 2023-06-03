import { Command } from "cmdk";
import { Item } from "./command-menu";
import { MovieIcon, PlusIcon } from "./icons";

export default function Watching({ searchMovies }: { searchMovies: Function }) {
  return (
    <Command.Group>
      <Item
        onSelect={() => {
          searchMovies();
        }}
      >
        <PlusIcon />
        Add New Movie...
      </Item>
      <Item>
        <MovieIcon />
        Movie 1
      </Item>
    </Command.Group>
  );
}

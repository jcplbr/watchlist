import { Command } from "cmdk";
import { Item } from "./command-menu";
import { MovieIcon, PlusIcon } from "./icons";

export default function ToWatch({ searchMovies }: { searchMovies: Function }) {
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
      <Item>
        <MovieIcon />
        Movie 2
      </Item>
    </Command.Group>
  );
}

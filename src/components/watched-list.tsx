import { Command } from "cmdk";
import { Item } from "./command-menu";
import { MovieIcon, PlusIcon } from "./icons";

export default function Watched({ searchMovies }: { searchMovies: Function }) {
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
      <Item>
        <MovieIcon />
        Movie 3
      </Item>
      <Item>
        <MovieIcon />
        Movie 4
      </Item>
      <Item>
        <MovieIcon />
        Movie 5
      </Item>
    </Command.Group>
  );
}

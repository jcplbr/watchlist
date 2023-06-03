import { Command } from "cmdk";
import { Item } from "./command-menu";
import { LaptopIcon, MoonIcon, SunIcon } from "./icons";

export default function Theme({
  lightTheme,
  darkTheme,
  systemTheme,
}: {
  lightTheme: Function;
  darkTheme: Function;
  systemTheme: Function;
}) {
  return (
    <Command.Group>
      <Item
        onSelect={() => {
          lightTheme();
        }}
      >
        <SunIcon />
        Change Theme to Light
      </Item>
      <Item
        onSelect={() => {
          darkTheme();
        }}
      >
        <MoonIcon />
        Change Theme to Dark
      </Item>
      <Item
        onSelect={() => {
          systemTheme();
        }}
      >
        <LaptopIcon />
        Change Theme to System
      </Item>
    </Command.Group>
  );
}

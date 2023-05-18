"use client";

import React from "react";
import { Command } from "cmdk";

export function CommandMenu() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [pages, setPages] = React.useState<string[]>(["home"]);
  const activePage = pages[pages.length - 1];
  const isHome = activePage === "home";

  const popPage = React.useCallback(() => {
    setPages((pages) => {
      const x = [...pages];
      x.splice(-1, 1);
      return x;
    });
  }, []);

  function bounce() {
    if (ref.current) {
      ref.current.style.transform = "scale(0.98)";
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.transform = "";
        }
      }, 100);
      setInputValue("");
    }
  }

  return (
    <Command
      ref={ref}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
          bounce();
        }

        if (
          (e.key === "Escape" && !isHome) ||
          (e.key === "Backspace" && !inputValue)
        ) {
          e.preventDefault();
          popPage();
          bounce();
        }
      }}
    >
      <div>
        {pages.map((p) => (
          <div
            key={p}
            cmdk-vercel-badge=""
            onClick={() => {
              if (p === activePage) return;
              popPage();
            }}
          >
            {p}
          </div>
        ))}
      </div>
      <Command.Input
        autoFocus
        placeholder={
          activePage === "search"
            ? "Search Movies, TV Shows..."
            : activePage === "ask AI"
            ? "Ask AI for recommendations..."
            : activePage === "to watch"
            ? "Search To Watch..."
            : activePage === "watching"
            ? "Search Watching..."
            : activePage === "watched"
            ? "Search Watched..."
            : activePage === "theme"
            ? "Change Theme..."
            : "What do you want to do?"
        }
        onValueChange={(value) => {
          setInputValue(value);
        }}
        value={inputValue}
      />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        {activePage === "home" && (
          <Home
            searchMovies={() => setPages([...pages, "search"])}
            askAI={() => setPages([...pages, "ask AI"])}
            toWatch={() => setPages([...pages, "to watch"])}
            watching={() => setPages([...pages, "watching"])}
            watched={() => setPages([...pages, "watched"])}
          />
        )}
        {activePage === "search" && <Movies />}
        {activePage === "ask AI" && <AskAI />}
        {activePage === "to watch" && <ToWatch />}
        {activePage === "watching" && <Watching />}
        {activePage === "watched" && <Watched />}
      </Command.List>
    </Command>
  );
}

function Home({
  searchMovies,
  askAI,
  toWatch,
  watching,
  watched,
}: {
  searchMovies: Function;
  askAI: Function;
  toWatch: Function;
  watching: Function;
  watched: Function;
}) {
  return (
    <>
      <Command.Group heading="Explore">
        <Item
          shortcut="⇧ S"
          onSelect={() => {
            searchMovies();
          }}
        >
          <SearchIcon />
          Search Movies, TV Shows...
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
          shortcut="⇧ W"
          onSelect={() => {
            toWatch();
          }}
        >
          <DotIcon />
          Search To Watch...
        </Item>
        <Item
          onSelect={() => {
            watching();
          }}
        >
          <DotIcon />
          Search Watching...
        </Item>
        <Item
          onSelect={() => {
            watched();
          }}
        >
          <DotIcon />
          Search Watched...
        </Item>
      </Command.Group>
      <Command.Group heading="General">
        <Item shortcut="T">
          <LaptopIcon />
          Change Theme...
        </Item>
      </Command.Group>
    </>
  );
}

function Movies() {
  return (
    <Command.Group>
      <Item>Project 1</Item>
      <Item>Project 2</Item>
      <Item>Project 3</Item>
      <Item>Project 4</Item>
      <Item>Project 5</Item>
      <Item>Project 6</Item>
    </Command.Group>
  );
}

function AskAI() {
  return (
    <Command.Group>
      <Item>Project 1</Item>
      <Item>Project 2</Item>
      <Item>Project 3</Item>
    </Command.Group>
  );
}

function ToWatch() {
  return (
    <Command.Group>
      <Item>Project 1</Item>
      <Item>Project 2</Item>
    </Command.Group>
  );
}

function Watching() {
  return (
    <Command.Group>
      <Item>Project 1</Item>
    </Command.Group>
  );
}

function Watched() {
  return (
    <Command.Group>
      <Item>Project 1</Item>
      <Item>Project 2</Item>
      <Item>Project 3</Item>
      <Item>Project 4</Item>
      <Item>Project 5</Item>
      <Item>Project 6</Item>
    </Command.Group>
  );
}

function Item({
  children,
  shortcut,
  onSelect = () => {},
}: {
  children: React.ReactNode;
  shortcut?: string;
  onSelect?: (value: string) => void;
}) {
  return (
    <Command.Item onSelect={onSelect}>
      {children}
      {shortcut && (
        <div cmdk-vercel-shortcuts="">
          {shortcut.split(" ").map((key) => {
            return <kbd key={key}>{key}</kbd>;
          })}
        </div>
      )}
    </Command.Item>
  );
}

function SearchIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
    </svg>
  );
}

function WandIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"></path>
      <path d="m14 7 3 3"></path>
      <path d="M5 6v4"></path>
      <path d="M19 14v4"></path>
      <path d="M10 2v2"></path>
      <path d="M7 8H3"></path>
      <path d="M21 16h-4"></path>
      <path d="M11 3H9"></path>
    </svg>
  );
}

function DotIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="1"></circle>
    </svg>
  );
}

function LaptopIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect width="18" height="12" x="3" y="4" rx="2" ry="2"></rect>
      <line x1="2" x2="22" y1="20" y2="20"></line>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2"></path>
      <path d="M12 20v2"></path>
      <path d="m4.93 4.93 1.41 1.41"></path>
      <path d="m17.66 17.66 1.41 1.41"></path>
      <path d="M2 12h2"></path>
      <path d="M20 12h2"></path>
      <path d="m6.34 17.66-1.41 1.41"></path>
      <path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
    </svg>
  );
}

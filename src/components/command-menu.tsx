"use client";

import React, { useContext } from "react";
import { Command } from "cmdk";
import {
  LaptopIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  ToWatchIcon,
  WandIcon,
  WatchedIcon,
  WatchingIcon,
} from "./icons";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { Message } from "@/lib/validators/message";
import ChatMessages from "./chat-messages";
import { MessagesContext } from "@/context/messages";
import { toast } from "react-hot-toast";

export function CommandMenu() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [pages, setPages] = React.useState<string[]>(["home"]);
  const activePage = pages[pages.length - 1];
  const isHome = activePage === "home";
  const {
    messages,
    isMessageUpdating,
    addMessage,
    removeMessage,
    updateMessage,
    setIsMessageUpdating,
  } = useContext(MessagesContext);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const { mutate: sendMessage, isLoading } = useMutation({
    mutationKey: ["sendMessage"],
    // include message to later use it in onMutate
    mutationFn: async (_message: Message) => {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      return response.body;
    },
    onMutate(message) {
      addMessage(message);
    },
    onSuccess: async (stream) => {
      if (!stream) throw new Error("No stream");

      // construct new message to add
      const id = nanoid();
      const responseMessage: Message = {
        id,
        isUserMessage: false,
        text: "",
      };

      // add new message to state
      addMessage(responseMessage);

      setIsMessageUpdating(true);

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        updateMessage(id, (prev) => prev + chunkValue);
      }

      // clean up
      setIsMessageUpdating(false);
      setInputValue("");

      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    },
    onError: (_, message) => {
      toast.error("Something went wrong. Please try again.");
      removeMessage(message.id);
      inputRef.current?.focus();
    },
  });

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
          (e.key === "Backspace" && !inputValue && !isHome)
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
        ref={inputRef}
        autoFocus
        placeholder={
          activePage === "movies"
            ? "Search Movies..."
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
        onKeyDown={(e: React.KeyboardEvent) => {
          if (activePage === "ask AI" && e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            const message = {
              id: nanoid(),
              isUserMessage: true,
              text: inputValue,
            };

            sendMessage(message);
          }
        }}
      />
      <Command.List>
        {activePage === "ask AI" ? (
          <Command.Empty>No messages yet</Command.Empty>
        ) : (
          <Command.Empty>
            No results for &quot;<span>{inputValue}</span>&quot;
          </Command.Empty>
        )}
        {activePage === "home" && (
          <Home
            searchMovies={() => setPages([...pages, "movies"])}
            askAI={() => setPages([...pages, "ask AI"])}
            toWatch={() => setPages([...pages, "to watch"])}
            watching={() => setPages([...pages, "watching"])}
            watched={() => setPages([...pages, "watched"])}
            theme={() => setPages([...pages, "theme"])}
          />
        )}
        {activePage === "movies" && <Movies />}
        {activePage === "ask AI" && <AskAI />}
        {activePage === "to watch" && <ToWatch />}
        {activePage === "watching" && <Watching />}
        {activePage === "watched" && <Watched />}
        {activePage === "theme" && (
          <Theme
            lightTheme={() => popPage()}
            darkTheme={() => popPage()}
            systemTheme={() => popPage()}
          />
        )}
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
          shortcut="⇧ M"
          onSelect={() => {
            searchMovies();
          }}
        >
          <SearchIcon />
          Search Movies...
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
          <ToWatchIcon />
          Search To Watch...
        </Item>
        <Item
          onSelect={() => {
            watching();
          }}
        >
          <WatchingIcon />
          Search Watching...
        </Item>
        <Item
          onSelect={() => {
            watched();
          }}
        >
          <WatchedIcon />
          Search Watched...
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
      <Item>
        <ChatMessages />
      </Item>
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
    </Command.Group>
  );
}

function Theme({
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

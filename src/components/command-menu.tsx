"use client";

import React, { useContext } from "react";
import { Command } from "cmdk";
import { LoaderIcon, MovieIcon, PlusIcon } from "./icons";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { Message } from "@/lib/validators/message";
import { MessagesContext } from "@/context/messages";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { MovieData } from "@/types/movie.types";
import Home from "./home-section";
import Movies from "./movies";
import MoviePage from "./movie-page";
import AskAI from "./ask-ai";
import ToWatch from "./to-watch-list";
import Watching from "./watching-list";
import Watched from "./watched-list";
import Theme from "./theme-toggle";

export function CommandMenu() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
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
    clearChat,
  } = useContext(MessagesContext);

  const [selectedMovie, setSelectedMovie] = React.useState<MovieData>();

  const [windowWidth, setWindowWidth] = React.useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  React.useEffect(() => {
    function handleResize() {
      if (typeof window !== "undefined") {
        setWindowWidth(window.innerWidth);
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  // AI chat
  const { mutate: sendMessage, isLoading } = useMutation({
    mutationKey: ["sendMessage"],
    // Include message to later use in onMutate
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
      if (inputValue === "clear") {
        clearChat();
        return { abort: true };
      }

      addMessage(message);
    },
    onSuccess: async (stream) => {
      if (!stream) throw new Error("No stream");
      // Construct new message to add
      const id = nanoid();
      const responseMessage: Message = {
        id,
        isUserMessage: false,
        text: "",
      };
      // Add new message to state
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
      // Clean up
      setIsMessageUpdating(false);
      setInputValue("");
      setTimeout(() => {
        if (windowWidth > 1024) {
          inputRef.current?.focus();
        }
      }, 10);
    },
    onError: (_, message) => {
      toast.error("Something went wrong. Please try again later.");
      removeMessage(message.id);
      if (windowWidth > 1024) {
        inputRef.current?.focus();
      }
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

  // Theme toggle
  const [mounted, setMounted] = React.useState<boolean>(false);
  const { setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Command
      shouldFilter={activePage !== "ask AI" && activePage !== "current"}
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
      <div style={{ position: "relative" }}>
        <Command.Input
          ref={inputRef}
          autoFocus={windowWidth > 1024}
          disabled={isLoading}
          readOnly={activePage === "current"}
          placeholder={
            activePage === "home"
              ? "What do you want to do?"
              : activePage === "movies" || activePage === "current"
              ? "Browse Popular Movies..."
              : activePage === "ask AI"
              ? "Ask AI for recommendations..."
              : activePage === "to watch"
              ? "Manage To Watch List..."
              : activePage === "watching"
              ? "Manage Watching List..."
              : activePage === "watched"
              ? "Manage Watched List..."
              : "Change Theme..."
          }
          onValueChange={(value) => {
            setInputValue(value);
          }}
          value={activePage === "current" ? selectedMovie?.title : inputValue}
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

        {activePage === "ask AI" && isLoading && (
          <kbd aria-hidden="true" className="ai-loader">
            <LoaderIcon />
          </kbd>
        )}
      </div>

      <Command.List>
        {activePage === "ask AI" ? (
          <Command.Empty>No messages yet</Command.Empty>
        ) : (
          <Command.Empty>
            No results for &quot;<span>{inputValue}</span>&quot;.
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
        {activePage === "movies" && (
          <Movies
            moviePage={() => setPages([...pages, "current"])}
            selectMovie={(movie: MovieData) => setSelectedMovie(movie)}
          />
        )}
        {activePage === "ask AI" && <AskAI />}
        {activePage === "to watch" && (
          <ToWatch
            searchMovies={() => setPages([...pages.slice(0, -1), "movies"])}
          />
        )}
        {activePage === "watching" && (
          <Watching
            searchMovies={() => setPages([...pages.slice(0, -1), "movies"])}
          />
        )}
        {activePage === "watched" && (
          <Watched
            searchMovies={() => setPages([...pages.slice(0, -1), "movies"])}
          />
        )}
        {activePage === "theme" && (
          <Theme
            lightTheme={() => {
              setTheme("light");
              popPage();
            }}
            darkTheme={() => {
              setTheme("dark");
              popPage();
            }}
            systemTheme={() => {
              setTheme("system");
              popPage();
            }}
          />
        )}
        {activePage === "current" && (
          <MoviePage selectedMovie={selectedMovie!} />
        )}
      </Command.List>
    </Command>
  );
}

////////////////////////////////////////////////////////////////////////////////////////////

export function Item({
  children,
  shortcut,
  onSelect = () => {},
  className,
}: {
  children: React.ReactNode;
  shortcut?: string;
  onSelect?: (value: string) => void;
  className?: string;
}) {
  return (
    <Command.Item className={className} onSelect={onSelect}>
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

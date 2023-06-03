"use client";

import React, { useContext } from "react";
import { Command } from "cmdk";
import {
  LaptopIcon,
  LoaderIcon,
  MoonIcon,
  MovieIcon,
  PlusIcon,
  ReadMoreIcon,
  SearchIcon,
  SunIcon,
  ToWatchIcon,
  WandIcon,
  WatchedIcon,
  WatchingIcon,
} from "./icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { Message } from "@/lib/validators/message";
import ChatMessages from "./chat-messages";
import { MessagesContext } from "@/context/messages";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import Image from "next/image";
import { MovieData } from "@/types/movie.types";
import { options } from "@/helpers/options";

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

  const [popularMovies, setPopularMovies] = React.useState<MovieData[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = React.useState<MovieData>();

  // TMDB popular movies
  const pageOneQuery = useQuery({
    queryKey: ["movies", { type: "popular", page: 1 }],
    queryFn: async () => {
      setLoading(true);

      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`,
        options
      );

      return res.json();
    },
    onSuccess: (data) => {
      const modifiedData = data.results.map((movie: MovieData) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
      }));

      setPopularMovies((prev) => [...prev, ...modifiedData]);
      setLoading(false);
      return modifiedData;
    },
    onError: () => {
      toast.error("Something went wrong. Please try again later.");
    },
    refetchOnWindowFocus: false,
  });

  const pageTwoQuery = useQuery({
    queryKey: ["movies", { type: "popular", page: 2 }],
    queryFn: async () => {
      setLoading(true);

      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?language=en-US&page=2`,
        options
      );

      return res.json();
    },
    onSuccess: (data) => {
      const modifiedData = data.results.map((movie: MovieData) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
      }));

      setPopularMovies((prev) => [...prev, ...modifiedData]);
      setLoading(false);
      return modifiedData;
    },
    onError: () => {
      toast.error("Something went wrong. Please try again later.");
    },
    refetchOnWindowFocus: false,
  });

  const pageThreeQuery = useQuery({
    queryKey: ["movies", { type: "popular", page: 3 }],
    queryFn: async () => {
      setLoading(true);

      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?language=en-US&page=3`,
        options
      );

      return res.json();
    },
    onSuccess: (data) => {
      const modifiedData = data.results.map((movie: MovieData) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
      }));

      setPopularMovies((prev) => [...prev, ...modifiedData]);
      setLoading(false);
      return modifiedData;
    },
    onError: () => {
      toast.error("Something went wrong. Please try again later.");
    },
    refetchOnWindowFocus: false,
  });

  const pageFourQuery = useQuery({
    queryKey: ["movies", { type: "popular", page: 4 }],
    queryFn: async () => {
      setLoading(true);

      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?language=en-US&page=4`,
        options
      );

      return res.json();
    },
    onSuccess: (data) => {
      const modifiedData = data.results.map((movie: MovieData) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
      }));

      setPopularMovies((prev) => [...prev, ...modifiedData]);
      setLoading(false);
      return modifiedData;
    },
    onError: () => {
      toast.error("Something went wrong. Please try again later.");
    },
    refetchOnWindowFocus: false,
  });

  const pageFiveQuery = useQuery({
    queryKey: ["movies", { type: "popular", page: 5 }],
    queryFn: async () => {
      setLoading(true);

      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?language=en-US&page=5`,
        options
      );

      return res.json();
    },
    onSuccess: (data) => {
      const modifiedData = data.results.map((movie: MovieData) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
      }));

      setPopularMovies((prev) => [...prev, ...modifiedData]);
      setLoading(false);
      return modifiedData;
    },
    onError: () => {
      toast.error("Something went wrong. Please try again later.");
    },
    refetchOnWindowFocus: false,
  });

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
            activePage === "movies" || "current"
              ? "Browse Popular Movies..."
              : activePage === "ask AI"
              ? "Ask AI for recommendations..."
              : activePage === "to watch"
              ? "Manage To Watch List..."
              : activePage === "watching"
              ? "Manage Watching List..."
              : activePage === "watched"
              ? "Manage Watched List..."
              : activePage === "theme"
              ? "Change Theme..."
              : "What do you want to do?"
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
            popularMovies={popularMovies}
            loading={loading}
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

function Movies({
  popularMovies,
  loading,
  moviePage,
  selectMovie,
}: {
  popularMovies: MovieData[];
  loading: boolean;
  moviePage: Function;
  selectMovie: Function;
}) {
  return (
    <>
      <Command.Group>
        {loading && (
          <Command.Loading>
            {Array(6).fill(
              <Item className="skeleton">
                <Skeleton />
              </Item>
            )}
          </Command.Loading>
        )}
        {popularMovies.map((movie: MovieData) => {
          return (
            <Item
              key={movie.id}
              onSelect={() => {
                moviePage();
                selectMovie(movie);
              }}
            >
              <MovieIcon />
              {movie.title}
            </Item>
          );
        })}
      </Command.Group>
    </>
  );
}

function AskAI() {
  return (
    <Command.Group>
      <Item className="ai-item">
        <ChatMessages />
      </Item>
    </Command.Group>
  );
}

function ToWatch({ searchMovies }: { searchMovies: Function }) {
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

function Watching({ searchMovies }: { searchMovies: Function }) {
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

function Watched({ searchMovies }: { searchMovies: Function }) {
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

function MoviePage({ selectedMovie }: { selectedMovie: MovieData }) {
  const formattedDate = convertDateFormat(selectedMovie.release_date);
  const movieUrl = `https://www.themoviedb.org/movie/${selectedMovie.id}`;

  // TMDB configuration
  const [posterBasePath, setPosterBasePath] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const configurationQuery = useQuery({
    queryKey: ["configuration"],
    queryFn: async () => {
      setLoading(true);

      const res = await fetch(
        "https://api.themoviedb.org/3/configuration",
        options
      );

      return res.json();
    },
    onSuccess: (data) => {
      const base_url = data.images.secure_base_url;
      const poster_size = data.images.poster_sizes[6];
      const poster_base_path = `${base_url}${poster_size}`;

      setPosterBasePath(poster_base_path);
      setLoading(false);
    },
    onError: () => {
      toast.error(
        "Something went wrong retrieving the poster. Please try again later."
      );
    },
    refetchOnWindowFocus: false,
  });

  // TMDB movie genres
  const [genresArray, setGenresArray] = React.useState<string[]>([]);
  const genres: string = genresArray.join(", ");

  const genresQuery = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${selectedMovie.id}?language=en-US`,
        options
      );

      return res.json();
    },
    onSuccess: (data) => {
      for (let i = 0; i < data.genres.length; i++) {
        const { name } = data.genres[i];

        setGenresArray((prev) => [...prev, name]);
      }
    },
    onError: () => {
      toast.error(
        "Something went wrong retrieving the genres. Please try again later."
      );
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <Command.Group>
        <div className="movie-wrapper">
          {loading ? (
            <Command.Loading>
              <Skeleton
                width={125}
                className="skeleton movie-poster"
                baseColor="var(--grayA3)"
                highlightColor="unset"
              />
            </Command.Loading>
          ) : (
            <Image
              src={`${posterBasePath}${selectedMovie.poster_path}`}
              width={720}
              height={1080}
              alt={`${selectedMovie.title} poster`}
              referrerPolicy="no-referrer"
              className="movie-poster"
              draggable={false}
            />
          )}

          <div className="movie-info">
            <div className="movie-date">
              <p>
                {formattedDate} {genres && `• ${genres}`}
              </p>
            </div>
            <div className="movie-overview">
              <p>{selectedMovie.overview}</p>
            </div>
          </div>
        </div>
      </Command.Group>

      <Command.Group heading="Actions">
        <Item onSelect={() => window.open(movieUrl, "_blank")}>
          <ReadMoreIcon /> Read more
        </Item>
        <Item>
          <PlusIcon /> Add to...
        </Item>
      </Command.Group>
    </>
  );
}

////////////////////////////////////////////////////////////////////////////////////////////

function Item({
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

function convertDateFormat(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function Loading() {
  return <p>Loading</p>;
}

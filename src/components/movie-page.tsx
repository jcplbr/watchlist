import { options } from "@/helpers/options";
import { MovieData } from "@/types/movie.types";
import { useQuery } from "@tanstack/react-query";
import { Command } from "cmdk";
import React from "react";
import { toast } from "sonner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import { ArrowRightIcon, PlusIcon, ReadMoreIcon, TrashIcon } from "./icons";
import Item from "@/helpers/cmdk-item";
import supabase from "@/lib/supabase";

export const revalidate = 60;

export default function MoviePage({
  selectedMovie,
  addTo,
  moveTo,
}: {
  selectedMovie: MovieData;
  addTo: Function;
  moveTo: Function;
}) {
  const formattedDate = convertDateFormat(selectedMovie.release_date);
  const movieUrl = `https://www.themoviedb.org/movie/${selectedMovie.id}`;

  // TMDB configuration
  const [posterBasePath, setPosterBasePath] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(true);

  const configurationQuery = useQuery({
    queryKey: ["configuration"],
    queryFn: async () => {
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

  async function changeToNone() {
    const { data } = await supabase
      .from("movies")
      .update({ current_list: "None" })
      .eq("id", selectedMovie?.id);

    toast.success(
      `'${selectedMovie.title}' successfully removed from '${list}' List.`
    );
  }

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
            <div className="movie-header">
              <div className="movie-date">
                <p>{formattedDate}</p>
                <p className="separator-dot">•</p>
                <p>{genres && `${genres}`}</p>
              </div>
              {list !== "None" && <div cmdk-vercel-badge="">{list}</div>}
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
        {list === "None" && (
          <Item
            onSelect={() => {
              addTo();
            }}
          >
            <PlusIcon /> Add to...
          </Item>
        )}
        {list !== "None" && (
          <>
            <Item onSelect={() => moveTo()}>
              <ArrowRightIcon /> Move to...
            </Item>
            <Item onSelect={() => changeToNone()}>
              <TrashIcon /> Remove from {list} List
            </Item>
          </>
        )}
      </Command.Group>
    </>
  );
}

////////////////////////////////////////////////////////////////////////////////////////////

function convertDateFormat(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

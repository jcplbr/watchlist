"use client";

import supabase from "@/lib/supabase";
import { notFound } from "next/navigation";
import ListButton from "./ListButton";

export const revalidate = 60;

export async function generateStaticParams() {
  const { data: movies } = await supabase.from("movies").select("id");

  return movies?.map((movie) => ({
    id: movie.id.toString(),
  }));
}

export default async function Movie({
  params: { id },
}: {
  params: { id: string };
}) {
  const { data: movie } = await supabase
    .from("movies")
    .select("id, title, current_list")
    .match({ id })
    .single();

  if (!movie) {
    notFound();
  }

  async function changeListToWatching() {
    const { data } = await supabase
      .from("movies")
      .update({ current_list: "Watching" })
      .eq("id", movie?.id);
  }

  async function changeListToNone() {
    const { data } = await supabase
      .from("movies")
      .update({ current_list: "None" })
      .eq("id", movie?.id);
  }

  return (
    <>
      <p>{movie.title}</p>
      <br />
      <ListButton
        changeListToWatching={changeListToWatching}
        changeListToNone={changeListToNone}
        current_list={movie.current_list}
      />
    </>
  );
}

"use client";

import getMovies from "@/hooks/get-movies";
import supabase from "@/lib/supabase";
import Link from "next/link";
import { useEffect } from "react";

export const revalidate = 60;

export default async function Movies() {
  useEffect(() => {
    getMovies();
  }, []);

  const { data: movies } = await supabase
    .from("movies")
    .select("id, title")
    .order("popularity", { ascending: false });

  if (!movies) {
    return <p>No movies found.</p>;
  }

  return movies.map((movie) => (
    <p key={movie.id} style={{ marginBottom: "16px" }}>
      <Link href={`/test/${movie.id}`}>{movie.title}</Link>
    </p>
  ));
}

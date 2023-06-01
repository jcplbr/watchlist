import { options } from "@/app/helpers/options";
import supabase from "@/lib/supabase";
import { MovieData } from "@/types/movie.types";

export default async function getMovies() {
    const getPageOne = async () => {
        const res = await fetch(
        "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
        options
        );
    
        if (!res.ok) throw new Error("Failed to fetch data.");
    
        const data = await res.json();
    
        // Get only interested fields
        const modifiedData = data.results.map((movie: MovieData) => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            poster_path: movie.poster_path,
            popularity: movie.popularity
        }));
    
        // Insert data into database
        const { data: insertedData } = await supabase
        .from("movies")
        .insert(modifiedData);
    
        return modifiedData;
    }
    
    const getPageTwo = async () => {
        const res = await fetch(
        "https://api.themoviedb.org/3/movie/popular?language=en-US&page=2",
        options
        );
    
        if (!res.ok) throw new Error("Failed to fetch data.");
    
        const data = await res.json();
    
        // Get only interested fields
        const modifiedData = data.results.map((movie: MovieData) => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            poster_path: movie.poster_path,
            popularity: movie.popularity
        }));
    
        // Insert data into database
        const { data: insertedData } = await supabase
        .from("movies")
        .insert(modifiedData);
    
        return modifiedData;
    }
    
    const getPageThree = async () => {
        const res = await fetch(
        "https://api.themoviedb.org/3/movie/popular?language=en-US&page=3",
        options
        );
    
        if (!res.ok) throw new Error("Failed to fetch data.");
    
        const data = await res.json();
    
        // Get only interested fields
        const modifiedData = data.results.map((movie: MovieData) => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            poster_path: movie.poster_path,
            popularity: movie.popularity
        }));
    
        // Insert data into database
        const { data: insertedData } = await supabase
        .from("movies")
        .insert(modifiedData);
    
        return modifiedData;
    }
    
    const getPageFour = async () => {
        const res = await fetch(
        "https://api.themoviedb.org/3/movie/popular?language=en-US&page=4",
        options
        );
    
        if (!res.ok) throw new Error("Failed to fetch data.");
    
        const data = await res.json();
    
        // Get only interested fields
        const modifiedData = data.results.map((movie: MovieData) => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            poster_path: movie.poster_path,
            popularity: movie.popularity
        }));
    
        // Insert data into database
        const { data: insertedData } = await supabase
        .from("movies")
        .insert(modifiedData);
    
        return modifiedData;
    }
    
    const getPageFive = async () => {
        const res = await fetch(
        "https://api.themoviedb.org/3/movie/popular?language=en-US&page=5",
        options
        );
    
        if (!res.ok) throw new Error("Failed to fetch data.");
    
        const data = await res.json();
    
        // Get only interested fields
        const modifiedData = data.results.map((movie: MovieData) => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            poster_path: movie.poster_path,
            popularity: movie.popularity
        }));
    
        // Insert data into database
        const { data: insertedData } = await supabase
        .from("movies")
        .insert(modifiedData);
    
        return modifiedData;
    }

    const pageOne = await getPageOne()
    const pageTwo = await getPageTwo()
    const pageThree = await getPageThree()
    const pageFour = await getPageFour()
    const pageFive = await getPageFive()

    const data = await Promise.all([pageOne, pageTwo, pageThree, pageFour, pageFive])

    return data
}
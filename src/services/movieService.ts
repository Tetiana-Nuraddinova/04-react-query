import axios from "axios";
import type { Movie } from "../types/movie";

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3/search/movie";

if (!TOKEN) {
  throw new Error("❌ VITE_TMDB_TOKEN is not defined in .env file");
}
interface FetchMoviesResponse {
  results: Movie[];
  total_results: number;
  total_pages: number;
  page: number;
}
export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const config = {
    params: {
      query,
    },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  };
  const { data } = await axios.get<FetchMoviesResponse>(BASE_URL, config);

  return data.results;
};

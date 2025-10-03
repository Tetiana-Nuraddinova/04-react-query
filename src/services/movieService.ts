import axios from "axios";
import type { FetchMoviesResponse } from "../types/movie";

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3/search/movie";

if (!TOKEN) {
  throw new Error("❌ VITE_TMDB_TOKEN is not defined in .env file");
}

export const fetchMovies = async (
  query: string,
  page: number
): Promise<FetchMoviesResponse> => {
  const config = {
    params: {
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  };
  const { data } = await axios.get<FetchMoviesResponse>(BASE_URL, config);

  return data;
};

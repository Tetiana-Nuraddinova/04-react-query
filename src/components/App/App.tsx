import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { SearchBar } from "../SearchBar/SearchBar";
import { MovieGrid } from "../MovieGrid/MovieGrid";
import { fetchMovies } from "../../services/movieService";
import type { Movie, FetchMoviesResponse } from "../../types/movie";
import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { MovieModal } from "../MovieModal/MovieModal";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
    setError(null);
    setLoading(true);

    try {
      const data: FetchMoviesResponse = await fetchMovies(newQuery, 1);

      if (!data.results || data.results.length === 0) {
        toast.error("No movies found for your request.");
        setMovies([]);
      } else {
        setMovies(data.results);
        setTotalPages(data.total_pages);
      }
    } catch {
      setError("Error fetching movies");
      toast.error("There was an error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async ({ selected }: { selected: number }) => {
    const newPage = selected + 1;
    setPage(newPage);
    setLoading(true);
    try {
      const data: FetchMoviesResponse = await fetchMovies(query, newPage);
      setMovies(data.results);
    } catch {
      toast.error("Error fetching movies for this page.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);
  return (
    <div className={css.App}>
      <SearchBar onSubmit={handleSearch} />

      <main>
        {loading && <Loader />}
        {error && <ErrorMessage />}
        {movies.length > 0 && (
          <>
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
            <MovieGrid movies={movies} onSelect={handleSelect} />

            {selectedMovie && (
              <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
            )}
          </>
        )}
      </main>

      <Toaster position="top-right" />
    </div>
  );
}

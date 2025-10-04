import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { SearchBar } from "../SearchBar/SearchBar";
import { MovieGrid } from "../MovieGrid/MovieGrid";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { MovieModal } from "../MovieModal/MovieModal";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { FetchMoviesResponse } from "../../services/movieService";
export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isError, isFetching, isSuccess } = useQuery<
    FetchMoviesResponse,
    Error
  >({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: keepPreviousData,
  });

  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };
  const handlePageChange = async ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleSelect = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);
  return (
    <div className={css.App}>
      <SearchBar onSubmit={handleSearch} />

      <main>
        {isFetching && <Loader />}
        {isError && <ErrorMessage />}
        {isSuccess &&
          data?.results?.length === 0 &&
          toast.error("No movies found for your request.")}
        {isSuccess && data?.results?.length > 0 && (
          <>
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
            <MovieGrid movies={data.results} onSelect={handleSelect} />

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

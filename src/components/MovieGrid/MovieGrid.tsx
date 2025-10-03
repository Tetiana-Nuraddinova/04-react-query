import React from "react";
import type { KeyboardEvent } from "react";
import type { Movie } from "../../types/movie";
import css from "./MovieGrid.module.css";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER = "https://via.placeholder.com/500x750?text=No+Image";
export const MovieGrid: React.FC<MovieGridProps> = ({ movies, onSelect }) => {
  if (!movies || movies.length === 0) return null;
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, movie: Movie) => {
    if (e.key === "Enter") onSelect(movie);
  };
  return (
    <ul className={css.grid}>
      {movies.map((m) => (
        <li key={m.id}>
          <div
            className={css.card}
            onClick={() => onSelect(m)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, m)}
          >
            <img
              className={css.image}
              src={
                m.poster_path ? `${POSTER_BASE}${m.poster_path}` : PLACEHOLDER
              }
              alt={m.title}
              loading="lazy"
            />
            <h2 className={css.title}>{m.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
};

import { Star, Calendar, Film } from "lucide-react";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
  imdbRating?: string;
  Genre?: string;
  Plot?: string;
  Director?: string;
  Actors?: string;
  Runtime?: string;
}

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  return (
    <div
      className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 border border-gray-700 hover:border-purple-500/50"
      onClick={() => onClick(movie)}
    >
      <div className="relative aspect-[2/3] bg-gray-900">
        {hasPoster ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film className="w-16 h-16 text-gray-600" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <span className="text-gray-300 text-xs capitalize">{movie.Type}</span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight mb-1">{movie.Title}</h3>
        <div className="flex items-center gap-1 text-gray-400">
          <Calendar className="w-3 h-3" />
          <span className="text-xs">{movie.Year}</span>
        </div>
      </div>
    </div>
  );
}

interface MovieDetailProps {
  movie: Movie;
  onClose: () => void;
}

export function MovieDetail({ movie, onClose }: MovieDetailProps) {
  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-48 shrink-0">
            {hasPoster ? (
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="w-full sm:w-48 h-64 sm:h-full object-cover rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none"
              />
            ) : (
              <div className="w-full h-64 sm:h-full bg-gray-900 flex items-center justify-center rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none">
                <Film className="w-16 h-16 text-gray-600" />
              </div>
            )}
          </div>
          <div className="p-6 flex-1">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h2 className="text-white text-xl font-bold leading-tight">{movie.Title}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-gray-400 text-sm">{movie.Year}</span>
                  {movie.Runtime && movie.Runtime !== "N/A" && (
                    <>
                      <span className="text-gray-600">·</span>
                      <span className="text-gray-400 text-sm">{movie.Runtime}</span>
                    </>
                  )}
                  <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full capitalize">{movie.Type}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors shrink-0 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {movie.imdbRating && movie.imdbRating !== "N/A" && (
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 font-semibold">{movie.imdbRating}</span>
                <span className="text-gray-500 text-sm">/10 IMDb</span>
              </div>
            )}

            {movie.Genre && movie.Genre !== "N/A" && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {movie.Genre.split(", ").map((g) => (
                  <span key={g} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">{g}</span>
                ))}
              </div>
            )}

            {movie.Plot && movie.Plot !== "N/A" && (
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{movie.Plot}</p>
            )}

            {movie.Director && movie.Director !== "N/A" && (
              <div className="mb-2">
                <span className="text-gray-500 text-xs uppercase tracking-wider">Director</span>
                <p className="text-gray-200 text-sm mt-0.5">{movie.Director}</p>
              </div>
            )}

            {movie.Actors && movie.Actors !== "N/A" && (
              <div>
                <span className="text-gray-500 text-xs uppercase tracking-wider">Cast</span>
                <p className="text-gray-200 text-sm mt-0.5">{movie.Actors}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

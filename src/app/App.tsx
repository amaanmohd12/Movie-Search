import { useState, useCallback } from "react";
import { Search, Film, Loader2, AlertCircle, Clapperboard } from "lucide-react";
import { MovieCard, MovieDetail, type Movie } from "./components/MovieCard";


export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [draftKey, setDraftKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(true);

  const searchMovies = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    if (!apiKey.trim()) {
      setError("Please enter your OMDB API key first.");
      setShowApiInput(true);
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query.trim())}`
      );
      const data = await res.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError(data.Error || "No results found.");
      }
    } catch {
      setError("Failed to fetch movies. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [query, apiKey]);

  const fetchDetails = useCallback(async (movie: Movie) => {
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}&plot=short`
      );
      const data = await res.json();
      if (data.Response === "True") {
        setSelectedMovie(data);
      } else {
        setSelectedMovie(movie);
      }
    } catch {
      setSelectedMovie(movie);
    }
  }, [apiKey]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-600 p-2 rounded-xl">
              <Clapperboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">MovieSearch</h1>
              <p className="text-gray-500 text-xs">Powered by OMDB</p>
            </div>
            <button
              onClick={() => { setDraftKey(apiKey); setShowApiInput(!showApiInput); }}
              className="ml-auto text-xs text-gray-500 hover:text-gray-300 transition-colors border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg"
            >
              {showApiInput ? "Hide" : "API Key"}
            </button>
          </div>

          {showApiInput && (
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={draftKey}
                onChange={(e) => setDraftKey(e.target.value)}
                placeholder="Paste your OMDB API key here (free at omdbapi.com)..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={() => { setApiKey(draftKey.trim()); setShowApiInput(false); }}
                disabled={!draftKey.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          )}

          <form onSubmit={searchMovies} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a movie..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Empty state */}
        {!hasSearched && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-gray-800 p-6 rounded-2xl mb-4">
              <Film className="w-12 h-12 text-purple-400" />
            </div>
            <h2 className="text-gray-300 text-xl font-semibold mb-2">Discover Movies</h2>
            <p className="text-gray-600 max-w-sm">
              Search for your favorite movies, shows, and series using the OMDB database.
            </p>
            <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 flex items-start gap-2 text-left max-w-sm">
              <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-300 text-sm font-medium">API Key Required</p>
                <p className="text-yellow-400/70 text-xs mt-0.5">
                  Get a free API key at <span className="underline">omdbapi.com/apikey.aspx</span> and paste it in the field above.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-[2/3] bg-gray-700" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-700 rounded" />
                  <div className="h-3 bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && movies.length > 0 && (
          <>
            <p className="text-gray-500 text-sm mb-4">Found {movies.length} results for "{query}"</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} onClick={fetchDetails} />
              ))}
            </div>
          </>
        )}

        {/* No results */}
        {!loading && hasSearched && movies.length === 0 && !error && (
          <div className="text-center py-16">
            <Film className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">No movies found for "{query}"</p>
          </div>
        )}
      </div>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieDetail movie={selectedMovie} onClose={() => setSelectedMovie(null)} apiKey={apiKey} />
      )}
    </div>
  );
}

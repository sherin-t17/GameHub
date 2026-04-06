import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Game } from "../types/game";
import { mockGames } from "../mocks/mockGames";

const useGames = () => {
  const [searchParams] = useSearchParams();
  const [games,      setGames]      = useState<Game[]>([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore,    setHasMore]    = useState(false);

  const query = {
    genre:    searchParams.get("genre")    ?? undefined,
    platform: searchParams.get("platform") ?? undefined,
    ordering: searchParams.get("ordering") ?? undefined,
    search:   searchParams.get("search")   ?? undefined,
    filter:   searchParams.get("filter")   ?? undefined,
    page:     Number(searchParams.get("page") ?? 1),
  };

  useEffect(() => {
    // Simulate network delay
    const timer = setTimeout(() => {
      let results = [...mockGames];

      // Filter by genre
      if (query.genre) {
        results = results.filter((g) =>
          g.genres.some((genre) => genre.slug === query.genre)
        );
      }

      // Filter by search
      if (query.search) {
        results = results.filter((g) =>
          g.name.toLowerCase().includes(query.search!.toLowerCase())
        );
      }

      // Sort
      if (query.ordering === "-rating" || query.filter === "top-rated") {
        results.sort((a, b) => b.rating - a.rating);
      } else if (query.ordering === "-released" || query.filter === "new-releases") {
        results.sort((a, b) =>
          new Date(b.released ?? 0).getTime() - new Date(a.released ?? 0).getTime()
        );
      } else if (query.ordering === "-added" || query.filter === "most-played") {
        results.sort((a, b) => b.playtime - a.playtime);
      }

      setGames(results);
      setTotalCount(results.length);
      setHasMore(false);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [
    query.genre, query.platform, query.ordering,
    query.search, query.filter, query.page,
  ]);

  return { games, isLoading, error: null, totalCount, hasMore, query };
};

export { useGames };

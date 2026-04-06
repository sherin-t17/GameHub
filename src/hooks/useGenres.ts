import { useEffect, useState } from "react";
import type { Genre } from "../types/game";
import { mockGenres } from "../mocks/mockGames";

const useGenres = () => {
  const [genres,    setGenres]    = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGenres(mockGenres);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return { genres, isLoading, error: null };
};

export { useGenres };

import { useEffect, useState } from "react";
import type { GameDetail } from "../mocks/mockGameDetails";
import { mockGameDetails, getFallbackDetail } from "../mocks/mockGameDetails";
import { mockGames } from "../mocks/mockGames";

const useGameDetail = (id: number) => {
  const [game,      setGame]      = useState<GameDetail | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;

    const timer = setTimeout(() => {
      // Check explicit mock detail first
      if (mockGameDetails[id]) {
        setGame(mockGameDetails[id]);
      } else {
        // Fall back to basic game info from mockGames list
        const basic = mockGames.find((g) => g.id === id);
        setGame(getFallbackDetail(id, basic?.name ?? "Unknown Game"));
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  return { game, isLoading, error: null };
};

export { useGameDetail };

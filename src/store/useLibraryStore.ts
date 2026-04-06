import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Game } from "../types/game";

export type LibrarySection = "wishlist" | "collection" | "backlog" | "history";

interface LibraryState {
  wishlist:   Game[];
  collection: Game[];
  backlog:    Game[];
  history:    Game[];

  addToSection:      (section: LibrarySection, game: Game) => void;
  toggleInSection:   (section: LibrarySection, game: Game) => void;
  removeFromSection: (section: LibrarySection, gameId: number) => void;
  isInSection:       (section: LibrarySection, gameId: number) => boolean;
  getGameSections:   (gameId: number) => LibrarySection[];
  moveGame:          (from: LibrarySection, to: LibrarySection, gameId: number) => void;
  clearSection:      (section: LibrarySection) => void;
}

const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      wishlist:   [],
      collection: [],
      backlog:    [],
      history:    [],

      addToSection: (section, game) => {
        const current = get()[section];
        if (current.find((g) => g.id === game.id)) return; // no dupes
        set({ [section]: [game, ...current] });
      },

      toggleInSection: (section, game) => {
        const current = get()[section];
        if (current.find((existingGame) => existingGame.id === game.id)) {
          set({ [section]: current.filter((existingGame) => existingGame.id !== game.id) });
          return;
        }
        set({ [section]: [game, ...current] });
      },

      removeFromSection: (section, gameId) => {
        set({ [section]: get()[section].filter((g) => g.id !== gameId) });
      },

      isInSection: (section, gameId) => {
        return !!get()[section].find((g) => g.id === gameId);
      },

      getGameSections: (gameId) => {
        const sections: LibrarySection[] = ["wishlist", "collection", "backlog", "history"];
        return sections.filter((section) =>
          get()[section].some((game) => game.id === gameId)
        );
      },

      moveGame: (from, to, gameId) => {
        const game = get()[from].find((g) => g.id === gameId);
        if (!game) return;
        set({
          [from]: get()[from].filter((g) => g.id !== gameId),
          [to]:   [game, ...get()[to]],
        });
      },

      clearSection: (section) => set({ [section]: [] }),
    }),
    {
      name: "gamehub-library", // persists to localStorage
    }
  )
);

export { useLibraryStore };

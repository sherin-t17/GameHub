export interface Platform {
  id: number;
  name: string;
  slug: string;
}

export interface ParentPlatform {
  platform: Platform;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface Game {
  id: number;
  name: string;
  slug: string;
  background_image: string | null;
  rating: number;
  rating_top: number;
  ratings_count: number;
  metacritic: number | null;
  released: string | null;
  parent_platforms: ParentPlatform[];
  genres: Genre[];
  playtime: number;
}
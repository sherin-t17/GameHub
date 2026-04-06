export interface GameDetail {
  id: number;
  name: string;
  slug: string;
  background_image: string;
  background_image_additional?: string;
  description_raw: string;
  rating: number;
  rating_top: number;
  ratings_count: number;
  metacritic: number | null;
  released: string | null;
  playtime: number;
  website?: string;
  developers: { id: number; name: string }[];
  publishers: { id: number; name: string }[];
  genres: { id: number; name: string; slug: string }[];
  platforms: {
    platform: { id: number; name: string; slug: string };
    requirements?: { minimum?: string; recommended?: string };
  }[];
  parent_platforms: { platform: { id: number; name: string; slug: string } }[];
  screenshots?: { id: number; image: string }[];
  ratings: { id: number; title: string; count: number; percent: number }[];
  esrb_rating?: { id: number; name: string; slug: string } | null;
}

export const mockGameDetails: Record<number, GameDetail> = {
  1: {
    id: 1,
    name: "Elden Ring",
    slug: "elden-ring",
    background_image:
      "https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7bab370a552855.jpg",
    background_image_additional:
      "https://media.rawg.io/media/screenshots/1ac/1ac19f31974314855ad7be4e2a4a6a76.jpg",
    description_raw:
      "Elden Ring is an action RPG developed by FromSoftware and published by Bandai Namco Entertainment. The game features an open world environment and was created in collaboration with fantasy novelist George R. R. Martin, who provided the worldbuilding and mythology. Players explore the Lands Between, a realm ruled by demigods who possess shards of the shattered Elden Ring. The game features challenging combat, deep lore, and a richly detailed world filled with dungeons, bosses, and secrets to discover. With multiple endings and a vast interconnected world, Elden Ring offers hundreds of hours of gameplay.",
    rating: 4.7,
    rating_top: 5,
    ratings_count: 6842,
    metacritic: 96,
    released: "2022-02-25",
    playtime: 96,
    website: "https://en.bandainamcoent.eu/elden-ring/elden-ring",
    developers: [{ id: 1, name: "FromSoftware" }],
    publishers: [{ id: 1, name: "Bandai Namco Entertainment" }],
    genres: [
      { id: 1, name: "Action", slug: "action" },
      { id: 2, name: "RPG", slug: "rpg" },
    ],
    parent_platforms: [
      { platform: { id: 1, name: "PC", slug: "pc" } },
      { platform: { id: 2, name: "PlayStation", slug: "playstation" } },
      { platform: { id: 3, name: "Xbox", slug: "xbox" } },
    ],
    platforms: [
      { platform: { id: 1, name: "PC", slug: "pc" } },
      { platform: { id: 2, name: "PlayStation 5", slug: "playstation5" } },
      { platform: { id: 3, name: "Xbox Series X", slug: "xbox-series-x" } },
    ],
    screenshots: [
      { id: 1, image: "https://media.rawg.io/media/screenshots/1ac/1ac19f31974314855ad7be4e2a4a6a76.jpg" },
      { id: 2, image: "https://media.rawg.io/media/screenshots/f7f/f7f1853ce774977a8e44f24498ecaf53.jpg" },
      { id: 3, image: "https://media.rawg.io/media/screenshots/4a7/4a77b4e2ea8a4bf86da5b6d6e38e8958.jpg" },
    ],
    ratings: [
      { id: 5, title: "Exceptional", count: 4012, percent: 58.6 },
      { id: 4, title: "Recommended", count: 2100, percent: 30.7 },
      { id: 3, title: "Meh",         count: 512,  percent: 7.5  },
      { id: 1, title: "Skip",        count: 218,  percent: 3.2  },
    ],
    esrb_rating: { id: 4, name: "Mature", slug: "mature" },
  },
  2: {
    id: 2,
    name: "Cyberpunk 2077",
    slug: "cyberpunk-2077",
    background_image:
      "https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg",
    description_raw:
      "Cyberpunk 2077 is an open-world action-adventure RPG set in Night City, a megalopolis obsessed with power, glamour, and body modification. You play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality. The game features a vast open world, deep character customization, branching storylines, and a richly detailed dystopian future. After a rocky launch in 2020, the game received massive updates and the Phantom Liberty expansion, transforming it into one of the most acclaimed RPGs of its generation.",
    rating: 4.4,
    rating_top: 5,
    ratings_count: 5921,
    metacritic: 86,
    released: "2020-12-10",
    playtime: 72,
    website: "https://www.cyberpunk.net",
    developers: [{ id: 2, name: "CD Projekt Red" }],
    publishers: [{ id: 2, name: "CD Projekt" }],
    genres: [
      { id: 1, name: "Action", slug: "action" },
      { id: 3, name: "Shooter", slug: "shooter" },
    ],
    parent_platforms: [
      { platform: { id: 1, name: "PC", slug: "pc" } },
      { platform: { id: 2, name: "PlayStation", slug: "playstation" } },
      { platform: { id: 3, name: "Xbox", slug: "xbox" } },
    ],
    platforms: [
      { platform: { id: 1, name: "PC", slug: "pc" } },
      { platform: { id: 2, name: "PlayStation 5", slug: "playstation5" } },
      { platform: { id: 3, name: "Xbox Series X", slug: "xbox-series-x" } },
    ],
    screenshots: [
      { id: 1, image: "https://media.rawg.io/media/screenshots/f7f/f7f1853ce774977a8e44f24498ecaf53.jpg" },
      { id: 2, image: "https://media.rawg.io/media/screenshots/4a7/4a77b4e2ea8a4bf86da5b6d6e38e8958.jpg" },
    ],
    ratings: [
      { id: 5, title: "Exceptional", count: 2800, percent: 47.3 },
      { id: 4, title: "Recommended", count: 2100, percent: 35.5 },
      { id: 3, title: "Meh",         count: 700,  percent: 11.8 },
      { id: 1, title: "Skip",        count: 321,  percent: 5.4  },
    ],
    esrb_rating: { id: 4, name: "Mature", slug: "mature" },
  },
};

// Fallback detail for any game not explicitly defined
export const getFallbackDetail = (id: number, name: string): GameDetail => ({
  id,
  name,
  slug: name.toLowerCase().replace(/\s+/g, "-"),
  background_image:
    "https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7bab370a552855.jpg",
  description_raw:
    "An incredible gaming experience awaits. This title has captivated millions of players worldwide with its deep mechanics, stunning visuals, and unforgettable story. Whether you're a seasoned veteran or a newcomer to the genre, this game offers something for everyone.",
  rating: 4.2,
  rating_top: 5,
  ratings_count: 1200,
  metacritic: 85,
  released: "2023-01-01",
  playtime: 25,
  developers: [{ id: 99, name: "Studio Unknown" }],
  publishers: [{ id: 99, name: "Publisher Unknown" }],
  genres: [{ id: 1, name: "Action", slug: "action" }],
  parent_platforms: [
    { platform: { id: 1, name: "PC", slug: "pc" } },
  ],
  platforms: [
    { platform: { id: 1, name: "PC", slug: "pc" } },
  ],
  screenshots: [],
  ratings: [
    { id: 5, title: "Exceptional", count: 600,  percent: 50   },
    { id: 4, title: "Recommended", count: 400,  percent: 33.3 },
    { id: 3, title: "Meh",         count: 150,  percent: 12.5 },
    { id: 1, title: "Skip",        count: 50,   percent: 4.2  },
  ],
  esrb_rating: null,
});
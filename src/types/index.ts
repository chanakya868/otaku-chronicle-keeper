
export type MediaType = "Anime" | "Manhwa";

export type Status = "Ongoing" | "Ended" | "Live";

export type Genre =
  | "Action"
  | "Adventure"
  | "Comedy"
  | "Drama"
  | "Fantasy"
  | "Horror"
  | "Mystery"
  | "Psychological"
  | "Romance"
  | "Sci-Fi"
  | "Slice of Life"
  | "Supernatural"
  | "Thriller";

export type WatchlistStatus = "Planning" | "Current" | "Completed" | "Dropped";

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  genres: Genre[];
  description: string;
  rating: number;
  status: Status;
  inWatchlist: boolean;
  watchlistStatus?: WatchlistStatus;
  imageUrl?: string;
}

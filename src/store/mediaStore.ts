
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MediaItem, Genre, Status, MediaType, WatchlistStatus } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface MediaStore {
  mediaItems: MediaItem[];
  addMediaItem: (item: Omit<MediaItem, "id">) => void;
  updateMediaItem: (id: string, item: Partial<MediaItem>) => void;
  deleteMediaItem: (id: string) => void;
  toggleWatchlist: (id: string) => void;
  updateWatchlistStatus: (id: string, status: WatchlistStatus) => void;
  importFromCSV: (items: Omit<MediaItem, "id">[]) => void;
  clearAllMediaItems: () => void;
}

export const useMediaStore = create<MediaStore>()(
  persist(
    (set) => ({
      mediaItems: [],
      addMediaItem: (item) =>
        set((state) => ({
          mediaItems: [...state.mediaItems, { id: uuidv4(), ...item }],
        })),
      updateMediaItem: (id, updatedItem) =>
        set((state) => ({
          mediaItems: state.mediaItems.map((item) =>
            item.id === id ? { ...item, ...updatedItem } : item
          ),
        })),
      deleteMediaItem: (id) =>
        set((state) => ({
          mediaItems: state.mediaItems.filter((item) => item.id !== id),
        })),
      toggleWatchlist: (id) =>
        set((state) => ({
          mediaItems: state.mediaItems.map((item) =>
            item.id === id
              ? {
                  ...item,
                  inWatchlist: !item.inWatchlist,
                  watchlistStatus: !item.inWatchlist ? "Planning" : undefined,
                }
              : item
          ),
        })),
      updateWatchlistStatus: (id, status) =>
        set((state) => ({
          mediaItems: state.mediaItems.map((item) =>
            item.id === id
              ? {
                  ...item,
                  watchlistStatus: status,
                  inWatchlist: true,
                }
              : item
          ),
        })),
      importFromCSV: (items) =>
        set((state) => ({
          mediaItems: [
            ...state.mediaItems,
            ...items.map((item) => ({ id: uuidv4(), ...item })),
          ],
        })),
      clearAllMediaItems: () => set({ mediaItems: [] }),
    }),
    {
      name: "media-storage",
    }
  )
);

export const genreOptions: Genre[] = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Supernatural",
  "Thriller",
];

export const statusOptions: Status[] = ["Ongoing", "Ended", "Live"];

export const mediaTypeOptions: MediaType[] = ["Anime", "Manhwa"];

export const watchlistStatusOptions: WatchlistStatus[] = [
  "Planning",
  "Current",
  "Completed",
  "Dropped",
];

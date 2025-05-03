
import { MediaItem, Genre, MediaType, Status } from "@/types";
import { genreOptions, mediaTypeOptions, statusOptions } from "@/store/mediaStore";
import Papa from "papaparse";

// Helper to validate and parse genres
const parseGenres = (genreString: string): Genre[] => {
  if (!genreString) return [];
  
  const genres = genreString.split(",").map(g => g.trim());
  return genres.filter(g => genreOptions.includes(g as Genre)) as Genre[];
};

// Helper to validate media type
const parseMediaType = (typeString: string): MediaType => {
  const type = typeString.trim();
  return mediaTypeOptions.includes(type as MediaType) 
    ? (type as MediaType) 
    : "Anime"; // Default to Anime
};

// Helper to validate status
const parseStatus = (statusString: string): Status => {
  const status = statusString.trim();
  return statusOptions.includes(status as Status) 
    ? (status as Status) 
    : "Ongoing"; // Default to Ongoing
};

// Parse CSV string into media items
export const parseCSV = (csvString: string): Omit<MediaItem, "id">[] => {
  const results = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
  });
  
  if (results.errors.length > 0) {
    console.error("CSV parsing errors:", results.errors);
  }
  
  return results.data.map((row: any) => ({
    title: row.title || "Untitled",
    type: parseMediaType(row.type),
    genres: parseGenres(row.genres),
    description: row.description || "",
    rating: parseFloat(row.rating) || 0,
    status: parseStatus(row.status),
    inWatchlist: row.inWatchlist === "true",
    watchlistStatus: row.watchlistStatus || undefined,
    imageUrl: row.imageUrl || undefined,
  }));
};

// Convert media items to CSV string
export const exportToCSV = (items: MediaItem[]): string => {
  const data = items.map(item => ({
    title: item.title,
    type: item.type,
    genres: item.genres.join(", "),
    description: item.description,
    rating: item.rating.toString(),
    status: item.status,
    inWatchlist: item.inWatchlist.toString(),
    watchlistStatus: item.watchlistStatus || "",
    imageUrl: item.imageUrl || "",
  }));
  
  return Papa.unparse(data);
};

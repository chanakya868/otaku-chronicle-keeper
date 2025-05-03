
import { useState } from "react";
import Layout from "@/components/Layout";
import MediaGrid from "@/components/MediaGrid";
import FilterBar, { FilterOptions } from "@/components/FilterBar";
import { useMediaStore } from "@/store/mediaStore";
import { MediaItem } from "@/types";

export default function Index() {
  const { mediaItems } = useMediaStore();
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    type: "All",
    status: "All",
    genre: "All",
    sortBy: "title",
    sortOrder: "asc",
  });

  // Apply filters and sorting
  const filteredItems = mediaItems.filter((item) => {
    // Text search
    if (
      filters.searchTerm &&
      !item.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Type filter
    if (filters.type !== "All" && item.type !== filters.type) {
      return false;
    }

    // Status filter
    if (filters.status !== "All" && item.status !== filters.status) {
      return false;
    }

    // Genre filter
    if (filters.genre !== "All" && !item.genres.includes(filters.genre)) {
      return false;
    }

    return true;
  });

  // Apply sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (filters.sortBy === "title") {
      return filters.sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (filters.sortBy === "rating") {
      return filters.sortOrder === "asc"
        ? a.rating - b.rating
        : b.rating - a.rating;
    } else if (filters.sortBy === "status") {
      return filters.sortOrder === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Collection</h1>
          <p className="text-muted-foreground">
            Viewing {sortedItems.length} of {mediaItems.length} titles
          </p>
        </div>

        <FilterBar onFilterChange={setFilters} />

        <MediaGrid items={sortedItems} />
      </div>
    </Layout>
  );
}

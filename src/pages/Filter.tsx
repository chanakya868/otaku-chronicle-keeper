
import { useState } from "react";
import Layout from "@/components/Layout";
import MediaGrid from "@/components/MediaGrid";
import { useMediaStore } from "@/store/mediaStore";
import { Genre, MediaItem, MediaType, Status } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Filter as FilterIcon, X } from "lucide-react";
import { genreOptions, mediaTypeOptions, statusOptions } from "@/store/mediaStore";
import { useToast } from "@/components/ui/use-toast";

export default function Filter() {
  const { mediaItems } = useMediaStore();
  const [results, setResults] = useState<MediaItem[]>([]);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  // Filter state
  const [selectedTypes, setSelectedTypes] = useState<MediaType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [ratingMin, setRatingMin] = useState<number | null>(null);
  const [ratingMax, setRatingMax] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"title" | "rating" | "status">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleTypeToggle = (type: MediaType) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleStatusToggle = (status: Status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleGenreToggle = (genre: Genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const handleFilter = () => {
    // Apply filters
    let filtered = [...mediaItems];
    
    // Type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((item) => selectedTypes.includes(item.type));
    }
    
    // Status filter
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((item) => selectedStatuses.includes(item.status));
    }
    
    // Genre filter - item must have at least one of the selected genres
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((item) =>
        selectedGenres.some((genre) => item.genres.includes(genre))
      );
    }
    
    // Rating range filter
    if (ratingMin !== null) {
      filtered = filtered.filter((item) => item.rating >= ratingMin);
    }
    if (ratingMax !== null) {
      filtered = filtered.filter((item) => item.rating <= ratingMax);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === "rating") {
        return sortOrder === "asc"
          ? a.rating - b.rating
          : b.rating - a.rating;
      } else if (sortBy === "status") {
        return sortOrder === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });
    
    setResults(filtered);
    setSearched(true);
    
    toast({
      title: "Filter Applied",
      description: `Found ${filtered.length} items matching your criteria.`,
      duration: 3000,
    });
  };

  const handleClearFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSelectedGenres([]);
    setRatingMin(null);
    setRatingMax(null);
    setSortBy("title");
    setSortOrder("asc");
    setSearched(false);
    
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset.",
      duration: 2000,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Advanced Filter</h1>
          <p className="text-muted-foreground">
            Customize and combine multiple filters for precise results
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filter Options</CardTitle>
                <CardDescription>
                  Combine multiple filters for precise results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Type Filter */}
                <div className="space-y-2">
                  <h3 className="font-medium">Media Type</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {mediaTypeOptions.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => handleTypeToggle(type)}
                        />
                        <Label htmlFor={`type-${type}`}>{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Status Filter */}
                <div className="space-y-2">
                  <h3 className="font-medium">Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {statusOptions.map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={selectedStatuses.includes(status)}
                          onCheckedChange={() => handleStatusToggle(status)}
                        />
                        <Label htmlFor={`status-${status}`}>{status}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Genre Filter */}
                <div className="space-y-2">
                  <h3 className="font-medium">Genres</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {genreOptions.map((genre) => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox
                          id={`genre-${genre}`}
                          checked={selectedGenres.includes(genre)}
                          onCheckedChange={() => handleGenreToggle(genre)}
                        />
                        <Label htmlFor={`genre-${genre}`}>{genre}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Rating Filter */}
                <div className="space-y-2">
                  <h3 className="font-medium">Rating Range</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="rating-min">Minimum</Label>
                      <select
                        id="rating-min"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        value={ratingMin === null ? "" : ratingMin}
                        onChange={(e) => setRatingMin(
                          e.target.value === "" ? null : parseFloat(e.target.value)
                        )}
                      >
                        <option value="">Any</option>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => (
                          <option key={val} value={val}>
                            {val}+
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="rating-max">Maximum</Label>
                      <select
                        id="rating-max"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        value={ratingMax === null ? "" : ratingMax}
                        onChange={(e) => setRatingMax(
                          e.target.value === "" ? null : parseFloat(e.target.value)
                        )}
                      >
                        <option value="">Any</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Sorting Options */}
                <div className="space-y-2">
                  <h3 className="font-medium">Sort By</h3>
                  <RadioGroup value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="title" id="sort-title" />
                      <Label htmlFor="sort-title">Title</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rating" id="sort-rating" />
                      <Label htmlFor="sort-rating">Rating</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="status" id="sort-status" />
                      <Label htmlFor="sort-status">Status</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Sort Order</h3>
                  <RadioGroup value={sortOrder} onValueChange={(v) => setSortOrder(v as any)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="asc" id="order-asc" />
                      <Label htmlFor="order-asc">Ascending</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="desc" id="order-desc" />
                      <Label htmlFor="order-desc">Descending</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex flex-col gap-2 pt-4">
                  <Button onClick={handleFilter} className="w-full">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                  <Button variant="outline" onClick={handleClearFilters} className="w-full">
                    <X className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {searched ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    Results ({results.length})
                  </h2>
                </div>
                <MediaGrid items={results} />
              </>
            ) : (
              <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-muted-foreground/20 bg-secondary/20 p-8 text-center">
                <div className="space-y-2">
                  <FilterIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No filters applied yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the filter options on the left to search your collection
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

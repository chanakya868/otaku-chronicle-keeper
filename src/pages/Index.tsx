
import { useState } from "react";
import Layout from "@/components/Layout";
import MediaGrid from "@/components/MediaGrid";
import { useMediaStore, genreOptions, mediaTypeOptions, statusOptions } from "@/store/mediaStore";
import { MediaItem, Genre, MediaType, Status } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { PlusCircle, Filter, X, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";

export default function Index() {
  const { mediaItems } = useMediaStore();
  const { toast } = useToast();
  
  // Basic filter state from previous component
  const [searchTerm, setSearchTerm] = useState("");
  const [simpleType, setSimpleType] = useState<MediaType | "All">("All");
  const [simpleStatus, setSimpleStatus] = useState<Status | "All">("All");
  const [simpleGenre, setSimpleGenre] = useState<Genre | "All">("All");
  const [sortBy, setSortBy] = useState<"title" | "rating" | "status">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  // Advanced filter state
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<MediaType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [ratingMin, setRatingMin] = useState<number | null>(null);
  const [ratingMax, setRatingMax] = useState<number | null>(null);
  const [useAdvancedFilters, setUseAdvancedFilters] = useState(false);
  
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

  const handleClearAdvancedFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSelectedGenres([]);
    setRatingMin(null);
    setRatingMax(null);
    setSortBy("title");
    setSortOrder("asc");
    
    toast({
      title: "Filters Cleared",
      description: "All advanced filters have been reset.",
      duration: 2000,
    });
  };

  const handleApplyAdvancedFilters = () => {
    setUseAdvancedFilters(true);
    setAdvancedFilterOpen(false);
    
    toast({
      title: "Advanced Filters Applied",
      description: `Showing results based on your custom criteria.`,
      duration: 2000,
    });
  };

  const handleClearSimpleFilters = () => {
    setSearchTerm("");
    setSimpleType("All");
    setSimpleStatus("All");
    setSimpleGenre("All");
    setSortBy("title");
    setSortOrder("asc");
    setUseAdvancedFilters(false);
    
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset.",
      duration: 2000,
    });
  };

  // Apply filters based on which mode we're in
  let filteredItems: MediaItem[] = [...mediaItems];
  
  if (useAdvancedFilters) {
    // Apply advanced filters
    if (selectedTypes.length > 0) {
      filteredItems = filteredItems.filter((item) => selectedTypes.includes(item.type));
    }
    
    if (selectedStatuses.length > 0) {
      filteredItems = filteredItems.filter((item) => selectedStatuses.includes(item.status));
    }
    
    if (selectedGenres.length > 0) {
      filteredItems = filteredItems.filter((item) =>
        selectedGenres.some((genre) => item.genres.includes(genre))
      );
    }
    
    if (ratingMin !== null) {
      filteredItems = filteredItems.filter((item) => item.rating >= ratingMin);
    }
    
    if (ratingMax !== null) {
      filteredItems = filteredItems.filter((item) => item.rating <= ratingMax);
    }
  } else {
    // Apply simple filters
    if (searchTerm) {
      filteredItems = filteredItems.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (simpleType !== "All") {
      filteredItems = filteredItems.filter((item) => item.type === simpleType);
    }
    
    if (simpleStatus !== "All") {
      filteredItems = filteredItems.filter((item) => item.status === simpleStatus);
    }
    
    if (simpleGenre !== "All") {
      filteredItems = filteredItems.filter((item) => item.genres.includes(simpleGenre));
    }
  }

  // Apply sorting
  filteredItems.sort((a, b) => {
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Collection</h1>
            <p className="text-muted-foreground">
              Viewing {filteredItems.length} of {mediaItems.length} titles
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleClearSimpleFilters}
              className="flex gap-2 items-center"
            >
              <X size={16} />
              Clear
            </Button>
            
            <Sheet open={advancedFilterOpen} onOpenChange={setAdvancedFilterOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant={useAdvancedFilters ? "default" : "outline"}
                  className="flex gap-2 items-center"
                >
                  <Filter size={16} />
                  Advanced
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="overflow-y-auto w-full sm:max-w-md">
                <SheetHeader className="mb-4">
                  <SheetTitle>Advanced Filters</SheetTitle>
                  <SheetDescription>
                    Combine multiple filters for precise results
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6">
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
                    <Button onClick={handleApplyAdvancedFilters} className="w-full">
                      <Filter className="mr-2 h-4 w-4" />
                      Apply Filters
                    </Button>
                    <Button variant="outline" onClick={handleClearAdvancedFilters} className="w-full">
                      <X className="mr-2 h-4 w-4" />
                      Clear All
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Basic Filter Bar */}
        <Card className="bg-secondary/20 border-secondary/50">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search titles..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setUseAdvancedFilters(false);
                  }}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Select
                  value={simpleType}
                  onValueChange={(value) => {
                    setSimpleType(value as MediaType | "All");
                    setUseAdvancedFilters(false);
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    {mediaTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={simpleStatus}
                  onValueChange={(value) => {
                    setSimpleStatus(value as Status | "All");
                    setUseAdvancedFilters(false);
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={simpleGenre}
                  onValueChange={(value) => {
                    setSimpleGenre(value as Genre | "All");
                    setUseAdvancedFilters(false);
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Genres</SelectItem>
                    {genreOptions.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <MediaGrid items={filteredItems} />
      </div>
      
      {/* Floating Action Button */}
      <Link
        to="/add"
        className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all z-20"
        aria-label="Add new item"
      >
        <PlusCircle size={32} />
      </Link>
    </Layout>
  );
}

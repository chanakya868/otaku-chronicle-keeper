
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Genre, MediaType, Status } from "@/types";
import {
  genreOptions,
  mediaTypeOptions,
  statusOptions,
} from "@/store/mediaStore";
import { Search, Filter, ArrowUpDown } from "lucide-react";

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  searchTerm: string;
  type: MediaType | "All";
  status: Status | "All";
  genre: Genre | "All";
  sortBy: "title" | "rating" | "status";
  sortOrder: "asc" | "desc";
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    type: "All",
    status: "All",
    genre: "All",
    sortBy: "title",
    sortOrder: "asc",
  });

  const handleFilterChange = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search titles..."
          className="pl-10"
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.type}
          onValueChange={(value) => handleFilterChange("type", value as MediaType | "All")}
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
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value as Status | "All")}
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[120px]">
              <Filter className="mr-2 h-4 w-4" /> Genres
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Genre</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.genre === "All"}
              onCheckedChange={() => handleFilterChange("genre", "All")}
            >
              All Genres
            </DropdownMenuCheckboxItem>
            {genreOptions.map((genre) => (
              <DropdownMenuCheckboxItem
                key={genre}
                checked={filters.genre === genre}
                onCheckedChange={() => handleFilterChange("genre", genre)}
              >
                {genre}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[120px]">
              <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.sortBy === "title"}
              onCheckedChange={() => handleFilterChange("sortBy", "title")}
            >
              By Title
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.sortBy === "rating"}
              onCheckedChange={() => handleFilterChange("sortBy", "rating")}
            >
              By Rating
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.sortBy === "status"}
              onCheckedChange={() => handleFilterChange("sortBy", "status")}
            >
              By Status
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.sortOrder === "asc"}
              onCheckedChange={() =>
                handleFilterChange("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")
              }
            >
              {filters.sortOrder === "asc" ? "Ascending" : "Descending"}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

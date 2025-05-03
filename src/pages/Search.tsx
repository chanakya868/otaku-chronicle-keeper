
import { useState } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MediaGrid from "@/components/MediaGrid";
import { useMediaStore } from "@/store/mediaStore";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  const { mediaItems } = useMediaStore();
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const filteredItems = mediaItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    item.genres.some(genre => genre.toLowerCase().includes(query.toLowerCase()))
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Search</h1>
          <p className="text-muted-foreground">
            Search your collection by title, description or genre
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search for titles, descriptions, or genres..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (searched) setSearched(false);
            }}
            className="flex-1"
          />
          <Button type="submit">
            <SearchIcon className="mr-2 h-4 w-4" /> Search
          </Button>
        </form>

        {searched && (
          <div className="mt-6">
            <p className="mb-4">
              {filteredItems.length === 0
                ? "No results found."
                : `Found ${filteredItems.length} results.`}
            </p>
            <MediaGrid items={filteredItems} />
          </div>
        )}
      </div>
    </Layout>
  );
}

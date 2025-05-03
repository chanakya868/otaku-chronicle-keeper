
import { MediaItem } from "@/types";
import MediaCard from "./MediaCard";

interface MediaGridProps {
  items: MediaItem[];
}

export default function MediaGrid({ items }: MediaGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center p-10">
        <p>No items found. Add some to your collection!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}

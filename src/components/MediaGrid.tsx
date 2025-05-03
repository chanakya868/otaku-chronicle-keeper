
import { MediaItem } from "@/types";
import MediaCard from "./MediaCard";
import { motion } from "framer-motion";

interface MediaGridProps {
  items: MediaItem[];
}

export default function MediaGrid({ items }: MediaGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-60 bg-secondary/20 rounded-lg border border-dashed border-secondary text-center p-10">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">No items found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or add some items to your collection!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <MediaCard item={item} />
        </motion.div>
      ))}
    </div>
  );
}

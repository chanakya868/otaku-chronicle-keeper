
import { MediaItem } from "@/types";
import StatusBadge from "./StatusBadge";
import { Star, BookmarkPlus, BookmarkCheck, Pencil, Trash2 } from "lucide-react";
import { useMediaStore } from "@/store/mediaStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface MediaCardProps {
  item: MediaItem;
}

export default function MediaCard({ item }: MediaCardProps) {
  const { toggleWatchlist, deleteMediaItem } = useMediaStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleToggleWatchlist = () => {
    toggleWatchlist(item.id);
    toast({
      title: item.inWatchlist ? "Removed from watchlist" : "Added to watchlist",
      description: `${item.title} has been ${
        item.inWatchlist ? "removed from" : "added to"
      } your watchlist.`,
      duration: 2000,
    });
  };

  const handleDelete = () => {
    deleteMediaItem(item.id);
    toast({
      title: "Item deleted",
      description: `${item.title} has been deleted from your collection.`,
      variant: "destructive",
      duration: 2000,
    });
  };

  const handleEdit = () => {
    navigate(`/edit/${item.id}`);
  };

  const placeholderImage = "https://via.placeholder.com/150x225/1A1F2C/FFFFFF?text=No+Image";

  return (
    <Card className="overflow-hidden bg-secondary/40 backdrop-blur-md border border-secondary hover:border-accent transition-all animate-fade-in">
      <CardHeader className="p-0 relative">
        <div className="absolute top-2 right-2 z-10">
          <StatusBadge status={item.status} />
        </div>
        <div className="absolute top-2 left-2 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDelete}
            className="bg-black/50 hover:bg-red-600/70 text-white rounded-full w-8 h-8 flex items-center justify-center"
          >
            <Trash2 size={16} />
          </Button>
        </div>
        <div className="h-[200px] overflow-hidden relative">
          <img
            src={item.imageUrl || placeholderImage}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // If image fails to load, replace with placeholder
              (e.target as HTMLImageElement).src = placeholderImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <h2 className="text-xl font-bold truncate">{item.title}</h2>
            <div className="flex items-center mt-1">
              <span className="bg-primary/20 text-primary-foreground text-xs px-2 py-0.5 rounded">
                {item.type}
              </span>
              <div className="flex items-center ml-2">
                <Star size={14} className="text-yellow-500" />
                <span className="text-xs ml-1">{item.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="mb-2">
          {item.genres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="inline-block bg-secondary text-xs rounded px-2 py-1 mr-1 mb-1"
            >
              {genre}
            </span>
          ))}
          {item.genres.length > 3 && (
            <span className="inline-block bg-secondary text-xs rounded px-2 py-1">
              +{item.genres.length - 3}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 pt-0 gap-2">
        <Button variant="outline" size="icon" onClick={handleToggleWatchlist} title={item.inWatchlist ? "Remove from watchlist" : "Add to watchlist"}>
          {item.inWatchlist ? <BookmarkCheck size={16} /> : <BookmarkPlus size={16} />}
        </Button>
        <Button variant="ghost" size="icon" onClick={handleEdit} title="Edit">
          <Pencil size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
}

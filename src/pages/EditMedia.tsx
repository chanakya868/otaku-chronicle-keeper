
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import MediaForm from "@/components/MediaForm";
import { useMediaStore } from "@/store/mediaStore";
import { MediaItem } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function EditMedia() {
  const { id } = useParams<{ id: string }>();
  const { mediaItems, updateMediaItem } = useMediaStore();
  const navigate = useNavigate();
  
  const mediaItem = mediaItems.find((item) => item.id === id);
  
  const handleSubmit = (data: Omit<MediaItem, "id" | "inWatchlist" | "watchlistStatus">) => {
    if (!id) return;
    
    updateMediaItem(id, data);
    navigate("/");
  };
  
  if (!mediaItem) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Item not found. It may have been deleted.
            </AlertDescription>
          </Alert>
          <button
            onClick={() => navigate("/")}
            className="text-primary hover:underline"
          >
            Return to Collection
          </button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit {mediaItem.title}</h1>
        <MediaForm
          initialData={mediaItem}
          onSubmit={handleSubmit}
          buttonText="Update"
        />
      </div>
    </Layout>
  );
}


import Layout from "@/components/Layout";
import MediaForm from "@/components/MediaForm";
import { useMediaStore } from "@/store/mediaStore";
import { MediaItem } from "@/types";
import { useNavigate } from "react-router-dom";

export default function AddMedia() {
  const { addMediaItem } = useMediaStore();
  const navigate = useNavigate();
  
  const handleSubmit = (data: Omit<MediaItem, "id" | "inWatchlist" | "watchlistStatus">) => {
    addMediaItem({
      ...data,
      inWatchlist: false,
    });
    navigate("/");
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Entry</h1>
        <MediaForm onSubmit={handleSubmit} buttonText="Add to Collection" />
      </div>
    </Layout>
  );
}

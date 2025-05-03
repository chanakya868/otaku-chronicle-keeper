
import { useState } from "react";
import Layout from "@/components/Layout";
import MediaGrid from "@/components/MediaGrid";
import { useMediaStore } from "@/store/mediaStore";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { WatchlistStatus } from "@/types";

export default function Watchlist() {
  const { mediaItems } = useMediaStore();
  const watchlistItems = mediaItems.filter((item) => item.inWatchlist);
  const [activeTab, setActiveTab] = useState<WatchlistStatus | "All">("All");

  const filteredItems = watchlistItems.filter((item) => {
    if (activeTab === "All") return true;
    return item.watchlistStatus === activeTab;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Watchlist</h1>
          <p className="text-muted-foreground">
            {watchlistItems.length} items in your watchlist
          </p>
        </div>

        <Tabs
          defaultValue="All"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as WatchlistStatus | "All")}
        >
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Planning">Planning</TabsTrigger>
            <TabsTrigger value="Current">Currently Watching</TabsTrigger>
            <TabsTrigger value="Completed">Completed</TabsTrigger>
            <TabsTrigger value="Dropped">Dropped</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-6">
            <MediaGrid items={filteredItems} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

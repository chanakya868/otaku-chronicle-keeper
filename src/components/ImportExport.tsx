
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMediaStore } from "@/store/mediaStore";
import { parseCSV, exportToCSV } from "@/utils/csvUtils";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Download, FileText, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ImportExport() {
  const { mediaItems, importFromCSV } = useMediaStore();
  const [fileError, setFileError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    setImportSuccess(false);
    
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.type !== "text/csv") {
      setFileError("Please upload a CSV file.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        const parsedItems = parseCSV(csvContent);
        
        if (parsedItems.length === 0) {
          setFileError("No valid items found in CSV.");
          return;
        }
        
        importFromCSV(parsedItems);
        setImportSuccess(true);
        toast({
          title: "Import successful",
          description: `${parsedItems.length} items were imported to your collection.`,
          duration: 3000,
        });
        
        // Reset input
        if (event.target) event.target.value = "";
      } catch (error) {
        console.error("Error parsing CSV:", error);
        setFileError("Failed to parse CSV file. Check the format.");
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    if (mediaItems.length === 0) {
      toast({
        title: "Export failed",
        description: "You have no items to export.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const csv = exportToCSV(mediaItems);
    
    // Create download link
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `otaku-chronicle-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: `${mediaItems.length} items exported to CSV.`,
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload size={20} />
            Import from CSV
          </CardTitle>
          <CardDescription>
            Import your existing collection from a CSV file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="csv">Upload CSV File</Label>
              <Input
                id="csv"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-1">
                CSV should have columns: title, type, genres (comma-separated),
                description, rating, status, inWatchlist (true/false)
              </p>
            </div>
            
            {fileError && (
              <Alert variant="destructive">
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            )}
            
            {importSuccess && (
              <Alert className="bg-green-600/20 border-green-600 text-foreground">
                <Check className="h-4 w-4" />
                <AlertDescription>Import successful!</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download size={20} />
            Export to CSV
          </CardTitle>
          <CardDescription>
            Export your collection to a CSV file for backup or sharing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Current collection: <strong>{mediaItems.length} items</strong>
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleExport} className="w-full" disabled={mediaItems.length === 0}>
            <FileText className="mr-2 h-4 w-4" />
            Export Collection
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { genreOptions, mediaTypeOptions, statusOptions } from "@/store/mediaStore";
import { MediaItem, Genre, MediaType, Status } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { CheckSquare, Star } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  type: z.enum(["Anime", "Manhwa"] as const),
  genres: z.array(z.string()).min(1, { message: "Select at least one genre" }),
  description: z.string().optional(),
  rating: z.number().min(0).max(10),
  status: z.enum(["Ongoing", "Ended", "Live"] as const),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface MediaFormProps {
  initialData?: MediaItem;
  onSubmit: (data: Omit<MediaItem, "id" | "inWatchlist" | "watchlistStatus">) => void;
  buttonText?: string;
}

export default function MediaForm({
  initialData,
  onSubmit,
  buttonText = "Save",
}: MediaFormProps) {
  const { toast } = useToast();
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [genreSearchOpen, setGenreSearchOpen] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      type: initialData?.type || "Anime",
      genres: initialData?.genres || [],
      description: initialData?.description || "",
      rating: initialData?.rating || 5,
      status: initialData?.status || "Ongoing",
      imageUrl: initialData?.imageUrl || "",
    },
  });
  
  // Keep selectedGenres in sync with form values
  useEffect(() => {
    setSelectedGenres(form.getValues().genres as Genre[]);
  }, []);

  const handleGenreSelect = (genre: Genre) => {
    const currentGenres = form.getValues().genres as Genre[];
    if (currentGenres.includes(genre)) {
      const filtered = currentGenres.filter((g) => g !== genre);
      form.setValue("genres", filtered);
      setSelectedGenres(filtered);
    } else {
      const updated = [...currentGenres, genre];
      form.setValue("genres", updated);
      setSelectedGenres(updated);
    }
  };

  const handleFormSubmit = (values: FormValues) => {
    if (values.imageUrl === "") {
      delete values.imageUrl;
    }
    
    onSubmit(values);
    toast({
      title: "Success!",
      description: initialData ? "Item updated successfully" : "Item added to your collection",
      duration: 3000,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mediaTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="genres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genres</FormLabel>
              <Popover open={genreSearchOpen} onOpenChange={setGenreSearchOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="justify-between w-full h-auto min-h-10 py-2"
                    >
                      {selectedGenres.length === 0 ? (
                        <span className="text-muted-foreground">Select genres</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {selectedGenres.map((genre) => (
                            <Badge key={genre} variant="secondary">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search genres..." />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      {genreOptions.map((genre) => (
                        <CommandItem
                          key={genre}
                          value={genre}
                          onSelect={() => handleGenreSelect(genre)}
                        >
                          <div className="flex items-center gap-2">
                            {selectedGenres.includes(genre) && (
                              <CheckSquare className="h-4 w-4" />
                            )}
                            {genre}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select all genres that apply.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (0-10)</FormLabel>
              <div className="flex items-center gap-4">
                <Controller
                  control={form.control}
                  name="rating"
                  render={({ field: { value, onChange } }) => (
                    <Slider
                      defaultValue={[value]}
                      min={0}
                      max={10}
                      step={0.5}
                      onValueChange={(vals) => onChange(vals[0])}
                      className="flex-1"
                    />
                  )}
                />
                <div className="flex items-center font-mono w-12 border rounded-md justify-center p-2">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  <span>{form.watch("rating")}</span>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a description or notes"
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>
                Enter a URL for the poster or cover image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full md:w-auto">
          {buttonText}
        </Button>
      </form>
    </Form>
  );
}

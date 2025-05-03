
import { Status } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "Ongoing":
        return "bg-blue-500/20 text-blue-500 border-blue-500/50";
      case "Ended":
        return "bg-green-500/20 text-green-500 border-green-500/50";
      case "Live":
        return "bg-red-500/20 text-red-500 border-red-500/50";
      default:
        return "";
    }
  };
  
  return (
    <Badge 
      variant="outline"
      className={cn("font-medium", getStatusStyles())}
    >
      {status}
    </Badge>
  );
}

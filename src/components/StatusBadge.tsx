
import { Status } from "@/types";

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const badgeClass = `status-badge status-${status.toLowerCase()}`;
  
  return <span className={badgeClass}>{status}</span>;
}


import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, ListFilter, Star } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-secondary/60 backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            Otaku Chronicle Keeper
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/import" className="hover:text-primary transition-colors">
              Import/Export
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Side Navigation */}
        <nav className="w-16 md:w-64 bg-secondary/30 shrink-0">
          <div className="p-4 flex flex-col gap-3 sticky top-20">
            <Link
              to="/"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
            >
              <BookOpen size={20} />
              <span className="hidden md:inline">My Collection</span>
            </Link>
            
            <Link
              to="/watchlist"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive("/watchlist")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
            >
              <Star size={20} />
              <span className="hidden md:inline">Watchlist</span>
            </Link>
            
            <Link
              to="/filter"
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive("/filter")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
            >
              <ListFilter size={20} />
              <span className="hidden md:inline">Advanced Filter</span>
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

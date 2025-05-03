
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Menu, Star, X } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-secondary/60 backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            Otaku Chronicle Keeper
          </Link>
          <div className="flex items-center gap-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                  <Menu size={20} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px] p-0">
                <div className="flex flex-col h-full bg-background">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-bold text-lg">Menu</h2>
                    <button className="rounded-full p-2 hover:bg-secondary/20" onClick={() => setOpen(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex flex-col p-4 gap-4">
                    <Link
                      to="/"
                      className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-secondary"
                      onClick={() => setOpen(false)}
                    >
                      <BookOpen size={20} />
                      <span>My Collection</span>
                    </Link>
                    <Link
                      to="/watchlist"
                      className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-secondary"
                      onClick={() => setOpen(false)}
                    >
                      <Star size={20} />
                      <span>Watchlist</span>
                    </Link>
                    <Link
                      to="/import"
                      className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-secondary"
                      onClick={() => setOpen(false)}
                    >
                      <span>Import/Export</span>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Side Navigation */}
        <nav className="w-16 bg-secondary/30 shrink-0">
          <div className="p-4 flex flex-col gap-3 sticky top-20">
            <Link
              to="/"
              className={`flex items-center justify-center gap-3 p-3 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
              title="My Collection"
            >
              <BookOpen size={20} />
            </Link>
            
            <Link
              to="/watchlist"
              className={`flex items-center justify-center gap-3 p-3 rounded-lg transition-colors ${
                isActive("/watchlist")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
              title="Watchlist"
            >
              <Star size={20} />
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

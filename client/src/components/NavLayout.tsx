import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  ChevronRight,
  FileText,
  Globe,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Shield,
  ShieldAlert,
  TrendingUp,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "TAI Dashboard", icon: LayoutDashboard },
  { href: "/compliance", label: "Compliance", icon: Shield },
  { href: "/charter", label: "Charter Council", icon: FileText },
  { href: "/regulatory", label: "Regulatory Feedback", icon: TrendingUp },
  { href: "/cross-sector", label: "Cross-Sector", icon: Globe },
];

export default function NavLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg gradient-navy flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-foreground leading-tight">B-BBEE Technology</div>
                <div className="text-xs text-muted-foreground leading-tight">Adoption Barometer</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === "/admin"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </nav>

            {/* Auth + Mobile */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{user?.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => logout()}>
                    <LogOut className="w-4 h-4 mr-1" /> Sign Out
                  </Button>
                </div>
              ) : (
                <Button size="sm" className="hidden sm:flex" onClick={() => startLogin()}>
                  <LogIn className="w-4 h-4 mr-1" /> Sign In
                </Button>
              )}
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-white px-4 py-3 space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location === href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent">
                <ShieldAlert className="w-4 h-4" /> Admin
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">
            {navItems.find(n => n.href === location)?.label ?? "Page"}
          </span>
        </div>
      </div>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}


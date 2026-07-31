import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, ChevronDown, ChevronRight, LogOut, User, Shield, Eye, CheckSquare } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "TAI Dashboard" },
  { href: "/companies", label: "Companies" },
  { href: "/compliance", label: "Compliance" },
  { href: "/charter", label: "Charter Council" },
  { href: "/regulatory", label: "Regulatory Feedback" },
  { href: "/cross-sector", label: "Cross-Sector" },
];

function RoleBadge({ role }: { role: string }) {
  if (role === "admin") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium badge-admin">
      <Shield size={10} /> Admin
    </span>
  );
  if (role === "examiner") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium badge-examiner">
      <Eye size={10} /> Examiner
    </span>
  );
  if (role === "verifier") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium badge-verifier">
      <CheckSquare size={10} /> Verifier
    </span>
  );
  return null;
}

export default function NavLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (href: string) => location === href || location.startsWith(href + "/");
  const pageLabel = navLinks.find(n => isActive(n.href))?.label
    ?? (location === "/admin" ? "Admin Dashboard"
    : location === "/verify" ? "Verifier Portal"
    : location === "/register" ? "Register Organisation"
    : location === "/" ? "Home"
    : location.replace("/", "").replace(/-/g, " "));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(99% 0.002 240)" }}>
      {/* Top utility bar */}
      <div style={{ background: "oklch(13% 0.04 240)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container flex items-center justify-between py-1.5">
          <div className="flex items-center gap-3 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            <span>B-BBEE Act 53 of 2003</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Maritime Sector Code</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">Integrated Transport Sector B-BBEE Charter Council</span>
          </div>
          <div className="flex items-center gap-3 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            {isAuthenticated ? (
              <span style={{ color: "rgba(255,255,255,0.75)" }}>{user?.name}</span>
            ) : (
              <button onClick={() => startLogin()} style={{ color: "rgba(255,255,255,0.75)" }} className="hover:text-white transition-colors">
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 shadow-lg" style={{ background: "oklch(17% 0.05 240)" }}>
        {/* PRSA teal accent line */}
        <div style={{ height: "3px", background: "oklch(42% 0.11 200)" }} />
        <div className="container flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center w-10 h-10 rounded select-none"
              style={{ background: "oklch(42% 0.11 200)" }}>
              <span className="text-white font-serif font-bold text-sm leading-none">B</span>
              <span className="font-sans font-bold text-xs leading-none" style={{ color: "oklch(62% 0.18 55)" }}>TAB</span>
            </div>
            <div>
              <div className="text-white font-serif font-bold text-base leading-tight">B-BBEE Technology</div>
              <div className="font-sans text-xs tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
                Adoption Barometer
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium rounded transition-all duration-150"
                style={isActive(link.href)
                  ? { background: "oklch(42% 0.11 200)", color: "white" }
                  : { color: "rgba(255,255,255,0.72)" }}
                onMouseEnter={e => { if (!isActive(link.href)) (e.target as HTMLElement).style.color = "white"; }}
                onMouseLeave={e => { if (!isActive(link.href)) (e.target as HTMLElement).style.color = "rgba(255,255,255,0.72)"; }}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link href="/admin"
                className="px-3 py-2 text-sm font-medium rounded transition-all duration-150"
                style={isActive("/admin")
                  ? { background: "oklch(62% 0.18 55)", color: "white" }
                  : { color: "oklch(70% 0.18 55)" }}>
                Admin
              </Link>
            )}
            {user?.role === "verifier" && (
              <Link href="/verify"
                className="px-3 py-2 text-sm font-medium rounded transition-all duration-150"
                style={isActive("/verify")
                  ? { background: "oklch(42% 0.11 200)", color: "white" }
                  : { color: "rgba(255,255,255,0.72)" }}>
                Verify
              </Link>
            )}
          </nav>

          {/* Auth area */}
          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded text-sm transition-all"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  <User size={15} />
                  <span>{user?.name?.split(" ")[0]}</span>
                  {user?.role && user.role !== "user" && <RoleBadge role={user.role} />}
                  <ChevronDown size={12} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-border rounded shadow-xl z-50">
                    <div className="px-3 py-2.5 border-b border-border">
                      <div className="text-sm font-medium text-foreground">{user?.name}</div>
                      <div className="text-xs text-muted-foreground">{user?.email}</div>
                      {user?.role && user.role !== "user" && (
                        <div className="mt-1"><RoleBadge role={user.role} /></div>
                      )}
                    </div>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => startLogin()}
                className="px-4 py-2 text-sm font-medium rounded transition-colors text-white"
                style={{ background: "oklch(62% 0.18 55)" }}
              >
                Sign In
              </button>
            )}
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium rounded transition-colors"
              style={{ border: "1px solid oklch(58% 0.14 200)", color: "oklch(68% 0.12 200)" }}
            >
              Register
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden p-2 text-white/80 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t py-3" style={{ background: "oklch(13% 0.04 240)", borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="container flex flex-col gap-1">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 text-sm rounded"
                  style={isActive(link.href)
                    ? { background: "oklch(42% 0.11 200)", color: "white" }
                    : { color: "rgba(255,255,255,0.72)" }}>
                  {link.label}
                </Link>
              ))}
              {user?.role === "admin" && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm rounded" style={{ color: "oklch(70% 0.18 55)" }}>Admin</Link>
              )}
              <div className="border-t pt-2 mt-1 flex gap-2" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                {isAuthenticated ? (
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-1 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <LogOut size={14} /> Sign Out
                  </button>
                ) : (
                  <button onClick={() => startLogin()} className="px-3 py-1.5 text-sm text-white rounded" style={{ background: "oklch(62% 0.18 55)" }}>Sign In</button>
                )}
                <Link href="/register" onClick={() => setMenuOpen(false)} className="px-3 py-1.5 text-sm rounded" style={{ border: "1px solid oklch(58% 0.14 200)", color: "oklch(68% 0.12 200)" }}>Register</Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="container py-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-prsa transition-colors" style={{ color: "oklch(42% 0.11 200)" }}>Home</Link>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium capitalize">{pageLabel}</span>
        </div>
      </div>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer style={{ background: "oklch(17% 0.05 240)", color: "rgba(255,255,255,0.6)" }} className="mt-auto">
        <div style={{ height: "3px", background: "oklch(62% 0.18 55)" }} />
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded flex items-center justify-center text-white font-serif font-bold text-xs" style={{ background: "oklch(42% 0.11 200)" }}>B</div>
                <span className="text-white font-serif font-semibold text-sm">B-BBEE Technology Adoption Barometer</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                A research platform operationalising real-time B-BBEE compliance monitoring and digital transformation tracking for the South African maritime sector.
              </p>
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-3">Regulatory Framework</h4>
              <ul className="space-y-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                <li>B-BBEE Act 53 of 2003</li>
                <li>Maritime Sector Code</li>
                <li>March 2024 MOU — B-BBEE Commission & PRSA</li>
                <li>Integrated Transport Sector Charter Council</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-3">Platform</h4>
              <ul className="space-y-1 text-xs">
                {[
                  { href: "/dashboard", label: "TAI Dashboard" },
                  { href: "/companies", label: "Company Directory" },
                  { href: "/compliance", label: "Compliance" },
                  { href: "/register", label: "Register Your Organisation" },
                ].map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.25)" }}>
            <span>© 2024 B-BBEE Technology Adoption Barometer. Research platform — demonstration data only.</span>
            <span>Aligned with B-BBEE Commission & Ports Regulator of South Africa</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

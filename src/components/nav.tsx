"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/chart-colors";
import {
  Flame,
  UtensilsCrossed,
  BookOpen,
  Dumbbell,
  ClipboardList,
  Scale,
  LineChart,
  CircleUserRound,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Today", icon: Flame },
  { href: "/food", label: "Food", icon: UtensilsCrossed },
  { href: "/meals", label: "Meals", icon: BookOpen },
  { href: "/exercise", label: "Exercise", icon: Dumbbell },
  { href: "/plan", label: "Plan", icon: ClipboardList },
  { href: "/weight", label: "Weight", icon: Scale },
  { href: "/trends", label: "Trends", icon: LineChart },
  { href: "/profile", label: "Profile", icon: CircleUserRound },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-24 flex-col items-center gap-2 border-r border-border bg-card py-6 sm:flex">
        <Link
          href="/"
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{ backgroundColor: BRAND }}
          aria-label="NutriTrack"
        >
          <Flame className="h-5 w-5 text-white" />
        </Link>
        <nav className="flex flex-1 flex-col items-center gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                title={item.label}
                className={cn(
                  "flex w-[72px] flex-col items-center gap-1 rounded-2xl px-1 py-2 transition-colors",
                  active
                    ? "text-white"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
                style={active ? { backgroundColor: BRAND } : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:hidden">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className="flex flex-1 flex-col items-center gap-1 py-3"
            >
              <item.icon
                className={cn("h-5 w-5 transition-colors", active ? "" : "text-muted-foreground")}
                style={active ? { color: BRAND } : undefined}
              />
              <span
                className="h-1 w-1 rounded-full transition-colors"
                style={{ backgroundColor: active ? BRAND : "transparent" }}
              />
            </Link>
          );
        })}
      </nav>
    </>
  );
}

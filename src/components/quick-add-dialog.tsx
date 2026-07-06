"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const QuickAddCloseContext = createContext<() => void>(() => {});

export function useQuickAddClose() {
  return useContext(QuickAddCloseContext);
}

export function QuickAddDialog({
  label,
  title,
  icon,
  variant = "default",
  className,
  children,
}: {
  label: string;
  title: string;
  icon?: ReactNode;
  variant?: "default" | "outline" | "secondary";
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant={variant} className={className}>
            {icon}
            {label}
          </Button>
        }
      />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <QuickAddCloseContext.Provider value={() => setOpen(false)}>
          {children}
        </QuickAddCloseContext.Provider>
      </DialogContent>
    </Dialog>
  );
}

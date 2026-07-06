"use client";

import { useState } from "react";
import { Dumbbell } from "lucide-react";

// Cross-fades between two still frames (start/end position) to approximate a
// looping GIF without needing a real animated-GIF asset or encoder.
export function ExercisePhotoLoop({
  images,
  alt,
  className = "h-16 w-16",
}: {
  images: [string, string] | null;
  alt: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);

  if (!images || broken) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-lg bg-secondary ${className}`}
      >
        <Dumbbell className="h-5 w-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={`relative shrink-0 overflow-hidden rounded-lg bg-secondary ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[0]}
        alt={alt}
        onError={() => setBroken(true)}
        className="absolute inset-0 h-full w-full animate-exercise-loop-a object-cover"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[1]}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full animate-exercise-loop-b object-cover"
      />
    </div>
  );
}

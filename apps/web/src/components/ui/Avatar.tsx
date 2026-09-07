import Image from "next/image";
import { cn } from "../../lib/cn";

export interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = { sm: 28, md: 40, lg: 56 } as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({ name, imageUrl, size = "md", className }: AvatarProps) {
  const px = sizeMap[size];
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-brand-700 font-medium",
        className
      )}
      style={{ width: px, height: px, fontSize: px * 0.38 }}
      role="img"
      aria-label={name}
    >
      {imageUrl ? (
        <Image src={imageUrl} alt={name} width={px} height={px} className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </div>
  );
}

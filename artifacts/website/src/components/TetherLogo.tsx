import { cn } from "@/lib/utils";

interface TetherLogoProps {
  size?: number;
  className?: string;
  variant?: "primary" | "white";
}

export function TetherLogo({ size = 32, className, variant = "primary" }: TetherLogoProps) {
  const bg = variant === "white" ? "rgba(255,255,255,0.16)" : "#6B9E8A";
  const fg = "white";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      className={cn("flex-shrink-0", className)}
      aria-hidden="true"
    >
      <rect width="52" height="52" rx="14" fill={bg} />
      <circle cx="26" cy="26" r="5.2" fill={fg} />
      <line x1="26" y1="7" x2="26" y2="19.5" stroke={fg} strokeWidth="3.4" strokeLinecap="round" />
      <line x1="26" y1="32.5" x2="26" y2="45" stroke={fg} strokeWidth="3.4" strokeLinecap="round" />
      <line x1="7" y1="26" x2="19.5" y2="26" stroke={fg} strokeWidth="3.4" strokeLinecap="round" />
      <line x1="32.5" y1="26" x2="45" y2="26" stroke={fg} strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="26" cy="7" r="2.6" fill={fg} opacity="0.5" />
      <circle cx="26" cy="45" r="2.6" fill={fg} opacity="0.5" />
      <circle cx="7" cy="26" r="2.6" fill={fg} opacity="0.5" />
      <circle cx="45" cy="26" r="2.6" fill={fg} opacity="0.5" />
    </svg>
  );
}

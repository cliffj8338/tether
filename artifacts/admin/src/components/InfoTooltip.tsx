import { useState, useRef, useEffect } from "react";

interface InfoTooltipProps {
  text: string;
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-4 h-4 rounded-full bg-muted text-muted-foreground text-[10px] font-bold flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors cursor-help"
        aria-label="More information"
      >
        i
      </button>
      {open && (
        <div className="absolute z-50 w-64 p-3 text-xs leading-relaxed text-popover-foreground bg-popover border border-border rounded-lg shadow-lg bottom-full mb-2 left-1/2 -translate-x-1/2">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover border-r border-b border-border rotate-45" />
          {text}
        </div>
      )}
    </div>
  );
}

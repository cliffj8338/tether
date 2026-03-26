interface EmptyStateProps {
  message: string;
  submessage?: string;
}

export function EmptyState({ message, submessage }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 5-6" />
        </svg>
      </div>
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
      {submessage && <p className="text-xs text-muted-foreground mt-1">{submessage}</p>}
    </div>
  );
}

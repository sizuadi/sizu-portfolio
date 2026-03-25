import { ChevronDown, ChevronUp } from "lucide-react";

interface ShowMoreButtonProps {
  expanded: boolean;
  onToggle: () => void;
  showLabel?: string;
  hideLabel?: string;
}

export function ShowMoreButton({
  expanded,
  onToggle,
  showLabel = "Show More",
  hideLabel = "Show Less",
}: ShowMoreButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="mt-6 mx-auto flex items-center gap-2 px-6 py-2.5 text-sm font-medium border border-neutral-300 dark:border-white/10 text-neutral-600 dark:text-white/50 bg-transparent transition-all duration-200 hover:border-neutral-900 dark:hover:border-white hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/4 cursor-pointer"
    >
      {expanded ? (
        <>
          {hideLabel}
          <ChevronUp size={14} />
        </>
      ) : (
        <>
          {showLabel}
          <ChevronDown size={14} />
        </>
      )}
    </button>
  );
}

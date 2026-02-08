import { Button } from "@/components/ui/Button";

interface PaginationProps {
  totalCount: number;
  canPrevious: boolean;
  canNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function Pagination({
  totalCount,
  canPrevious,
  canNext,
  onPrevious,
  onNext,
}: PaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className="flex mt-auto items-center justify-between pt-4"
    >
      <p className="text-sm text-blue-600">
        Showing {totalCount} team(s) total
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="neutral"
          size="sm"
          onClick={onPrevious}
          disabled={!canPrevious}
          className="text-gray-600 disabled:opacity-50"
          aria-label="Go to previous page"
        >
          Previous
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onNext}
          disabled={!canNext}
          aria-label="Go to next page"
        >
          Next
        </Button>
      </div>
    </nav>
  );
}

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
    <div className="flex mt-auto items-center justify-between pt-4">
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
        >
          Previous
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onNext}
          disabled={!canNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

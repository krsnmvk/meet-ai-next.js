import { Button } from '@/components/ui/button';

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function DataPagination({
  onPageChange,
  page,
  totalPages,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </span>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          variant="outline"
          size="sm"
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || totalPages === 0}
          variant="outline"
          size="sm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

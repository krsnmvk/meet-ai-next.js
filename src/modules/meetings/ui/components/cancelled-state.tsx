import EmptyState from '@/app/_components/empty.state';

export default function CancelledState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-5 gap-y-8 bg-white rounded-lg">
      <EmptyState
        title="Meeting cancelled"
        description="The meeting was cancelled"
        image="/cancelled.svg"
      />
    </div>
  );
}

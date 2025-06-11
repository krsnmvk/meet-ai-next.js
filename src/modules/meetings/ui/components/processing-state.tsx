import EmptyState from '@/app/_components/empty.state';

export default function ProcessingState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-5 gap-y-8 bg-white rounded-lg">
      <EmptyState
        title="Meeting completed"
        description="This meeting was completed. a summary will appear soon"
        image="/processing.svg"
      />
    </div>
  );
}

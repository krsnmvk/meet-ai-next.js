import { Loader2Icon } from 'lucide-react';

type Props = {
  title: string;
  description: string;
};

export default function LoadingState({ description, title }: Props) {
  return (
    <div className="py-4 px-8 flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center justify-center p-10 rounded-lg -shadow-sm gap-y-6 bg-background">
        <Loader2Icon className="animate-spin size-6 text-primary" />
        <div className="flex gap-y-2 flex-col text-center">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

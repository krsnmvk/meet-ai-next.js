import Image from 'next/image';

type Props = {
  title: string;
  description: string;
};

export default function EmptyState({ description, title }: Props) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image src="/empty.svg" alt="Empty" width={240} height={240} />
      <div className="flex gap-y-6 max-w-md mx-auto flex-col text-center">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

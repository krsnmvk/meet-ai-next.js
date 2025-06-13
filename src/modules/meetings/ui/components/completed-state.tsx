import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MeetingGetOne } from '../../types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  BookOpenCheckIcon,
  ClockFadingIcon,
  FileTextIcon,
  SparklesIcon,
  VideoIcon,
} from 'lucide-react';
import GeneratedAvatar from '@/app/_components/generated-avatar';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { formatDuration } from '@/lib/format-duration';
import Markdown from 'react-markdown';

type Props = {
  data: MeetingGetOne;
};

export default function CompletedState({ data }: Props) {
  return (
    <div className="flex flex-col gap-y-4">
      <Tabs defaultValue="summary">
        <div className="bg-white rounded-lg border px-3">
          <ScrollArea>
            <TabsList className="p-0 h-13 justify-start bg-background rounded-none">
              <TabsTrigger
                value="summary"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <BookOpenCheckIcon />
                <span>Summary</span>
              </TabsTrigger>
              <TabsTrigger
                value="transcript"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <FileTextIcon />
                <span>Transcript</span>
              </TabsTrigger>
              <TabsTrigger
                value="recording"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <VideoIcon />
                <span>Recording</span>
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <SparklesIcon />
                <span>Ask AI</span>
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <TabsContent value="recording">
          <div className="bg-white rounded-lg border px-4 py-5">
            <video
              src={data.recordingUrl!}
              controls
              className="rounded-lg w-full"
            />
          </div>
        </TabsContent>
        <TabsContent value="summary">
          <div className="bg-white rounded-lg border">
            <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
              <h3 className="font-medium text-2xl capitalize">{data.name}</h3>
              <div className="flex items-center gap-x-2">
                <Link
                  href={`/agents/${data.agents.id}`}
                  className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
                >
                  <GeneratedAvatar
                    seed={data.agents.name}
                    variant="botttsNeutral"
                    className="size-5"
                  />
                  <span>{data.agents.name}</span>
                </Link>
                <p>{data.startedAt ? format(data.startedAt, 'PPP') : ''}</p>
              </div>
              <div className="flex items-center gap-x-2">
                <SparklesIcon className="size-4" />
                <p>General Summary</p>
              </div>
              <Badge
                variant="outline"
                className="flex items-center gap-x-2 [&>svg]:size-4"
              >
                <ClockFadingIcon className="text-blue-700" />
                <span>
                  {data.duration
                    ? formatDuration(data.duration)
                    : 'No Durations'}
                </span>
              </Badge>
              <Markdown
                components={{
                  h1: (props) => (
                    <h1 className="text-2xl font-medium mb-6" {...props} />
                  ),
                  h2: (props) => (
                    <h2 className="text-xl font-medium mb-6" {...props} />
                  ),
                  h3: (props) => (
                    <h3 className="text-lg font-medium mb-6" {...props} />
                  ),
                  h4: (props) => (
                    <h4 className="text-base font-medium mb-6" {...props} />
                  ),
                  p: (props) => (
                    <p className="leading-relaxed mb-6" {...props} />
                  ),
                  ul: (props) => (
                    <ul className="list-disc list-inside mb-6" {...props} />
                  ),
                  ol: (props) => (
                    <ol className="list-decimal list-inside mb-6" {...props} />
                  ),
                  li: (props) => <li className="mb-1" {...props} />,
                  strong: (props) => (
                    <strong className="font-semibold" {...props} />
                  ),
                  code: (props) => (
                    <code
                      className="bg-gray-100 px-1 py-0.5 rounded"
                      {...props}
                    />
                  ),
                  blockquote: (props) => (
                    <blockquote
                      className="border-l-4 pl-4 italic py-4"
                      {...props}
                    />
                  ),
                }}
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                magni eos incidunt sit at, ducimus minima similique ipsum
                repellat quae!
              </Markdown>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

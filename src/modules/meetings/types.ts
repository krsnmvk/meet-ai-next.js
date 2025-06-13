import { AppRouter } from '@/trpc/routers/_app';
import { inferRouterOutputs } from '@trpc/server';

export type MeetingGetOne = inferRouterOutputs<AppRouter>['meetings']['getOne'];
export type MeetingGetMany =
  inferRouterOutputs<AppRouter>['meetings']['getMany']['items'];
export enum MeetingStatus {
  upcoming = 'upcoming',
  active = 'active',
  processing = 'processing',
  completed = 'completed',
  cancelled = 'cancelled',
}
export type StreamTranscriptItem = {
  speaker_id: string;
  type: string;
  text: string;
  start_ts: string;
  stop_ts: string;
};

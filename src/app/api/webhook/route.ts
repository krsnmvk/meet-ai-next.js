import { db } from '@/drizzle';
import { agentsTable, meetingsTable } from '@/drizzle/schema';
import { inngest } from '@/inngest/client';
import { streamVideo } from '@/lib/stream-video';
import {
  CallSessionStartedEvent,
  CallSessionParticipantLeftEvent,
  CallEndedEvent,
  CallTranscriptionReadyEvent,
  CallRecordingReadyEvent,
} from '@stream-io/node-sdk';
import { and, eq, not } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

function verifySignatureWithSDK(body: string, signature: string) {
  return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-signature');
  const apiKey = req.headers.get('x-api-key');

  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: 'Missing signature or api key' },
      { status: 400 }
    );
  }

  const body = await req.text();

  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventType = (payload as Record<string, unknown>)?.type;

  if (eventType === 'call.session_started') {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom.meetingId;

    if (!meetingId) {
      return NextResponse.json(
        { error: 'Missing meeting id' },
        { status: 400 }
      );
    }

    const [existingMeeting] = await db
      .select()
      .from(meetingsTable)
      .where(
        and(
          eq(meetingsTable.id, meetingId),
          not(eq(meetingsTable.status, 'completed')),
          not(eq(meetingsTable.status, 'active')),
          not(eq(meetingsTable.status, 'cancelled')),
          not(eq(meetingsTable.status, 'processing'))
        )
      );

    if (!existingMeeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    await db
      .update(meetingsTable)
      .set({
        status: 'active',
        startedAt: new Date(),
      })
      .where(eq(meetingsTable.id, existingMeeting.id))
      .returning();

    const [existingAgent] = await db
      .select()
      .from(agentsTable)
      .where(eq(agentsTable.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const call = streamVideo.video.call('default', meetingId);

    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      agentUserId: existingAgent.id,
      openAiApiKey: process.env.OPENAI_API_KEY!,
    });

    realtimeClient.updateSession({
      instructions: existingAgent.instructions,
    });
  } else if (eventType === 'call.session_participant_left') {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(':')[1];

    if (!meetingId) {
      return NextResponse.json(
        { error: 'Missing meeting id' },
        { status: 400 }
      );
    }

    const call = streamVideo.video.call('default', meetingId);
    await call.end();
  } else if (eventType === 'call.session_ended') {
    const event = payload as CallEndedEvent;
    const meetingId = event.call.custom.meetingId;

    if (!meetingId) {
      return NextResponse.json(
        { error: 'Missing meeting id' },
        { status: 400 }
      );
    }

    await db
      .update(meetingsTable)
      .set({
        status: 'processing',
        endedAt: new Date(),
      })
      .where(
        and(eq(meetingsTable.id, meetingId), eq(meetingsTable.status, 'active'))
      )
      .returning();
  } else if (eventType === 'call.transcription_ready') {
    const event = payload as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid.split(':')[1];

    if (!meetingId) {
      return NextResponse.json(
        { error: 'Missing meeting id' },
        { status: 400 }
      );
    }

    const [updateMeeting] = await db
      .update(meetingsTable)
      .set({
        transcriptUrl: event.call_transcription.url,
      })
      .where(eq(meetingsTable.id, meetingId))
      .returning();

    if (!updateMeeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    await inngest.send({
      name: 'meetings/processing',
      data: {
        meetingId: updateMeeting.id,
        transcriptUrl: updateMeeting.transcriptUrl,
      },
    });
  } else if (eventType === 'call.recording_ready') {
    const event = payload as CallRecordingReadyEvent;
    const meetingId = event.call_cid.split(':')[1];

    if (!meetingId) {
      return NextResponse.json(
        { error: 'Missing meeting id' },
        { status: 400 }
      );
    }

    await db
      .update(meetingsTable)
      .set({
        recordingUrl: event.call_recording.url,
      })
      .where(eq(meetingsTable.id, meetingId))
      .returning();
  }

  return NextResponse.json({ message: 'OK' }, { status: 200 });
}

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoTrack,
  useConnectionState,
  useTracks,
  useVoiceAssistant,
} from "@livekit/components-react";
import { ConnectionState, Track } from "livekit-client";
import { Button } from "@/components/ui/button";
import { platformClient } from "@/lib/platform-client";
import type { JoinInterviewResponse } from "@/lib/types";
import { InterviewControls } from "./interview-controls";
import { LiveTranscript } from "./live-transcript";

type ScreenState =
  | { step: "consent" }
  | { step: "connecting" }
  | { step: "in_room"; session: JoinInterviewResponse }
  | { step: "ended" }
  | { step: "error"; message: string };

export default function CandidateInterviewRoomPage() {
  const params = useParams<{ inviteToken: string }>();
  const inviteToken = params.inviteToken;
  const [consented, setConsented] = useState(false);
  const [screen, setScreen] = useState<ScreenState>({ step: "consent" });

  async function handleJoin() {
    setScreen({ step: "connecting" });
    try {
      // Fail fast with a clear message if the browser/OS denies mic/camera
      // access, rather than letting LiveKit's connect-then-publish surface a
      // vaguer error.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      stream.getTracks().forEach((track) => track.stop());

      const session = await platformClient.joinInterview(inviteToken);
      setScreen({ step: "in_room", session });
    } catch (err) {
      setScreen({
        step: "error",
        message: err instanceof Error ? err.message : "Could not join the interview",
      });
    }
  }

  if (screen.step === "consent" || screen.step === "connecting") {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <h1 className="text-2xl font-semibold">AI Voice Interview</h1>
        <p className="mt-3 text-sm text-white/70">
          This interview is conducted by an AI voice interviewer. Your video and audio are
          recorded for human review — the recording does not affect your evaluation on its own,
          and a human always makes the final decision on your application.
        </p>
        <label className="mt-6 flex items-start gap-3 text-sm text-white/90">
          <input
            type="checkbox"
            checked={consented}
            onChange={(e) => setConsented(e.target.checked)}
            className="mt-1 h-4 w-4"
          />
          I consent to this AI-conducted interview being recorded (video and audio) for hiring
          evaluation.
        </label>
        <Button
          className="mt-8"
          disabled={!consented || screen.step === "connecting"}
          onClick={handleJoin}
        >
          {screen.step === "connecting" ? "Connecting…" : "Join interview"}
        </Button>
      </main>
    );
  }

  if (screen.step === "error") {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <h1 className="text-2xl font-semibold">Couldn&apos;t join</h1>
        <p className="mt-3 text-sm text-white/70">{screen.message}</p>
        <p className="mt-3 text-sm text-white/50">
          This will not affect your evaluation. Please contact your recruiter for a new invite
          link.
        </p>
      </main>
    );
  }

  if (screen.step === "ended") {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <h1 className="text-2xl font-semibold">Interview complete</h1>
        <p className="mt-3 text-sm text-white/70">
          Thank you — your responses have been recorded for review. A recruiter will follow up
          with next steps.
        </p>
      </main>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={screen.session.livekitUrl}
      token={screen.session.token}
      connect
      audio
      video
      onDisconnected={() => setScreen({ step: "ended" })}
      onError={(err) => setScreen({ step: "error", message: err.message })}
      className="min-h-screen"
    >
      <InterviewRoom />
    </LiveKitRoom>
  );
}

function InterviewRoom() {
  const connectionState = useConnectionState();
  const { state: agentState } = useVoiceAssistant();
  const [showCaptions, setShowCaptions] = useState(true);

  // Self-view only — the agent has no camera track (see worker.py's
  // AutoSubscribe.AUDIO_ONLY), so there is nothing to render for "the other
  // side." Never add a face/emotion overlay here.
  const cameraTracks = useTracks([Track.Source.Camera]);
  const localCameraTrack = cameraTracks.find((t) => t.participant.isLocal);

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-5 px-6 py-8 text-center">
      <RoomAudioRenderer />
      {localCameraTrack ? (
        <VideoTrack
          trackRef={localCameraTrack}
          className="h-44 w-32 rounded-2xl object-cover shadow-lg border border-white/10"
        />
      ) : (
        <div
          className="h-20 w-20 rounded-full bg-[var(--color-navy-hover)] transition-transform shadow-inner border border-white/10"
          style={{ transform: agentState === "speaking" ? "scale(1.08)" : "scale(1)" }}
          aria-hidden
        />
      )}

      <div className="flex flex-col items-center gap-2 w-full">
        <p className="text-xs text-white/70">{describeState(connectionState, agentState)}</p>
        <button
          type="button"
          onClick={() => setShowCaptions(!showCaptions)}
          className="text-[11px] text-white/60 hover:text-white underline transition-colors"
        >
          {showCaptions ? "Hide Live Captions" : "Show Live Captions"}
        </button>
      </div>

      <LiveTranscript isOpen={showCaptions} />
      <InterviewControls />
    </main>
  );
}

function describeState(connectionState: ConnectionState, agentState: string): string {
  if (connectionState !== ConnectionState.Connected) {
    return "Reconnecting… this will not affect your evaluation.";
  }
  switch (agentState) {
    case "listening":
      return "Listening — go ahead and answer.";
    case "thinking":
      return "The interviewer is thinking…";
    case "speaking":
      return "The interviewer is speaking.";
    default:
      return "Connected — the interview will begin shortly.";
  }
}

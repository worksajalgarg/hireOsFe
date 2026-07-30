"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useConnectionState,
  useVoiceAssistant,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { Button } from "@/components/ui/button";
import { platformClient } from "@/lib/platform-client";
import type { JoinInterviewResponse } from "@/lib/types";
import { InterviewControls } from "./interview-controls";

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
      // Fail fast with a clear message if the browser/OS denies mic access,
      // rather than letting LiveKit's connect-then-publish surface a vaguer error.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
          This interview is conducted by an AI voice interviewer. Your responses are recorded for
          human review — the recording does not affect your evaluation on its own, and a human
          always makes the final decision on your application.
        </p>
        <label className="mt-6 flex items-start gap-3 text-sm text-white/90">
          <input
            type="checkbox"
            checked={consented}
            onChange={(e) => setConsented(e.target.checked)}
            className="mt-1 h-4 w-4"
          />
          I consent to this AI-conducted interview being recorded for hiring evaluation.
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
      video={false}
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

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <RoomAudioRenderer />
      <div
        className="h-24 w-24 rounded-full bg-[var(--color-navy-hover)] transition-transform"
        style={{ transform: agentState === "speaking" ? "scale(1.08)" : "scale(1)" }}
        aria-hidden
      />
      <p className="text-sm text-white/70">{describeState(connectionState, agentState)}</p>
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

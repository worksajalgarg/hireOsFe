"use client";

import { useState } from "react";
import { useLocalParticipant, useRoomContext } from "@livekit/components-react";
import {
  HelpCircle,
  Mic,
  MicOff,
  Pause,
  Play,
  PhoneOff,
  RotateCcw,
  Video,
  VideoOff,
} from "lucide-react";
import type { Room } from "livekit-client";
import { Button } from "@/components/ui/button";

type ControlAction = "repeat" | "clarify" | "pause" | "resume";

function sendControlMessage(room: Room, action: ControlAction) {
  const payload = new TextEncoder().encode(JSON.stringify({ action }));
  room.localParticipant.publishData(payload, { reliable: true, topic: "interview-controls" });
}

export function InterviewControls() {
  const room = useRoomContext();
  const { isMicrophoneEnabled, isCameraEnabled } = useLocalParticipant();
  const [paused, setPaused] = useState(false);

  function togglePause() {
    const next = !paused;
    setPaused(next);
    sendControlMessage(room, next ? "pause" : "resume");
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => room.localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
      >
        {isMicrophoneEnabled ? <Mic size={16} /> : <MicOff size={16} />}
        {isMicrophoneEnabled ? "Mute" : "Unmute"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => room.localParticipant.setCameraEnabled(!isCameraEnabled)}
      >
        {isCameraEnabled ? <Video size={16} /> : <VideoOff size={16} />}
        {isCameraEnabled ? "Camera off" : "Camera on"}
      </Button>
      <Button variant="outline" size="sm" onClick={() => sendControlMessage(room, "repeat")}>
        <RotateCcw size={16} />
        Repeat question
      </Button>
      <Button variant="outline" size="sm" onClick={() => sendControlMessage(room, "clarify")}>
        <HelpCircle size={16} />
        Clarify question
      </Button>
      <Button variant="outline" size="sm" onClick={togglePause}>
        {paused ? <Play size={16} /> : <Pause size={16} />}
        {paused ? "Resume" : "Pause"}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => room.disconnect()}>
        <PhoneOff size={16} />
        End interview
      </Button>
    </div>
  );
}

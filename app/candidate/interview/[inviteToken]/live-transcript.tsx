"use client";

import { useEffect, useRef } from "react";
import {
  useVoiceAssistant,
  useTracks,
  useTrackTranscription,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import type { ReceivedTranscriptionSegment } from "@livekit/components-core";

interface LiveTranscriptProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface DisplaySegment extends ReceivedTranscriptionSegment {
  speakerLabel: "Candidate" | "AI Interviewer";
}

export function LiveTranscript({ isOpen }: LiveTranscriptProps) {
  const { agentTranscriptions } = useVoiceAssistant();

  // Find local candidate microphone track for candidate live transcript
  const audioTracks = useTracks([Track.Source.Microphone]);
  const localAudioTrack = audioTracks.find((t) => t.participant.isLocal);
  const { segments: candidateSegments } = useTrackTranscription(localAudioTrack);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Tag speakerLabel and combine segments chronologically
  const taggedCandidate: DisplaySegment[] = (candidateSegments || []).map((s) => ({
    ...s,
    speakerLabel: "Candidate",
  }));

  const taggedAgent: DisplaySegment[] = (agentTranscriptions || []).map((s) => ({
    ...s,
    speakerLabel: "AI Interviewer",
  }));

  const allSegments = [...taggedCandidate, ...taggedAgent].sort(
    (a, b) => (a.firstReceivedTime || 0) - (b.firstReceivedTime || 0)
  );

  // Auto-scroll to latest transcript segment
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allSegments.length]);

  if (!isOpen) return null;

  return (
    <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md shadow-2xl transition-all">
      <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/80">
            Live Transcript & Diarization
          </h3>
        </div>
        <span className="text-[10px] text-white/50">Real-time</span>
      </div>

      <div
        ref={scrollRef}
        className="flex max-h-56 min-h-[120px] flex-col gap-2.5 overflow-y-auto pr-1 text-left text-xs"
      >
        {allSegments.length === 0 ? (
          <div className="my-auto flex flex-col items-center justify-center gap-1 text-white/40 italic py-6">
            <span>Listening for candidate or interviewer speech…</span>
          </div>
        ) : (
          allSegments.map((segment) => {
            const isLocal = segment.speakerLabel === "Candidate";
            const speakerBadgeBg = isLocal
              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
              : "bg-purple-500/20 text-purple-300 border-purple-500/30";

            return (
              <div key={segment.id} className="flex flex-col gap-1 transition-all">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${speakerBadgeBg}`}
                  >
                    {segment.speakerLabel}
                  </span>
                  {segment.language && (
                    <span className="text-[9px] text-white/40 font-mono uppercase">
                      {segment.language}
                    </span>
                  )}
                </div>
                <p className="pl-1 leading-relaxed text-white/90 font-sans">
                  {segment.text}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

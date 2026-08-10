"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { platformClient } from "@/lib/platform-client";
import { PipelineBoard } from "@/components/recruiter/pipeline-board";

export default function JobRolePipelinePage() {
  const params = useParams<{ roleId: string }>();

  const pipeline = useQuery({
    queryKey: ["pipeline", params.roleId],
    queryFn: () => platformClient.listPipeline(params.roleId),
  });

  if (pipeline.isLoading) return <p className="text-sm text-gray-400">Loading…</p>;

  return <PipelineBoard jobRoleId={params.roleId} pipeline={pipeline.data ?? {}} />;
}

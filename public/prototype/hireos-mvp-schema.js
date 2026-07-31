/*
 * MVP Data Schema / Persistence Contract.
 *
 * This file is the single local contract between prototype seed data,
 * shared review state, and the future database schema. It does not connect
 * a backend; it freezes field names, enums, relationships, and writeback
 * targets so feature slices do not invent incompatible persistence shapes.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.HireOSMvpSchema = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const enums = {
    task_status: ["Open", "In Progress", "Waiting", "Done", "Cancelled"],
    task_type: [
      "Job Setup",
      "Job Ready for Intake",
      "Inbox Review",
      "Candidate Review",
      "Duplicate Review",
      "Missing Candidate Info",
      "Job Match Review",
      "Application Next Action",
      "Blocked Resolution",
      "Mailbox Disconnected",
    ],
    source_module: ["Inbox", "Jobs", "Candidate", "Application", "System"],
    candidate_review_status: [
      "Unreviewed",
      "Reviewing",
      "Complete",
      "Needs Info",
      "Parse Failed",
      "Potential Duplicate",
      "Rejected",
      "Archived",
    ],
    profile_completeness: ["Complete", "Partial", "Missing Required"],
    application_status: [
      "Intake",
      "Profile Review",
      "Job Match Review",
      "Ready for Next Action",
      "Waiting",
      "Closed",
    ],
    job_link_status: ["Unconfirmed", "Confirmed", "Rejected", "Needs Review"],
    inbox_item_status: ["New", "Needs Review", "Task Created", "Applied", "Ignored"],
    exception_type: [
      "Missing Candidate Info",
      "Resume Parse Failed",
      "Job Match Unclear",
      "Potential Duplicate",
      "Evidence Needed",
      "Human Confirmation Needed",
      "Mailbox Disconnected",
    ],
  };

  const tables = {
    users: table("user_id", ["user_id", "name", "email", "avatar_initials", "preferred_language", "created_at", "updated_at"]),
    jobs: table("job_id", [
      "job_id",
      "title",
      "department",
      "location",
      "work_mode",
      "headcount",
      "level",
      "jd",
      "must_have_requirements",
      "nice_to_have_requirements",
      "status",
      "created_by_user_id",
      "ai_generated",
      "created_at",
      "updated_at",
    ]),
    candidates: table("candidate_id", [
      "candidate_id",
      "full_name",
      "primary_email",
      "phone",
      "location",
      "current_company",
      "current_title",
      "skills_summary",
      "source_summary",
      "profile_completeness",
      "review_status",
      "duplicate_candidate_ids",
      "evidence_ids",
      "created_from_inbox_item_id",
      "created_at",
      "updated_at",
    ]),
    applications: table("application_id", [
      "application_id",
      "candidate_id",
      "job_id",
      "status",
      "job_link_status",
      "owner_user_id",
      "next_action",
      "due_at",
      "evidence_ids",
      "linked_task_ids",
      "timeline_event_ids",
      "created_from_inbox_item_id",
      "created_at",
      "updated_at",
    ]),
    inbox_items: table("inbox_item_id", [
      "inbox_item_id",
      "source_type",
      "raw_subject",
      "raw_sender",
      "received_at",
      "attachment_names",
      "attachment_summary",
      "parsed_candidate",
      "suggested_job_id",
      "parse_status",
      "review_status",
      "exception_type",
      "evidence_ids",
      "related_candidate_id",
      "related_application_id",
      "created_at",
      "updated_at",
    ]),
    tasks: table("task_id", [
      "task_id",
      "task_type",
      "title",
      "status",
      "priority",
      "owner_role",
      "owner_id",
      "due_at",
      "source_module",
      "related_job_id",
      "related_candidate_id",
      "related_application_id",
      "related_inbox_item_id",
      "exception_type",
      "next_action",
      "evidence_ids",
      "completion_action",
      "waiting_on",
      "waiting_reason",
      "cancellation_reason",
      "writeback_preview",
      "writeback_result",
      "completed_at",
      "completed_by_user_id",
      "created_at",
      "updated_at",
    ]),
    evidence: table("evidence_id", ["evidence_id", "source_type", "source_ref_id", "title", "content_excerpt", "file_name", "created_at"]),
    timeline_events: table("timeline_event_id", [
      "timeline_event_id",
      "target_type",
      "target_id",
      "event_type",
      "description",
      "actor_user_id",
      "evidence_ids",
      "created_at",
    ]),
  };

  const relationships = {
    jobs: {
      created_by_user_id: "users.user_id",
    },
    candidates: {
      created_from_inbox_item_id: "inbox_items.inbox_item_id",
      evidence_ids: "evidence.evidence_id[]",
      duplicate_candidate_ids: "candidates.candidate_id[]",
    },
    applications: {
      candidate_id: "candidates.candidate_id",
      job_id: "jobs.job_id",
      created_from_inbox_item_id: "inbox_items.inbox_item_id",
    },
    inbox_items: {
      suggested_job_id: "jobs.job_id",
      related_candidate_id: "candidates.candidate_id",
      related_application_id: "applications.application_id",
      evidence_ids: "evidence.evidence_id[]",
    },
    tasks: {
      related_job_id: "jobs.job_id",
      related_candidate_id: "candidates.candidate_id",
      related_application_id: "applications.application_id",
      related_inbox_item_id: "inbox_items.inbox_item_id",
      evidence_ids: "evidence.evidence_id[]",
    },
    evidence: {
      source_ref_id: "inbox_items.inbox_item_id | candidates.candidate_id | applications.application_id | tasks.task_id",
    },
    timeline_events: {
      target_id: "candidates.candidate_id | applications.application_id | jobs.job_id | tasks.task_id",
      evidence_ids: "evidence.evidence_id[]",
    },
  };

  const taskWritebackContract = {
    "Inbox Review": writeback("Apply Inbox Item / Ignore Inbox Item", ["inbox_items", "timeline_events"]),
    "Candidate Review": writeback("Confirm Candidate Profile / Mark Parse Failed", ["candidates", "timeline_events"]),
    "Duplicate Review": writeback("Confirm Duplicate Resolved", ["candidates", "timeline_events"]),
    "Missing Candidate Info": writeback("Request Candidate Info", ["candidates", "tasks", "timeline_events"]),
    "Job Match Review": writeback("Confirm Job Match / Reject Job Match", ["applications", "timeline_events"]),
    "Application Next Action": writeback("Update Application next action", ["applications", "timeline_events"]),
    "Blocked Resolution": writeback("Resolve blocked record", ["applications", "timeline_events"]),
    "Mailbox Disconnected": writeback("Reconnect mailbox simulator", ["tasks", "inbox_items", "timeline_events"]),
  };

  const localStoreMapping = {
    users: "Generated from owner_id / created_by_user_id references in local seeds.",
    jobs: "Generated from related_job_id and application.job_id references until real job records exist.",
    candidates: "createReviewStateStore().listCandidates()",
    applications: "createReviewStateStore().listApplications()",
    inbox_items: "createReviewStateStore().getReviewContext(...).inboxItem via local review seed",
    tasks: "createTaskStore().listTasks({ view: 'all' }) normalized for DB-only optional fields",
    evidence: "createReviewStateStore().listEvidence()",
    timeline_events: "createReviewStateStore().listTimelineEvents() plus future task writebacks",
  };

  const MVP_SCHEMA_CONTRACT = {
    version: "S1.5 MVP Data Schema / Persistence Contract",
    tables,
    enums,
    relationships,
    localStoreMapping,
    taskWritebackContract,
    boundaries: [
      "Candidate is the reusable person profile and never stores job workflow state.",
      "Application is the Candidate + Job workflow record.",
      "Task carries execution and writeback intent; it does not replace Candidate or Application.",
      "Evidence can point to Inbox, Candidate, Application, or Task context.",
      "TimelineEvent records business changes for Candidate, Application, Job, or Task targets.",
    ],
  };

  function table(primaryKey, fields) {
    return { primaryKey, fields };
  }

  function writeback(completionAction, targets) {
    return { completion_action: completionAction, targets, timeline_event: "Task Completed" };
  }

  function mapLocalReviewStateToPersistenceTables({ reviewStateStore, taskStore }) {
    const taskRecords = taskStore.listTasks({ view: "all" });
    const candidates = supplementCandidates(
      reviewStateStore.listCandidates().map((item) => pickFields("candidates", item)),
      taskRecords
    );
    const applications = supplementApplications(
      reviewStateStore.listApplications().map((item) => pickFields("applications", item)),
      taskRecords
    );
    const evidence = reviewStateStore.listEvidence().map((item) => pickFields("evidence", item));
    const timelineEvents = reviewStateStore.listTimelineEvents().map((item) => pickFields("timeline_events", item));
    const tasks = taskRecords.map(normalizeTaskRecord);
    const inboxItems = collectInboxItems(reviewStateStore, candidates, applications).map((item) => pickFields("inbox_items", item));
    const users = collectUsers(tasks, applications);
    const jobs = collectJobs(tasks, applications, users[0].user_id);

    return {
      users,
      jobs,
      candidates,
      applications,
      inbox_items: inboxItems,
      tasks,
      evidence,
      timeline_events: timelineEvents,
    };
  }

  function collectInboxItems(reviewStateStore, candidates, applications) {
    const ids = new Set([
      ...candidates.map((item) => item.created_from_inbox_item_id).filter(Boolean),
      ...applications.map((item) => item.created_from_inbox_item_id).filter(Boolean),
    ]);
    return [...ids].map((inboxItemId) => reviewStateStore.getReviewContext({ inboxItemId }).inboxItem);
  }

  function supplementCandidates(candidates, tasks) {
    const existing = idSet(candidates, "candidate_id");
    const additions = tasks
      .filter((task) => task.related_candidate_id && !existing.has(task.related_candidate_id))
      .map((task) => {
        existing.add(task.related_candidate_id);
        return pickFields("candidates", {
          candidate_id: task.related_candidate_id,
          full_name: candidateNameFromTask(task),
          primary_email: "",
          phone: "",
          location: "",
          current_company: "",
          current_title: "",
          skills_summary: task.context_summary || "",
          source_summary: `${task.source_module} local seed reference`,
          profile_completeness: "Partial",
          review_status: "Unreviewed",
          duplicate_candidate_ids: [],
          evidence_ids: task.evidence_ids || [],
          created_from_inbox_item_id: "",
          created_at: "2026-07-28T00:00:00+08:00",
          updated_at: "2026-07-28T00:00:00+08:00",
        });
      });
    return [...candidates, ...additions];
  }

  function supplementApplications(applications, tasks) {
    const existing = idSet(applications, "application_id");
    const additions = tasks
      .filter((task) => task.related_application_id && !existing.has(task.related_application_id))
      .map((task) => {
        existing.add(task.related_application_id);
        return pickFields("applications", {
          application_id: task.related_application_id,
          candidate_id: task.related_candidate_id,
          job_id: task.related_job_id,
          status: task.task_type === "Blocked Resolution" ? "Waiting" : "Ready for Next Action",
          job_link_status: "Confirmed",
          owner_user_id: task.owner_id || "",
          next_action: task.next_action || "",
          due_at: task.due_at || "",
          evidence_ids: task.evidence_ids || [],
          linked_task_ids: [task.task_id],
          timeline_event_ids: [],
          created_from_inbox_item_id: "",
          created_at: "2026-07-28T00:00:00+08:00",
          updated_at: "2026-07-28T00:00:00+08:00",
        });
      });
    return [...applications, ...additions];
  }

  function collectUsers(tasks, applications) {
    const ids = new Set(["system"]);
    tasks.forEach((task) => {
      if (task.owner_id) ids.add(task.owner_id);
      if (task.completed_by_user_id) ids.add(task.completed_by_user_id);
    });
    applications.forEach((application) => {
      if (application.owner_user_id) ids.add(application.owner_user_id);
    });
    return [...ids].sort().map((userId) => ({
      user_id: userId,
      name: userName(userId),
      email: userId === "system" ? "system@hireos.local" : `${userId.replace(/^user_/, "").replaceAll("_", ".")}@hireos.local`,
      avatar_initials: initialsForUser(userId),
      preferred_language: "en",
      created_at: "2026-07-28T00:00:00+08:00",
      updated_at: "2026-07-28T00:00:00+08:00",
    }));
  }

  function collectJobs(tasks, applications, createdByUserId) {
    const ids = new Set();
    tasks.forEach((task) => {
      if (task.related_job_id) ids.add(task.related_job_id);
    });
    applications.forEach((application) => {
      if (application.job_id) ids.add(application.job_id);
    });
    return [...ids].sort().map((jobId) => ({
      job_id: jobId,
      title: jobTitle(jobId),
      department: "MVP Recruiting",
      location: jobId.includes("gtm") ? "Hanoi" : "Ho Chi Minh",
      work_mode: jobId.includes("gtm") ? "Remote" : "Hybrid",
      headcount: 1,
      level: "MVP",
      jd: `${jobTitle(jobId)} JD draft generated by the local MVP prototype.`,
      must_have_requirements: ["Basic screening criteria"],
      nice_to_have_requirements: [],
      status: "Active",
      created_by_user_id: createdByUserId,
      ai_generated: true,
      created_at: "2026-07-28T00:00:00+08:00",
      updated_at: "2026-07-28T00:00:00+08:00",
    }));
  }

  function normalizeTaskRecord(task) {
    return pickFields("tasks", {
      ...task,
      priority: normalizePriority(task.priority),
      related_inbox_item_id: task.related_inbox_item_id || "",
      exception_type: task.exception_type || inferExceptionType(task),
      waiting_on: task.waiting_on || (task.status === "Waiting" ? task.owner_role : ""),
      waiting_reason: task.waiting_reason || (task.status === "Waiting" ? task.next_action : ""),
      cancellation_reason: task.cancellation_reason || "",
      writeback_preview: task.writeback_preview || writebackPreview(task),
      writeback_result: task.writeback_result || (task.status === "Done" ? { completion_action: task.completion_action } : null),
      completed_at: task.completed_at || (task.status === "Done" ? task.due_at : ""),
      completed_by_user_id: task.completed_by_user_id || (task.status === "Done" ? task.owner_id : ""),
      created_at: task.created_at || "2026-07-28T00:00:00+08:00",
      updated_at: task.updated_at || task.due_at || "2026-07-28T00:00:00+08:00",
    });
  }

  function pickFields(tableName, input) {
    const output = {};
    tables[tableName].fields.forEach((field) => {
      output[field] = input[field] === undefined ? emptyDefault(field) : cloneJson(input[field]);
    });
    return output;
  }

  function validateMvpPersistenceContract(dbTables) {
    const errors = [];
    Object.entries(tables).forEach(([tableName, definition]) => {
      const records = dbTables[tableName];
      if (!Array.isArray(records)) {
        errors.push(`${tableName} must be an array`);
        return;
      }
      records.forEach((record) => {
        const keys = Object.keys(record);
        const extra = keys.filter((key) => !definition.fields.includes(key));
        const missing = definition.fields.filter((field) => !(field in record));
        extra.forEach((field) => errors.push(`${tableName}.${record[definition.primaryKey] || "unknown"} has extra field ${field}`));
        missing.forEach((field) => errors.push(`${tableName}.${record[definition.primaryKey] || "unknown"} missing field ${field}`));
        validateRecordEnums(tableName, record, errors);
      });
    });
    validateRelationships(dbTables, errors);
    return { errors };
  }

  function validateRecordEnums(tableName, record, errors) {
    enumChecks(tableName).forEach(([field, enumName]) => {
      const value = record[field];
      if (value && !enums[enumName].includes(value)) {
        errors.push(`${tableName}.${record[tables[tableName].primaryKey]} has invalid ${field}: ${value}`);
      }
    });
  }

  function enumChecks(tableName) {
    return {
      candidates: [["profile_completeness", "profile_completeness"], ["review_status", "candidate_review_status"]],
      applications: [["status", "application_status"], ["job_link_status", "job_link_status"]],
      inbox_items: [["review_status", "inbox_item_status"], ["exception_type", "exception_type"]],
      tasks: [["task_type", "task_type"], ["status", "task_status"], ["source_module", "source_module"], ["exception_type", "exception_type"]],
    }[tableName] || [];
  }

  function validateRelationships(dbTables, errors) {
    const candidateIds = idSet(dbTables.candidates, "candidate_id");
    const applicationIds = idSet(dbTables.applications, "application_id");
    const jobIds = idSet(dbTables.jobs, "job_id");
    const inboxItemIds = idSet(dbTables.inbox_items, "inbox_item_id");

    dbTables.applications.forEach((application) => {
      requireReference(errors, "applications", application.application_id, "candidate_id", application.candidate_id, candidateIds);
      requireReference(errors, "applications", application.application_id, "job_id", application.job_id, jobIds);
    });
    dbTables.tasks.forEach((task) => {
      if (task.source_module !== "System" && !task.related_job_id && !task.related_candidate_id && !task.related_application_id && !task.related_inbox_item_id) {
        errors.push(`tasks.${task.task_id} must relate to at least one business object`);
      }
      optionalReference(errors, "tasks", task.task_id, "related_job_id", task.related_job_id, jobIds);
      optionalReference(errors, "tasks", task.task_id, "related_candidate_id", task.related_candidate_id, candidateIds);
      optionalReference(errors, "tasks", task.task_id, "related_application_id", task.related_application_id, applicationIds);
      optionalReference(errors, "tasks", task.task_id, "related_inbox_item_id", task.related_inbox_item_id, inboxItemIds);
    });
  }

  function requireReference(errors, tableName, id, field, value, allowedIds) {
    if (!allowedIds.has(value)) errors.push(`${tableName}.${id} has missing ${field} reference ${value}`);
  }

  function optionalReference(errors, tableName, id, field, value, allowedIds) {
    if (value && !allowedIds.has(value)) errors.push(`${tableName}.${id} has missing ${field} reference ${value}`);
  }

  function idSet(records, field) {
    return new Set((records || []).map((record) => record[field]).filter(Boolean));
  }

  function normalizePriority(priority) {
    if (priority === "Urgent") return "P0";
    if (priority === "High") return "P1";
    if (priority === "Medium" || priority === "Low") return "P2";
    return priority || "P2";
  }

  function inferExceptionType(task) {
    if (task.task_type === "Missing Candidate Info") return "Missing Candidate Info";
    if (task.task_type === "Duplicate Review") return "Potential Duplicate";
    if (task.task_type === "Job Match Review") return "Job Match Unclear";
    if (task.task_type === "Inbox Review") return "Human Confirmation Needed";
    if (task.task_type === "Mailbox Disconnected") return "Mailbox Disconnected";
    if (task.task_type === "Blocked Resolution") return "Evidence Needed";
    return "";
  }

  function writebackPreview(task) {
    const contract = taskWritebackContract[task.task_type];
    return contract ? { targets: contract.targets, timeline_event: contract.timeline_event } : null;
  }

  function userName(userId) {
    if (userId === "system") return "System";
    return userId.replace(/^user_/, "").split("_").map(capitalize).join(" ");
  }

  function candidateNameFromTask(task) {
    const candidateObject = (task.related_objects || []).find((item) => !String(item).startsWith("job_"));
    return candidateObject || task.related_candidate_id.replace(/^cand_/, "").split("_").map(capitalize).join(" ");
  }

  function initialsForUser(userId) {
    return userName(userId).split(" ").map((part) => part[0] || "").join("").slice(0, 2).toUpperCase();
  }

  function jobTitle(jobId) {
    return jobId.replace(/^job_/, "").split("_").map(capitalize).join(" ");
  }

  function capitalize(value) {
    return value ? value[0].toUpperCase() + value.slice(1) : "";
  }

  function emptyDefault(field) {
    if (field.endsWith("_ids") || ["attachment_names", "must_have_requirements", "nice_to_have_requirements", "linked_task_ids", "timeline_event_ids"].includes(field)) return [];
    if (field === "parsed_candidate" || field === "writeback_preview" || field === "writeback_result") return null;
    if (field === "ai_generated") return false;
    if (field === "headcount") return 0;
    return "";
  }

  function cloneJson(value) {
    return JSON.parse(JSON.stringify(value));
  }

  return {
    MVP_SCHEMA_CONTRACT,
    mapLocalReviewStateToPersistenceTables,
    validateMvpPersistenceContract,
  };
});

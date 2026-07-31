/*
 * MVP Task contract.
 * Required fields: task_id, task_type, title, status, priority, owner_role,
 * owner_id, due_at, source_module, related_job_id, related_candidate_id,
 * related_application_id, next_action, evidence_ids, completion_action.
 *
 * Allowed status flow for MVP shell: Open / In Progress / Waiting / Done / Cancelled.
 * This local store is intentionally small so Inbox, Jobs, Candidate,
 * Application, and System flows can create or update tasks without a backend.
 */
const TASK_STATUSES = ["Open", "In Progress", "Waiting", "Done", "Cancelled"];
const ACTIVE_TASK_STATUSES = ["Open", "In Progress", "Waiting"];
const TASK_SOURCE_MODULES = ["Inbox", "Jobs", "Candidate", "Application", "System"];
const CANDIDATE_PROFILE_COMPLETENESS = ["Complete", "Partial", "Missing Required"];
const CANDIDATE_REVIEW_STATUSES = [
  "Unreviewed",
  "Reviewing",
  "Complete",
  "Needs Info",
  "Parse Failed",
  "Potential Duplicate",
  "Rejected",
  "Archived",
];
const APPLICATION_STATUSES = [
  "Intake",
  "Profile Review",
  "Job Match Review",
  "Ready for Next Action",
  "Waiting",
  "Closed",
];
const APPLICATION_JOB_LINK_STATUSES = ["Unconfirmed", "Confirmed", "Rejected", "Needs Review"];
const REVIEW_EXCEPTION_TYPES = [
  "Missing Candidate Info",
  "Resume Parse Failed",
  "Job Match Unclear",
  "Potential Duplicate",
  "Evidence Needed",
  "Human Confirmation Needed",
  "Mailbox Disconnected",
];
const MVP_TASK_DETAIL_ACTIONS = [
  "start",
  "complete",
  "wait",
  "reassign",
  "cancel",
  "request_evidence",
  "resolve",
  "connect_mailbox",
];
const MVP_TASK_TYPES = [
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
];
const TODAY_ISO_DATE = "2026-07-29";
const REQUIRED_TASK_FIELDS = [
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
  "next_action",
  "evidence_ids",
  "completion_action",
];

const EXCEPTION_TASK_CONFIGS = {
  "Missing Candidate Info": {
    taskType: "Missing Candidate Info",
    sourceModule: "Inbox",
    priority: "High",
    nextAction: "Collect missing candidate material before application workflow proceeds.",
    completionAction: "Request Candidate Info and keep the Candidate review state waiting for the missing material.",
  },
  "Resume Parse Failed": {
    taskType: "Inbox Review",
    sourceModule: "Inbox",
    priority: "High",
    nextAction: "Repair resume parsing or request a usable CV source.",
    completionAction: "Mark Parse Failed or attach repaired resume evidence before candidate workflow proceeds.",
  },
  "Job Match Unclear": {
    taskType: "Job Match Review",
    sourceModule: "Inbox",
    priority: "High",
    nextAction: "Confirm the intended active job before application workflow proceeds.",
    completionAction: "Confirm Job Match or Reject Job Match and write the result to the Application review state.",
  },
  "Potential Duplicate": {
    taskType: "Duplicate Review",
    sourceModule: "Inbox",
    priority: "High",
    nextAction: "Resolve the duplicate signal before creating or changing an Application.",
    completionAction: "Confirm Duplicate Resolved before any Candidate merge, link, or Application writeback.",
  },
  "Evidence Needed": {
    taskType: "Candidate Review",
    sourceModule: "Inbox",
    priority: "Medium",
    nextAction: "Review missing or weak evidence before confirming candidate material.",
    completionAction: "Attach the required evidence or cancel the candidate review with an audit reason.",
  },
  "Human Confirmation Needed": {
    taskType: "Inbox Review",
    sourceModule: "Inbox",
    priority: "Medium",
    nextAction: "Review candidate material before any Candidate or Application writeback.",
    completionAction: "Apply or ignore the Inbox Item after human confirmation.",
  },
  "Mailbox Disconnected": {
    taskType: "Mailbox Disconnected",
    sourceModule: "System",
    priority: "Urgent",
    nextAction: "Reconnect recruiting@company.vn or pause email intake until the approved folders can sync again.",
    completionAction: "Restore mailbox sync so email intake can create owner-ready tasks again.",
  },
};

const detailActionDefinitions = {
  start: { action: "start", label: "Start", icon: "play" },
  complete: { action: "complete", label: "Complete", icon: "check" },
  wait: { action: "wait", label: "Wait", icon: "pause-circle" },
  reassign: { action: "reassign", label: "Reassign", icon: "user-round-check" },
  cancel: { action: "cancel", label: "Cancel", icon: "x" },
  request_evidence: { action: "request_evidence", label: "Request Evidence", icon: "file-question" },
  resolve: { action: "resolve", label: "Resolve", icon: "wrench" },
  connect_mailbox: { action: "connect_mailbox", label: "Connect recruiting mailbox", icon: "mail-plus" },
};

const taskDetailTypeConfigs = {
  "Mailbox Disconnected": {
    category: "Mailbox",
    primaryAction: "connect_mailbox",
    actions: ["connect_mailbox", "wait", "cancel"],
    requiredGoal: "Reconnect the recruiting mailbox before email intake can safely create tasks.",
    recommendedAction: "Run the shared Mailbox Connect local simulator from this task or Inbox.",
    decisionImpact: "Successful connection marks this task Done and makes the Inbox simulation readable again.",
    confidence: "High",
    riskLevel: "High",
    missingInformation: ["Usable mailbox connection"],
    typeSpecificTitle: "Mailbox Connection Review",
    typeSpecificRows: [
      ["Mailbox", "recruiting@company.vn"],
      ["Connection mode", "Deterministic local simulator"],
      ["Scope", "Inbox and candidate material intake"],
    ],
    workflowPreview: {
      nextStep: "Inbox returns to readable local queue and Mailbox Disconnected becomes Done.",
      nextOwner: "HR Lead",
      nextDue: "Immediate after simulator success",
      timelineWrite: "Mailbox connection audit record is written locally.",
      candidateMessage: "No candidate message is sent.",
    },
    automationApproval: "Local simulator only; no real Gmail or Outlook API is connected.",
  },
  "Inbox Review": {
    category: "Inbox",
    primaryAction: "start",
    actions: ["start", "request_evidence", "complete", "cancel"],
    requiredGoal: "Review the email thread before it changes Candidate or Application records.",
    recommendedAction: "Review source email, attachment, identity confidence, and job-match confidence together.",
    decisionImpact: "Completion can create a candidate task, update an application, or keep the inbox item open for more information.",
    confidence: "Medium",
    riskLevel: "High",
    missingInformation: ["Human confirmation of identity and intended job"],
    typeSpecificTitle: "Inbox Evidence Review",
    typeSpecificRows: [
      ["Email thread", "Agency-forwarded candidate profile"],
      ["Attachment", "CV evidence retained before writeback"],
      ["Allowed outcome", "Create candidate task or request information"],
    ],
    workflowPreview: {
      nextStep: "Creates or updates Candidate Review / Duplicate Review / Application Next Action after HR confirmation.",
      nextOwner: "HR Lead",
      nextDue: "Same-day intake SLA",
      timelineWrite: "Inbox review decision is written to the related application when one exists.",
      candidateMessage: "No real email is sent; any reply remains a local draft.",
    },
  },
  "Candidate Review": {
    category: "Candidate",
    primaryAction: "start",
    actions: ["start", "request_evidence", "complete", "cancel"],
    requiredGoal: "Confirm whether the parsed person record should become or update a Candidate.",
    recommendedAction: "Confirm identity fields and evidence before allowing any application-level workflow.",
    decisionImpact: "Completion unlocks job-match review or application creation without merging unrelated candidate histories.",
    confidence: "Medium",
    riskLevel: "Medium",
    missingInformation: ["Human confirmation of parsed candidate identity"],
    typeSpecificTitle: "Candidate Identity Review",
    typeSpecificRows: [
      ["Identity fields", "Name, email, phone, location, source"],
      ["CV evidence", "Attachment remains traceable"],
      ["MVP outcome", "Confirm, reject, or request more evidence"],
    ],
    workflowPreview: {
      nextStep: "Candidate record becomes eligible for Job Match Review or Application Next Action.",
      nextOwner: "HR Lead",
      nextDue: "Inherited from intake SLA",
      timelineWrite: "Candidate identity confirmation is recorded as audit history.",
      candidateMessage: "No candidate message is sent automatically.",
    },
  },
  "Duplicate Review": {
    category: "Candidate",
    primaryAction: "start",
    actions: ["start", "request_evidence", "complete", "cancel"],
    requiredGoal: "Resolve the duplicate signal before creating or changing an Application.",
    recommendedAction: "Compare matching and conflicting evidence, then confirm merge/link or reject the duplicate.",
    decisionImpact: "A correct merge preserves Candidate history; a wrong merge can corrupt multiple Application timelines.",
    confidence: "Medium",
    riskLevel: "High",
    missingInformation: ["Human merge or link decision"],
    typeSpecificTitle: "Duplicate Candidate Review",
    typeSpecificRows: [
      ["Matching evidence", "Phone, name, or attachment signal"],
      ["Conflict evidence", "Different source or ambiguous history"],
      ["MVP outcome", "Confirm merge/link, request evidence, reject duplicate"],
    ],
    workflowPreview: {
      nextStep: "Returns to Candidate Review or Application Next Action after the duplicate decision.",
      nextOwner: "HR Lead",
      nextDue: "Same-day review SLA",
      timelineWrite: "Duplicate decision is written to Candidate audit history.",
      candidateMessage: "No candidate message is sent automatically.",
    },
  },
  "Missing Candidate Info": {
    category: "Candidate",
    primaryAction: "request_evidence",
    actions: ["request_evidence", "wait", "complete", "cancel"],
    requiredGoal: "Collect the missing candidate field or decide the profile is not usable for this job.",
    recommendedAction: "Ask the source for the missing field, then keep the task Waiting until the answer arrives.",
    decisionImpact: "The candidate does not move to application workflow until missing information is resolved.",
    confidence: "Low",
    riskLevel: "Medium",
    missingInformation: ["Missing candidate contact or source detail"],
    typeSpecificTitle: "Missing Candidate Information",
    typeSpecificRows: [
      ["Required fields", "Name, email, phone or clear source"],
      ["Current gap", "One or more parsed fields are missing"],
      ["MVP outcome", "Fill field, wait for source, or cancel"],
    ],
  },
  "Job Match Review": {
    category: "Inbox",
    primaryAction: "start",
    actions: ["start", "request_evidence", "complete", "cancel"],
    requiredGoal: "Confirm whether the candidate belongs to the suggested job before application creation.",
    recommendedAction: "Compare parsed CV evidence against the job criteria and accept only if the match is clear.",
    decisionImpact: "Completion creates the Application Next Action task; rejection keeps the Inbox item open.",
    confidence: "Medium",
    riskLevel: "Medium",
    missingInformation: ["Human job-match confirmation"],
    typeSpecificTitle: "Job Match Review",
    typeSpecificRows: [
      ["Job criteria", "Basic screening criteria and scorecard summary"],
      ["Candidate evidence", "CV and source thread"],
      ["MVP outcome", "Accept match or request more information"],
    ],
  },
  "Application Next Action": {
    category: "Application",
    primaryAction: "start",
    actions: ["start", "wait", "reassign", "complete", "request_evidence", "cancel"],
    requiredGoal: "Confirm the application has enough evidence to move to its next workflow step.",
    recommendedAction: "Check evidence links, owner, and due date before completing the workflow move.",
    decisionImpact: "Completion writes the application timeline and may create the next owner task.",
    confidence: "High",
    riskLevel: "Medium",
    missingInformation: ["Evidence packet confirmation"],
    typeSpecificTitle: "Application Next Action",
    typeSpecificRows: [
      ["Application", "Candidate plus job-specific workflow state"],
      ["Next action", "Owner-visible step required now"],
      ["MVP outcome", "Move to next round or create next task"],
    ],
    workflowPreview: {
      nextStep: "Hiring Manager confirmation can be prepared, or the Application timeline is updated.",
      nextOwner: "Hiring Manager or HR Lead",
      nextDue: "Inherited from job SLA",
      timelineWrite: "Application stage transition is written to timeline.",
      candidateMessage: "Candidate message is not sent unless a human approves a draft.",
    },
  },
  "Blocked Resolution": {
    category: "Exception",
    primaryAction: "resolve",
    actions: ["resolve", "request_evidence", "wait", "reassign", "cancel"],
    requiredGoal: "Resolve the blocking cause so the application can return to its normal workflow.",
    recommendedAction: "Fix the missing evidence, owner, or decision path before marking the task complete.",
    decisionImpact: "Resolution records the unblock reason and resumes the prior workflow state.",
    confidence: "Medium",
    riskLevel: "High",
    missingInformation: ["Blocking evidence or owner fix"],
    typeSpecificTitle: "Blocked Resolution",
    typeSpecificRows: [
      ["Exception cause", "Missing owner, evidence gap, overdue feedback, or policy ambiguity"],
      ["Impact object", "Application or job workflow"],
      ["MVP outcome", "Resolve and return to original workflow"],
    ],
    workflowPreview: {
      nextStep: "Unblock record is written, then the application returns to the prior workflow or resumes the next action.",
      nextOwner: "Current owner from the application workflow",
      nextDue: "Recalculated from job SLA",
      timelineWrite: "Blocked Resolution record is written to audit timeline.",
      candidateMessage: "No candidate message is sent automatically.",
    },
  },
  "Job Setup": {
    category: "Job",
    primaryAction: "start",
    actions: ["start", "complete", "request_evidence", "cancel"],
    requiredGoal: "Complete the job setup detail required by downstream task generation.",
    recommendedAction: "Tighten the missing job field, then complete the task.",
    decisionImpact: "Job setup quality improves Candidate Review and Application Next Action routing.",
    confidence: "High",
    riskLevel: "Low",
    missingInformation: ["Job setup refinement"],
    typeSpecificTitle: "Job Setup Review",
  },
  "Job Ready for Intake": {
    category: "Job",
    primaryAction: "complete",
    actions: ["complete"],
    requiredGoal: "Confirm the job remains ready for high-confidence email intake.",
    recommendedAction: "No change is needed unless a job default is removed.",
    decisionImpact: "The job remains eligible for local email intake simulation.",
    confidence: "High",
    riskLevel: "Low",
    missingInformation: [],
    typeSpecificTitle: "Job Intake Readiness",
  },
};

const seedTasks = [
  {
    task_id: "flow_01_ai_intake",
    task_type: "Job Setup",
    title: "AI Intake：确认招聘意图",
    status: "Done",
    priority: "High",
    owner_role: "HR Lead",
    owner_id: "user_linh_tran",
    due_at: "2026-07-29T09:00:00+08:00",
    source_module: "Jobs",
    related_job_id: "job_senior_backend",
    related_candidate_id: "",
    related_application_id: "",
    next_action: "确认岗位目标、硬性条件、面试轮次和发布边界。",
    evidence_ids: ["ev_job_title_set", "ev_default_owner_set"],
    completion_action: "AI 已生成 JD、Scorecard、Workflow、Interview Plan 和 Challenge 说明。",
    context_summary: "Linh Tran used AI Intake to describe a Senior Backend Engineer role for HireOS task APIs, workflow state, and production reliability.",
    related_objects: ["Senior Backend Engineer", "AI Intake", "JD package"],
    evidence_summary: ["Hiring intent is captured.", "Interview workflow is drafted.", "Hard conditions and challenge risks are visible before launch."],
  },
  {
    task_id: "flow_02_review_job_package",
    task_type: "Job Setup",
    title: "审核 Job Package",
    status: "Open",
    priority: "High",
    owner_role: "HR Lead",
    owner_id: "user_linh_tran",
    due_at: "2026-07-29T10:00:00+08:00",
    source_module: "Jobs",
    related_job_id: "job_senior_backend",
    related_candidate_id: "",
    related_application_id: "",
    next_action: "审核 JD、Scorecard、Workflow、Interview Plan 和 Challenge 风险。",
    evidence_ids: ["ev_scorecard_summary_partial", "ev_screening_criteria_set"],
    completion_action: "确认岗位包可发布，并解锁发布/简历导入任务。",
    context_summary: "The generated package is ready for human review before publishing. The review must confirm scope, scorecard, interview sequence, and launch conditions.",
    related_objects: ["JD", "Scorecard", "Workflow", "Interview Plan", "Challenge"],
    evidence_summary: ["JD draft is available.", "Scorecard dimensions are mapped.", "Challenge notes call out budget, talent pool, interview overlap, and hard condition risks."],
  },
  {
    task_id: "flow_03_publish_and_import",
    task_type: "Job Ready for Intake",
    title: "发布岗位并导入简历",
    status: "Open",
    priority: "High",
    owner_role: "HR Lead",
    owner_id: "user_linh_tran",
    due_at: "2026-07-29T11:00:00+08:00",
    source_module: "Jobs",
    related_job_id: "job_senior_backend",
    related_candidate_id: "",
    related_application_id: "",
    next_action: "发布岗位，并确认招聘邮箱可以导入第一批 CV。",
    evidence_ids: ["ev_job_title_set", "ev_default_sla_set", "ev_screening_criteria_set"],
    completion_action: "岗位进入 Active，CV Import 生成候选人审核任务。",
    context_summary: "The reviewed Senior Backend package is ready to publish. After publish, the prototype imports a clean set of CVs for this job only.",
    related_objects: ["Senior Backend Engineer", "Publish", "CV Import"],
    evidence_summary: ["Job defaults are ready.", "Mailbox intake is in scope.", "Imported CVs must stay linked to the published job."],
  },
  {
    task_id: "flow_04_recruiting_monitor",
    task_type: "Inbox Review",
    title: "招聘监控：审核导入简历",
    status: "Open",
    priority: "High",
    owner_role: "HR Lead",
    owner_id: "user_linh_tran",
    due_at: "2026-07-29T12:00:00+08:00",
    source_module: "Inbox",
    related_job_id: "job_senior_backend",
    related_candidate_id: "cand_trang_nguyen",
    related_application_id: "app_trang_backend",
    next_action: "确认导入的 CV、来源、候选人身份和岗位匹配，避免脏数据进入申请流程。",
    evidence_ids: ["ev_parsed_candidate_fields", "ev_source_email", "ev_job_match_low_confidence"],
    completion_action: "确认候选人和岗位匹配后，进入 HR 初面安排。",
    context_summary: "The first imported CV batch produced Trang Nguyen as the clean candidate for the Senior Backend flow. HR needs to validate source and match before scheduling.",
    related_objects: ["Trang Nguyen", "Senior Backend Engineer", "CV import batch"],
    evidence_summary: ["CV was imported from recruiting intake.", "Candidate identity is clean.", "Job match is strong enough for HR screen after review."],
  },
  {
    task_id: "flow_05_schedule_hr_screen",
    task_type: "Application Next Action",
    title: "安排 HR 初面",
    status: "Open",
    priority: "High",
    owner_role: "HR Lead",
    owner_id: "user_linh_tran",
    due_at: "2026-07-29T14:00:00+08:00",
    source_module: "Application",
    related_job_id: "job_senior_backend",
    related_candidate_id: "cand_trang_nguyen",
    related_application_id: "app_trang_backend",
    next_action: "安排 HR 初面，并确认动机、薪资范围、地点和上线期支持条件。",
    evidence_ids: ["ev_source_email", "ev_application_stage_ready"],
    completion_action: "HR 初面安排写入申请时间线，并准备反馈审核任务。",
    context_summary: "Trang Nguyen has passed clean intake. The next workflow step is HR screen scheduling with explicit questions tied to the job package.",
    related_objects: ["Trang Nguyen", "HR Screen", "Linh Tran"],
    evidence_summary: ["Candidate source is confirmed.", "Job package defines HR screen questions.", "Scheduling should create a visible next due time."],
  },
  {
    task_id: "flow_06_review_hr_feedback",
    task_type: "Application Next Action",
    title: "审核 HR 初面反馈",
    status: "Open",
    priority: "High",
    owner_role: "HR Lead",
    owner_id: "user_linh_tran",
    due_at: "2026-07-29T16:00:00+08:00",
    source_module: "Application",
    related_job_id: "job_senior_backend",
    related_candidate_id: "cand_trang_nguyen",
    related_application_id: "app_trang_backend",
    next_action: "审核 HR 初面反馈，决定是否进入技术面试。",
    evidence_ids: ["ev_application_stage_ready", "ev_tech_interview"],
    completion_action: "反馈审核通过后，创建技术面试/Assessment 决策任务。",
    context_summary: "HR screen feedback is ready. The review should confirm motivation, salary range, communication, and whether the candidate should enter the interview decision step.",
    related_objects: ["Trang Nguyen", "HR Feedback", "Senior Backend Engineer"],
    evidence_summary: ["Motivation signal is positive.", "Salary range is within band.", "Leadership depth remains an interview question."],
  },
  {
    task_id: "flow_07_interview_decision",
    task_type: "Application Next Action",
    title: "面试决定：进入技术面",
    status: "Open",
    priority: "High",
    owner_role: "HR Lead",
    owner_id: "user_linh_tran",
    due_at: "2026-07-30T10:00:00+08:00",
    source_module: "Application",
    related_job_id: "job_senior_backend",
    related_candidate_id: "cand_trang_nguyen",
    related_application_id: "app_trang_backend",
    next_action: "确认进入技术面，并把面试重点和证据缺口传给 Tech Lead。",
    evidence_ids: ["ev_tech_interview", "ev_scorecard_summary_partial"],
    completion_action: "技术面安排写入申请时间线；面试后进入 Assessment 决策。",
    context_summary: "HR feedback supports moving Trang Nguyen into the technical interview. The decision must preserve evidence gaps from the job package.",
    related_objects: ["Trang Nguyen", "Tech Lead", "Technical Interview"],
    evidence_summary: ["Backend ownership evidence is promising.", "Workflow-system depth needs direct probing.", "Tech Lead should avoid repeating HR screen questions."],
  },
  {
    task_id: "flow_08_assessment_decision",
    task_type: "Application Next Action",
    title: "Assessment 决定",
    status: "Open",
    priority: "High",
    owner_role: "HR Lead",
    owner_id: "user_linh_tran",
    due_at: "2026-07-30T15:00:00+08:00",
    source_module: "Application",
    related_job_id: "job_senior_backend",
    related_candidate_id: "cand_trang_nguyen",
    related_application_id: "app_trang_backend",
    next_action: "根据面试反馈决定是否发送 Assessment，或直接进入创始人终面。",
    evidence_ids: ["ev_assessment_v2", "ev_tech_interview", "ev_application_stage_ready"],
    completion_action: "Assessment 决策写入申请时间线，并形成下一步 Owner 可见任务。",
    context_summary: "Technical interview evidence is ready for the Assessment decision. The decision should close the evidence gap without adding unnecessary process drag.",
    related_objects: ["Trang Nguyen", "Assessment", "Founder Review"],
    evidence_summary: ["Technical interview evidence is linked.", "Assessment can cover workflow design and debugging tradeoffs.", "If evidence is already sufficient, HR can recommend founder review instead."],
  },
];

const seedReviewState = {
  inboxItems: [
    {
      inbox_item_id: "inbox_quang_agency_forward",
      source_type: "Email",
      raw_subject: "Agency profile: Quang Do for Platform Engineer",
      raw_sender: "agency@talent.vn",
      received_at: "2026-07-28T08:55:00+08:00",
      attachment_names: ["CV_Quang_Backend.pdf"],
      attachment_summary: "Backend-heavy CV with platform match ambiguity.",
      parsed_candidate: {
        full_name: "Quang Do",
        primary_email: "agency forwarded",
        phone: "+84 90 000 0101",
        location: "Unknown",
        source_summary: "Agency-forwarded candidate profile",
      },
      suggested_job_id: "job_platform_engineer",
      parse_status: "Parsed",
      review_status: "Needs Review",
      exception_type: "Job Match Unclear",
      evidence_ids: ["ev_agency_forward", "ev_job_match_low_confidence"],
      related_candidate_id: "cand_quang_do",
      related_application_id: "app_quang_platform",
      created_at: "2026-07-28T08:55:00+08:00",
      updated_at: "2026-07-28T08:55:00+08:00",
    },
  ],
  candidates: [
    {
      candidate_id: "cand_quang_do",
      full_name: "Quang Do",
      primary_email: "agency forwarded",
      phone: "+84 90 000 0101",
      location: "Unknown",
      current_company: "",
      current_title: "Backend Engineer",
      skills_summary: "Backend engineer with possible platform ownership signal.",
      source_summary: "Agency-forwarded candidate profile",
      profile_completeness: "Partial",
      review_status: "Reviewing",
      duplicate_candidate_ids: ["cand_quang_backend_existing"],
      evidence_ids: ["ev_agency_forward", "ev_cv_quang_backend", "ev_parsed_candidate_fields"],
      created_from_inbox_item_id: "inbox_quang_agency_forward",
      created_at: "2026-07-28T08:55:00+08:00",
      updated_at: "2026-07-28T08:55:00+08:00",
    },
    {
      candidate_id: "cand_lan_pham",
      full_name: "Lan Pham",
      primary_email: "lan.pham@mail.vn",
      phone: "",
      location: "Ho Chi Minh",
      current_company: "",
      current_title: "Product Designer",
      skills_summary: "Designer profile missing a required phone number.",
      source_summary: "Inbox CV intake",
      profile_completeness: "Missing Required",
      review_status: "Needs Info",
      duplicate_candidate_ids: [],
      evidence_ids: ["ev_lan_cv", "ev_missing_phone", "ev_source_email"],
      created_from_inbox_item_id: "",
      created_at: "2026-07-28T09:20:00+08:00",
      updated_at: "2026-07-28T09:20:00+08:00",
    },
    {
      candidate_id: "cand_trang_nguyen",
      full_name: "Trang Nguyen",
      primary_email: "trang.nguyen@mail.vn",
      phone: "+84 90 000 0188",
      location: "Ho Chi Minh",
      current_company: "Fintech API Studio",
      current_title: "Senior Backend Engineer",
      skills_summary: "Backend ownership, API reliability, hiring OS workflow experience.",
      source_summary: "Recruiting inbox · CV attachment parsed",
      profile_completeness: "Complete",
      review_status: "Reviewing",
      duplicate_candidate_ids: [],
      evidence_ids: ["ev_source_email", "ev_parsed_candidate_fields", "ev_screening_criteria_set"],
      created_from_inbox_item_id: "",
      created_at: "2026-07-29T12:00:00+08:00",
      updated_at: "2026-07-29T12:00:00+08:00",
    },
  ],
  applications: [
    {
      application_id: "app_quang_platform",
      candidate_id: "cand_quang_do",
      job_id: "job_platform_engineer",
      status: "Job Match Review",
      job_link_status: "Needs Review",
      owner_user_id: "user_linh_tran",
      next_action: "Confirm Platform job match before application workflow can proceed.",
      due_at: "2026-07-28T15:30:00+08:00",
      evidence_ids: ["ev_agency_forward", "ev_job_match_low_confidence", "ev_cv_quang_backend"],
      linked_task_ids: ["task_inbox_identity_review", "task_inbox_job_match_review"],
      timeline_event_ids: ["tl_app_quang_created", "tl_app_quang_job_match_review"],
      created_from_inbox_item_id: "inbox_quang_agency_forward",
      created_at: "2026-07-28T08:55:00+08:00",
      updated_at: "2026-07-28T08:55:00+08:00",
    },
    {
      application_id: "app_trang_backend",
      candidate_id: "cand_trang_nguyen",
      job_id: "job_senior_backend",
      status: "Profile Review",
      job_link_status: "Confirmed",
      owner_user_id: "user_linh_tran",
      next_action: "Review candidate basics, evidence, and decide Shortlist / Reject / Need More Info.",
      due_at: "2026-07-29T13:00:00+08:00",
      evidence_ids: ["ev_source_email", "ev_parsed_candidate_fields", "ev_screening_criteria_set"],
      linked_task_ids: ["task_candidate_screening_app_trang_backend"],
      timeline_event_ids: ["tl_app_trang_created", "tl_app_trang_screening"],
      created_from_inbox_item_id: "",
      created_at: "2026-07-29T12:00:00+08:00",
      updated_at: "2026-07-29T12:00:00+08:00",
    },
  ],
  evidence: [
    {
      evidence_id: "ev_agency_forward",
      source_type: "Email",
      source_ref_id: "inbox_quang_agency_forward",
      title: "Agency forwarded profile",
      content_excerpt: "Identity confidence 72%, Platform match 62%, Backend match 58%.",
      file_name: "",
      created_at: "2026-07-28T08:55:00+08:00",
    },
    {
      evidence_id: "ev_cv_quang_backend",
      source_type: "Resume",
      source_ref_id: "inbox_quang_agency_forward",
      title: "CV Quang Backend",
      content_excerpt: "Backend systems experience is stronger than platform ownership evidence.",
      file_name: "CV_Quang_Backend.pdf",
      created_at: "2026-07-28T08:55:00+08:00",
    },
    {
      evidence_id: "ev_parsed_candidate_fields",
      source_type: "AI Extraction",
      source_ref_id: "inbox_quang_agency_forward",
      title: "Parsed candidate fields",
      content_excerpt: "Name, phone, source, CV reference, and summary were extracted.",
      file_name: "",
      created_at: "2026-07-28T08:56:00+08:00",
    },
    {
      evidence_id: "ev_job_match_low_confidence",
      source_type: "AI Extraction",
      source_ref_id: "inbox_quang_agency_forward",
      title: "Low-confidence job match",
      content_excerpt: "Suggested Platform Engineer match requires HR confirmation.",
      file_name: "",
      created_at: "2026-07-28T08:56:00+08:00",
    },
    {
      evidence_id: "ev_lan_cv",
      source_type: "Resume",
      source_ref_id: "",
      title: "Lan Pham CV",
      content_excerpt: "Designer CV parsed from inbox material.",
      file_name: "Lan_Pham_CV.pdf",
      created_at: "2026-07-28T09:20:00+08:00",
    },
    {
      evidence_id: "ev_missing_phone",
      source_type: "AI Extraction",
      source_ref_id: "",
      title: "Missing phone",
      content_excerpt: "Required candidate phone field is missing.",
      file_name: "",
      created_at: "2026-07-28T09:20:00+08:00",
    },
    {
      evidence_id: "ev_source_email",
      source_type: "Email",
      source_ref_id: "",
      title: "Source email",
      content_excerpt: "Original source email is retained for follow-up.",
      file_name: "",
      created_at: "2026-07-28T09:20:00+08:00",
    },
    {
      evidence_id: "ev_screening_criteria_set",
      source_type: "Scorecard",
      source_ref_id: "job_senior_backend",
      title: "Screening criteria set",
      content_excerpt: "Candidate Screening uses the published job scorecard; HR confirms the decision.",
      file_name: "",
      created_at: "2026-07-29T12:00:00+08:00",
    },
  ],
  timelineEvents: [
    {
      timeline_event_id: "tl_app_trang_created",
      target_type: "Application",
      target_id: "app_trang_backend",
      event_type: "Created",
      description: "Application created after the job was published and candidate evidence was mocked for MVP screening.",
      actor_user_id: "system",
      evidence_ids: ["ev_source_email"],
      created_at: "2026-07-29T12:00:00+08:00",
    },
    {
      timeline_event_id: "tl_app_trang_screening",
      target_type: "Application",
      target_id: "app_trang_backend",
      event_type: "Task Created",
      description: "Candidate Screening task created for HR decision.",
      actor_user_id: "system",
      evidence_ids: ["ev_screening_criteria_set"],
      created_at: "2026-07-29T12:05:00+08:00",
    },
    {
      timeline_event_id: "tl_cand_quang_created",
      target_type: "Candidate",
      target_id: "cand_quang_do",
      event_type: "Created",
      description: "Candidate profile created from Inbox intake for human review.",
      actor_user_id: "system",
      evidence_ids: ["ev_agency_forward", "ev_parsed_candidate_fields"],
      created_at: "2026-07-28T08:55:00+08:00",
    },
    {
      timeline_event_id: "tl_app_quang_created",
      target_type: "Application",
      target_id: "app_quang_platform",
      event_type: "Created",
      description: "Application created as Candidate plus Platform Engineer workflow record.",
      actor_user_id: "system",
      evidence_ids: ["ev_agency_forward"],
      created_at: "2026-07-28T08:55:00+08:00",
    },
    {
      timeline_event_id: "tl_app_quang_job_match_review",
      target_type: "Application",
      target_id: "app_quang_platform",
      event_type: "Task Created",
      description: "Low-confidence job match requires HR review before workflow progress.",
      actor_user_id: "system",
      evidence_ids: ["ev_job_match_low_confidence"],
      created_at: "2026-07-28T08:56:00+08:00",
    },
  ],
};

function cloneTask(task) {
  return { ...task, evidence_ids: [...task.evidence_ids], related_objects: [...(task.related_objects || [])], evidence_summary: [...(task.evidence_summary || [])] };
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function dateOnly(value) {
  return String(value || "").slice(0, 10);
}

function isActiveTask(task) {
  return ACTIVE_TASK_STATUSES.includes(task.status);
}

function cloneAction(actionName) {
  return { ...detailActionDefinitions[actionName] };
}

function taskDetailConfig(task) {
  return taskDetailTypeConfigs[task.task_type] || {
    category: task.source_module || "Task",
    primaryAction: "start",
    actions: ["start", "complete", "wait", "reassign", "cancel"],
    requiredGoal: task.next_action,
    recommendedAction: task.next_action,
    decisionImpact: task.completion_action,
    confidence: "Medium",
    riskLevel: task.priority === "Urgent" ? "High" : "Medium",
    missingInformation: [],
    typeSpecificTitle: `${task.task_type} Review`,
  };
}

function deriveSlaStatus(task) {
  if (["Done", "Cancelled"].includes(task.status)) return "Closed";
  const dueDate = dateOnly(task.due_at);
  if (!dueDate) return "Missing due date";
  if (dueDate < TODAY_ISO_DATE) return "Overdue";
  if (dueDate === TODAY_ISO_DATE) return "Due today";
  if (task.status === "Waiting") return "Waiting";
  return "On track";
}

function defaultWorkflowPreview(task) {
  return {
    nextStep: task.completion_action,
    nextOwner: task.owner_role,
    nextDue: task.due_at || "No due date",
    timelineWrite: task.related_application_id ? "Application Timeline receives the task completion record." : "Task audit timeline receives the completion record.",
    candidateMessage: "No candidate message is sent automatically.",
  };
}

function evidenceModel(task, config) {
  const summary = [...(task.evidence_summary || [])];
  if (!summary.length && task.evidence_ids.length) {
    summary.push(`${task.evidence_ids.length} linked evidence records are attached to this task.`);
  }
  return {
    summary,
    source: summary[0] ? [summary[0]] : task.evidence_ids.slice(0, 1),
    supporting: summary.slice(1, 3),
    counter: task.task_type === "Duplicate Review" || task.task_type === "Inbox Review"
      ? summary.slice(2, 4)
      : [],
    unknowns: [...(config.missingInformation || [])],
    evidenceIds: [...task.evidence_ids],
  };
}

function typeSpecificRows(task, config) {
  if (config.typeSpecificRows) return config.typeSpecificRows.map((row) => [...row]);
  return [
    ["Task type", task.task_type],
    ["Required goal", config.requiredGoal || task.next_action],
    ["Completion result", task.completion_action],
  ];
}

function createTaskDetailModel(task) {
  if (!task) {
    throw new Error("Task detail requires a task payload");
  }
  const config = taskDetailConfig(task);
  const actions = (config.actions || ["start", "complete", "wait", "reassign", "cancel"]).map(cloneAction);
  const primaryAction = cloneAction(config.primaryAction || actions[0].action);
  const workflowPreview = { ...defaultWorkflowPreview(task), ...(config.workflowPreview || {}) };
  const relatedObjects = [...(task.related_objects || [])];
  const missingInformation = [...(config.missingInformation || [])];
  const humanConfirmationRequired = Boolean(config.humanConfirmationRequired);

  return {
    taskId: task.task_id,
    title: task.title,
    taskType: task.task_type,
    category: config.category,
    status: task.status,
    priority: task.priority,
    ownerRole: task.owner_role,
    ownerId: task.owner_id,
    dueAt: task.due_at,
    slaStatus: deriveSlaStatus(task),
    sourceModule: task.source_module,
    jobId: task.related_job_id,
    candidateId: task.related_candidate_id,
    applicationId: task.related_application_id,
    relatedObjects,
    requiredGoal: config.requiredGoal || task.next_action,
    recommendedAction: config.recommendedAction || task.next_action,
    decisionImpact: config.decisionImpact || task.completion_action,
    confidence: config.confidence || "Medium",
    riskLevel: config.riskLevel || (task.priority === "Urgent" ? "High" : "Medium"),
    missingInformation,
    primaryAction,
    actions,
    aiRecommendation: {
      summary: config.recommendedAction || task.next_action,
      confidence: config.confidence || "Medium",
      riskLevel: config.riskLevel || "Medium",
      humanConfirmationRequired,
      boundary: humanConfirmationRequired
        ? "AI / HR recommendation cannot decide; the assigned human must confirm the outcome."
        : "AI / HR recommendation summarizes deterministic local evidence only.",
    },
    evidence: evidenceModel(task, config),
    typeSpecific: {
      title: config.typeSpecificTitle || `${task.task_type} Review`,
      rows: typeSpecificRows(task, config),
    },
    workflowPreview,
    sidebar: {
      owner: `${task.owner_role} · ${task.owner_id}`,
      timing: `${formatDetailDue(task.due_at)} · ${deriveSlaStatus(task)}`,
      relatedObjects,
      auditRecords: [
        ["Created", `${task.source_module} generated ${task.task_type}`],
        ["Current status", task.status],
        ["Completion action", task.completion_action],
      ],
    },
    automation: {
      approval: config.automationApproval || (humanConfirmationRequired
        ? "Human confirmation is required before workflow writeback."
        : "Deterministic local simulator; no real email or LLM API is connected."),
      writesTimeline: workflowPreview.timelineWrite,
      sendsCandidateMessage: workflowPreview.candidateMessage,
    },
  };
}

function formatDetailDue(value) {
  return value || "No due date";
}

function validateStatus(status) {
  if (!TASK_STATUSES.includes(status)) {
    throw new Error(`Invalid task status: ${status}`);
  }
}

function validateSourceModule(sourceModule) {
  if (!TASK_SOURCE_MODULES.includes(sourceModule)) {
    throw new Error(`Invalid source module: ${sourceModule}`);
  }
}

function validateRequiredFields(task) {
  REQUIRED_TASK_FIELDS.forEach((field) => {
    if (!(field in task)) {
      throw new Error(`Missing required task field: ${field}`);
    }
  });
  if (!Array.isArray(task.evidence_ids)) {
    throw new Error("Missing required task field: evidence_ids");
  }
  validateSourceModule(task.source_module);
}

const taskStoreStorageKey = "hireos-task-store-clean-flow-v1";

function resetTaskStoreStorageFromLocation(storage, locationLike) {
  if (!storage || typeof storage.removeItem !== "function" || !locationLike) return false;
  const search = typeof locationLike.search === "string" ? locationLike.search : "";
  const params = new URLSearchParams(search);
  if (params.get("reset_demo_state") !== "1" && params.get("reset_tasks") !== "1") return false;
  storage.removeItem(taskStoreStorageKey);
  return true;
}

function createTaskStore(initialTasks = seedTasks, options = {}) {
  const storage = options.storage || null;
  const storageKey = options.storageKey || taskStoreStorageKey;
  let tasks = loadPersistedTasks(storage, storageKey, initialTasks);

  function persistTasks() {
    if (!storage || typeof storage.setItem !== "function") return;
    storage.setItem(storageKey, JSON.stringify(tasks));
  }

  function listTasks(options = {}) {
    const { view = "all", ownerId } = options;
    let result = tasks;
    if (view === "my") {
      result = result.filter((task) => task.owner_id === ownerId && isActiveTask(task));
    } else if (view === "all_open") {
      result = result.filter((task) => ["Open", "In Progress"].includes(task.status));
    } else if (view === "due_today") {
      result = result.filter((task) => isActiveTask(task) && dateOnly(task.due_at) === TODAY_ISO_DATE);
    } else if (view === "overdue") {
      result = result.filter((task) => isActiveTask(task) && dateOnly(task.due_at) < TODAY_ISO_DATE);
    } else if (view === "waiting") {
      result = result.filter((task) => task.status === "Waiting");
    }
    return result.slice().sort(compareTaskQueueOrder).map(cloneTask);
  }

  function getTask(taskId) {
    const task = tasks.find((item) => item.task_id === taskId);
    return task ? cloneTask(task) : null;
  }

  function createTask(input) {
    const task = {
      task_id: input.task_id || `task_${Date.now()}_${tasks.length + 1}`,
      status: input.status || "Open",
      evidence_ids: [],
      related_job_id: "",
      related_candidate_id: "",
      related_application_id: "",
      ...input,
    };
    validateStatus(task.status);
    validateRequiredFields(task);
    tasks = [task, ...tasks];
    persistTasks();
    return cloneTask(task);
  }

  function updateTask(taskId, patch) {
    if (patch.status) validateStatus(patch.status);
    if (patch.source_module) validateSourceModule(patch.source_module);
    const index = tasks.findIndex((task) => task.task_id === taskId);
    if (index === -1) throw new Error(`Task not found: ${taskId}`);
    tasks[index] = { ...tasks[index], ...patch };
    persistTasks();
    return cloneTask(tasks[index]);
  }

  return { listTasks, getTask, createTask, updateTask };
}

function compareTaskQueueOrder(a, b) {
  const aActive = isActiveTask(a) ? 0 : 1;
  const bActive = isActiveTask(b) ? 0 : 1;
  if (aActive !== bActive) return aActive - bActive;

  const activityDiff = taskActivityTimestamp(b) - taskActivityTimestamp(a);
  if (activityDiff !== 0) return activityDiff;

  const dueDiff = timestampValue(b.due_at, 0) - timestampValue(a.due_at, 0);
  if (dueDiff !== 0) return dueDiff;

  const statusDiff = taskStatusOrder(a.status) - taskStatusOrder(b.status);
  if (statusDiff !== 0) return statusDiff;

  return String(a.task_id).localeCompare(String(b.task_id));
}

function taskActivityTimestamp(task) {
  return Math.max(
    timestampValue(task.updated_at, 0),
    timestampValue(task.created_at, 0)
  );
}

function taskStatusOrder(status) {
  return {
    Open: 0,
    "In Progress": 1,
    Waiting: 2,
    Done: 3,
    Cancelled: 4,
  }[status] ?? 9;
}

function timestampValue(value, fallback) {
  const parsed = Date.parse(value || "");
  return Number.isNaN(parsed) ? fallback : parsed;
}

function loadPersistedTasks(storage, storageKey, initialTasks) {
  if (!storage || typeof storage.getItem !== "function") {
    return initialTasks.map(cloneTask);
  }
  try {
    const raw = storage.getItem(storageKey);
    if (!raw) return initialTasks.map(cloneTask);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return initialTasks.map(cloneTask);
    return parsed.map(cloneTask);
  } catch {
    return initialTasks.map(cloneTask);
  }
}

function createReviewStateStore(initialState = seedReviewState) {
  const state = cloneJson(initialState);

  function findCandidate(candidateId) {
    return state.candidates.find((item) => item.candidate_id === candidateId) || null;
  }

  function findApplication(applicationId) {
    return state.applications.find((item) => item.application_id === applicationId) || null;
  }

  function findInboxItem(inboxItemId) {
    return state.inboxItems.find((item) => item.inbox_item_id === inboxItemId) || null;
  }

  function updateInboxItem(inboxItemId, patch) {
    const inboxItem = findInboxItem(inboxItemId);
    if (!inboxItem) throw new Error(`Inbox item not found: ${inboxItemId}`);
    Object.assign(inboxItem, patch);
    return inboxItem;
  }

  function findTask(taskId, taskStore) {
    if (taskStore && typeof taskStore.getTask === "function") return taskStore.getTask(taskId);
    return seedTasks.find((task) => task.task_id === taskId) || null;
  }

  function relatedEvidence(candidate, application, inboxItem, evidenceIds = []) {
    const ids = new Set([
      ...evidenceIds,
      ...(candidate ? candidate.evidence_ids : []),
      ...(application ? application.evidence_ids : []),
      ...(inboxItem ? inboxItem.evidence_ids : []),
    ]);
    return state.evidence.filter((item) => ids.has(item.evidence_id)).map(cloneJson);
  }

  function relatedTimeline(candidate, application) {
    const ids = new Set([
      candidate ? candidate.candidate_id : "",
      application ? application.application_id : "",
    ]);
    return state.timelineEvents
      .filter((item) => ids.has(item.target_id))
      .map(cloneJson);
  }

  function contextFromIds({ candidateId, applicationId, inboxItemId, exceptionType, evidenceIds }) {
    let inboxItem = inboxItemId ? findInboxItem(inboxItemId) : null;
    const candidate = findCandidate(candidateId || (inboxItem && inboxItem.related_candidate_id));
    const application = findApplication(applicationId || (inboxItem && inboxItem.related_application_id)) ||
      (candidate ? state.applications.find((item) => item.candidate_id === candidate.candidate_id) : null);
    inboxItem = inboxItem || state.inboxItems.find((item) => (
      (candidate && item.related_candidate_id === candidate.candidate_id) ||
      (application && item.related_application_id === application.application_id)
    )) || null;
    if (!candidate) throw new Error("Review context requires a Candidate record.");
    return {
      candidate: cloneJson(candidate),
      application: application ? cloneJson(application) : null,
      inboxItem: inboxItem ? cloneJson(inboxItem) : null,
      exception_type: exceptionType || (inboxItem && inboxItem.exception_type) || "",
      evidence: relatedEvidence(candidate, application, inboxItem, evidenceIds),
      timeline: relatedTimeline(candidate, application),
    };
  }

  function getReviewContext(request = {}) {
    if (request.inboxItemId) {
      return contextFromIds({ inboxItemId: request.inboxItemId });
    }

    if (request.taskId) {
      const task = findTask(request.taskId, request.taskStore);
      if (!task) throw new Error(`Task not found: ${request.taskId}`);
      const inboxItem = state.inboxItems.find((item) => (
        item.related_candidate_id === task.related_candidate_id ||
        item.related_application_id === task.related_application_id
      ));
      return contextFromIds({
        candidateId: task.related_candidate_id,
        applicationId: task.related_application_id,
        inboxItemId: inboxItem ? inboxItem.inbox_item_id : "",
        exceptionType: task.exception_type || (inboxItem && inboxItem.exception_type) || inferExceptionTypeForTask(task),
        evidenceIds: task.evidence_ids,
      });
    }

    if (request.applicationId) {
      const application = findApplication(request.applicationId);
      if (!application) throw new Error(`Application not found: ${request.applicationId}`);
      return contextFromIds({
        candidateId: application.candidate_id,
        applicationId: application.application_id,
        inboxItemId: application.created_from_inbox_item_id,
      });
    }

    return contextFromIds({
      candidateId: request.candidateId,
      applicationId: request.applicationId,
    });
  }

  function getInboxCandidateReviewEntry(request = {}) {
    const context = getReviewContext(request);
    if (!context.inboxItem) {
      throw new Error("Inbox candidate review entry requires an Inbox Item.");
    }
    const parsedCandidate = context.inboxItem.parsed_candidate || {};
    return {
      ...context,
      source: {
        material: `${context.inboxItem.source_type} · ${context.inboxItem.raw_subject}`,
        sender: context.inboxItem.raw_sender,
        receivedAt: context.inboxItem.received_at,
        attachments: [...(context.inboxItem.attachment_names || [])],
        attachmentSummary: context.inboxItem.attachment_summary,
      },
      parsedFields: cloneJson(parsedCandidate),
      evidenceLinks: context.evidence.map((item) => ({
        ...item,
        href: `#${item.evidence_id}`,
      })),
      completeness: {
        status: context.candidate.profile_completeness,
        missingFields: missingCandidateFields(context.candidate, parsedCandidate),
      },
      jobLink: {
        jobId: context.application ? context.application.job_id : context.inboxItem.suggested_job_id,
        suggestedJobId: context.inboxItem.suggested_job_id,
        status: context.application ? context.application.job_link_status : "Unconfirmed",
        applicationStatus: context.application ? context.application.status : "Intake",
      },
      availableActions: inboxCandidateReviewActions(),
      exceptionHandoff: buildInboxExceptionHandoff({
        inboxItem: context.inboxItem,
        candidate: context.candidate,
        application: context.application,
        action: inboxActionFromExceptionType(context.inboxItem.exception_type),
      }),
    };
  }

  function applyInboxCandidateReviewAction(input = {}) {
    const context = getReviewContext(input);
    if (!context.inboxItem) {
      throw new Error("Inbox candidate review action requires an Inbox Item.");
    }
    const candidate = findCandidate(context.candidate.candidate_id);
    const application = context.application ? findApplication(context.application.application_id) : null;
    const inboxItem = findInboxItem(context.inboxItem.inbox_item_id);
    const taskStore = input.taskStore;
    const now = input.created_at || "2026-07-28T16:00:00+08:00";
    const action = input.action;
    const evidenceIds = input.evidence_ids || inboxItem.evidence_ids || [];
    let task = null;
    let handoff = null;

    if (action === "confirm_complete") {
      candidate.review_status = "Complete";
      candidate.profile_completeness = "Complete";
      candidate.updated_at = now;
      if (application) {
        application.job_link_status = "Confirmed";
        application.status = "Ready for Next Action";
        application.next_action = "Candidate profile and job link confirmed; prepare the next application workflow action.";
        application.updated_at = now;
      }
      updateInboxItem(inboxItem.inbox_item_id, {
        review_status: "Applied",
        exception_type: "",
        updated_at: now,
      });
      task = updateRelatedTask(taskStore, {
        candidate,
        application,
        inboxItem,
        taskType: "Job Match Review",
        status: "Done",
        action,
        now,
      });
      appendTimeline({
        target_type: "Candidate",
        target_id: candidate.candidate_id,
        event_type: "Reviewed",
        description: "Inbox confirmed candidate material as complete.",
        actor_user_id: input.actor_user_id || "",
        evidence_ids: evidenceIds,
        created_at: now,
      });
      if (application) {
        appendTimeline({
          target_type: "Application",
          target_id: application.application_id,
          event_type: "Reviewed",
          description: "Inbox confirmed the application job link.",
          actor_user_id: input.actor_user_id || "",
          evidence_ids: evidenceIds,
          created_at: now,
        });
      }
    } else if (action === "mark_missing_info") {
      candidate.review_status = "Needs Info";
      candidate.profile_completeness = "Missing Required";
      candidate.updated_at = now;
      if (application) {
        application.status = "Waiting";
        application.job_link_status = "Needs Review";
        application.next_action = "Wait for missing candidate material before application workflow proceeds.";
        application.updated_at = now;
      }
      updateInboxItem(inboxItem.inbox_item_id, {
        review_status: "Task Created",
        exception_type: "Missing Candidate Info",
        updated_at: now,
      });
      handoff = buildInboxExceptionHandoff({ inboxItem, candidate, application, action, input });
      task = upsertHandoffTask(taskStore, handoff.payload, now);
      appendTimeline({
        target_type: "Candidate",
        target_id: candidate.candidate_id,
        event_type: "Updated",
        description: "Inbox marked candidate material as missing required information.",
        actor_user_id: input.actor_user_id || "",
        evidence_ids: evidenceIds,
        created_at: now,
      });
    } else if (action === "mark_parse_failed") {
      candidate.review_status = "Parse Failed";
      candidate.profile_completeness = "Missing Required";
      candidate.updated_at = now;
      if (application) {
        application.status = "Waiting";
        application.job_link_status = "Needs Review";
        application.next_action = "Wait for resume parsing repair before application workflow proceeds.";
        application.updated_at = now;
      }
      updateInboxItem(inboxItem.inbox_item_id, {
        review_status: "Task Created",
        parse_status: "Failed",
        exception_type: "Resume Parse Failed",
        updated_at: now,
      });
      handoff = buildInboxExceptionHandoff({ inboxItem, candidate, application, action, input });
      task = upsertHandoffTask(taskStore, handoff.payload, now);
      appendTimeline({
        target_type: "Candidate",
        target_id: candidate.candidate_id,
        event_type: "Updated",
        description: "Inbox marked resume parsing as failed.",
        actor_user_id: input.actor_user_id || "",
        evidence_ids: evidenceIds,
        created_at: now,
      });
    } else if (action === "mark_job_unclear") {
      if (application) {
        application.status = "Job Match Review";
        application.job_link_status = "Needs Review";
        application.next_action = "Confirm the intended job before application workflow proceeds.";
        application.updated_at = now;
      }
      updateInboxItem(inboxItem.inbox_item_id, {
        review_status: "Task Created",
        exception_type: "Job Match Unclear",
        updated_at: now,
      });
      handoff = buildInboxExceptionHandoff({ inboxItem, candidate, application, action, input });
      task = updateRelatedTask(taskStore, {
        candidate,
        application,
        inboxItem,
        taskType: "Job Match Review",
        status: "Waiting",
        action,
        now,
      }) || upsertHandoffTask(taskStore, handoff.payload, now);
      if (application) {
        appendTimeline({
          target_type: "Application",
          target_id: application.application_id,
          event_type: "Updated",
          description: "Inbox marked the application job link as uncertain.",
          actor_user_id: input.actor_user_id || "",
          evidence_ids: evidenceIds,
          created_at: now,
        });
      }
    } else if (action === "mark_potential_duplicate") {
      candidate.review_status = "Potential Duplicate";
      candidate.duplicate_candidate_ids = cloneJson(input.duplicate_candidate_ids || candidate.duplicate_candidate_ids || []);
      candidate.updated_at = now;
      if (application) {
        application.status = "Job Match Review";
        application.job_link_status = "Needs Review";
        application.updated_at = now;
      }
      updateInboxItem(inboxItem.inbox_item_id, {
        review_status: "Task Created",
        exception_type: "Potential Duplicate",
        updated_at: now,
      });
      handoff = buildInboxExceptionHandoff({ inboxItem, candidate, application, action, input });
      task = updateRelatedTask(taskStore, {
        candidate,
        application,
        inboxItem,
        taskType: "Duplicate Review",
        status: "Waiting",
        action,
        now,
      }) || upsertHandoffTask(taskStore, handoff.payload, now);
      appendTimeline({
        target_type: "Candidate",
        target_id: candidate.candidate_id,
        event_type: "Updated",
        description: "Inbox marked the candidate as a potential duplicate.",
        actor_user_id: input.actor_user_id || "",
        evidence_ids: evidenceIds,
        created_at: now,
      });
    } else {
      throw new Error(`Unsupported inbox candidate review action: ${action || "missing"}`);
    }

    const updatedContext = getInboxCandidateReviewEntry({ inboxItemId: inboxItem.inbox_item_id, taskStore });
    return {
      ...updatedContext,
      task,
      exceptionHandoff: handoff || buildInboxExceptionHandoff({ inboxItem, candidate, application, action, input }),
    };
  }

  function convertExceptionToTask(input = {}) {
    const exceptionType = input.exception_type || input.exceptionType;
    validateReviewExceptionType(exceptionType);
    const context = input.inboxItemId
      ? getReviewContext({ inboxItemId: input.inboxItemId })
      : getReviewContext({
        candidateId: input.candidateId,
        applicationId: input.applicationId,
      });
    const candidate = findCandidate(context.candidate.candidate_id);
    const application = context.application ? findApplication(context.application.application_id) : null;
    const inboxItem = context.inboxItem ? findInboxItem(context.inboxItem.inbox_item_id) : null;
    const now = input.created_at || "2026-07-28T16:00:00+08:00";

    applyExceptionReviewState({ exceptionType, candidate, application, inboxItem, now });
    const payload = buildExceptionTaskPayload({
      exceptionType,
      candidate,
      application,
      inboxItem,
      input,
      now,
    });
    const result = upsertExceptionTask(input.taskStore, payload, now);
    appendTimeline({
      target_type: application ? "Application" : "Candidate",
      target_id: application ? application.application_id : candidate.candidate_id,
      event_type: "Task Created",
      description: `${exceptionType} converted to ${payload.task_type} task.`,
      actor_user_id: input.actor_user_id || "system",
      evidence_ids: payload.evidence_ids,
      created_at: now,
    });

    return {
      task: result.task,
      created: result.created,
      candidate: cloneJson(candidate),
      application: application ? cloneJson(application) : null,
      inboxItem: inboxItem ? cloneJson(inboxItem) : null,
      exception_type: exceptionType,
    };
  }

  function applyReviewDecision(input = {}) {
    const context = getReviewContext(input);
    const candidate = findCandidate(context.candidate.candidate_id);
    const application = context.application ? findApplication(context.application.application_id) : null;
    const now = input.created_at || "2026-07-28T16:00:00+08:00";
    const evidenceIds = Array.isArray(input.evidence_ids) ? input.evidence_ids : [];

    if (input.completion_action === "Confirm Candidate Profile") {
      candidate.review_status = "Complete";
      candidate.profile_completeness = "Complete";
      candidate.updated_at = now;
      appendTimeline({
        target_type: "Candidate",
        target_id: candidate.candidate_id,
        event_type: "Reviewed",
        description: "Candidate profile confirmed from shared review state.",
        actor_user_id: input.actor_user_id || "",
        evidence_ids: evidenceIds,
        created_at: now,
      });
    } else if (input.completion_action === "Request Candidate Info") {
      candidate.review_status = "Needs Info";
      candidate.profile_completeness = "Missing Required";
      candidate.updated_at = now;
      appendTimeline({
        target_type: "Candidate",
        target_id: candidate.candidate_id,
        event_type: "Updated",
        description: "Candidate profile marked as needing more information.",
        actor_user_id: input.actor_user_id || "",
        evidence_ids: evidenceIds,
        created_at: now,
      });
    } else if (input.completion_action === "Confirm Job Match" && application) {
      application.job_link_status = "Confirmed";
      application.status = "Ready for Next Action";
      application.updated_at = now;
      appendTimeline({
        target_type: "Application",
        target_id: application.application_id,
        event_type: "Reviewed",
        description: "Application job link confirmed from shared review state.",
        actor_user_id: input.actor_user_id || "",
        evidence_ids: evidenceIds,
        created_at: now,
      });
    } else if (input.completion_action === "Reject Job Match" && application) {
      application.job_link_status = "Rejected";
      application.status = "Closed";
      application.updated_at = now;
      appendTimeline({
        target_type: "Application",
        target_id: application.application_id,
        event_type: "Reviewed",
        description: "Application job link rejected from shared review state.",
        actor_user_id: input.actor_user_id || "",
        evidence_ids: evidenceIds,
        created_at: now,
      });
    } else {
      throw new Error(`Unsupported review completion action: ${input.completion_action || "missing"}`);
    }

    return getReviewContext({
      candidateId: candidate.candidate_id,
      applicationId: application ? application.application_id : "",
    });
  }

  function appendTimeline(input) {
    state.timelineEvents.unshift({
      timeline_event_id: `tl_${state.timelineEvents.length + 1}_${Date.now()}`,
      ...input,
    });
  }

  function shortlistCandidateForApplication(input = {}) {
    const application = findApplication(input.applicationId || input.application_id);
    if (!application) throw new Error(`Application not found: ${input.applicationId || input.application_id || "missing"}`);
    const candidate = findCandidate(input.candidateId || application.candidate_id);
    if (!candidate) throw new Error(`Candidate not found: ${input.candidateId || application.candidate_id || "missing"}`);
    const now = input.created_at || "2026-07-29T13:00:00+08:00";
    const evidenceIds = [...new Set([...(application.evidence_ids || []), ...(candidate.evidence_ids || []), ...(input.evidence_ids || [])])];

    candidate.review_status = "Complete";
    candidate.profile_completeness = candidate.profile_completeness === "Missing Required" ? "Missing Required" : "Complete";
    candidate.updated_at = now;
    application.status = "Ready for Next Action";
    application.job_link_status = "Confirmed";
    application.next_action = "Schedule HR Interview for shortlisted candidate.";
    application.updated_at = now;

    let completedTask = null;
    if (input.taskStore && input.taskId && typeof input.taskStore.updateTask === "function") {
      completedTask = input.taskStore.updateTask(input.taskId, {
        status: "Done",
        completion_action: "Candidate shortlisted by HR; Application is ready for HR Interview scheduling.",
        completed_at: now,
        completed_by_user_id: input.actor_user_id || "user_linh_tran",
        updated_at: now,
      });
    }

    appendTimeline({
      target_type: "Application",
      target_id: application.application_id,
      event_type: "Shortlisted",
      description: "HR shortlisted the candidate for the current job and requested HR Interview scheduling.",
      actor_user_id: input.actor_user_id || "user_linh_tran",
      evidence_ids: evidenceIds,
      created_at: now,
    });

    const nextTask = createHrInterviewNextActionTask(input.taskStore, {
      jobId: application.job_id,
      candidateId: candidate.candidate_id,
      applicationId: application.application_id,
      ownerId: input.actor_user_id || application.owner_user_id || "user_linh_tran",
      createdAt: now,
    });

    return {
      candidate: cloneJson(candidate),
      application: cloneJson(application),
      completedTask,
      nextTask,
      timeline: relatedTimeline(candidate, application),
    };
  }

  function listCandidates() {
    return state.candidates.map(cloneJson);
  }

  function listApplications() {
    return state.applications.map(cloneJson);
  }

  function listEvidence() {
    return state.evidence.map(cloneJson);
  }

  function listTimelineEvents() {
    return state.timelineEvents.map(cloneJson);
  }

  return {
    getReviewContext,
    getInboxCandidateReviewEntry,
    applyReviewDecision,
    shortlistCandidateForApplication,
    applyInboxCandidateReviewAction,
    convertExceptionToTask,
    listCandidates,
    listApplications,
    listEvidence,
    listTimelineEvents,
  };
}

function inferExceptionTypeForTask(task) {
  if (task.task_type === "Missing Candidate Info") return "Missing Candidate Info";
  if (task.task_type === "Duplicate Review") return "Potential Duplicate";
  if (task.task_type === "Job Match Review") return "Job Match Unclear";
  if (task.task_type === "Inbox Review") return "Human Confirmation Needed";
  if (task.task_type === "Mailbox Disconnected") return "Mailbox Disconnected";
  return "";
}

function validateReviewExceptionType(exceptionType) {
  if (!REVIEW_EXCEPTION_TYPES.includes(exceptionType)) {
    throw new Error(`Unsupported review exception type: ${exceptionType || "missing"}`);
  }
}

function applyExceptionReviewState({ exceptionType, candidate, application, inboxItem, now }) {
  if (exceptionType === "Missing Candidate Info" || exceptionType === "Evidence Needed") {
    candidate.review_status = "Needs Info";
    candidate.profile_completeness = "Missing Required";
  } else if (exceptionType === "Resume Parse Failed") {
    candidate.review_status = "Parse Failed";
    candidate.profile_completeness = "Missing Required";
  } else if (exceptionType === "Potential Duplicate") {
    candidate.review_status = "Potential Duplicate";
  } else if (exceptionType === "Human Confirmation Needed") {
    candidate.review_status = "Reviewing";
  }
  candidate.updated_at = now;

  if (application) {
    if (exceptionType === "Job Match Unclear") {
      application.status = "Job Match Review";
      application.job_link_status = "Needs Review";
      application.next_action = "Confirm the intended job before application workflow proceeds.";
    } else if (exceptionType !== "Mailbox Disconnected") {
      application.status = "Waiting";
      application.job_link_status = application.job_link_status || "Needs Review";
      application.next_action = EXCEPTION_TASK_CONFIGS[exceptionType].nextAction;
    }
    application.updated_at = now;
  }

  if (inboxItem) {
    inboxItem.review_status = "Task Created";
    inboxItem.exception_type = exceptionType;
    if (exceptionType === "Resume Parse Failed") inboxItem.parse_status = "Failed";
    inboxItem.updated_at = now;
  }
}

function buildExceptionTaskPayload({ exceptionType, candidate, application, inboxItem, input = {}, now }) {
  const config = EXCEPTION_TASK_CONFIGS[exceptionType];
  const objectId = (inboxItem && inboxItem.inbox_item_id) ||
    (application && application.application_id) ||
    candidate.candidate_id;
  const evidenceIds = [...new Set([
    ...(inboxItem ? inboxItem.evidence_ids : []),
    ...(candidate ? candidate.evidence_ids : []),
    ...(application ? application.evidence_ids : []),
    ...(input.evidence_ids || []),
  ])];
  const jobId = (application && application.job_id) || (inboxItem && inboxItem.suggested_job_id) || "";

  return {
    task_id: `task_s3_${config.taskType.toLowerCase().replaceAll(" ", "_")}_${objectId}`,
    task_type: config.taskType,
    title: exceptionTaskTitle(exceptionType, candidate, jobId),
    status: input.status || "Open",
    priority: input.priority || config.priority,
    owner_role: input.owner_role || "HR Lead",
    owner_id: input.actor_user_id || input.owner_id || "user_linh_tran",
    due_at: input.due_at || "2026-07-29T10:00:00+08:00",
    source_module: config.sourceModule,
    related_job_id: jobId,
    related_candidate_id: candidate ? candidate.candidate_id : "",
    related_application_id: application ? application.application_id : "",
    related_inbox_item_id: inboxItem ? inboxItem.inbox_item_id : "",
    exception_type: exceptionType,
    next_action: input.next_action || config.nextAction,
    evidence_ids: evidenceIds,
    completion_action: input.completion_action || config.completionAction,
    related_objects: exceptionRelatedObjects(candidate, jobId, inboxItem, exceptionType),
    evidence_summary: [`${exceptionType} was converted from review state into a task.`],
    context_summary: `${exceptionType} should be handled in Tasks, not left as an Inbox-only exception.`,
    waiting_on: "",
    waiting_reason: "",
    writeback_preview: { targets: exceptionWritebackTargets(config.taskType), timeline_event: "Task Created" },
    created_at: now,
    updated_at: now,
  };
}

function upsertExceptionTask(taskStore, payload, now) {
  if (!taskStore || typeof taskStore.listTasks !== "function") return { task: null, created: false };
  const existing = findActiveExceptionTask(taskStore, payload);
  if (existing && typeof taskStore.updateTask === "function") {
    return {
      task: taskStore.updateTask(existing.task_id, {
        ...payload,
        task_id: existing.task_id,
        created_at: existing.created_at || payload.created_at,
        updated_at: now,
      }),
      created: false,
    };
  }
  if (typeof taskStore.createTask !== "function") return { task: null, created: false };
  if (taskStore.getTask && taskStore.getTask(payload.task_id)) {
    const taskCount = taskStore.listTasks({ view: "all" }).length + 1;
    payload = { ...payload, task_id: `${payload.task_id}_${taskCount}` };
  }
  return { task: taskStore.createTask(payload), created: true };
}

function findActiveExceptionTask(taskStore, payload) {
  return taskStore.listTasks({ view: "all" }).find((task) => {
    if (task.task_type !== payload.task_type || !isActiveTask(task)) return false;
    if (payload.related_inbox_item_id && task.related_inbox_item_id === payload.related_inbox_item_id) return true;
    if (payload.related_application_id && task.related_application_id === payload.related_application_id) return true;
    if (payload.related_candidate_id && task.related_candidate_id === payload.related_candidate_id) return true;
    return payload.source_module === "System" && task.source_module === "System";
  }) || null;
}

function exceptionTaskTitle(exceptionType, candidate, jobId) {
  if (exceptionType === "Mailbox Disconnected") return "重连招聘邮箱";
  const name = candidate && candidate.full_name ? candidate.full_name : "候选人";
  if (exceptionType === "Missing Candidate Info") return `补充 ${name} 资料`;
  if (exceptionType === "Resume Parse Failed") return `修复 ${name} 简历解析`;
  if (exceptionType === "Job Match Unclear") return `确认 ${name} 投递岗位`;
  if (exceptionType === "Potential Duplicate") return `处理 ${name} 重复`;
  if (exceptionType === "Evidence Needed") return `补充 ${name} 证据`;
  if (exceptionType === "Human Confirmation Needed") return `确认 ${name} 邮件`;
  return `处理 ${name} 异常${jobId ? `：${jobTitleFromId(jobId)}` : ""}`;
}

function exceptionRelatedObjects(candidate, jobId, inboxItem, exceptionType) {
  if (exceptionType === "Mailbox Disconnected") return ["recruiting@company.vn", "Mailbox Connection"];
  return [
    candidate && candidate.full_name,
    jobId && jobTitleFromId(jobId),
    inboxItem && inboxItem.raw_subject,
  ].filter(Boolean);
}

function exceptionWritebackTargets(taskType) {
  if (taskType === "Missing Candidate Info") return ["candidates", "tasks", "timeline_events"];
  if (taskType === "Duplicate Review" || taskType === "Candidate Review") return ["candidates", "timeline_events"];
  if (taskType === "Job Match Review") return ["applications", "timeline_events"];
  if (taskType === "Mailbox Disconnected") return ["tasks", "inbox_items", "timeline_events"];
  return ["inbox_items", "timeline_events"];
}

function jobTitleFromId(jobId) {
  return String(jobId || "")
    .replace(/^job_/, "")
    .split("_")
    .filter(Boolean)
    .map((part) => part ? part[0].toUpperCase() + part.slice(1) : "")
    .join(" ");
}

function inboxCandidateReviewActions() {
  return [
    { action: "confirm_complete", label: "Confirm material complete", writes: ["candidates", "applications", "inbox_items", "timeline_events"] },
    { action: "mark_missing_info", label: "Mark missing candidate material", writes: ["candidates", "applications", "inbox_items", "tasks", "timeline_events"] },
    { action: "mark_parse_failed", label: "Mark resume parse failed", writes: ["candidates", "applications", "inbox_items", "tasks", "timeline_events"] },
    { action: "mark_job_unclear", label: "Mark job uncertain", writes: ["applications", "inbox_items", "tasks", "timeline_events"] },
    { action: "mark_potential_duplicate", label: "Mark possible duplicate", writes: ["candidates", "inbox_items", "tasks", "timeline_events"] },
  ];
}

function inboxActionFromExceptionType(exceptionType) {
  return {
    "Missing Candidate Info": "mark_missing_info",
    "Resume Parse Failed": "mark_parse_failed",
    "Job Match Unclear": "mark_job_unclear",
    "Potential Duplicate": "mark_potential_duplicate",
  }[exceptionType] || "mark_job_unclear";
}

function missingCandidateFields(candidate, parsedCandidate = {}) {
  return [
    ["full_name", candidate.full_name || parsedCandidate.full_name],
    ["primary_email", candidate.primary_email || parsedCandidate.primary_email],
    ["phone", candidate.phone || parsedCandidate.phone],
    ["source_summary", candidate.source_summary || parsedCandidate.source_summary],
  ].filter(([, value]) => !value).map(([field]) => field);
}

function buildInboxExceptionHandoff({ inboxItem, candidate, application, action, input = {} }) {
  const config = {
    confirm_complete: {
      exceptionType: "",
      taskType: "Application Next Action",
      nextAction: "资料已完整，准备申请流程的下一步。",
    },
    mark_missing_info: {
      exceptionType: "Missing Candidate Info",
      taskType: "Missing Candidate Info",
      nextAction: "先补齐候选人资料，再继续推进。",
    },
    mark_parse_failed: {
      exceptionType: "Resume Parse Failed",
      taskType: "Inbox Review",
      nextAction: "修复简历解析，或重新要一份可用简历。",
    },
    mark_job_unclear: {
      exceptionType: "Job Match Unclear",
      taskType: "Job Match Review",
      nextAction: "先确认候选人投递哪个岗位。",
    },
    mark_potential_duplicate: {
      exceptionType: "Potential Duplicate",
      taskType: "Duplicate Review",
      nextAction: "先处理重复风险，再创建或修改申请。",
    },
  }[action] || {
    exceptionType: inboxItem.exception_type || "Human Confirmation Needed",
    taskType: "Inbox Review",
    nextAction: "审核候选人资料，再写入系统。",
  };

  return {
    target: "S3 Task Conversion",
    payload: {
      task_id: `task_s3_${config.taskType.toLowerCase().replaceAll(" ", "_")}_${candidate.candidate_id}`,
      task_type: config.taskType,
      status: action === "confirm_complete" ? "Open" : "Waiting",
      priority: config.exceptionType === "Potential Duplicate" ? "High" : "Medium",
      owner_role: "HR Lead",
      owner_id: input.actor_user_id || "user_linh_tran",
      due_at: input.due_at || "2026-07-29T10:00:00+08:00",
      source_module: "Inbox",
      related_job_id: (application && application.job_id) || inboxItem.suggested_job_id || "",
      related_candidate_id: candidate.candidate_id,
      related_application_id: application ? application.application_id : "",
      related_inbox_item_id: inboxItem.inbox_item_id,
      exception_type: config.exceptionType,
      next_action: config.nextAction,
      evidence_ids: [...new Set([...(inboxItem.evidence_ids || []), ...(input.evidence_ids || [])])],
      completion_action: action === "confirm_complete"
        ? "Prepare the next Application workflow action."
        : "Convert this Inbox exception into the matching task workflow.",
      missing_fields: [...(input.missing_fields || [])],
      duplicate_candidate_ids: [...(input.duplicate_candidate_ids || [])],
    },
  };
}

function updateRelatedTask(taskStore, { candidate, application, inboxItem, taskType, status, action, now }) {
  if (!taskStore || typeof taskStore.listTasks !== "function" || typeof taskStore.updateTask !== "function") return null;
  const task = taskStore.listTasks({ view: "all" }).find((item) => (
    item.task_type === taskType &&
    item.source_module === "Inbox" &&
    item.related_candidate_id === candidate.candidate_id &&
    (!application || !item.related_application_id || item.related_application_id === application.application_id)
  ));
  if (!task) return null;
  return taskStore.updateTask(task.task_id, {
    status,
    related_inbox_item_id: inboxItem.inbox_item_id,
    exception_type: action === "confirm_complete" ? "" : inferExceptionTypeForTask({ task_type: taskType }),
    waiting_on: status === "Waiting" ? task.owner_role : "",
    waiting_reason: status === "Waiting" ? task.next_action : "",
    writeback_result: {
      action,
      related_inbox_item_id: inboxItem.inbox_item_id,
    },
    completed_at: status === "Done" ? now : "",
    completed_by_user_id: status === "Done" ? task.owner_id : "",
    updated_at: now,
  });
}

function upsertHandoffTask(taskStore, payload, now) {
  const taskPayload = {
    task_id: payload.task_id,
    task_type: payload.task_type,
    title: inboxHandoffTaskTitle(payload),
    status: payload.status,
    priority: payload.priority,
    owner_role: payload.owner_role,
    owner_id: payload.owner_id,
    due_at: payload.due_at,
    source_module: payload.source_module,
    related_job_id: payload.related_job_id,
    related_candidate_id: payload.related_candidate_id,
    related_application_id: payload.related_application_id,
    related_inbox_item_id: payload.related_inbox_item_id,
    exception_type: payload.exception_type,
    next_action: payload.next_action,
    evidence_ids: payload.evidence_ids,
    completion_action: payload.completion_action,
    waiting_on: payload.owner_role,
    waiting_reason: payload.next_action,
    writeback_preview: { targets: ["tasks", "timeline_events"], timeline_event: "Task Created" },
    created_at: now,
    updated_at: now,
  };
  return upsertExceptionTask(taskStore, taskPayload, now).task;
}

function inboxHandoffTaskTitle(payload) {
  const name = candidateNameFromId(payload.related_candidate_id);
  if (payload.exception_type === "Missing Candidate Info") return `补充 ${name} 资料`;
  if (payload.exception_type === "Resume Parse Failed") return `修复 ${name} 简历解析`;
  if (payload.exception_type === "Job Match Unclear") return `确认 ${name} 投递岗位`;
  if (payload.exception_type === "Potential Duplicate") return `处理 ${name} 重复`;
  return `审核 ${name} 资料`;
}

function createPublishedJobFollowupTask(taskStore, input = {}) {
  return createCandidateScreeningTask(taskStore, {
    jobId: input.jobId,
    jobTitle: input.jobTitle,
    candidateId: input.candidateId || "cand_trang_nguyen",
    applicationId: input.applicationId || "app_trang_backend",
    ownerId: input.ownerId,
    dueAt: input.dueAt,
  });
}

function createCandidateScreeningTask(taskStore, input = {}) {
  if (!taskStore || typeof taskStore.createTask !== "function") return null;
  const candidateId = input.candidateId || input.candidate_id || "";
  const applicationId = input.applicationId || input.application_id || "";
  const jobId = input.jobId || input.job_id || "";
  const taskId = input.taskId || `task_candidate_screening_${applicationId || candidateId || jobId || Date.now()}`;
  const candidateName = candidateNameFromId(candidateId);
  const jobTitle = input.jobTitle || jobTitleFromId(jobId) || "Published Job";
  const payload = {
    task_id: taskId,
    task_type: "Candidate Review",
    title: candidateId ? `筛选 ${candidateName}` : `筛选 ${jobTitle} 候选人`,
    status: input.status || "Open",
    priority: input.priority || "High",
    owner_role: input.ownerRole || "HR Lead",
    owner_id: input.ownerId || "user_linh_tran",
    due_at: input.dueAt || "2026-07-29T13:00:00+08:00",
    source_module: "Candidate",
    related_job_id: jobId,
    related_candidate_id: candidateId,
    related_application_id: applicationId,
    next_action: "Review candidate basics, current application, evidence, and decide Shortlist / Reject / Need More Info.",
    evidence_ids: input.evidenceIds || ["ev_source_email", "ev_parsed_candidate_fields", "ev_screening_criteria_set"],
    completion_action: "Shortlist creates the HR Interview scheduling task; Reject or Need More Info keeps the workflow accountable.",
    related_objects: [candidateId ? candidateName : "Mock candidate", jobTitle, "Candidate Screening"],
    evidence_summary: [
      "Candidate Screening is HR-confirmed.",
      "AI can recommend, but HR owns Shortlist / Reject / Need More Info.",
      "Application receives the workflow status; Candidate remains the person record.",
    ],
    context_summary: `${candidateId ? candidateName : "Candidate"} is ready for HR screening against ${jobTitle}.`,
    created_at: input.createdAt || "2026-07-29T12:00:00+08:00",
    updated_at: input.createdAt || "2026-07-29T12:00:00+08:00",
  };
  if (taskStore.getTask && taskStore.getTask(taskId) && typeof taskStore.updateTask === "function") {
    return taskStore.updateTask(taskId, payload);
  }
  return taskStore.createTask(payload);
}

function createHrInterviewNextActionTask(taskStore, input = {}) {
  if (!taskStore || typeof taskStore.createTask !== "function") return null;
  const applicationId = input.applicationId || input.application_id || "";
  const candidateId = input.candidateId || input.candidate_id || "";
  const jobId = input.jobId || input.job_id || "";
  const taskId = `task_hr_interview_${applicationId || candidateId || Date.now()}`;
  const payload = {
    task_id: taskId,
    task_type: "Application Next Action",
    title: `安排 ${candidateNameFromId(candidateId)} HR Interview`,
    status: "Open",
    priority: "High",
    owner_role: "HR Lead",
    owner_id: input.ownerId || "user_linh_tran",
    due_at: input.dueAt || "2026-07-29T15:00:00+08:00",
    source_module: "Application",
    related_job_id: jobId,
    related_candidate_id: candidateId,
    related_application_id: applicationId,
    next_action: "Schedule HR Interview for shortlisted candidate.",
    evidence_ids: input.evidenceIds || ["ev_application_stage_ready", "ev_screening_criteria_set"],
    completion_action: "HR Interview scheduled and written to the Application timeline.",
    related_objects: [candidateNameFromId(candidateId), jobTitleFromId(jobId), "HR Interview"],
    evidence_summary: ["Candidate was shortlisted by HR.", "Next action is scheduling, not automatic communication."],
    context_summary: "Shortlist moved this Application into HR Interview scheduling.",
    created_at: input.createdAt || "2026-07-29T13:00:00+08:00",
    updated_at: input.createdAt || "2026-07-29T13:00:00+08:00",
  };
  if (taskStore.getTask && taskStore.getTask(taskId) && typeof taskStore.updateTask === "function") {
    return taskStore.updateTask(taskId, payload);
  }
  return taskStore.createTask(payload);
}

function candidateNameFromId(candidateId) {
  return {
    cand_quang_do: "Quang Do",
    cand_lan_pham: "Lan Pham",
    cand_trang_nguyen: "Trang Nguyen",
    cand_anh_le: "Anh Le",
    cand_minh_pham: "Minh Pham",
  }[candidateId] || "候选人";
}

const browserTaskStorage = typeof window !== "undefined" ? window.localStorage : null;
if (typeof window !== "undefined") {
  resetTaskStoreStorageFromLocation(browserTaskStorage, window.location);
}
const taskStore = createTaskStore(seedTasks, { storage: browserTaskStorage });
const reviewStateStore = createReviewStateStore();

const taskCore = {
  MVP_TASK_TYPES,
  MVP_TASK_DETAIL_ACTIONS,
  TASK_STATUSES,
  ACTIVE_TASK_STATUSES,
  TASK_SOURCE_MODULES,
  CANDIDATE_PROFILE_COMPLETENESS,
  CANDIDATE_REVIEW_STATUSES,
  APPLICATION_STATUSES,
  APPLICATION_JOB_LINK_STATUSES,
  REVIEW_EXCEPTION_TYPES,
  REQUIRED_TASK_FIELDS,
  createTaskDetailModel,
  createTaskStore,
  createReviewStateStore,
  createPublishedJobFollowupTask,
  createCandidateScreeningTask,
  createHrInterviewNextActionTask,
  resetTaskStoreStorageFromLocation,
  taskStore,
  reviewStateStore,
};

if (typeof window !== "undefined") {
  window.HireOSTasks = taskCore;
}

if (typeof module !== "undefined") {
  module.exports = taskCore;
}

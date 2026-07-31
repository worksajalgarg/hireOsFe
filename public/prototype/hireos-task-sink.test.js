const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  TASK_STATUSES,
  createTaskStore,
} = require("./hireos-tasks-data.js");

const {
  TASK_WRITEBACK_TYPES,
  createApplicationDetailModel,
  createTaskApplicationSnapshot,
  applyTaskResultToApplication,
  completedTasksFromStore,
} = require("./hireos-task-sink.js");

test("supports the MVP task writeback type set", () => {
  assert.deepEqual(TASK_WRITEBACK_TYPES, [
    "Application Next Action",
    "Blocked Resolution",
  ]);
});

test("task sink consumes only the Task Core status contract", () => {
  assert.deepEqual(TASK_STATUSES, ["Open", "In Progress", "Waiting", "Done", "Cancelled"]);
  const store = createTaskStore([
    contractTask({ task_id: "task_open", status: "Open" }),
    contractTask({ task_id: "task_waiting", status: "Waiting" }),
    contractTask({ task_id: "task_done", status: "Done" }),
    contractTask({ task_id: "task_cancelled", status: "Cancelled" }),
  ]);

  assert.deepEqual(completedTasksFromStore(store).map((task) => task.task_id), ["task_done"]);
});

test("application next action task updates owner, next action, due date, timeline, and evidence from Task Core fields", () => {
  const app = createTaskApplicationSnapshot().applications[0];
  const updated = applyTaskResultToApplication(app, contractTask({
    task_id: "task_next_1",
    task_type: "Application Next Action",
    title: "Confirm Hiring Manager follow-up",
    status: "Done",
    owner_role: "Hiring Manager",
    owner_id: "user_hiring_manager",
    due_at: "2026-07-29T17:00:00+08:00",
    related_application_id: "app_trang_backend",
    next_action: "Confirm Hiring Manager follow-up questions",
    evidence_ids: ["email-thread-trang-availability"],
    completion_action: "Keep application in review and record candidate availability.",
  }));

  assert.equal(updated.currentState, "Hiring Manager Review");
  assert.equal(updated.owner, "Hiring Manager");
  assert.equal(updated.nextAction, "Confirm Hiring Manager follow-up questions");
  assert.equal(updated.dueDate, "2026-07-29T17:00:00+08:00");
  assert.equal(updated.evidence[0].id, "email-thread-trang-availability");
  assert.equal(updated.linkedTasks[0].id, "task_next_1");
  assert.equal(updated.linkedTasks[0].status, "Done");
  assert.equal(updated.recentTaskRecords[0].type, "Application Next Action");
  assert.match(updated.timeline[0].summary, /Hiring Manager follow-up/);
});

test("blocked resolution returns application to prior state and records resolution", () => {
  const app = createTaskApplicationSnapshot().applications[3];
  const updated = applyTaskResultToApplication(app, contractTask({
    task_id: "task_blocked_1",
    task_type: "Blocked Resolution",
    title: "Resolve missing owner",
    status: "Done",
    owner_role: "HR Lead",
    owner_id: "user_linh_tran",
    due_at: "2026-07-29T16:00:00+08:00",
    related_application_id: "app_quang_platform",
    next_action: "Confirm Platform job match",
    evidence_ids: ["inbox-review-quang-platform"],
    completion_action: "Owner assigned and low-confidence match sent to HR review.",
  }));

  assert.equal(updated.currentState, "Needs HR Review");
  assert.equal(updated.owner, "HR Lead");
  assert.equal(updated.sla, "On Track");
  assert.equal(updated.timeline[0].eventType, "Blocked Resolution");
});

test("snapshot applies Done tasks from the global task store contract", () => {
  const store = createTaskStore([
    contractTask({
      task_id: "task_open_anh",
      task_type: "Application Next Action",
      status: "Open",
      related_application_id: "app_anh_designer",
      next_action: "Collect feedback",
      evidence_ids: ["ev_feedback_missing"],
    }),
    contractTask({
      task_id: "task_done_anh",
      task_type: "Application Next Action",
      status: "Done",
      related_application_id: "app_anh_designer",
      next_action: "Review design exercise against rubric",
      evidence_ids: ["ev_interview_feedback"],
      completion_action: "Attach feedback evidence and move the application to the next pipeline state.",
    }),
  ]);
  const app = createTaskApplicationSnapshot(store).applicationsAfterTasks.find((item) => item.id === "app_anh_designer");

  assert.equal(app.currentState, "Ready for Next Action");
  assert.equal(app.linkedTasks[0].status, "Done");
  assert.equal(app.linkedTasks.some((task) => task.id === "task_open_anh"), true);
  assert.equal(app.linkedTasks.some((task) => task.id === "task_done_anh"), true);
});

test("applications and detail pages consume the task sink renderer", () => {
  const applicationsHtml = fs.readFileSync(path.join(__dirname, "hireos-applications.html"), "utf8");
  const detailHtml = fs.readFileSync(path.join(__dirname, "hireos-application-detail.html"), "utf8");

  assert.match(applicationsHtml, /hireos-task-sink\.js/);
  assert.match(applicationsHtml, /hireos-tasks-data\.js[\s\S]*hireos-task-sink\.js/);
  assert.match(applicationsHtml, /data-task-sink="applications-table"/);
  assert.match(applicationsHtml, /data-task-sink="recent-task-timeline"/);
  assert.match(detailHtml, /hireos-task-sink\.js/);
  assert.match(detailHtml, /hireos-tasks-data\.js[\s\S]*hireos-task-sink\.js/);
  assert.match(detailHtml, /data-task-sink="application-detail"/);
  assert.match(detailHtml, /data-task-contract-note/);
});

test("application detail refreshes when task store changes in another tab", () => {
  const taskSinkJs = fs.readFileSync(path.join(__dirname, "hireos-task-sink.js"), "utf8");

  assert.match(taskSinkJs, /addEventListener\("storage"/);
  assert.match(taskSinkJs, /hireos-task-store-v1/);
  assert.match(taskSinkJs, /bootTaskSinkPage\(\)/);
});

test("application detail model exposes candidate, workflow, evidence, task links, and human decision boundary", () => {
  const application = createTaskApplicationSnapshot().applicationsAfterTasks.find((item) => item.id === "app_trang_backend");
  const detail = createApplicationDetailModel(application);

  assert.equal(detail.title, "Trang Nguyen · Senior Backend Engineer");
  assert.equal(detail.candidate.name, "Trang Nguyen");
  assert.equal(detail.application.job, "Senior Backend Engineer");
  assert.equal(detail.workflow.currentState, "Hiring Manager Review");
  assert.equal(detail.workflow.owner, "Hiring Manager");
  assert.equal(detail.workflow.nextAction, "Confirm follow-up questions");
  assert.equal(detail.workflow.sla, "Today");
  assert.ok(detail.evidence.length >= 2);
  assert.ok(detail.timeline.length >= 2);
  assert.ok(detail.recommendation.summary);
  assert.equal(detail.recommendation.humanDecisionRequired, true);
  assert.match(detail.recommendation.boundary, /AI can recommend/i);
  assert.match(detail.workflowPreview.nextTask, /Application Next Action|Hiring Manager/);
});

test("application detail model preserves the approved candidate detail middle-section design", () => {
  const application = createTaskApplicationSnapshot().applicationsAfterTasks.find((item) => item.id === "app_trang_backend");
  const detail = createApplicationDetailModel(application);

  assert.deepEqual(detail.middleSections.map((section) => section.title), [
    "候选人基本信息",
    "面试流程与状态",
    "AI Summary",
  ]);
  assert.deepEqual(detail.summaryCards.map((card) => card.title), [
    "候选人",
    "当前申请",
    "联系方式",
    "岗位匹配",
  ]);
  assert.equal(detail.workflowSteps.at(-1).status, "待安排");
  assert.equal(detail.workflowSteps.at(-1).tone, "current");
  assert.match(detail.aiSummary.body, /可参考的证据/);
  assert.match(detail.aiSummary.body, /人工确认/);
});

test("application detail page renders only the approved candidate-detail middle sections", () => {
  const taskSinkJs = fs.readFileSync(path.join(__dirname, "hireos-task-sink.js"), "utf8");

  assert.match(taskSinkJs, /候选人基本信息/);
  assert.match(taskSinkJs, /面试流程与状态/);
  assert.match(taskSinkJs, /AI Summary/);
  assert.doesNotMatch(taskSinkJs, /application-detail-sidebar/);
  assert.doesNotMatch(taskSinkJs, /Ownership \/ SLA/);
  assert.doesNotMatch(taskSinkJs, /<h2>Linked Tasks<\/h2>/);
  assert.doesNotMatch(taskSinkJs, /<h2>Next Workflow Preview<\/h2>/);
  assert.doesNotMatch(taskSinkJs, /<h2>Audit<\/h2>/);
  assert.doesNotMatch(taskSinkJs, /<h2>证据与上下文<\/h2>/);
  assert.doesNotMatch(taskSinkJs, /<h2>申请时间线<\/h2>/);
}
);

test("application detail page stays a context surface, not a primary navigation module", () => {
  const detailHtml = fs.readFileSync(path.join(__dirname, "hireos-application-detail.html"), "utf8");

  assert.match(detailHtml, /data-application-title/);
  assert.match(detailHtml, /data-application-subtitle/);
  assert.match(detailHtml, /data-task-sink="application-detail"/);
  assert.match(detailHtml, /基于当前上下文提问/);
  assert.doesNotMatch(detailHtml, /<strong data-task-contract-note>高/);
  assert.doesNotMatch(detailHtml, /Task-first tracking/);
  assert.doesNotMatch(detailHtml, /hireos-applications\.html[\s\S]*<span>Applications<\/span>/);
  assert.doesNotMatch(detailHtml, /hireos-candidates\.html[\s\S]*<span>Candidates<\/span>/);
});

test("JD Agent keeps document writes behind local intent and adoption guards", () => {
  const pagesJs = fs.readFileSync(path.join(__dirname, "hireos-pages.js"), "utf8");

  assert.match(pagesJs, /function isAdoptionMessage/);
  assert.match(pagesJs, /function modelPatchAllowedForMessage/);
  assert.match(pagesJs, /function rememberPendingDocumentProposal/);
  assert.match(pagesJs, /function acceptPendingDocumentProposal/);
  assert.match(pagesJs, /modelPatchAllowedForMessage\(result, latestMessage, localPatch, localIntent\)/);
  assert.match(pagesJs, /acceptPendingDocumentProposal\(/);
});

test("JD Agent extraction covers unordered facts and expected start date phrasing", () => {
  const pagesJs = fs.readFileSync(path.join(__dirname, "hireos-pages.js"), "utf8");

  assert.match(pagesJs, /最好\|希望\|尽量\|需要\|要求\|可/);
  assert.match(pagesJs, /startDate/);
  assert.match(pagesJs, /salaryRange/);
  assert.match(pagesJs, /reportTo/);
  assert.match(pagesJs, /teamSize/);
  assert.match(pagesJs, /employmentType/);
  assert.match(pagesJs, /patch\.workTime[\s\S]*全职\|兼职\|合同制/);
});

test("JD Agent discussion fallback answers role questions without document artifact cards", () => {
  const pagesJs = fs.readFileSync(path.join(__dirname, "hireos-pages.js"), "utf8");
  const discussionBlock = pagesJs.match(/function renderDiscussionResponse[\s\S]*?function renderPolishResponse/)?.[0] || "";

  assert.match(pagesJs, /Finance Director.*财务总监|财务总监[\s\S]*Finance Director/);
  assert.match(pagesJs, /finan\?ce\\s\*director/);
  assert.match(pagesJs, /function roleDiscussionAdviceForMessage/);
  assert.doesNotMatch(discussionBlock, /createDraftArtifactCard/);
  assert.match(discussionBlock, /roleDiscussionAdviceForMessage\(message\)/);
});

test("JD Agent uses a fixed artifact rail instead of inline document cards", () => {
  const pagesJs = fs.readFileSync(path.join(__dirname, "hireos-pages.js"), "utf8");
  const structuredBlock = pagesJs.match(/function renderStructuredAgentDecision[\s\S]*?function renderGeneralAgentResponse/)?.[0] || "";
  const artifactCardBlock = pagesJs.match(/function createDraftArtifactCard[\s\S]*?function nextActionList/)?.[0] || "";

  assert.match(pagesJs, /const artifactRail = document\.createElement\("div"\)/);
  assert.match(pagesJs, /function renderArtifactRail/);
  assert.match(pagesJs, /function selectDraftArtifact/);
  assert.match(structuredBlock, /roleDiscussionAdviceForMessage\(latestMessage\)/);
  assert.match(artifactCardBlock, /return ""/);
  assert.match(pagesJs, /agent-rail-card/);
  assert.match(structuredBlock, /nextActionList\(roleAdvice\?\.actions \|\| structuredActions\(result\)\)/);
});

test("JD Agent supports SendEmail commands for plain text and JD references", () => {
  const pagesJs = fs.readFileSync(path.join(__dirname, "hireos-pages.js"), "utf8");
  const pagesCss = fs.readFileSync(path.join(__dirname, "hireos-pages.css"), "utf8");

  assert.match(pagesJs, /function parseSendEmailCommand/);
  assert.match(pagesJs, /function parseSendEmailSkillInput/);
  assert.match(pagesJs, /function setComposeSkill/);
  assert.match(pagesJs, /function setComposeJdReference/);
  assert.match(pagesJs, /function composeJdArtifact/);
  assert.match(pagesJs, /@SendEmail:\\\+\(\[\^\+\]\+\)\\\+\(\[\\s\\S\]\+\)/);
  assert.match(pagesJs, /messageType: "text"/);
  assert.match(pagesJs, /messageType: "jd_reference"/);
  assert.match(pagesJs, /function resolveEmailJdReference/);
  assert.match(pagesJs, /function renderUserTurnContent/);
  assert.match(pagesJs, /agent-message-token/);
  assert.match(pagesJs, /agent-skill-popover/);
  assert.match(pagesJs, /agent-compose-skill-chip/);
  assert.match(pagesJs, /agent-compose-jd-references/);
  assert.match(pagesJs, /agent-compose-jd-token/);
  assert.match(pagesJs, /skillChip\.setAttribute\("data-no-translate", ""\)/);
  assert.match(pagesJs, /skillChip\.innerHTML = `<span>SendEmail<\/span><i data-lucide="x"><\/i>`/);
  assert.doesNotMatch(pagesJs, /skillChip\.innerHTML = `<i data-lucide="mail">/);
  assert.match(pagesJs, /收件邮箱 \+ 邮件内容/);
  assert.match(pagesJs, /data-agent-compose-skill="send_email"/);
  assert.match(pagesJs, /activeComposeSkill === "send_email"/);
  assert.match(pagesJs, /setComposeJdReference\(selectedDraftArtifactId\)/);
  assert.match(pagesJs, /setComposeJdReference\(artifact\.id\)/);
  assert.match(pagesJs, /handleSendEmailCommand\(sendEmailCommand\)/);
  assert.match(pagesCss, /\.agent-skill-popover/);
  assert.match(pagesCss, /\.agent-compose-skill-chip/);
  assert.match(pagesCss, /\.agent-compose-jd-token/);
  assert.match(pagesCss, /\.compose-box\.has-skill\.has-jd-reference/);
  assert.match(pagesCss, /\.agent-compose-skill-chip svg:last-child[\s\S]*width: 12px/);
  assert.match(pagesCss, /\.compose-box\.has-skill/);
});

test("tasks page exposes JD draft box and preview publish/save actions", () => {
  const tasksHtml = fs.readFileSync(path.join(__dirname, "hireos-tasks.html"), "utf8");
  const pagesJs = fs.readFileSync(path.join(__dirname, "hireos-pages.js"), "utf8");
  const pagesCss = fs.readFileSync(path.join(__dirname, "hireos-pages.css"), "utf8");

  assert.doesNotMatch(tasksHtml, /负责人登录后的第一工作台/);
  assert.match(tasksHtml, /data-jd-drafts-open/);
  assert.match(tasksHtml, /JD Draft/);
  assert.doesNotMatch(tasksHtml, /topbar[\s\S]{0,240}data-jd-drafts-open/);
  assert.match(tasksHtml, /task-board-tabs[\s\S]*data-task-view="jd_drafts"[\s\S]*data-jd-drafts-open/);
  const taskTabsBlock = tasksHtml.match(/<div class="secondary-tabs task-board-tabs"[\s\S]*?<\/div>/)?.[0] || "";
  assert.match(taskTabsBlock, /data-task-view="my_tasks"[\s\S]*data-task-view="all_tasks"[\s\S]*data-task-view="today"/);
  assert.doesNotMatch(taskTabsBlock.replace(/<button class="secondary-tab task-board-tab jd-drafts-button"[\s\S]*?<\/button>/, ""), /<i data-lucide=/);
  assert.match(pagesJs, /jdDraftStorageKey/);
  assert.match(pagesJs, /activeTaskView === "jd_drafts"/);
  assert.match(pagesJs, /class="task-card jd-draft-task-card"/);
  assert.match(pagesJs, /filter\(\(draft\) => draft\.status !== "published"\)/);
  assert.match(pagesJs, /function createPublishedJdTask/);
  assert.match(pagesJs, /task_type: "Job Ready for Intake"/);
  assert.match(pagesJs, /title: "发布岗位并导入简历"/);
  assert.match(pagesJs, /createPublishedJdTask\(record\)/);
  assert.match(pagesJs, /activeTaskView = "my_tasks"/);
  assert.match(pagesJs, /window\.confirm\(`确认发布/);
  assert.match(pagesJs, /agent-preview-publish-button/);
  assert.match(pagesJs, /function saveJdDraftRecord/);
  assert.match(pagesJs, /function renderJdDraftsPanel/);
  assert.match(pagesJs, /function publishCurrentJd/);
  assert.match(pagesJs, /data-agent-preview-publish/);
  assert.match(pagesJs, /saveJdDraftRecord\(documentDraft, documentNode\.outerHTML, "draft"\)/);
  assert.match(pagesJs, /saveJdDraftRecord\(documentDraft, html, "published"\)/);
  assert.match(pagesCss, /\.jd-drafts-panel/);
  assert.match(pagesCss, /\.jd-draft-item/);
  assert.match(pagesCss, /\.jd-drafts-button/);
  assert.match(pagesCss, /\.jd-drafts-button[\s\S]*margin-left: auto/);
});

test("JD Agent greeting response stays conversational and does not create a preview artifact", () => {
  const pagesJs = fs.readFileSync(path.join(__dirname, "hireos-pages.js"), "utf8");
  const generalBlock = pagesJs.match(/function renderGeneralAgentResponse[\s\S]*?function renderUnrecognizedJobInput/)?.[0] || "";

  assert.match(pagesJs, /function isGreetingMessage/);
  assert.match(generalBlock, /isGreetingMessage\(message\)/);
  assert.match(generalBlock, /创建 JD|创建岗位说明书|岗位说明书/);
});

function contractTask(overrides = {}) {
  return {
    task_id: "task_contract_default",
    task_type: "Application Next Action",
    title: "Complete application task",
    status: "Done",
    priority: "High",
    owner_role: "HR Lead",
    owner_id: "user_linh_tran",
    due_at: "2026-07-28T15:00:00+08:00",
    source_module: "Application",
    related_job_id: "job_senior_backend",
    related_candidate_id: "cand_trang_nguyen",
    related_application_id: "app_trang_backend",
    next_action: "Send Hiring Manager follow-up questions",
    evidence_ids: ["ev_task_result"],
    completion_action: "Record task completion on the application timeline.",
    context_summary: "Task context",
    related_objects: ["Trang Nguyen", "Senior Backend Engineer"],
    evidence_summary: ["Evidence summary"],
    ...overrides,
  };
}

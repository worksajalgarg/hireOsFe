(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.HireOSTaskSink = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const TASK_WRITEBACK_TYPES = [
    "Application Next Action",
    "Blocked Resolution",
  ];

  const TASK_STATUS_DONE = "Done";
  const TASK_STORE_STORAGE_KEY = "hireos-task-store-v1";
  const DEFAULT_TASK_CONTRACT_NOTE =
    "Session A alignment: consumes window.HireOSTasks.taskStore records from docs/task-core-contract.md.";

  function createTaskApplicationSnapshot(taskStore) {
    const applications = seedApplications();
    const tasks = allTasksFromStore(taskStore || getGlobalTaskStore());
    const applicationsWithTasks = attachTasksToApplications(applications, tasks);
    const doneTasks = completedTasksFromList(tasks);
    const applicationsAfterTasks = doneTasks.reduce((items, task) => {
      return items.map((application) =>
        application.id === task.related_application_id ? applyTaskResultToApplication(application, task) : application
      );
    }, applicationsWithTasks);

    return {
      contractNote: DEFAULT_TASK_CONTRACT_NOTE,
      applications,
      tasks,
      completedTasks: doneTasks,
      applicationsAfterTasks,
    };
  }

  function createApplicationDetailModel(application) {
    if (!application) throw new Error("Application detail requires an application record.");
    const requiresHiringManager = application.currentState === "Hiring Manager Review";
    const evidenceGap = inferEvidenceGap(application);
    const workflowSteps = workflowStepsForApplication(application);
    const recommendationSummary = recommendationForApplication(application, evidenceGap);
    const verifiedSummary = stripTerminalPunctuation(application.verifiedSignals || "后端架构、调试深度、书面沟通、API ownership");
    const evidenceGapSummary = stripTerminalPunctuation(evidenceGap);
    return {
      id: application.id,
      title: `${application.candidate} · ${application.job}`,
      subtitle: "候选人基本信息、AI Summary、面试流程与状态。",
      candidate: {
        name: application.candidate,
        summary: application.candidateSummary,
        email: application.candidateEmail,
        location: application.candidateLocation || "Ho Chi Minh",
        workMode: application.workMode || "Hybrid",
      },
      application: {
        job: application.job,
        state: application.currentState,
        previousState: application.previousState || "",
      },
      basicInfo: {
        rows: [
          ["姓名", application.candidate],
          ["申请职位", application.job],
          ["地点", application.candidateLocation || "Ho Chi Minh"],
          ["Owner", application.owner],
          ["联系方式", application.candidateEmail],
          ["简历详情", application.candidateSummary],
          ["HR 反馈", application.hrFeedback || "HR 已确认基础条件、薪资范围和英语协作，建议进入下一步人工确认。"],
        ],
      },
      workflow: {
        currentState: application.currentState,
        owner: application.owner,
        ownerId: application.ownerId,
        nextAction: application.nextAction,
        dueDate: application.dueDate || "Due date missing",
        sla: application.sla,
      },
      evidence: application.evidence || [],
      linkedTasks: application.linkedTasks || [],
      timeline: application.timeline || [],
      recommendation: {
        summary: recommendationSummary,
        evidenceGap,
        humanDecisionRequired: requiresHiringManager,
        boundary: "AI can recommend the next step, but HR or the Hiring Manager must confirm candidate progress.",
      },
      aiSummary: {
        body: `${recommendationSummary} 目前可参考的证据包括 ${verifiedSummary}；当前还需要补齐 ${evidenceGapSummary}。AI 仅提供下一步判断摘要，候选人推进或关闭仍需 HR / Hiring Manager 人工确认。`,
      },
      middleSections: [
        { title: "候选人基本信息", subtitle: "只展示判断当前申请所需的候选人和岗位信息" },
        { title: "面试流程与状态", subtitle: "当前申请在该岗位下的阶段、负责人、下一步和 SLA" },
        { title: "AI Summary", subtitle: "AI 汇总 CV、面试反馈和证据缺口，辅助人工确认下一步" },
      ],
      summaryCards: [
        {
          title: "候选人",
          body: application.candidateSummary,
          pills: ["高匹配", "CV 已解析"],
          tone: "green",
        },
        {
          title: "当前申请",
          body: `${application.job} · ${application.currentState} · 当前负责人为 ${application.owner}。`,
          pills: ["负责人已设置", application.sla === "Today" ? "今天到期" : application.sla],
          tone: "warn",
        },
        {
          title: "联系方式",
          body: `${application.candidateEmail} · ${application.candidateLocation || "Ho Chi Minh"} · 可接受 ${application.workMode || "Hybrid"}。`,
          pills: ["Email 来源", "可入职时间待确认"],
          tone: "",
        },
        {
          title: "岗位匹配",
          body: application.jobFitSummary || "AI 从 CV、邮件和任务证据中识别到岗位关键能力匹配。",
          pills: [application.matchConfidence || "94% 置信度", "证据已关联"],
          tone: "green",
        },
      ],
      workflowSteps,
      recommendationCards: [
        {
          title: "推荐动作",
          body: recommendationSummary,
          pill: requiresHiringManager ? "确认" : "推进",
          tone: requiresHiringManager ? "warn" : "green",
        },
        {
          title: "已验证",
          body: application.verifiedSignals || "后端架构、调试深度、书面沟通、API ownership。",
          pill: "强",
          tone: "green",
        },
        {
          title: "仍需验证",
          body: evidenceGap,
          pill: "缺口",
          tone: "warn",
        },
        {
          title: "决策边界",
          body: "AI 只能建议下一步，候选人推进或关闭必须由 HR / Hiring Manager 确认。",
          pill: "人工",
          tone: "",
        },
      ],
      workflowPreview: {
        nextTask: nextTaskForApplication(application),
        nextOwner: nextOwnerForApplication(application),
        nextDue: application.dueDate || "Set due date from the next task SLA.",
        timelineWrite: "Task completion writes owner, next action, evidence, and decision notes back to Application Timeline.",
        candidateMessage: "No candidate message is sent from this detail page unless a separate communication task is approved.",
      },
      audit: [
        ["Application", application.id],
        ["Evidence", `${(application.evidence || []).length} records`],
        ["Linked tasks", `${(application.linkedTasks || []).length} tasks`],
      ],
    };
  }

  function seedApplications() {
    return [
      {
        id: "app_trang_backend",
        candidate: "Trang Nguyen",
        candidateSummary: "Backend engineer with fintech API and distributed systems evidence.",
        candidateEmail: "trang.nguyen@mail.vn",
        candidateLocation: "Ho Chi Minh",
        workMode: "hybrid",
        job: "Senior Backend Engineer",
        currentState: "Hiring Manager Review",
        owner: "Hiring Manager",
        ownerId: "user_hiring_manager",
        nextAction: "Confirm follow-up questions",
        dueDate: "2026-07-28T17:00:00+08:00",
        sla: "Today",
        jobFitSummary: "AI 从 CV 和邮件附件中识别到后端架构、API 设计和调试经验。",
        matchConfidence: "94% 置信度",
        hrFeedback: "HR 已确认基础条件、薪资范围和英语协作；建议 Hiring Manager 在终面重点确认高压领导力。",
        verifiedSignals: "后端架构、调试深度、书面沟通、API ownership。",
        evidence: [
          evidence("ev_assessment_v2", "Assessment", "Assessment v2 parsed", "System design, debugging, and API ownership evidence."),
          evidence("ev_tech_interview", "Interview Feedback", "Tech interview feedback", "Architecture and debugging signal confirmed."),
        ],
        linkedTasks: [],
        recentTaskRecords: [],
        timeline: [
          event("2026-07-28T10:42:00+08:00", "Assessment Review", "Assessment parsed", "System design and debugging evidence extracted.", "ev_assessment_v2"),
          event("2026-07-28T09:18:00+08:00", "Interview Feedback", "Interview feedback linked", "Evidence gap reduced for backend ownership.", "ev_tech_interview"),
        ],
      },
      {
        id: "app_anh_designer",
        candidate: "Anh Le",
        candidateSummary: "Product designer with strong craft and mixed product strategy evidence.",
        candidateEmail: "anh.le@design.vn",
        candidateLocation: "Ho Chi Minh",
        workMode: "onsite",
        job: "Product Designer",
        currentState: "Waiting Feedback",
        owner: "Mai Ho",
        ownerId: "user_mai_ho",
        nextAction: "Collect feedback",
        dueDate: "2026-07-27T18:00:00+08:00",
        sla: "Overdue",
        hrFeedback: "HR 已完成基础筛选；当前等待面试官补充结构化反馈后再推进。",
        evidence: [
          evidence("ev_interview_scheduled", "Interview", "Design interview scheduled", "Interview was confirmed by email."),
        ],
        linkedTasks: [],
        recentTaskRecords: [],
        timeline: [
          event("2026-07-27T15:20:00+08:00", "Interview", "Design interview completed", "Feedback requested from interviewer.", "ev_interview_scheduled"),
        ],
      },
      {
        id: "app_minh_gtm",
        candidate: "Minh Pham",
        candidateSummary: "GTM leader with offer-ready evidence across launch planning and team fit.",
        candidateEmail: "minh.pham@mail.vn",
        candidateLocation: "Hanoi",
        workMode: "remote",
        job: "GTM Lead",
        currentState: "Ready for Next Action",
        owner: "HR Lead",
        ownerId: "user_linh_tran",
        nextAction: "Prepare Hiring Manager context",
        dueDate: "2026-07-28T17:00:00+08:00",
        sla: "Ready",
        hrFeedback: "HR 认为候选人与 GTM Lead 匹配度高，可准备 Hiring Manager 上下文。",
        evidence: [
          evidence("ev_offer_packet", "Assessment", "GTM launch plan", "Launch plan and founder interview evidence complete."),
        ],
        linkedTasks: [],
        recentTaskRecords: [],
        timeline: [
          event("2026-07-28T08:50:00+08:00", "Application Next Action", "Hiring Manager context prepared", "Evidence is ready for business confirmation.", "ev_offer_packet"),
        ],
      },
      {
        id: "app_quang_platform",
        candidate: "Quang Do",
        candidateSummary: "Agency-forwarded backend profile with low-confidence Platform match.",
        candidateEmail: "agency forwarded",
        candidateLocation: "Unknown",
        workMode: "Unknown",
        job: "Platform Engineer",
        currentState: "Blocked",
        previousState: "Needs HR Review",
        owner: "Unassigned",
        ownerId: "",
        nextAction: "Assign owner",
        hrFeedback: "HR 需要先确认候选人身份、岗位匹配和负责人，再允许进入申请流程。",
        dueDate: "",
        sla: "Missing",
        evidence: [
          evidence("ev_agency_forward", "Email", "Agency forwarded profile", "Identity 72%, Platform match 62%, Backend match 58%."),
        ],
        linkedTasks: [],
        recentTaskRecords: [],
        timeline: [
          event("2026-07-28T08:55:00+08:00", "Blocked", "Owner missing", "Application blocked from workflow defaults.", "ev_agency_forward"),
        ],
      },
    ];
  }

  function completedTasksFromStore(taskStore) {
    return completedTasksFromList(allTasksFromStore(taskStore));
  }

  function completedTasksFromList(tasks) {
    return tasks.filter((task) => task.status === TASK_STATUS_DONE && task.related_application_id);
  }

  function allTasksFromStore(taskStore) {
    if (!taskStore || typeof taskStore.listTasks !== "function") return [];
    return taskStore.listTasks();
  }

  function attachTasksToApplications(applications, tasks) {
    return applications.map((application) => {
      const linked = tasks
        .filter((task) => task.related_application_id === application.id)
        .map(taskLink);
      return { ...application, linkedTasks: linked };
    });
  }

  function applyTaskResultToApplication(application, task) {
    assertSupportedTask(task);

    const nextState = inferApplicationState(application, task);
    const nextOwner = task.owner_role || application.owner;
    const nextOwnerId = task.owner_id || application.ownerId;
    const nextAction = task.next_action || application.nextAction;
    const dueDate = task.due_at || application.dueDate;
    const linkedEvidence = (Array.isArray(task.evidence_ids) ? task.evidence_ids : []).map((id) =>
      evidence(id, evidenceTypeForTask(task.task_type), evidenceTitleForTask(task.task_type), task.completion_action || task.next_action)
    );

    const record = {
      id: task.task_id,
      type: task.task_type,
      title: task.title,
      status: task.status,
      completed_at: task.due_at,
      completed_by: task.owner_role,
      ownerId: task.owner_id,
      outcome: {
        state: nextState,
        owner: nextOwner,
        ownerId: nextOwnerId,
        nextAction,
        dueAt: dueDate,
        sla: inferSla(task, dueDate, nextState),
      },
    };

    const timelineEvent = event(
      task.due_at,
      task.task_type,
      `${task.task_type} done`,
      `${task.completion_action || task.title} Next action: ${nextAction}`,
      linkedEvidence[0] ? linkedEvidence[0].id : undefined,
      task.task_id
    );

    return {
      ...application,
      currentState: nextState,
      previousState: isBlockedResolution(task) ? undefined : application.previousState,
      owner: nextOwner,
      ownerId: nextOwnerId,
      nextAction,
      dueDate,
      sla: record.outcome.sla,
      evidence: mergeEvidence(linkedEvidence, application.evidence || []),
      linkedTasks: mergeTaskLinks([taskLink(task)], application.linkedTasks || []),
      recentTaskRecords: [record, ...(application.recentTaskRecords || [])],
      timeline: [timelineEvent, ...(application.timeline || [])],
    };
  }

  function assertSupportedTask(task) {
    if (!task || !TASK_WRITEBACK_TYPES.includes(task.task_type)) {
      throw new Error(`Unsupported task writeback type: ${task ? task.task_type : "missing"}`);
    }
    if (task.status !== TASK_STATUS_DONE) {
      throw new Error(`Task must be Done before Application writeback: ${task.task_id}`);
    }
  }

  function inferApplicationState(application, task) {
    if (isBlockedResolution(task)) return application.previousState || "Needs HR Review";
    if (/Hiring Manager/i.test(`${task.next_action} ${task.completion_action}`)) return "Hiring Manager Review";
    if (task.task_type === "Application Next Action") return "Ready for Next Action";
    return application.currentState;
  }

  function isBlockedResolution(task) {
    return task.task_type === "Blocked Resolution";
  }

  function inferSla(task, dueDate, state) {
    if (isBlockedResolution(task)) return "On Track";
    if (!dueDate) return "Missing";
    return "On Track";
  }

  function evidence(id, type, title, summary) {
    return { id, type, title, summary };
  }

  function event(occurredAt, eventType, title, summary, evidenceId, taskId) {
    return { occurredAt, eventType, title, summary, evidenceId, taskId };
  }

  function taskLink(task) {
    return {
      id: task.task_id,
      type: task.task_type,
      title: task.title,
      status: task.status,
      owner: task.owner_role,
      ownerId: task.owner_id,
      nextAction: task.next_action,
    };
  }

  function mergeEvidence(newItems, existingItems) {
    const seen = new Set();
    return [...newItems, ...existingItems].filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }

  function mergeTaskLinks(newItems, existingItems) {
    const seen = new Set();
    return [...newItems, ...existingItems].filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }

  function evidenceTypeForTask(type) {
    if (isBlockedResolution({ task_type: type })) return "Resolution";
    return "Task Result";
  }

  function evidenceTitleForTask(type) {
    if (isBlockedResolution({ task_type: type })) return "Blocked resolution evidence";
    return "Next action evidence";
  }

  function getGlobalTaskStore() {
    if (typeof window === "undefined") return null;
    return window.HireOSTasks?.taskStore || null;
  }

  function createFreshGlobalTaskStore() {
    if (typeof window === "undefined") return null;
    if (!window.HireOSTasks || typeof window.HireOSTasks.createTaskStore !== "function") return getGlobalTaskStore();
    return window.HireOSTasks.createTaskStore(undefined, { storage: window.localStorage });
  }

  function bootTaskSinkPage() {
    if (typeof document === "undefined") return;
    const snapshot = createTaskApplicationSnapshot(getGlobalTaskStore());
    renderApplicationsPage(snapshot);
    renderApplicationDetail(snapshot);
  }

  function refreshTaskSinkPageFromStorage() {
    if (typeof document === "undefined") return;
    const snapshot = createTaskApplicationSnapshot(createFreshGlobalTaskStore());
    renderApplicationsPage(snapshot);
    renderApplicationDetail(snapshot);
  }

  function renderApplicationsPage(snapshot) {
    const table = document.querySelector("[data-task-sink='applications-table']");
    if (!table) return;

    const rows = snapshot.applicationsAfterTasks.map((application) => {
      const href = `./hireos-application-detail.html?application=${encodeURIComponent(application.id)}`;
      return `<a class="table-row" href="${href}">
        <div class="cell-main"><strong>${escapeHtml(application.candidate)} · ${escapeHtml(application.job)}</strong><span>${application.evidence.length} evidence events · ${application.linkedTasks.length} linked tasks</span></div>
        <span>${escapeHtml(application.currentState)}</span>
        <span>${escapeHtml(application.owner)}</span>
        <span>${escapeHtml(application.nextAction)}</span>
        <span class="${pillClass(application.sla)}">${escapeHtml(application.sla)}</span>
      </a>`;
    });

    table.innerHTML = `<div class="table-row header"><span>Application</span><span>Current State</span><span>Owner</span><span>Next Action</span><span>SLA</span></div>${rows.join("")}`;

    const timeline = document.querySelector("[data-task-sink='recent-task-timeline']");
    if (timeline) {
      const latest = snapshot.applicationsAfterTasks.flatMap((application) =>
        (application.timeline || []).slice(0, 1).map((item) => ({ ...item, application }))
      );
      timeline.innerHTML = latest
        .map(
          (item) => `<div class="timeline-row"><time>${formatShortTime(item.occurredAt)}</time><div class="cell-main"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.application.candidate)} · ${escapeHtml(item.summary)}</span></div><span class="pill green">Task</span></div>`
        )
        .join("");
    }

    const metrics = {
      active: snapshot.applicationsAfterTasks.length,
      dueToday: snapshot.applicationsAfterTasks.filter((item) => item.sla === "Today").length,
      waiting: snapshot.applicationsAfterTasks.filter((item) => /Waiting/.test(item.currentState)).length,
      missing: snapshot.applicationsAfterTasks.filter((item) => item.sla === "Missing" || item.owner === "Unassigned").length,
    };

    setText("[data-task-metric='active']", metrics.active);
    setText("[data-task-metric='due-today']", metrics.dueToday);
    setText("[data-task-metric='waiting']", metrics.waiting);
    setText("[data-task-metric='missing']", metrics.missing);
  }

  function renderApplicationDetail(snapshot) {
    const detail = document.querySelector("[data-task-sink='application-detail']");
    if (!detail) return;

    const selectedId = new URLSearchParams(window.location.search).get("application") || "app_trang_backend";
    const application =
      snapshot.applicationsAfterTasks.find((item) => item.id === selectedId) || snapshot.applicationsAfterTasks[0];

    const model = createApplicationDetailModel(application);

    setText("[data-application-title]", model.title);
    setText("[data-application-subtitle]", model.subtitle);

    detail.innerHTML = `<div class="detail-stack application-detail-main">
      <section class="panel decision-panel"><div class="panel-header"><div><h2>${model.middleSections[0].title}</h2><p>${model.middleSections[0].subtitle}</p></div><span class="${pillClass(model.workflow.sla)}">${escapeHtml(model.workflow.sla)}</span></div>
        ${basicInfoCard(model.basicInfo.rows)}
      </section>
      <section class="panel"><div class="panel-header"><div><h2>${model.middleSections[2].title}</h2><p>${model.middleSections[2].subtitle}</p></div></div>
        ${aiSummaryCard(model.aiSummary.body)}
      </section>
      <section class="panel"><div class="panel-header"><div><h2>${model.middleSections[1].title}</h2><p>${model.middleSections[1].subtitle}</p></div></div>
        <div class="application-timeline">${model.workflowSteps.map((step) => workflowStep(step)).join("")}</div>
      </section>
    </div>`;

    setDataValue("[data-task-contract-note]", "contractNote", snapshot.contractNote);
  }

  function detailRows(rows) {
    return rows.map(([label, value]) => `<div class="detail-field-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
  }

  function basicInfoCard(rows) {
    return `<article class="application-basic-card">${detailRows(rows)}</article>`;
  }

  function aiSummaryCard(summary) {
    return `<article class="ai-summary-card"><p>${escapeHtml(summary)}</p></article>`;
  }

  function summaryCard(card) {
    const pills = card.pills.map((pill, index) => `<span class="pill ${index === 0 ? card.tone : ""}">${escapeHtml(pill)}</span>`).join("");
    return `<article class="config-card"><h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(card.body)}</p><div class="config-meta">${pills}</div></article>`;
  }

  function workflowStep(step) {
    const icon = step.tone === "done" ? "check" : "calendar-clock";
    const pillTone = step.tone === "done" ? "green" : "warn";
    return `<article class="application-step ${escapeHtml(step.tone)}"><div class="step-marker"><i data-lucide="${icon}"></i></div><div class="step-card"><div class="step-head"><div><strong>${escapeHtml(step.title)}</strong><span>${escapeHtml(step.summary)}</span></div><span class="pill ${pillTone}">${escapeHtml(step.status)}</span></div><div class="step-meta"><span>负责人：${escapeHtml(step.owner)}</span><span>下一步：${escapeHtml(step.nextAction)}</span><span>SLA：${escapeHtml(step.sla)}</span></div></div></article>`;
  }

  function recommendationCard(card) {
    return `<div class="work-card ${card.tone === "green" ? "ai" : ""}"><div class="card-top"><div class="card-copy"><strong>${escapeHtml(card.title)}</strong><span>${escapeHtml(card.body)}</span></div><span class="pill ${escapeHtml(card.tone)}">${escapeHtml(card.pill)}</span></div></div>`;
  }

  function evidenceCard(item) {
    return `<div class="work-card"><div class="card-top"><div class="card-copy"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.summary)}</span></div><span class="pill green">${escapeHtml(item.type)}</span></div></div>`;
  }

  function timelineRow(item) {
    return `<div class="timeline-row"><time>${formatShortTime(item.occurredAt)}</time><div class="cell-main"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.summary)}</span></div><span class="pill">${escapeHtml(item.eventType)}</span></div>`;
  }

  function linkedTaskRows(tasks) {
    if (!tasks.length) {
      return `<div class="table-row"><div class="cell-main"><strong>No linked tasks</strong><span>This application is waiting for task context.</span></div><span></span><span></span></div>`;
    }
    return tasks.map((task) => `<div class="table-row"><div class="cell-main"><strong>${escapeHtml(task.title)}</strong><span>${escapeHtml(task.id)}</span></div><span>${escapeHtml(task.type)}</span><span class="${task.status === "Done" ? "pill green" : "pill warn"}">${escapeHtml(task.status)}</span></div>`).join("");
  }

  function workflowStepsForApplication(application) {
    const finalOwner = application.owner || "HR Lead";
    const finalNextAction = application.nextAction || "确认下一步";
    const finalSla = application.sla || "待设置";
    if (/Blocked/.test(application.currentState)) {
      return [
        workflowStepModel("邮件录入", "候选人来源和基础身份已进入待办箱", "已完成", "HR Lead", "无", "完成", "done"),
        workflowStepModel("候选人确认", "需要解决身份、岗位匹配或负责人缺口", "阻塞", finalOwner, finalNextAction, finalSla, "current"),
      ];
    }
    if (/Waiting/.test(application.currentState)) {
      return [
        workflowStepModel("HR 审核", "基础条件和岗位意向已确认", "已完成", "Linh Tran", "无", "完成", "done"),
        workflowStepModel("面试执行", "面试已发生，但结构化反馈还未完整写回", "等待", finalOwner, finalNextAction, finalSla, "current"),
      ];
    }
    return [
      workflowStepModel("HR 审核", "基础条件、薪资范围和英语协作已确认", "已完成", "Linh Tran", "无", "完成", "done"),
      workflowStepModel("技术面试", "系统设计、调试思路和 API 质量已验证", "已完成", "Tech Lead", "补充记录", "完成", "done"),
      workflowStepModel("Hiring Manager 确认", "需要确认下一步业务判断和补充问题", "待安排", finalOwner, finalNextAction, finalSla, "current"),
    ];
  }

  function workflowStepModel(title, summary, status, owner, nextAction, sla, tone) {
    return { title, summary, status, owner, nextAction, sla, tone };
  }

  function recommendationForApplication(application, evidenceGap) {
    if (application.currentState === "Hiring Manager Review") return `准备 Hiring Manager 确认，并重点覆盖：${evidenceGap}`;
    if (/Blocked/.test(application.currentState)) return "先处理阻塞任务，再把该申请返回原来的正常流程状态。";
    if (/Waiting/.test(application.currentState)) return "等待外部负责人或候选人回复，同时在 Tasks 中保留截止时间。";
    return "通过下一个关联任务推进该申请，并把证据写入申请时间线。";
  }

  function inferEvidenceGap(application) {
    const summaries = (application.evidence || []).map((item) => `${item.title} ${item.summary}`).join(" ");
    if (/leadership|pressure/i.test(summaries) || application.currentState === "Hiring Manager Review") return "Leadership under pressure remains the main open question.";
    if (/feedback/i.test(application.nextAction)) return "Structured interviewer feedback is missing.";
    if (/owner|Blocked|Missing/i.test(`${application.currentState} ${application.nextAction} ${application.sla}`)) return "Owner, due date, or job match evidence must be resolved first.";
    return "No critical evidence gap is listed for the current MVP snapshot.";
  }

  function nextTaskForApplication(application) {
    if (application.currentState === "Hiring Manager Review") return "Hiring Manager confirmation";
    if (/Blocked/.test(application.currentState)) return "Blocked Resolution";
    return "Application Next Action";
  }

  function nextOwnerForApplication(application) {
    if (application.currentState === "Hiring Manager Review") return "Hiring Manager";
    if (/Blocked/.test(application.currentState)) return "HR Lead";
    return application.owner || "HR Lead";
  }

  function factCard(title, heading, body, pills) {
    return `<article class="config-card"><h3>${escapeHtml(title)}</h3><p><strong>${escapeHtml(heading)}</strong><br>${escapeHtml(body)}</p><div class="config-meta">${pills
      .map((pill) => `<span class="pill">${escapeHtml(pill)}</span>`)
      .join("")}</div></article>`;
  }

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = String(value);
  }

  function setDataValue(selector, key, value) {
    const node = document.querySelector(selector);
    if (node) node.dataset[key] = String(value);
  }

  function stripTerminalPunctuation(value) {
    return String(value || "").trim().replace(/[。.!?；;]+$/u, "");
  }

  function pillClass(value) {
    if (value === "Ready" || value === "On Track") return "pill green";
    if (value === "Today") return "pill warn";
    if (value === "Missing" || value === "Overdue") return "pill danger";
    return "pill";
  }

  function formatShortTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value || "Now";
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", bootTaskSinkPage);
    } else {
      bootTaskSinkPage();
    }
  }

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key === TASK_STORE_STORAGE_KEY) refreshTaskSinkPageFromStorage();
    });
  }

  return {
    TASK_WRITEBACK_TYPES,
    createApplicationDetailModel,
    createTaskApplicationSnapshot,
    completedTasksFromStore,
    applyTaskResultToApplication,
  };
});

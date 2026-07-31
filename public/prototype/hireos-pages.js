function refreshIcons() {
  if (window.lucide) lucide.createIcons();
}

function setToggleIcon(button, icon, label) {
  button.innerHTML = `<i data-lucide="${icon}"></i>`;
  button.setAttribute("aria-label", label);
  button.setAttribute("title", label);
  refreshIcons();
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const zhTextMap = new Map([
  ["Dashboard", "仪表盘"],
  ["Tasks", "任务"],
  ["Jobs", "岗位"],
  ["Email Agent", "邮件 Agent"],
  ["Applications", "申请流程"],
  ["Candidates", "候选人"],
  ["Assessments", "测评"],
  ["Founder Inbox", "创始人收件箱"],
  ["Blocked", "阻塞项"],
  ["Analytics", "分析"],
  ["Operate", "运营"],
  ["Decision", "决策"],
  ["Profile", "个人资料"],
  ["Notifications", "通知"],
  ["Language", "语言"],
  ["Sign out", "退出登录"],
  ["Online · HR Lead", "在线 · HR 负责人"],
  ["Ask HireOS Agent about this page...", "向 HireOS Agent 询问当前页面..."],
  ["Summarize risks", "总结风险"],
  ["Suggest next action", "建议下一步"],
  ["Show evidence gaps", "查看证据缺口"],
  ["Creation Job", "创建职位"],
  ["View Pending Tasks", "查看待处理任务"],
  ["Review Due Tasks", "查看到期任务"],
  ["Open job", "打开岗位"],
  ["Created jobs, intake readiness, and candidate cards for each active hiring flow.", "已创建岗位、录入准备状态，以及每个活跃招聘流程中的候选人卡片。"],
  ["Create Job", "创建职位"],
  ["Status", "状态"],
  ["All Jobs", "全部岗位"],
  ["Job List", "Job 列表"],
  ["Each job keeps only the required setup fields and the candidate cards that need review.", "每个 Job 只保留必要设置字段和需要处理的候选人卡片。"],
  ["Headcount", "岗位人数"],
  ["JD + Scorecard Ready", "JD + Scorecard 已就绪"],
  ["Salary Range Missing", "薪资范围缺失"],
  ["Candidate Cards", "候选人卡片"],
  ["Click a candidate to open existing detail page", "点击候选人进入已有详情页"],
  ["Review created job", "审核新建岗位"],
  ["View pending candidates", "查看待处理候选人"],
  ["Check blocked intake", "检查阻塞录入"],
  ["Role setup and candidate cards", "岗位设置与候选人卡片"],
  ["Ask Agent", "询问 Agent"],
  ["New Job", "新建岗位"],
  ["Filters", "筛选"],
  ["Sync", "同步"],
  ["Connect Mailbox", "连接邮箱"],
  ["Draft rubric", "起草 Rubric"],
  ["Send assessment", "发送测评"],
  ["Export", "导出"],
  ["Batch Review", "批量审核"],
  ["Resolve Batch", "批量处理"],
  ["Add Application", "新增申请"],
  ["New Candidate", "新增候选人"],
  ["Import CV", "导入 CV"],
  ["Review decisions", "查看决策"],
  ["Resolve blocked", "处理阻塞"],
  ["Approve", "批准"],
  ["Open card", "打开卡片"],
  ["Create tasks", "创建任务"],
  ["Edit draft", "编辑草稿"],
  ["Merge", "合并"],
  ["Inspect", "检查"],
  ["Apply", "应用"],
  ["Open", "打开"],
  ["Compare", "对比"],
  ["Create report", "生成报告"],
  ["Drill down", "下钻"],
  ["Ready", "就绪"],
  ["Review", "审核"],
  ["Risk", "风险"],
  ["Healthy", "健康"],
  ["Overdue", "逾期"],
  ["Complete", "完成"],
  ["Partial", "部分"],
  ["Monday, Jul 27", "7月27日，星期一"],
  ["AI Daily Brief", "AI 每日简报"],
  ["Founder attention is needed on 5 decisions and 3 stalled high-value applications.", "5 个决策和 3 个停滞的高价值申请需要创始人关注。"],
  ["AI found delayed feedback in Product Designer and Backend Engineer pipelines. Two candidates have strong evidence for final interview, but both have open compensation and timeline risks.", "AI 发现产品设计师和后端工程师流程中存在反馈延迟。两位候选人具备进入终面的强证据，但都存在薪酬和时间风险。"],
  ["Next critical action", "下一项关键动作"],
  ["Approve Assessment rubric for Senior Backend", "批准高级后端测评 Rubric"],
  ["Risk window", "风险窗口"],
  ["2 high-fit candidates inactive over 72h", "2 位高匹配候选人超过 72 小时无进展"],
  ["Recommendation confidence", "推荐置信度"],
  ["Evidence coverage is high across email intake, interview notes, and assessment submissions.", "邮件录入、面试记录和测评提交中的证据覆盖度较高。"],
  ["86% evidence coverage", "86% 证据覆盖"],
  ["Total CVs", "CV 总数"],
  ["Pending HR Review", "待 HR 审核"],
  ["Founder Decisions", "创始人决策"],
  ["Blocked Applications", "阻塞申请"],
  ["Recruiting Funnel", "招聘漏斗"],
  ["All active jobs, email-first applications", "所有活跃岗位，邮件优先申请"],
  ["Week", "周"],
  ["Month", "月"],
  ["Quarter", "季度"],
  ["CV Intake", "CV 录入"],
  ["HR Review", "HR 审核"],
  ["Shortlist", "入围"],
  ["Offer Decision", "Offer 决策"],
  ["Evidence-first decisions waiting for human approval", "等待人工审批的证据优先决策"],
  ["Job Progress", "岗位进展"],
  ["Role-level pipeline health and SLA exposure", "岗位级流程健康度与 SLA 暴露"],
  ["View jobs", "查看岗位"],
  ["Senior Backend Engineer", "高级后端工程师"],
  ["Product Designer", "产品设计师"],
  ["GTM Lead", "GTM 负责人"],
  ["Evidence Timeline", "证据时间线"],
  ["Latest structured events from email and interviews", "来自邮件和面试的最新结构化事件"],
  ["Assessment submission parsed", "测评提交已解析"],
  ["Interview feedback extracted", "面试反馈已提取"],
  ["Low-confidence job match", "低置信度岗位匹配"],
  ["Recommended next move", "推荐下一步"],
  ["Approve final interview for Trang Nguyen and ask HR to clarify availability before Friday.", "批准 Trang Nguyen 进入终面，并请 HR 在周五前确认可面试时间。"],
  ["Draft action", "草拟动作"],
  ["Send HR a concise follow-up list for overdue feedback and low-confidence job matches.", "向 HR 发送一份简洁的跟进清单，涵盖逾期反馈和低置信度岗位匹配。"],
  ["Candidate is the person record. Applications keep the job-specific process separate.", "Candidate 是人的记录；Application 保留具体岗位下的流程。"],
  ["This prevents one candidate's multiple role histories from collapsing into a single vague status.", "这可以避免同一候选人的多个岗位历史被压成一个模糊状态。"],
  ["Deduplication insight", "去重洞察"],
  ["11 profiles may be duplicates based on phone, email aliases, CV filename, and agency-forwarded attachments.", "基于手机号、邮箱别名、CV 文件名和猎头转发附件，11 份档案可能重复。"],
  ["Duplicates", "重复项"],
  ["Need HR merge review", "需要 HR 合并审核"],
  ["Multi-role", "多岗位"],
  ["Applied to 2+ jobs", "申请 2 个以上岗位"],
  ["CV Versions", "CV 版本"],
  ["Updated attachments retained", "已保留更新附件"],
  ["Candidate Registry", "候选人库"],
  ["Identity, source, CV history, and cross-job context", "身份、来源、CV 历史和跨岗位上下文"],
  ["All", "全部"],
  ["High value", "高价值"],
  ["Dedup watch", "去重监控"],
  ["Candidate", "候选人"],
  ["Source", "来源"],
  ["Latest Evidence", "最新证据"],
  ["Status", "状态"],
  ["High fit", "高匹配"],
  ["Duplicate signal", "重复信号"],
  ["Duplicate Review", "重复审核"],
  ["Merge candidates only with evidence", "仅在有证据时合并候选人"],
  ["Same phone number, different agency email. CV skill section has 89% overlap.", "手机号相同，但猎头邮箱不同。CV 技能部分重合度 89%。"],
  ["Email alias match and same attachment hash.", "邮箱别名匹配，附件哈希相同。"],
  ["Candidate History", "候选人历史"],
  ["Cross-job evidence continuity", "跨岗位证据连续性"],
  ["Backend application", "后端申请"],
  ["Assessment and interview evidence retained", "已保留测评和面试证据"],
  ["Active", "活跃"],
  ["Platform referral", "平台岗位推荐"],
  ["Rejected due to seniority mismatch", "因资历不匹配被拒"],
  ["Past", "历史"],
  ["Candidate Agent", "候选人 Agent"],
  ["Identity and history", "身份与历史"],
  ["Merge recommendation", "合并建议"],
  ["Hold Quang Do merge for HR review. Evidence is suggestive, not definitive.", "暂缓合并 Quang Do，交由 HR 审核。证据有提示性，但还不够确定。"],
  ["Phone number matches, but source email differs.", "手机号匹配，但来源邮箱不同。"],
  ["Wrong merge could pollute two application timelines.", "错误合并可能污染两条申请时间线。"],
  ["Queue review", "加入审核队列"],
  ["48 email threads need structured decisions before they touch the pipeline.", "48 个邮件线程需要先结构化判断，再进入流程。"],
  ["The page separates high-confidence automation from low-confidence HR review, preserving raw email evidence for every extracted event.", "本页区分高置信度自动化和低置信度 HR 审核，并为每个提取事件保留原始邮件证据。"],
  ["AI intake rule", "AI 录入规则"],
  ["Auto-create Applications only when candidate, job, source, and attachment evidence all pass confidence threshold.", "仅当候选人、岗位、来源和附件证据都达到置信度阈值时，才自动创建 Application。"],
  ["Threads Parsed", "已解析线程"],
  ["CV Attachments", "CV 附件"],
  ["Auto Matched", "自动匹配"],
  ["Needs Review", "需要审核"],
  ["Intake Queue", "录入队列"],
  ["Email threads before candidate/application updates", "候选人/申请更新前的邮件线程"],
  ["Auto Applied", "自动应用"],
  ["Drafts", "草稿"],
  ["Evidence extraction on", "证据提取已开启"],
  ["Email Thread", "邮件线程"],
  ["Detected Type", "识别类型"],
  ["Job Match", "岗位匹配"],
  ["AI Action", "AI 动作"],
  ["Create Application", "创建申请"],
  ["Update Interview", "更新面试"],
  ["Attach Evidence", "附加证据"],
  ["Ask HR", "询问 HR"],
  ["Low conf.", "低置信度"],
  ["Drafted Replies", "已起草回复"],
  ["Human approval before sensitive messages", "敏感消息发送前需人工批准"],
  ["Mailbox Rules", "邮箱规则"],
  ["Current automation boundaries", "当前自动化边界"],
  ["Never reject automatically", "永不自动拒绝"],
  ["Low-confidence matches enter queue", "低置信度匹配进入队列"],
  ["Extraction and approval", "提取与审批"],
  ["Recommended review", "推荐审核"],
  ["Confirm the agency-forwarded profile before creating a Platform application.", "创建平台岗位申请前，先确认猎头转发的档案。"],
  ["Show low-confidence matches, draft a reply, or explain why a thread was classified.", "查看低置信度匹配、起草回复，或解释线程分类原因。"],
  ["Application is the operating unit: candidate plus job plus workflow state.", "Application 是运营单元：候选人 + 岗位 + 流程状态。"],
  ["This page keeps people, roles, and process history separate, so HR can move work forward without losing evidence.", "本页将人、岗位和流程历史分开，让 HR 在推进流程时不丢失证据。"],
  ["AI next-step rule", "AI 下一步规则"],
  ["No active Application should be missing Current Owner, Next Action, Due Date, or Evidence links.", "任何活跃 Application 都不应缺少当前负责人、下一步动作、截止时间或证据链接。"],
  ["Active Applications", "活跃申请"],
  ["Due Today", "今日到期"],
  ["Waiting Candidate", "等待候选人"],
  ["Missing Owner", "缺少负责人"],
  ["Pipeline Workbench", "流程工作台"],
  ["Status, owner, next action and SLA in one table", "状态、负责人、下一步和 SLA 汇总在一张表中"],
  ["State", "状态"],
  ["Owner", "负责人"],
  ["Next Action", "下一步"],
  ["Today", "今天"],
  ["Unassigned", "未分配"],
  ["Missing", "缺失"],
  ["Application Timeline", "申请时间线"],
  ["Structured evidence events", "结构化证据事件"],
  ["Owner Load", "负责人负载"],
  ["Current owner responsibility", "当前负责人职责"],
  ["Application Agent", "申请 Agent"],
  ["Status and next action", "状态与下一步"],
  ["Resolve now", "立即处理"],
  ["Assign Quang Do to Linh Tran or pause the application until job match is confirmed.", "将 Quang Do 分配给 Linh Tran，或在岗位匹配确认前暂停该申请。"],
  ["Assessments should close evidence gaps, not become extra process drag.", "测评应补齐证据缺口，而不是制造额外流程负担。"],
  ["Each assignment is tied to Scorecard criteria, candidate context, submitted artifacts, and a human-calibrated decision.", "每项作业都关联 Scorecard 标准、候选人上下文、提交材料和人工校准后的决策。"],
  ["Stop Rule suggestion", "停止规则建议"],
  ["For Trang Nguyen, evidence coverage is high enough to move to final interview without another assignment round.", "对 Trang Nguyen 来说，证据覆盖已足够进入终面，无需再增加一轮作业。"],
  ["Open Assessments", "开放测评"],
  ["Submitted", "已提交"],
  ["Avg Review Time", "平均审核时间"],
  ["Assessment Workspace", "测评工作台"],
  ["Submission status, rubric confidence, and next decision", "提交状态、Rubric 置信度和下一步决策"],
  ["Sent", "已发送"],
  ["Draft", "草稿"],
  ["Rubric linked", "Rubric 已关联"],
  ["Rubric", "Rubric"],
  ["Submission", "提交"],
  ["AI Review", "AI 审核"],
  ["Parsed", "已解析"],
  ["Strong evidence", "强证据"],
  ["Mixed signal", "混合信号"],
  ["Calibrate", "校准"],
  ["Offer-ready", "Offer 就绪"],
  ["Evidence Profile", "证据画像"],
  ["Rubric-linked signals", "Rubric 关联信号"],
  ["Debugging depth", "调试深度"],
  ["Communication clarity", "沟通清晰度"],
  ["Follow-up Queue", "跟进队列"],
  ["Assessment operations", "测评运营"],
  ["Now", "现在"],
  ["Assessment Agent", "测评 Agent"],
  ["Rubric and evidence", "Rubric 与证据"],
  ["Review recommendation", "审核建议"],
  ["Move Trang Nguyen forward and skip additional assessment.", "推进 Trang Nguyen，并跳过额外测评。"],
  ["9 Applications are blocked; 4 are overdue enough to risk candidate drop-off.", "9 个申请处于阻塞状态，其中 4 个已逾期到可能导致候选人流失。"],
  ["Blocked is the operational truth surface: who owns the next action, what is missing, and how long it has been stuck.", "Blocked 是运营事实界面：谁负责下一步、缺了什么、卡了多久。"],
  ["AI escalation", "AI 升级提醒"],
  ["The largest cause this week is missing interview feedback after time confirmation emails.", "本周最大原因是面试时间确认后缺少面试反馈。"],
  ["Overdue SLA", "SLA 逾期"],
  ["Blocked Applications", "阻塞申请"],
  ["Reason, owner, next action and escalation path", "原因、负责人、下一步和升级路径"],
  ["Reason", "原因"],
  ["Age", "时长"],
  ["Root Causes", "根因"],
  ["What is creating blocks", "阻塞来源"],
  ["Job match", "岗位匹配"],
  ["Resolution Playbook", "处理手册"],
  ["AI-drafted, human-approved actions", "AI 起草、人工批准的动作"],
  ["Feedback reminder", "反馈提醒"],
  ["Owner assignment", "负责人分配"],
  ["Blocked Agent", "阻塞 Agent"],
  ["Escalation and cleanup", "升级与清理"],
  ["Resolve first", "优先处理"],
  ["Pipeline visibility is improving, but execution delay is concentrated in interview feedback.", "流程可见性正在改善，但执行延迟集中在面试反馈。"],
  ["Analytics here measures operational discipline, channel quality, and AI adoption without hiding the evidence behind black-box scores.", "这里的分析衡量运营纪律、渠道质量和 AI 采纳，而不是用黑箱分数隐藏证据。"],
  ["AI metric caveat", "AI 指标说明"],
  ["AI adoption is only counted when a human accepts a draft, recommendation, extracted event, or status update.", "只有人工接受草稿、建议、提取事件或状态更新时，才计入 AI 采纳。"],
  ["Shortlist Rate", "入围率"],
  ["AI Adoption", "AI 采纳"],
  ["CV to Offer Decision conversion", "CV 到 Offer 决策转化"],
  ["Volume", "数量"],
  ["Rate", "比率"],
  ["CVs", "CV 数"],
  ["Offer", "Offer"],
  ["HR Execution", "HR 执行"],
  ["Operational speed and discipline", "运营速度与纪律"],
  ["Channel Quality", "渠道质量"],
  ["Source attribution from CV to decision quality", "从 CV 到决策质量的来源归因"],
  ["Email inbound", "邮件流入"],
  ["Referral", "推荐"],
  ["Agency", "猎头"],
  ["Forwarded profiles", "转发档案"],
  ["Analytics Agent", "分析 Agent"],
  ["Metrics with evidence", "有证据的指标"],
  ["Operating insight", "运营洞察"],
  ["5 high-value decisions are waiting, but only 2 are truly time-sensitive.", "5 个高价值决策在等待，但只有 2 个真正紧急。"],
  ["Founder Inbox removes operational noise and shows the decision, evidence, risk, and recommended action in one place.", "创始人收件箱去除运营噪音，在一个地方展示决策、证据、风险和推荐动作。"],
  ["Decision principle", "决策原则"],
  ["Open Decisions", "开放决策"],
  ["Avg Wait", "平均等待"],
  ["Evidence Ready", "证据就绪"],
  ["Risk Escalations", "风险升级"],
  ["Decision Cards", "决策卡"],
  ["Decision Anatomy", "决策结构"],
  ["Every card follows the same hierarchy", "每张卡遵循同样的信息层级"],
  ["Founder Agent", "创始人 Agent"],
  ["Decision support", "决策支持"],
  ["Decision recommendation", "决策建议"],
  ["12 active jobs need workflow discipline before more intake volume lands.", "在更多简历进入前，12 个活跃岗位需要先补齐流程纪律。"],
  ["AI setup suggestion", "AI 设置建议"],
  ["Active Jobs", "活跃岗位"],
  ["Missing SLA", "缺少 SLA"],
  ["Draft JDs", "JD 草稿"],
  ["Workflow Gaps", "流程缺口"],
  ["Job Control Table", "岗位控制表"],
  ["Role-level health before candidates move through pipeline", "候选人流转前的岗位级健康度"],
  ["Paused", "已暂停"],
  ["AI checks enabled", "AI 检查已开启"],
  ["Job", "岗位"],
  ["Pipeline", "流程"],
  ["Scorecard", "Scorecard"],
  ["Workflow Defaults", "流程默认值"],
  ["Scorecard Coverage", "Scorecard 覆盖"],
  ["Signals by role family", "按岗位族展示信号"],
  ["Job Agent", "岗位 Agent"],
  ["Workflow and scorecard setup", "流程与 Scorecard 设置"],
  ["Inbox", "待办箱"],
  ["Intelligence", "智能分析"],
  ["Settings", "设置"],
  ["AI Hiring Operating System", "AI 招聘操作系统"],
  ["Evidence", "证据"],
  ["Confidence", "置信度"],
  ["Ask", "提问"],
  ["High", "高"],
  ["Yes", "是"],
  ["Search candidate, job, owner", "搜索候选人、岗位、负责人"],
  ["Application", "申请"],
  ["Interview", "面试"],
  ["Assessment", "测评"],
  ["Backend", "后端"],
  ["Design", "设计"],
  ["Ops", "运营"],
  ["Data", "数据"],
  ["Audit", "审计"],
  ["AI highlights jobs missing Scorecard coverage, owner defaults, or SLA rules. The goal is to make every downstream Application inherit a clear process.", "AI 会标出缺少 Scorecard 覆盖、负责人默认值或 SLA 规则的岗位，目标是让每个下游申请都继承清晰流程。"],
  ["Paused Jobs", "已暂停岗位"],
  ["Excluded from email auto-match", "不参与邮件自动匹配"],
  ["8 fully configured", "8 个已完整配置"],
  ["Need founder confirmation", "需要创始人确认"],
  ["Scorecard or rubric incomplete", "Scorecard 或评分标准不完整"],
  ["74 applications · Ho Chi Minh", "74 个申请 · 胡志明市"],
  ["43 applications · Remote VN", "43 个申请 · 越南远程"],
  ["38 applications · Hanoi", "38 个申请 · 河内"],
  ["29 applications · Hybrid", "29 个申请 · 混合办公"],
  ["Assessment-heavy pipeline · 3 blocked", "测评较重的流程 · 3 个阻塞"],
  ["Open detail", "打开详情"],
  ["Feedback due today", "反馈今日到期"],
  ["Scorecard partial", "Scorecard 不完整"],
  ["Offer decision stage", "Offer 决策阶段"],
  ["Email match off", "邮件匹配关闭"],
  ["Platform Engineer", "平台工程师"],
  ["Needs workflow defaults", "需要流程默认值"],
  ["Email match blocked", "邮件匹配已阻断"],
  ["Add due dates and Process Owner defaults to Platform Engineer before approving more CV intake.", "在批准更多 CV 进入前，先给平台工程师岗位补充截止时间和流程负责人默认值。"],
  ["29 active applications inherit no SLA.", "29 个活跃申请没有继承 SLA。"],
  ["Blocked detection will be unreliable.", "阻塞识别会不可靠。"],
  ["High · workflow defaults missing.", "高 · 缺少流程默认值。"],
  ["Compare Backend and Platform hiring flows, or draft a Scorecard section.", "对比后端和平台岗位招聘流程，或起草一段 Scorecard。"],
  ["Pause Job", "暂停岗位"],
  ["Save Job", "保存岗位"],
  ["Job Detail", "岗位详情"],
  ["Hiring Workflow", "招聘流程"],
  ["Assessment Plan", "测评方案"],
  ["Job Pipeline", "岗位流程"],
  ["This job is Active, so AI can match inbound CV emails into Applications.", "该岗位为活跃状态，因此 AI 可以把流入的 CV 邮件匹配为申请。"],
  ["Active status requires confirmed JD, workflow stages, owner defaults, SLA rules, and minimum Scorecard coverage. Draft or Paused jobs must not receive automatic matches.", "活跃状态需要确认 JD、流程阶段、负责人默认值、SLA 规则和最低 Scorecard 覆盖度。草稿或暂停岗位不能接收自动匹配。"],
  ["AI setup check", "AI 设置检查"],
  ["Scorecard coverage is ready, but Assessment rubric should be reviewed before sending the next technical case.", "Scorecard 覆盖已就绪，但发送下一份技术案例前应先审核测评评分标准。"],
  ["Job Status", "岗位状态"],
  ["Email match enabled", "邮件匹配已开启"],
  ["29 active in workflow", "29 个处于活跃流程"],
  ["Evidence dimensions covered", "证据维度已覆盖"],
  ["Assessment rubric review", "测评评分标准待审核"],
  ["Hiring Requirement", "招聘需求"],
  ["Creation-time fields can be edited later with change history", "创建岗位时填写，后续可修改并保留变更记录"],
  ["Role Goal", "岗位目标"],
  ["Own backend service reliability, API design, and integration quality for the hiring OS platform.", "负责招聘 OS 平台的后端服务可靠性、API 设计和集成质量。"],
  ["Founder confirmed", "创始人已确认"],
  ["Ho Chi Minh", "胡志明市"],
  ["Budget & Level", "预算与级别"],
  ["Senior IC, 5+ years, Vietnam-based compensation band. Requires English collaboration.", "高级个人贡献者，5 年以上经验，越南薪资带，要求英文协作。"],
  ["Senior", "高级"],
  ["Hybrid", "混合办公"],
  ["Configured Workflow", "已配置流程"],
  ["Every Application inherits stages, owner, next action, and SLA", "每个申请都会继承阶段、负责人、下一步和 SLA"],
  ["Owner: Linh · SLA: 1 business day · verify base fit", "负责人：Linh · SLA：1 个工作日 · 验证基础匹配"],
  ["Technical Interview", "技术面试"],
  ["Owner: Tech Lead · evidence: architecture, debugging, communication", "负责人：技术负责人 · 证据：架构、调试、沟通"],
  ["Owner: HR + Tech Lead · rubric review pending", "负责人：HR + 技术负责人 · 评分标准待审核"],
  ["Founder Decision", "创始人决策"],
  ["Founder sees complete evidence, gaps, and abnormal process history", "创始人查看完整证据、缺口和异常流程历史"],
  ["Email Matching Rules", "邮件匹配规则"],
  ["How mailbox data enters this job", "邮箱数据如何进入该岗位"],
  ["Eligible for automatic matching", "允许自动匹配"],
  ["Only Active jobs receive high-confidence CV matches from the recruiting mailbox.", "只有活跃岗位会接收招聘邮箱中的高置信度 CV 匹配。"],
  ["Match confidence threshold", "匹配置信度阈值"],
  ["Candidate + job + attachment evidence must pass 85% before auto-create Application.", "候选人、岗位和附件证据超过 85% 后才可自动创建申请。"],
  ["Low-confidence fallback", "低置信度兜底"],
  ["Ambiguous CVs enter Inbox for HR confirmation instead of silently creating data.", "模糊 CV 进入待办箱由 HR 确认，而不是静默创建数据。"],
  ["Job AI Workspace", "岗位 AI 工作区"],
  ["Role setup and workflow checks", "岗位设置与流程检查"],
  ["Recommended action", "推荐动作"],
  ["Review the Assessment rubric before sending another case, then keep the job Active.", "发送下一份案例前先审核测评评分标准，然后保持岗位活跃。"],
  ["Scorecard is 92% covered; rubric has one incomplete dimension.", "Scorecard 覆盖率为 92%；评分标准仍有一个维度不完整。"],
  ["Weak rubric will reduce assessment evidence quality.", "评分标准薄弱会降低测评证据质量。"],
  ["High · based on workflow configuration.", "高 · 基于流程配置。"],
  ["Inbox turns scattered recruiting work into queues with clear ownership.", "待办箱把分散的招聘工作整理成有明确负责人的队列。"],
  ["Email remains the primary data source, but AI only writes high-confidence events automatically. Everything ambiguous becomes a review item with raw evidence attached.", "邮件仍是主要数据来源，但 AI 只会自动写入高置信度事件。所有模糊项都会变成带原始证据的审核任务。"],
  ["AI approval rule", "AI 审批规则"],
  ["AI can draft, classify, extract, and suggest. Low-confidence matches, candidate merges, and offer decisions require human approval.", "AI 可以起草、分类、提取和建议。低置信度匹配、候选人合并和 Offer 决策必须人工审批。"],
  ["Email Intake", "邮件录入"],
  ["Threads need structure", "线程需要结构化"],
  ["Decisions", "决策"],
  ["Founder approval queue", "创始人审批队列"],
  ["Assessment Reviews", "测评审核"],
  ["Submissions awaiting review", "等待审核的提交"],
  ["Owner, SLA, or evidence gap", "负责人、SLA 或证据缺口"],
  ["Unified Work Queue", "统一工作队列"],
  ["Secondary business queues grouped under one operational Inbox", "二级业务队列统一归入一个运营待办箱"],
  ["Search thread, candidate, job, owner", "搜索邮件线程、候选人、岗位、负责人"],
  ["Contextual AI write-back on", "上下文 AI 写回已开启"],
  ["Queue Item", "队列项"],
  ["Type", "类型"],
  ["Object", "对象"],
  ["AI Suggestion", "AI 建议"],
  ["CV - Trang Nguyen Backend", "CV - Trang Nguyen 后端"],
  ["3 attachments from recruiting mailbox", "来自招聘邮箱的 3 个附件"],
  ["Create record", "创建记录"],
  ["Minh Pham offer decision", "Minh Pham Offer 决策"],
  ["Evidence complete, awaiting founder", "证据完整，等待创始人"],
  ["Approve offer decision", "批准 Offer 决策"],
  ["Assessment submission v2", "测评提交 V2"],
  ["Version changes detected in README", "README 中检测到版本变化"],
  ["Compare V1/V2", "对比 V1/V2"],
  ["Anh Le interview feedback", "Anh Le 面试反馈"],
  ["Feedback missing after scheduled interview", "面试后缺少反馈"],
  ["Remind owner", "提醒负责人"],
  ["Agency-forwarded profile", "猎头转发档案"],
  ["Possible duplicate identity", "可能重复身份"],
  ["Merge candidate", "合并候选人"],
  ["Inbox AI Workspace", "待办箱 AI 工作区"],
  ["Queues, approvals, and write-back", "队列、审批与写回"],
  ["Highest-risk item", "最高风险项"],
  ["Do not auto-merge the agency-forwarded profile. Ask HR to confirm identity before updating the Candidate Timeline.", "不要自动合并猎头转发档案。更新候选人时间线前先请 HR 确认身份。"],
  ["Same phone number appears on an existing Backend candidate.", "相同手机号出现在已有后端候选人中。"],
  ["Duplicate merge could corrupt application history.", "错误合并可能污染申请历史。"],
  ["Medium · identity match 72%.", "中 · 身份匹配 72%。"],
  ["Create task", "创建任务"],
  ["Query any queue, draft a reply, explain an extraction, or apply a reviewed status update.", "查询任意队列、起草回复、解释提取结果，或应用已审核的状态更新。"],
  ["Agency-forwarded profile", "猎头转发档案"],
  ["Open Raw Email", "打开原始邮件"],
  ["Confirm Match", "确认匹配"],
  ["This queue item is blocked because the candidate identity is ambiguous.", "该队列项被阻塞，因为候选人身份不明确。"],
  ["AI should not create or merge candidate records when identity confidence is medium. HR must review the raw email and approve the write-back.", "当身份置信度为中等时，AI 不应创建或合并候选人记录。HR 必须审核原始邮件并批准写回。"],
  ["Approval boundary", "审批边界"],
  ["AI can extract, compare, and suggest. Human approval is required before merge, reject, or offer decision.", "AI 可以提取、对比和建议。合并、拒绝或 Offer 决策前必须人工审批。"],
  ["Agency forward", "猎头转发"],
  ["Identity Match", "身份匹配"],
  ["Possible duplicate", "可能重复"],
  ["Write-back", "写回"],
  ["Hold", "暂缓"],
  ["Needs HR approval", "需要 HR 审批"],
  ["Raw Email Evidence", "原始邮件证据"],
  ["Primary source stays attached to every extracted event", "每个提取事件都会保留原始来源"],
  ["Forwarded profile from agency", "猎头转发档案"],
  ["Thread", "线程"],
  ["Parse CV", "解析 CV"],
  ["Done", "完成"],
  ["Phone number match", "手机号匹配"],
  ["Matches existing Backend candidate record", "匹配已有后端候选人记录"],
  ["Identity", "身份"],
  ["Merge review", "合并审核"],
  ["Job keyword mismatch", "岗位关键词不匹配"],
  ["Backend CV forwarded for Platform Engineer", "后端 CV 被转发到平台工程师岗位"],
  ["Low", "低"],
  ["Write-back Preview", "写回预览"],
  ["What will change if HR confirms", "HR 确认后会发生什么变化"],
  ["Update Candidate", "更新候选人"],
  ["Merge CV version into existing person record", "将 CV 版本合并到已有人员记录"],
  ["Approval", "审批"],
  ["Only if HR confirms Platform Engineer is the intended job", "仅当 HR 确认目标岗位为平台工程师时执行"],
  ["Add Evidence Event", "新增证据事件"],
  ["Attach raw email, CV, match score, and reviewer decision", "附加原始邮件、CV、匹配分和审核人决策"],
  ["Safe", "安全"],
  ["Human Review Checklist", "人工审核清单"],
  ["Why this cannot be fully automatic", "为什么不能完全自动化"],
  ["Confirm identity", "确认身份"],
  ["Same phone number but different agency email. Wrong merge can corrupt timelines.", "手机号相同但猎头邮箱不同。错误合并会污染时间线。"],
  ["Required", "必需"],
  ["Confirm job", "确认岗位"],
  ["AI sees Platform 62%, Backend 58%. Active job match is not strong enough.", "AI 判断平台 62%、后端 58%。活跃岗位匹配不够强。"],
  ["Preserve evidence", "保留证据"],
  ["Raw email and AI extraction must stay visible in Candidate Timeline.", "原始邮件和 AI 提取结果必须在候选人时间线中可见。"],
  ["Do not auto-apply", "不要自动应用"],
  ["Send this to HR review instead of merging candidate records automatically.", "将其发送给 HR 审核，而不是自动合并候选人记录。"],
  ["Identity 72%, job match 62%, source is agency forward.", "身份 72%，岗位匹配 62%，来源为猎头转发。"],
  ["Could create duplicate Candidate or wrong Application.", "可能创建重复候选人或错误申请。"],
  ["Medium · human confirmation needed.", "中 · 需要人工确认。"],
  ["Application 是运营单元：候选人 + 岗位 + 流程状态。", "Application 是运营单元：候选人 + 岗位 + 流程状态。"],
  ["Candidate Profile", "候选人档案"],
  ["Timeline", "时间线"],
  ["Email Threads", "邮件线程"],
  ["Interviews", "面试"],
  ["Across 12 jobs", "覆盖 12 个岗位"],
  ["Mostly interview feedback", "主要是面试反馈"],
  ["Assessment or availability", "测评或可面试时间"],
  ["Must be assigned", "必须分配"],
  ["Due", "到期"],
  ["Next-step suggestions", "下一步建议"],
  ["7 evidence events · 1 assessment", "7 个证据事件 · 1 个测评"],
  ["Founder Review", "创始人审核"],
  ["Founder", "创始人"],
  ["Approve final interview", "批准终面"],
  ["Mixed feedback · evidence gap", "反馈混合 · 存在证据缺口"],
  ["Collect feedback", "收集反馈"],
  ["Offer evidence complete", "Offer 证据完整"],
  ["Assign owner", "分配负责人"],
  ["System design and debugging evidence extracted", "已提取系统设计和调试证据"],
  ["Evidence gap reduced for product thinking", "产品思维证据缺口已减少"],
  ["Assessment parsed", "测评已解析"],
  ["Interview feedback linked", "面试反馈已关联"],
  ["Owner missing", "缺少负责人"],
  ["Application blocked from workflow defaults", "申请被流程默认值阻塞"],
  ["Alert", "警报"],
  ["44 applications · 8 due this week", "44 个申请 · 本周 8 个到期"],
  ["31 applications · 4 overdue feedback", "31 个申请 · 4 个反馈逾期"],
  ["Application has no Current Owner and no Due Date.", "申请缺少当前负责人和截止日期。"],
  ["Active pipeline item can disappear from SLA monitoring.", "活跃流程项可能从 SLA 监控中消失。"],
  ["High · required fields missing.", "高 · 缺少必填字段。"],
  ["Assign", "分配"],
  ["Move to Founder Review", "移动到创始人审核"],
  ["This Application is ready for founder review, but one leadership evidence gap remains.", "该申请已可进入创始人审核，但仍有一个领导力证据缺口。"],
  ["Application is the workflow unit. Candidate identity stays reusable, while this page stores job-specific state, evidence, SLA, and decision history.", "Application 是流程单元。候选人身份保持可复用，本页存储具体岗位的状态、证据、SLA 和决策历史。"],
  ["Decision context", "决策上下文"],
  ["AI recommendation uses Evidence Gap + Scorecard + CV, and never makes the final offer decision.", "AI 推荐基于证据缺口、Scorecard 和 CV，但永远不做最终 Offer 决策。"],
  ["Application State", "申请状态"],
  ["Owner: Founder", "负责人：创始人"],
  ["Evidence Events", "证据事件"],
  ["Email, interview, assessment", "邮件、面试、测评"],
  ["Decision due", "决策到期"],
  ["Evidence Gap", "证据缺口"],
  ["Leadership under pressure", "压力下的领导力"],
  ["Person record plus job-specific Application state", "人员记录 + 具体岗位申请状态"],
  ["Trang Nguyen · backend engineer with fintech API and distributed systems experience.", "Trang Nguyen · 具备金融科技 API 和分布式系统经验的后端工程师。"],
  ["CV parsed", "CV 已解析"],
  ["Senior Backend Engineer · Active job · current state is Founder Review after assessment evidence.", "高级后端工程师 · 活跃岗位 · 测评证据后当前状态为创始人审核。"],
  ["Owner set", "负责人已设置"],
  ["Due today", "今日到期"],
  ["Every human and AI update is stored as an Evidence Event", "每一次人工和 AI 更新都会记录为证据事件"],
  ["Debugging depth and architecture tradeoff evidence extracted", "已提取调试深度和架构取舍证据"],
  ["Tech Lead confirmed strong systems reasoning", "技术负责人确认系统推理能力强"],
  ["Human", "人工"],
  ["CV intake from mailbox", "从邮箱录入 CV"],
  ["Email Agent matched candidate to Senior Backend with 94% confidence", "邮件 Agent 以 94% 置信度将候选人匹配到高级后端岗位"],
  ["Decision Card", "决策卡片"],
  ["Founder sees evidence, gap, risk, and recommended action", "创始人查看证据、缺口、风险和推荐动作"],
  ["Proceed to final interview instead of asking for another assessment round.", "进入终面，而不是再增加一轮测评。"],
  ["Proceed", "推进"],
  ["Verified", "已验证"],
  ["Backend architecture, debugging depth, written communication, API ownership.", "后端架构、调试深度、书面沟通、API 责任感。"],
  ["Strong", "强"],
  ["Unknown", "未知"],
  ["Leadership under pressure has not been directly tested.", "压力下领导力尚未被直接验证。"],
  ["Gap", "缺口"],
  ["Decision boundary", "决策边界"],
  ["AI can recommend, but founder must approve final interview, rejection, or offer decision.", "AI 可以推荐，但终面、拒绝或 Offer 决策必须由创始人批准。"],
  ["Application AI Workspace", "申请 AI 工作区"],
  ["Evidence, gaps, and next actions", "证据、缺口与下一步"],
  ["Ask in context", "基于上下文提问"],
  ["You can ask about the CV, interview feedback, assessment versions, timeline, or why the next action is recommended.", "你可以询问 CV、面试反馈、测评版本、时间线，或为什么推荐该下一步。"],
  ["Decision uses Scorecard + CV + Evidence Gap.", "决策使用 Scorecard、CV 和证据缺口。"],
  ["Leadership gap should be covered in final interview.", "领导力缺口应在终面中覆盖。"],
  ["High · seven evidence events linked.", "高 · 已关联 7 个证据事件。"],
  ["Draft questions", "起草问题"],
  ["Show evidence", "查看证据"],
  ["Last 30 days", "最近 30 天"],
  ["2 paused, 4 draft", "2 个暂停，4 个草稿"],
  ["22 due today", "22 个今日到期"],
  ["Email Match Accuracy", "邮件匹配准确率"],
  ["Human-confirmed matches", "人工确认的匹配"],
  ["Offer Decision Rate", "Offer 决策率"],
  ["MVP stops here", "MVP 到此为止"],
  ["Job Status & SLA", "岗位状态与 SLA"],
  ["Role availability and inherited workflow discipline", "岗位可用性与继承的流程纪律"],
  ["Active jobs with clean defaults", "默认值完整的活跃岗位"],
  ["8 of 12 active jobs have owner, SLA, scorecard, and workflow", "12 个活跃岗位中有 8 个具备负责人、SLA、Scorecard 和流程"],
  ["Paused jobs excluded from email matching", "暂停岗位不参与邮件匹配"],
  ["2 jobs are still visible but do not receive automatic applications", "2 个岗位仍可见，但不接收自动申请"],
  ["Draft jobs blocking intake", "草稿岗位阻止录入"],
  ["4 jobs need founder confirmation before AI matching turns on", "4 个岗位需要创始人确认后才能开启 AI 匹配"],
  ["Email-first AI Quality", "邮件优先的 AI 质量"],
  ["Automation quality before data enters the workflow", "数据进入流程前的自动化质量"],
  ["Email to candidate record", "邮件到候选人记录"],
  ["Median 18 minutes from thread to structured Application", "从邮件线程到结构化申请的中位时间为 18 分钟"],
  ["Good", "良好"],
  ["Email to status update", "邮件到状态更新"],
  ["74% of scheduling and submission threads update status correctly", "74% 的安排和提交线程能正确更新状态"],
  ["Watch", "关注"],
  ["Low-confidence review rate", "低置信度审核率"],
  ["14 threads require HR confirmation before write-back", "14 个线程写回前需要 HR 确认"],
  ["Decision Operations", "决策运营"],
  ["Founder-visible abnormal flow and decision load", "创始人可见的异常流程和决策负载"],
  ["Founder abnormal-flow visibility", "创始人异常流程可见性"],
  ["All 9 blocked applications are visible in Inbox", "9 个阻塞申请都在待办箱中可见"],
  ["Offer decision waiting time", "Offer 决策等待时间"],
  ["Median 1.3 days after evidence complete", "证据完整后中位等待 1.3 天"],
  ["Stable", "稳定"],
  ["Evidence gap before decision", "决策前证据缺口"],
  ["5 applications need Scorecard, CV, or Assessment support", "5 个申请需要 Scorecard、CV 或测评支持"],
  ["Recruiting mailbox", "招聘邮箱"],
  ["Founder + team intros", "创始人与团队推荐"],
  ["Manual upload / email", "手动上传 / 邮件"],
  ["Analytics AI Workspace", "分析 AI 工作区"],
  ["Referral has the highest offer decision rate, but inbound email produces most total shortlisted candidates.", "推荐渠道 Offer 决策率最高，但流入邮件贡献了最多入围候选人。"],
  ["Referral offer decision rate is 8.3%; email inbound produces 45 shortlisted candidates.", "推荐渠道 Offer 决策率为 8.3%；流入邮件产生 45 个入围候选人。"],
  ["Interview feedback SLA is dragging overall cycle time.", "面试反馈 SLA 正在拖慢整体周期。"],
  ["High · based on structured source attribution.", "高 · 基于结构化来源归因。"],
  ["Audit Log", "审计日志"],
  ["Save Changes", "保存修改"],
  ["Settings define what AI can read, suggest, and write back into the hiring workflow.", "设置定义 AI 可以读取、建议和写回招聘流程的范围。"],
  ["This page keeps operational rules out of daily queue pages, while making mailbox scope, approval gates, and status defaults explicit.", "本页将运营规则从日常队列页中抽离，同时明确邮箱范围、审批门槛和状态默认值。"],
  ["Governance rule", "治理规则"],
  ["AI may structure evidence and update workflow status, but cannot auto-reject, auto-hire, or make an offer decision.", "AI 可以结构化证据并更新流程状态，但不能自动拒绝、自动录用或做 Offer 决策。"],
  ["Mailboxes", "邮箱"],
  ["Recruiting + agency intake", "招聘 + 猎头录入"],
  ["Users", "用户"],
  ["HR, founder, interviewers", "HR、创始人、面试官"],
  ["SLA Rules", "SLA 规则"],
  ["By application state", "按申请状态"],
  ["AI Rules", "AI 规则"],
  ["3 require review", "3 条需要审核"],
  ["Workspace Configuration", "工作区配置"],
  ["Company-level settings that shape every Job and Application", "影响每个岗位和申请的公司级设置"],
  ["Mailbox Connections", "邮箱连接"],
  ["Control which HR inboxes AI can read, which folders count as recruiting data, and which sender domains require review.", "控制 AI 可读取哪些 HR 邮箱、哪些文件夹算招聘数据，以及哪些发件域名需要审核。"],
  ["Connected", "已连接"],
  ["2 inboxes", "2 个邮箱"],
  ["Low-conf review", "低置信度审核"],
  ["Roles & Permissions", "角色与权限"],
  ["Define who can create jobs, change job status, approve evidence, view all abnormal processes, and make offer decisions.", "定义谁可以创建岗位、修改岗位状态、批准证据、查看所有异常流程和做 Offer 决策。"],
  ["Founder override", "创始人覆盖权限"],
  ["HR admin", "HR 管理员"],
  ["Interviewer", "面试官"],
  ["Status & SLA Defaults", "状态与 SLA 默认值"],
  ["Set Application Status, Job Status, owner defaults, due dates, and blocked detection rules inherited by each new job.", "设置新岗位继承的申请状态、岗位状态、负责人默认值、截止日期和阻塞识别规则。"],
  ["Closed", "已关闭"],
  ["AI Automation Rules", "AI 自动化规则"],
  ["Choose which AI actions are automatic, which require approval, and which sensitive actions are out of scope for MVP.", "选择哪些 AI 动作可自动执行、哪些需要审批，以及哪些敏感动作不在 MVP 范围内。"],
  ["Extract evidence", "提取证据"],
  ["Confirm match", "确认匹配"],
  ["No auto-hire", "不自动录用"],
  ["Hiring Templates", "招聘模板"],
  ["Reusable interview stages, scorecards, assessment plans, and evaluation rubrics for common role families.", "面向常见岗位族的可复用面试阶段、Scorecard、测评方案和评分标准。"],
  ["Engineer", "工程"],
  ["Evidence Policy", "证据策略"],
  ["Define the required evidence event types for decisions: Scorecard, CV, Evidence Gap, Interview, Assessment, and Offer Decision.", "定义决策所需的证据事件类型：Scorecard、CV、证据缺口、面试、测评和 Offer 决策。"],
  ["Evidence Event", "证据事件"],
  ["Settings AI Workspace", "设置 AI 工作区"],
  ["Governance and templates", "治理与模板"],
  ["Policy warning", "策略警告"],
  ["Three active jobs still allow applications without owner defaults. Add a fallback owner before more email intake is synced.", "仍有 3 个活跃岗位允许没有负责人默认值的申请。同步更多邮件录入前请添加兜底负责人。"],
  ["Platform, Ops, and Data jobs have missing SLA defaults.", "平台、运营和数据岗位缺少 SLA 默认值。"],
  ["Founder may see abnormal flows without a responsible owner.", "创始人可能看到没有负责人的异常流程。"],
  ["High · inherited settings incomplete.", "高 · 继承设置不完整。"],
  ["Draft rule", "起草规则"],
  ["Review jobs", "审核岗位"],
  ["Test Sync", "测试同步"],
  ["Add Mailbox", "添加邮箱"],
  ["Status & SLA", "状态与 SLA"],
  ["Templates", "模板"],
  ["All Settings", "全部设置"],
  ["Email is the primary system input, so mailbox settings are production rules.", "邮件是主要系统输入，因此邮箱设置就是生产规则。"],
  ["This page decides what AI can read, what counts as recruiting evidence, when AI can write status updates, and when HR approval is required.", "本页决定 AI 能读取什么、什么算招聘证据、何时可写回状态，以及何时需要 HR 审批。"],
  ["Privacy and control", "隐私与控制"],
  ["Only configured folders and recruiting senders are processed. Sensitive replies and offer decisions require human approval.", "只处理已配置文件夹和招聘发件人。敏感回复和 Offer 决策需要人工审批。"],
  ["Connected Mailboxes", "已连接邮箱"],
  ["Folders Watched", "监听文件夹"],
  ["Inbox, CV, Assessment", "待办箱、CV、测评"],
  ["Auto Write-back", "自动写回"],
  ["Safe event types", "安全事件类型"],
  ["Review Rules", "审核规则"],
  ["Low confidence or sensitive", "低置信度或敏感"],
  ["Connected Sources", "已连接来源"],
  ["Which inboxes AI can read", "AI 可读取的邮箱"],
  ["Mailbox", "邮箱"],
  ["Scope", "范围"],
  ["recruiting@company.vn", "recruiting@company.vn"],
  ["Main HR recruiting mailbox", "主 HR 招聘邮箱"],
  ["6 folders", "6 个文件夹"],
  ["agency-intake@company.vn", "agency-intake@company.vn"],
  ["Forwarded profiles and agency updates", "转发档案和猎头更新"],
  ["2 folders", "2 个文件夹"],
  ["Always", "始终"],
  ["Email Processing Rules", "邮件处理规则"],
  ["What AI can do with mailbox data", "AI 可以如何处理邮箱数据"],
  ["Auto-allowed", "允许自动执行"],
  ["Parse CV attachments, extract candidate identity, attach raw email, create evidence events for high-confidence updates.", "解析 CV 附件、提取候选人身份、附加原始邮件，并为高置信度更新创建证据事件。"],
  ["CV parse", "CV 解析"],
  ["Evidence event", "证据事件"],
  ["Requires approval", "需要审批"],
  ["Candidate merge, low-confidence job match, status updates from ambiguous threads, outbound candidate replies.", "候选人合并、低置信度岗位匹配、模糊线程状态更新、对候选人的外发回复。"],
  ["Reply", "回复"],
  ["Write-back Boundaries", "写回边界"],
  ["Rules aligned with MVP scope", "与 MVP 范围一致的规则"],
  ["Allowed automatically", "允许自动执行"],
  ["High-confidence CV intake, interview schedule confirmation, assessment submission attachment.", "高置信度 CV 录入、面试时间确认、测评提交附件。"],
  ["Allowed after approval", "审批后允许"],
  ["Candidate merge, job match correction, human-facing reply draft, blocked escalation task.", "候选人合并、岗位匹配修正、面向人的回复草稿、阻塞升级任务。"],
  ["Never automatic in MVP", "MVP 中永不自动执行"],
  ["Reject candidate, make offer decision, change compensation, or send sensitive offer communication.", "拒绝候选人、做 Offer 决策、修改薪酬或发送敏感 Offer 沟通。"],
  ["Mailbox AI Workspace", "邮箱 AI 工作区"],
  ["Input rules and automation boundaries", "输入规则与自动化边界"],
  ["Recommended rule", "推荐规则"],
  ["Keep agency mailbox write-back on Hold; use it for evidence extraction but require HR approval before merge or application creation.", "保持猎头邮箱写回为暂缓；可用于证据提取，但合并或创建申请前必须 HR 审批。"],
  ["Agency forwards create most duplicate identity risks.", "猎头转发带来最多重复身份风险。"],
  ["Wrong merge can corrupt Candidate Timeline.", "错误合并会污染候选人时间线。"],
  ["High · based on current review queue.", "高 · 基于当前审核队列。"],
  ["Apply rule", "应用规则"],
  ["Recommended setup", "推荐设置"],
]);

[
  ["Task Detail", "任务详情"],
  ["Decision / Execution", "决策 / 执行"],
  ["Recommended action", "推荐动作"],
  ["Evidence & Context", "证据与上下文"],
  ["Source Evidence", "来源证据"],
  ["Supporting Evidence", "支持证据"],
  ["Counter / Unknowns", "反证 / 未知项"],
  ["AI / HR Recommendation", "AI / HR 建议"],
  ["Next Workflow Preview", "下一步流程预览"],
  ["Ownership, Links & Audit", "负责人、关联与审计"],
  ["Current owner", "当前负责人"],
  ["Task Type", "任务类型"],
  ["Task actions", "任务操作"],
  ["Task", "任务"],
  ["State", "状态"],
  ["Recommended handling", "推荐处理"],
  ["Boundary", "边界"],
  ["Confirmation", "确认方式"],
  ["Human confirmation required", "需要人工确认"],
  ["Assistive recommendation only", "仅作为辅助建议"],
  ["Connect recruiting mailbox", "连接招聘邮箱"],
  ["Request Evidence", "请求补充证据"],
  ["Start", "开始"],
  ["Wait", "等待"],
  ["Reassign", "重新分配"],
  ["Cancel", "取消"],
  ["Next step", "下一步"],
  ["Next owner", "下一负责人"],
  ["Next due", "下一截止时间"],
  ["Timeline", "时间线"],
  ["Candidate message", "候选人消息"],
  ["Approval boundary", "审批边界"],
  ["Message boundary", "消息边界"],
  ["Mailbox Disconnected", "邮箱未连接"],
  ["Inbox Review", "待办箱审核"],
  ["Candidate Review", "候选人审核"],
  ["Missing Candidate Info", "候选人信息缺失"],
  ["Job Match Review", "岗位匹配审核"],
  ["Application Next Action", "申请下一步"],
  ["Interview Scheduling", "面试排期"],
  ["Interview Feedback", "面试反馈"],
  ["Assessment Review", "测评审核"],
  ["Founder Decision", "创始人决策"],
  ["Blocked Resolution", "阻塞处理"],
  ["Missing Default Owner", "缺少默认负责人"],
  ["Job Setup", "岗位设置"],
  ["Job Ready for Intake", "岗位可接收简历"],
  ["In Progress", "处理中"],
  ["Waiting", "等待"],
  ["Done", "完成"],
  ["Cancelled", "已取消"],
  ["Urgent", "紧急"],
  ["Medium", "中"],
  ["Low", "低"],
  ["HR Lead", "HR 负责人"],
  ["HR Member", "HR 成员"],
  ["Founder", "创始人"],
  ["Mailbox", "邮箱"],
  ["Type", "类型"],
  ["Priority", "优先级"],
  ["Due", "到期"],
  ["Completion Action", "完成动作"],
  ["Related", "关联"],
  ["Field", "字段"],
  ["Value", "值"],
  ["Created", "创建时间"],
  ["Current Status", "当前状态"],
  ["Completion Action", "完成动作"],
  ["Current status", "当前状态"],
  ["Completion action", "完成动作"],
  ["None", "无"],
  ["none", "无"],
  ["generated", "生成"],
  ["confidence", "置信度"],
  ["Task AI Workspace", "任务 AI 工作区"],
  ["Context, evidence, action", "上下文、证据、动作"],
  ["No tasks in this view", "当前视图没有任务"],
  ["Switch filters or create a task from another module.", "切换筛选或从其他模块创建任务。"],
  ["No Jobs tasks", "没有岗位任务"],
  ["Jobs setup tasks will appear after a Job is activated or misses configuration.", "岗位激活或缺少配置后会出现岗位设置任务。"],
  ["No Settings tasks", "没有设置相关任务"],
  ["Mailbox, owner, and SLA defaults are ready.", "邮箱、负责人和 SLA 默认值已就绪。"],
  ["No due date", "无截止时间"],
  ["No related object", "无关联对象"],
  ["Confirm Quang Do candidate identity", "确认 Quang Do 候选人身份"],
  ["Review parsed name, email, phone, location, source, CV attachment, and summary before creating or linking a Candidate.", "创建或关联候选人前，审核已解析的姓名、邮箱、电话、地点、来源、CV 附件和摘要。"],
  ["Confirm New Candidate or Link Existing Candidate, then allow Application review only if the job match is accepted.", "确认新候选人或关联已有候选人；只有岗位匹配被接受后才允许进入申请审核。"],
  ["Inbox parsed an agency-forwarded CV into a minimal Candidate profile. HR needs to confirm whether it should become a new Candidate or link to an existing person record.", "待办箱将猎头转发的 CV 解析为最小候选人档案。HR 需要确认它应成为新候选人，还是关联到已有人员记录。"],
  ["Name, email, phone, location, source, CV reference, and summary were extracted.", "已提取姓名、邮箱、电话、地点、来源、CV 引用和摘要。"],
  ["Source evidence is the agency-forwarded email.", "来源证据是猎头转发邮件。"],
  ["Application creation is blocked until candidate identity is confirmed.", "候选人身份确认前，申请创建保持阻塞。"],
  ["Resolve Quang Do duplicate signal", "处理 Quang Do 重复信号"],
  ["Compare email, name, phone, source evidence, and prior Application history before merging or linking.", "合并或关联前，对比邮箱、姓名、电话、来源证据和既有申请历史。"],
  ["Merge Candidate or Link Existing Candidate; do not create a new Application until the duplicate task is Done.", "合并候选人或关联已有候选人；重复审核任务完成前不要创建新申请。"],
  ["Quang Do shares a phone number and similar name with an existing Backend candidate, but the source email differs.", "Quang Do 与一名已有后端候选人手机号相同、姓名相近，但来源邮箱不同。"],
  ["Phone number matches an existing Candidate.", "手机号匹配已有候选人。"],
  ["Name is a fuzzy match.", "姓名为模糊匹配。"],
  ["Agency source email differs, so merge requires human approval.", "猎头来源邮箱不同，因此合并需要人工确认。"],
  ["Fill missing phone for Lan Pham", "补全 Lan Pham 缺失电话"],
  ["Ask the source for the missing phone number or mark the parsed profile not fit for the current job.", "向来源方索要缺失电话，或标记该解析档案不适合当前岗位。"],
  ["Confirm New Candidate or Mark Not Fit for Current Job after the missing information is resolved.", "缺失信息处理后，确认新候选人或标记不适合当前岗位。"],
  ["Inbox parsed a candidate name, email, location, CV reference, source, and summary, but the phone number is missing.", "待办箱已解析候选人姓名、邮箱、地点、CV 引用、来源和摘要，但缺少电话号码。"],
  ["Email and CV reference are present.", "邮箱和 CV 引用已存在。"],
  ["Phone number is missing.", "缺少电话号码。"],
  ["No duplicate signal was found from email, name, or source evidence.", "从邮箱、姓名或来源证据中未发现重复信号。"],
  ["Confirm agency-forwarded candidate identity", "确认猎头转发候选人身份"],
  ["Review raw email and decide whether this is the existing Backend candidate or a new Platform profile.", "审核原始邮件，并判断这是已有后端候选人，还是新的平台工程师档案。"],
  ["Create or update the candidate/application only after HR confirms identity and intended job.", "只有 HR 确认身份和目标岗位后，才创建或更新候选人/申请。"],
  ["Agency mailbox forwarded a CV with medium identity confidence and weak job match. The same phone number appears on an existing Backend candidate.", "猎头邮箱转发了一份身份置信度中等、岗位匹配较弱的 CV。同一手机号出现在已有后端候选人中。"],
  ["Identity match is 72%.", "身份匹配为 72%。"],
  ["Platform match is 62%, Backend match is 58%.", "平台岗位匹配为 62%，后端岗位匹配为 58%。"],
  ["Wrong merge could corrupt two application timelines.", "错误合并可能污染两条申请时间线。"],
  ["Collect Anh Le interview feedback", "收集 Anh Le 面试反馈"],
  ["Ask the interviewer for written feedback or move the application to Waiting with a clear reason.", "向面试官索要书面反馈，或用明确原因将申请移至等待状态。"],
  ["Attach feedback evidence and move the application to the next pipeline state.", "附加反馈证据，并将申请推进到下一流程状态。"],
  ["The interview happened, but the application has no structured feedback. The candidate is now outside the expected response window.", "面试已发生，但申请缺少结构化反馈。候选人已超过预期响应窗口。"],
  ["Interview was confirmed by email.", "面试已通过邮件确认。"],
  ["No interviewer note is linked.", "尚未关联面试官记录。"],
  ["Candidate follow-up risk increases after 24 hours.", "超过 24 小时后，候选人跟进风险上升。"],
  ["Approve Trang Nguyen final interview", "批准 Trang Nguyen 进入终面"],
  ["Approve final interview or return to HR with the leadership evidence gap that must be covered first.", "批准进入终面，或退回 HR 并说明必须先补齐的领导力证据缺口。"],
  ["Move application to Founder Review outcome and record the founder decision evidence.", "将申请推进到创始人审核结果，并记录创始人决策证据。"],
  ["Assessment and technical interview evidence are strong. The remaining gap is leadership under pressure.", "测评和技术面试证据较强，剩余缺口是压力下的领导力。"],
  ["Seven evidence events are linked.", "已关联 7 条证据事件。"],
  ["Assessment V2 was parsed.", "测评 V2 已解析。"],
  ["Leadership pressure remains untested.", "压力下领导力尚未验证。"],
  ["Record Minh Pham offer decision", "记录 Minh Pham 的 Offer 决策"],
  ["Record Offer Decision or request compensation evidence before closing the MVP decision.", "记录 Offer 决策，或在关闭 MVP 决策前请求薪酬证据。"],
  ["Write Offer Decision to the Application Timeline without drafting, negotiating, or managing the offer.", "将 Offer 决策写入申请时间线，不起草、不谈判、不管理 Offer。"],
  ["Evidence is complete enough for a Founder offer decision. The remaining risk is compensation band uncertainty, which stays outside MVP offer management.", "证据已足够支持创始人做 Offer 决策；剩余风险是薪酬区间不确定，该部分不进入 MVP Offer 管理。"],
  ["Assessment and hiring manager feedback are linked.", "测评和招聘经理反馈已关联。"],
  ["Reference notes are attached.", "背调记录已附加。"],
  ["Compensation band uncertainty remains.", "薪酬区间仍不确定。"],
  ["Wait for Minh Pham availability", "等待 Minh Pham 可面试时间"],
  ["Resume when the candidate replies with two final interview slots.", "候选人回复两个终面时间段后恢复处理。"],
  ["Schedule founder interview or cancel the application if no reply arrives by the due date.", "安排创始人面试；若截止时间前无回复，则取消该申请。"],
  ["HR sent the candidate a scheduling follow-up and is waiting for available times.", "HR 已向候选人发送排期跟进，正在等待可用时间。"],
  ["Follow-up email was sent.", "跟进邮件已发送。"],
  ["No candidate reply yet.", "候选人尚未回复。"],
  ["Due date is set so the wait cannot disappear.", "已设置截止时间，等待项不会从队列中消失。"],
  ["Assign default owner for Platform Engineer", "为平台工程师设置默认负责人"],
  ["Set a default owner before more CV intake is approved for Platform Engineer.", "批准更多平台工程师 CV 录入前，先设置默认负责人。"],
  ["Update the Job default_owner so new Applications inherit a current owner.", "更新岗位 default_owner，让新申请继承当前负责人。"],
  ["Platform Engineer is missing a default owner. New Applications should not enter without a responsible owner.", "平台工程师缺少默认负责人。没有负责人的新申请不应进入流程。"],
  ["Owner defaults are missing.", "负责人默认值缺失。"],
  ["Active condition is not met.", "尚未满足活跃条件。"],
  ["Email intake remains blocked until owner is assigned.", "负责人分配前，邮件录入保持阻塞。"],
  ["Set default SLA for Platform Engineer", "为平台工程师设置默认 SLA"],
  ["Choose the default SLA that Application Next Action tasks should inherit.", "选择申请下一步任务应继承的默认 SLA。"],
  ["Update the Job default_sla and unblock SLA-based task generation.", "更新岗位 default_sla，并解除基于 SLA 的任务生成阻塞。"],
  ["Platform Engineer has no default SLA, so generated Applications cannot receive reliable due dates.", "平台工程师没有默认 SLA，因此生成的申请无法获得可靠截止时间。"],
  ["Default SLA is empty.", "默认 SLA 为空。"],
  ["Due dates cannot be inherited.", "截止时间无法继承。"],
  ["Blocked detection depends on SLA.", "阻塞识别依赖 SLA。"],
  ["Tighten Senior Backend scorecard summary", "完善高级后端 Scorecard 摘要"],
  ["Add one sentence that makes the basic screening criteria clear enough for Candidate Review tasks.", "补充一句话，让基础筛选标准足够支持候选人审核任务。"],
  ["Save the criteria / scorecard summary used by Candidate Review and Application Next Action tasks.", "保存候选人审核和申请下一步任务使用的 criteria / scorecard 摘要。"],
  ["The Senior Backend job is active, but the scorecard summary can be clearer for review tasks.", "高级后端岗位已活跃，但 Scorecard 摘要仍可更清晰以支持审核任务。"],
  ["Owner is set.", "负责人已设置。"],
  ["Default SLA is set.", "默认 SLA 已设置。"],
  ["Criteria summary needs one clearer screening statement.", "筛选标准摘要需要一句更清晰的说明。"],
  ["Senior Backend ready for email intake", "高级后端已可接收邮件录入"],
  ["No next action. The Job meets MVP Active conditions for high-confidence email matching.", "无下一步动作。该岗位已满足 MVP 活跃条件，可用于高置信度邮件匹配。"],
  ["Keep high-confidence email intake enabled for this Active Job.", "保持该活跃岗位的高置信度邮件录入开启。"],
  ["Senior Backend has title, owner, default SLA, and basic screening criteria.", "高级后端已具备标题、负责人、默认 SLA 和基础筛选标准。"],
  ["Job title is set.", "岗位名称已设置。"],
  ["Default owner is Linh Tran.", "默认负责人是 Linh Tran。"],
  ["Default SLA is 1 business day.", "默认 SLA 为 1 个工作日。"],
  ["Basic screening criteria are present.", "基础筛选标准已存在。"],
  ["Confirm Quang Do job match", "确认 Quang Do 岗位匹配"],
  ["Compare the parsed CV evidence against Platform Engineer criteria before accepting the job match.", "接受岗位匹配前，将解析出的 CV 证据与平台工程师标准进行对比。"],
  ["Accept the matched job and create the Application Next Action task, or reject the match and keep the Inbox item open.", "接受匹配岗位并创建申请下一步任务，或拒绝匹配并保持待办箱条目开启。"],
  ["The inbox parser found a possible Platform Engineer match, but confidence is below the automatic intake threshold.", "待办箱解析器发现可能匹配平台工程师岗位，但置信度低于自动录入阈值。"],
  ["Platform match is below the auto-accept threshold.", "平台岗位匹配低于自动接受阈值。"],
  ["Backend experience is stronger than platform ownership evidence.", "后端经验强于平台 ownership 证据。"],
  ["Human review prevents routing the application to the wrong job.", "人工审核可避免将申请路由到错误岗位。"],
  ["Move Trang Nguyen to founder review", "将 Trang Nguyen 推进到创始人审核"],
  ["Check that assessment and technical interview evidence are attached, then send the application to Founder Decision.", "确认测评和技术面试证据已附加，然后将申请发送到创始人决策。"],
  ["Create or update the Founder Decision task and write the application stage transition to the timeline.", "创建或更新创始人决策任务，并将申请阶段变更写入时间线。"],
  ["Trang Nguyen is ready for founder review once HR confirms the evidence packet is complete.", "HR 确认证据包完整后，Trang Nguyen 即可进入创始人审核。"],
  ["Assessment V2 is attached.", "测评 V2 已附加。"],
  ["Technical interview evidence is linked.", "技术面试证据已关联。"],
  ["Application stage is ready for founder review.", "申请阶段已可进入创始人审核。"],
  ["Unblock Anh Le feedback gap", "解除 Anh Le 反馈缺口阻塞"],
  ["Escalate the missing interviewer feedback and decide whether the application can proceed with available evidence.", "升级缺失的面试官反馈，并判断申请是否可基于现有证据继续推进。"],
  ["Attach the missing feedback or record the blocking reason before the application moves forward.", "申请推进前，附加缺失反馈或记录阻塞原因。"],
  ["The application is blocked because required interview feedback is missing past SLA.", "该申请因必需面试反馈超过 SLA 仍缺失而被阻塞。"],
  ["Interview occurred.", "面试已发生。"],
  ["Feedback is missing.", "反馈缺失。"],
  ["The due date, not status, makes this task overdue.", "逾期由截止时间推导，不由状态表示。"],
  ["Reconnect recruiting mailbox", "重新连接招聘邮箱"],
  ["Reconnect recruiting@company.vn or pause email intake until the approved folders can sync again.", "重新连接 recruiting@company.vn，或暂停邮件录入直到已批准文件夹可再次同步。"],
  ["Restore mailbox sync so email intake can create owner-ready tasks again.", "恢复邮箱同步，让邮件录入可以再次创建负责人可处理的任务。"],
  ["The recruiting mailbox is the MVP intake source. If it disconnects, HireOS cannot reliably convert candidate emails or workflow exceptions into tasks.", "招聘邮箱是 MVP 录入来源。断开后，HireOS 无法可靠地将候选人邮件或流程异常转换为任务。"],
  ["Connection check failed.", "连接检查失败。"],
  ["Read scope is Inbox, CV Intake, and Assessments.", "读取范围为待办箱、CV 录入和测评。"],
  ["Default routing sends this task to the HR Lead.", "默认路由会将该任务发送给 HR 负责人。"],
  ["Set fallback owner for generated tasks", "设置生成任务的兜底负责人"],
  ["Set HR default owner and Founder decision owner before allowing more intake-generated tasks.", "允许更多录入生成任务前，先设置 HR 默认负责人和创始人决策负责人。"],
  ["Generated tasks inherit owner_role and owner_id when a module-specific owner is absent.", "缺少模块专属负责人时，生成任务会继承 owner_role 和 owner_id。"],
  ["Tasks need a responsible owner at creation time. Missing owner defaults turn workflow exceptions into unassigned work.", "任务创建时必须有负责人。负责人默认值缺失会让流程异常变成无人负责的工作。"],
  ["HR default owner is required.", "需要 HR 默认负责人。"],
  ["Founder decision owner is required.", "需要创始人决策负责人。"],
  ["Unassigned tasks cannot be worked from the owner queue.", "未分配任务无法从负责人队列处理。"],
  ["Set default SLA for Founder Decision", "设置创始人决策默认 SLA"],
  ["Confirm default due windows for Inbox Review, Application Next Action, and Founder Decision.", "确认待办箱审核、申请下一步和创始人决策的默认截止窗口。"],
  ["Generated tasks receive due_at from default SLA rules when no job-specific SLA exists.", "没有岗位专属 SLA 时，生成任务从默认 SLA 规则获得 due_at。"],
  ["Due dates are required for task queues, overdue detection, and owner prioritization. Missing SLA creates invisible operational risk.", "任务队列、逾期识别和负责人优先级都需要截止时间。缺少 SLA 会产生不可见的运营风险。"],
  ["Inbox Review default is 4 business hours.", "待办箱审核默认 4 个工作小时。"],
  ["Application Next Action default is 1 business day.", "申请下一步默认 1 个工作日。"],
  ["Founder Decision requires founder confirmation.", "创始人决策需要创始人确认。"],
  ["Archive superseded assessment draft", "归档已被替代的测评草稿"],
  ["No next action.", "无下一步动作。"],
  ["Keep the archived draft visible as historical evidence.", "保留已归档草稿作为历史证据。"],
  ["Assessment V1 was superseded by V2 and has already been archived.", "测评 V1 已被 V2 替代并归档。"],
  ["V2 is the active submission.", "V2 是当前有效提交。"],
  ["V1 remains attached for history.", "V1 作为历史记录保留附件。"],
  ["Reconnect the recruiting mailbox before email intake can safely create tasks.", "先重新连接招聘邮箱，邮件录入才能安全创建任务。"],
  ["Run the shared Mailbox Connect local simulator from this task or Inbox.", "从此任务或待办箱运行共享的邮箱连接本地模拟流程。"],
  ["Successful connection marks this task Done and makes the Inbox simulation readable again.", "连接成功会将此任务标记为完成，并让待办箱模拟队列重新可读。"],
  ["Usable mailbox connection", "可用邮箱连接"],
  ["Mailbox Connection Review", "邮箱连接审核"],
  ["Connection mode", "连接模式"],
  ["Deterministic local simulator", "确定性本地模拟器"],
  ["Inbox, CV Intake, Assessments", "待办箱、CV 录入、测评"],
  ["Inbox returns to readable local queue and Mailbox Disconnected becomes Done.", "待办箱恢复为可读本地队列，邮箱未连接任务变为完成。"],
  ["Immediate after simulator success", "模拟成功后立即生效"],
  ["Mailbox connection audit record is written locally.", "邮箱连接审计记录写入本地。"],
  ["No candidate message is sent.", "不发送候选人消息。"],
  ["Local simulator only; no real Gmail or Outlook API is connected.", "仅本地模拟；未接入真实 Gmail 或 Outlook API。"],
  ["AI / HR recommendation summarizes deterministic local evidence only.", "AI / HR 建议仅总结确定性本地证据。"],
  ["Review the email thread before it changes Candidate or Application records.", "审核邮件线程，再变更候选人或申请记录。"],
  ["Review source email, attachment, identity confidence, and job-match confidence together.", "同时审核来源邮件、附件、身份置信度和岗位匹配置信度。"],
  ["Completion can create a candidate task, update an application, or keep the inbox item open for more information.", "完成后可创建候选人任务、更新申请，或保持待办箱条目开启以补充信息。"],
  ["Human confirmation of identity and intended job", "人工确认身份和目标岗位"],
  ["Inbox Evidence Review", "待办箱证据审核"],
  ["Email thread", "邮件线程"],
  ["Agency-forwarded candidate profile", "猎头转发候选人档案"],
  ["Attachment", "附件"],
  ["CV evidence retained before writeback", "写回前保留 CV 证据"],
  ["Allowed outcome", "允许结果"],
  ["Create candidate task or request information", "创建候选人任务或请求补充信息"],
  ["Creates or updates Candidate Review / Duplicate Review / Application Next Action after HR confirmation.", "HR 确认后创建或更新候选人审核、重复审核或申请下一步任务。"],
  ["Same-day intake SLA", "当日录入 SLA"],
  ["Inbox review decision is written to the related application when one exists.", "如有关联申请，则将待办箱审核决策写入该申请。"],
  ["No real email is sent; any reply remains a local draft.", "不发送真实邮件；任何回复都仅保留为本地草稿。"],
  ["Confirm whether the parsed person record should become or update a Candidate.", "确认解析出的人员记录应创建新候选人还是更新已有候选人。"],
  ["Confirm identity fields and evidence before allowing any application-level workflow.", "允许进入申请级流程前，先确认身份字段和证据。"],
  ["Completion unlocks job-match review or application creation without merging unrelated candidate histories.", "完成后可解锁岗位匹配审核或申请创建，同时避免合并无关候选人历史。"],
  ["Human confirmation of parsed candidate identity", "人工确认解析出的候选人身份"],
  ["Candidate Identity Review", "候选人身份审核"],
  ["Identity fields", "身份字段"],
  ["Name, email, phone, location, source", "姓名、邮箱、电话、地点、来源"],
  ["CV evidence", "CV 证据"],
  ["Attachment remains traceable", "附件保持可追溯"],
  ["MVP outcome", "MVP 结果"],
  ["Confirm, reject, or request more evidence", "确认、拒绝或请求更多证据"],
  ["Candidate record becomes eligible for Job Match Review or Application Next Action.", "候选人记录可进入岗位匹配审核或申请下一步。"],
  ["Inherited from intake SLA", "继承自录入 SLA"],
  ["Candidate identity confirmation is recorded as audit history.", "候选人身份确认会记录为审计历史。"],
  ["Resolve the duplicate signal before creating or changing an Application.", "创建或变更申请前，先处理重复信号。"],
  ["Compare matching and conflicting evidence, then confirm merge/link or reject the duplicate.", "对比匹配证据和冲突证据，再确认合并/关联或拒绝重复项。"],
  ["A correct merge preserves Candidate history; a wrong merge can corrupt multiple Application timelines.", "正确合并会保留候选人历史；错误合并可能污染多条申请时间线。"],
  ["Human merge or link decision", "人工合并或关联决策"],
  ["Duplicate Candidate Review", "重复候选人审核"],
  ["Matching evidence", "匹配证据"],
  ["Phone, name, or attachment signal", "电话、姓名或附件信号"],
  ["Conflict evidence", "冲突证据"],
  ["Different source or ambiguous history", "来源不同或历史不明确"],
  ["Confirm merge/link, request evidence, reject duplicate", "确认合并/关联、请求证据或拒绝重复项"],
  ["Returns to Candidate Review or Application Next Action after the duplicate decision.", "重复决策后返回候选人审核或申请下一步。"],
  ["Same-day review SLA", "当日审核 SLA"],
  ["Duplicate decision is written to Candidate audit history.", "重复项决策写入候选人审计历史。"],
  ["Collect the missing candidate field or decide the profile is not usable for this job.", "补齐缺失候选人字段，或判断该档案不可用于此岗位。"],
  ["Ask the source for the missing field, then keep the task Waiting until the answer arrives.", "向来源方索要缺失字段，并保持任务等待直到收到回复。"],
  ["The candidate does not move to application workflow until missing information is resolved.", "缺失信息解决前，候选人不会进入申请流程。"],
  ["Missing candidate contact or source detail", "缺失候选人联系方式或来源详情"],
  ["Missing Candidate Information", "候选人信息缺失"],
  ["Required fields", "必填字段"],
  ["Name, email, phone or clear source", "姓名、邮箱、电话或明确来源"],
  ["Current gap", "当前缺口"],
  ["One or more parsed fields are missing", "一个或多个解析字段缺失"],
  ["Fill field, wait for source, or cancel", "补全字段、等待来源或取消"],
  ["Confirm whether the candidate belongs to the suggested job before application creation.", "创建申请前，确认候选人是否属于建议岗位。"],
  ["Compare parsed CV evidence against the job criteria and accept only if the match is clear.", "将解析出的 CV 证据与岗位标准对比，只有匹配明确时才接受。"],
  ["Completion creates the Application Next Action task; rejection keeps the Inbox item open.", "完成后创建申请下一步任务；拒绝则保持待办箱条目开启。"],
  ["Human job-match confirmation", "人工确认岗位匹配"],
  ["Job criteria", "岗位标准"],
  ["Basic screening criteria and scorecard summary", "基础筛选标准和 Scorecard 摘要"],
  ["Candidate evidence", "候选人证据"],
  ["CV and source thread", "CV 和来源线程"],
  ["Accept match or request more information", "接受匹配或请求更多信息"],
  ["Confirm the application has enough evidence to move to its next workflow step.", "确认申请有足够证据进入下一流程步骤。"],
  ["Check evidence links, owner, and due date before completing the workflow move.", "完成流程推进前，检查证据链接、负责人和截止时间。"],
  ["Completion writes the application timeline and may create the next owner task.", "完成后写入申请时间线，并可能创建下一负责人任务。"],
  ["Evidence packet confirmation", "证据包确认"],
  ["Candidate plus job-specific workflow state", "候选人 + 岗位专属流程状态"],
  ["Owner-visible step required now", "当前需要负责人处理的步骤"],
  ["Move to next round or create next task", "推进到下一轮或创建下一任务"],
  ["Founder Decision task is created or application timeline is updated.", "创建创始人决策任务，或更新申请时间线。"],
  ["Founder or HR Lead", "创始人或 HR 负责人"],
  ["Inherited from job SLA", "继承自岗位 SLA"],
  ["Application stage transition is written to timeline.", "申请阶段变更写入时间线。"],
  ["Candidate message is not sent unless a human approves a draft.", "只有人工批准草稿后才会发送候选人消息。"],
  ["Keep scheduling visible until the candidate or interviewer provides times.", "在候选人或面试官提供时间前，保持排期可见。"],
  ["Leave Waiting with a due date, then complete when availability is confirmed.", "带截止时间保持等待，确认可用时间后完成。"],
  ["Completion schedules the next interview task or cancels stale scheduling.", "完成后安排下一面试任务，或取消过期排期。"],
  ["Availability reply", "可用时间回复"],
  ["Scheduling Follow-up", "排期跟进"],
  ["Waiting on", "等待对象"],
  ["Candidate or interviewer availability", "候选人或面试官可用时间"],
  ["SLA rule", "SLA 规则"],
  ["Waiting is visible and can become overdue by due_at", "等待状态保持可见，并可由 due_at 推导为逾期"],
  ["Schedule interview or cancel", "安排面试或取消"],
  ["Attach missing interview feedback or record why the application must wait.", "附加缺失面试反馈，或记录申请必须等待的原因。"],
  ["Ask the interviewer or owner for structured feedback before moving the application.", "推进申请前，向面试官或负责人索要结构化反馈。"],
  ["Completion attaches feedback evidence and moves the application toward assessment or founder review.", "完成后附加反馈证据，并将申请推进到测评或创始人审核。"],
  ["Interviewer feedback", "面试官反馈"],
  ["Interview Feedback Review", "面试反馈审核"],
  ["No structured interviewer note is linked", "尚未关联结构化面试官记录"],
  ["Owner action", "负责人动作"],
  ["Ask owner or wait with reason", "询问负责人或带原因等待"],
  ["Attach feedback and advance application", "附加反馈并推进申请"],
  ["Review the assessment evidence before it influences a workflow decision.", "测评证据影响流程决策前，先进行审核。"],
  ["Use rubric-linked evidence and keep human approval before sensitive decisions.", "使用 Rubric 关联证据，并在敏感决策前保留人工审批。"],
  ["Completion can advance an application or archive superseded assessment evidence.", "完成后可推进申请，或归档已被替代的测评证据。"],
  ["Human assessment calibration", "人工测评校准"],
  ["Submitted artifact and parsed summary", "提交物和解析摘要"],
  ["Advance, request evidence, or archive", "推进、请求证据或归档"],
  ["The founder must manually confirm the decision based on the evidence packet.", "创始人必须基于证据包人工确认决策。"],
  ["Use the AI / HR recommendation as a briefing, then record the human decision.", "将 AI / HR 建议作为简报参考，然后记录人工决策。"],
  ["Completion writes a founder decision event and creates the next workflow step only after human confirmation.", "只有人工确认后，完成动作才写入创始人决策事件并创建下一流程步骤。"],
  ["Founder judgment on remaining evidence gap", "创始人判断剩余证据缺口"],
  ["Founder Decision Card", "创始人决策卡"],
  ["Continue, hold, reject, or request more evidence", "继续、暂缓、拒绝或请求更多证据"],
  ["Evidence packet", "证据包"],
  ["Assessment, interview, and CV evidence", "测评、面试和 CV 证据"],
  ["AI cannot approve or reject automatically", "AI 不能自动批准或拒绝"],
  ["Application Timeline receives the Founder Decision and the next task is created only after human confirmation.", "申请时间线接收创始人决策，且只有人工确认后才创建下一任务。"],
  ["Founder decision SLA", "创始人决策 SLA"],
  ["Founder decision evidence is written to the application timeline.", "创始人决策证据写入申请时间线。"],
  ["The founder must manually record the MVP Offer Decision endpoint.", "创始人必须人工记录 MVP Offer 决策终点。"],
  ["Confirm the evidence and risk summary, then record the offer decision manually.", "确认证据和风险摘要后，人工记录 Offer 决策。"],
  ["Completion writes Offer Decision to the Timeline; it does not start offer management.", "完成后将 Offer 决策写入时间线；不会启动 Offer 管理。"],
  ["Founder offer judgment", "创始人 Offer 判断"],
  ["Offer Decision Card", "Offer 决策卡"],
  ["Offer Decision endpoint", "Offer 决策终点"],
  ["Compensation or timing uncertainty remains visible", "薪酬或时间不确定性保持可见"],
  ["No negotiation, contract, or onboarding workflow", "不进入谈判、合同或入职流程"],
  ["Offer Decision is written to the Application Timeline as the MVP endpoint.", "Offer 决策作为 MVP 终点写入申请时间线。"],
  ["Same-day founder SLA", "创始人当日 SLA"],
  ["Offer Decision record is written after human confirmation.", "人工确认后写入 Offer 决策记录。"],
  ["Resolve the blocking cause so the application can return to its normal workflow.", "处理阻塞原因，让申请回到正常流程。"],
  ["Fix the missing evidence, owner, or decision path before marking the task complete.", "标记任务完成前，修复缺失证据、负责人或决策路径。"],
  ["Resolution records the unblock reason and resumes the prior workflow state.", "处理结果会记录解除阻塞原因，并恢复之前的流程状态。"],
  ["Blocking evidence or owner fix", "阻塞证据或负责人修复"],
  ["Exception cause", "异常原因"],
  ["Missing owner, evidence gap, overdue feedback, or policy ambiguity", "缺少负责人、证据缺口、反馈逾期或策略不明确"],
  ["Impact object", "影响对象"],
  ["Application or job workflow", "申请或岗位流程"],
  ["Resolve and return to original workflow", "处理并回到原流程"],
  ["Unblock record is written, then the application returns to the prior workflow or resumes the next action.", "写入解除阻塞记录后，申请返回原流程或恢复下一步动作。"],
  ["Current owner from the application workflow", "申请流程中的当前负责人"],
  ["Recalculated from job SLA", "根据岗位 SLA 重新计算"],
  ["Blocked Resolution record is written to audit timeline.", "阻塞处理记录写入审计时间线。"],
  ["Assign the missing owner default before generated work enters the queue.", "生成工作进入队列前，先补齐缺失的负责人默认值。"],
  ["Set the default owner or fallback owner, then resume task generation.", "设置默认负责人或兜底负责人，然后恢复任务生成。"],
  ["Future generated tasks inherit an owner and return to the normal intake or application workflow.", "后续生成任务会继承负责人，并回到正常录入或申请流程。"],
  ["Default owner", "默认负责人"],
  ["No default current owner", "缺少默认当前负责人"],
  ["Generated tasks can become unassigned", "生成任务可能变成未分配"],
  ["Assign job or system fallback owner", "分配岗位或系统兜底负责人"],
  ["Owner default is restored, then intake or application tasks return to normal workflow.", "负责人默认值恢复后，录入或申请任务回到正常流程。"],
  ["Configured HR Lead or Founder owner", "已配置的 HR 负责人或创始人负责人"],
  ["Inherited from generated task SLA", "继承自生成任务 SLA"],
  ["Configuration fix is recorded in audit timeline.", "配置修复记录写入审计时间线。"],
  ["Set the missing SLA default so generated tasks receive due dates.", "设置缺失的默认 SLA，让生成任务获得截止时间。"],
  ["Choose the default due window and then resume SLA-based task creation.", "选择默认截止窗口，然后恢复基于 SLA 的任务创建。"],
  ["Future tasks can show due-today and overdue labels derived from due_at.", "后续任务可根据 due_at 显示今日到期和逾期标签。"],
  ["Default SLA window", "默认 SLA 窗口"],
  ["No default due window", "缺少默认截止窗口"],
  ["Overdue detection cannot be derived reliably", "无法可靠推导逾期识别"],
  ["Set SLA and return to workflow", "设置 SLA 并回到流程"],
  ["SLA default is restored, then generated tasks resume with due_at-based timing.", "SLA 默认值恢复后，生成任务继续使用基于 due_at 的时间规则。"],
  ["Configured default SLA", "已配置默认 SLA"],
  ["SLA fix is recorded in audit timeline.", "SLA 修复记录写入审计时间线。"],
  ["Complete the job setup detail required by downstream task generation.", "补全下游任务生成所需的岗位设置详情。"],
  ["Tighten the missing job field, then complete the task.", "完善缺失岗位字段，然后完成任务。"],
  ["Job setup quality improves Candidate Review and Application Next Action routing.", "岗位设置质量会改善候选人审核和申请下一步的路由。"],
  ["Job setup refinement", "岗位设置优化"],
  ["Job Setup Review", "岗位设置审核"],
  ["Confirm the job remains ready for high-confidence email intake.", "确认岗位仍可接收高置信度邮件录入。"],
  ["No change is needed unless a job default is removed.", "除非岗位默认值被移除，否则无需变更。"],
  ["The job remains eligible for local email intake simulation.", "该岗位继续可用于本地邮件录入模拟。"],
  ["Job Intake Readiness", "岗位录入就绪"],
  ["AI / HR recommendation cannot decide; the assigned human must confirm the outcome.", "AI / HR 建议不能替代决策；指定负责人必须确认结果。"],
  ["Application Timeline receives the task completion record.", "申请时间线接收任务完成记录。"],
  ["Task audit timeline receives the completion record.", "任务审计时间线接收完成记录。"],
  ["Human confirmation is required before workflow writeback.", "流程写回前需要人工确认。"],
  ["Deterministic local simulator; no real email or LLM API is connected.", "确定性本地模拟器；未接入真实邮件或 LLM API。"],
  ["My Tasks", "我的任务"],
  ["Today", "今日"],
  ["Critical", "关键"],
  ["Upcoming Interviews", "即将面试"],
  ["Waiting for My Decision", "等待我决策"],
  ["Waiting on Others", "等待他人"],
  ["Completed by AI", "AI 已完成"],
  ["All Tasks", "全部任务"],
  ["Confirm Hiring Need", "确认招聘需求"],
  ["Review AI Job Package", "审核 AI 岗位包"],
  ["Review Job Change", "审核岗位调整"],
  ["Review AI Candidate Recommendation", "审核 AI 推荐候选人"],
  ["Resolve AI / HR Disagreement", "处理 AI / HR 分歧"],
  ["Review HR Screen", "审核 HR 初面"],
  ["Confirm Follow-up Questions", "确认补充问题"],
  ["Review AI Interview Plan", "审核 AI 面试计划"],
  ["Prepare Upcoming Interview", "准备即将面试"],
  ["Run Structured Interview", "执行结构化面试"],
  ["Review AI Interview Summary", "审核 AI 面试总结"],
  ["Decide Next Interview Round", "决定面试下一轮"],
  ["Review AI Assessment", "审核 AI 笔试题"],
  ["Review Batch Assessment Plan", "审核批量笔试方案"],
  ["Hiring Need", "招聘需求"],
  ["Job Package", "岗位包"],
  ["Job Change", "岗位调整"],
  ["Candidate Recommendation", "候选人推荐"],
  ["AI / HR Disagreement", "AI / HR 分歧"],
  ["HR Screen", "HR 初面"],
  ["Follow-up Questions", "补充问题"],
  ["Interview Plan", "面试计划"],
  ["Interview Prep", "面试准备"],
  ["Structured Interview", "结构化面试"],
  ["Interview Summary", "面试总结"],
  ["Next Round", "下一轮"],
  ["Assessment", "笔试"],
  ["Batch Assessment", "批量笔试"],
  ["Owner", "负责人"],
  ["Due", "到期"],
  ["Source", "来源"],
  ["Open task", "打开任务"],
  ["AI Completed", "AI 已完成"],
  ["Human Review", "人工审核"],
  ["Founder Decision", "创始人决策"],
  ["Interview", "面试"],
  ["Batch", "批量"],
  ["Waiting Others", "等待他人"],
  ["Needs attention today", "今日需要处理"],
  ["High-risk or founder-visible", "高风险或创始人可见"],
  ["Interview work entering the calendar", "进入日程的面试工作"],
  ["Decision is owned by you", "由你负责决策"],
  ["Multiple candidates share the same review motion", "多个候选人共用同一审核动作"],
  ["Blocked by another owner or candidate reply", "被其他负责人或候选人回复阻塞"],
  ["AI completed draft, parse, or prep", "AI 已完成草稿、解析或准备"],
  ["Full task catalog", "完整任务目录"],
  ["Owned by Linh Tran", "Linh Tran 负责"],
  ["All Open", "全部打开"],
  ["Open or in progress", "打开或处理中"],
  ["Needs same-day action", "需要当天处理"],
  ["Handle first", "优先处理"],
  ["Paused with owner", "由负责人暂停"],
  ["Parsed profiles need confirmation", "解析档案需要确认"],
  ["Email, name, or source evidence match", "邮箱、姓名或来源证据匹配"],
  ["Missing Info", "信息缺失"],
  ["Phone, CV, or source is incomplete", "电话、CV 或来源不完整"],
  ["Ready for Application", "可进入申请"],
  ["Candidate task completed first", "先完成候选人任务"],
  ["Confirm agency-forwarded candidate identity", "确认猎头转发候选人身份"],
  ["Complete candidate identity from unknown CV", "补全未知 CV 的候选人身份"],
  ["Fill the missing candidate identity from the CV and raw email evidence.", "根据 CV 和原始邮件证据补全缺失的候选人身份。"],
  ["Create or update the Candidate only after identity is confirmed.", "只有身份确认后才创建或更新候选人。"],
  ["Choose active job for Mai Nguyen referral", "为 Mai Nguyen 推荐选择活跃岗位"],
  ["Select an active job or send the candidate to the unassigned pool.", "选择一个活跃岗位，或将候选人放入未分配池。"],
  ["Prepare an Application draft only after the intended job is selected.", "只有选定目标岗位后才准备申请草稿。"],
  ["Classify bounce thread from recruiting mailbox", "分类招聘邮箱退信线程"],
  ["Confirm whether the thread is recruiting-related or cancel it with no write-back.", "确认该线程是否与招聘相关；否则取消且不写回。"],
  ["Cancel the task if it is non-recruiting, or reclassify it into the correct Inbox task type.", "如果不是招聘相关则取消任务，或重新分类为正确的待办箱任务类型。"],
  ["Complete candidate identity from unknown CV", "补全未知 CV 的候选人身份"],
  ["Choose active job for Mai Nguyen referral", "为 Mai Nguyen 推荐选择活跃岗位"],
  ["Founder Tasks", "创始人任务"],
  ["contract-aligned tasks", "条符合契约的任务"],
  ["Decision SLA owned by Founder", "创始人负责的决策 SLA"],
  ["Waiting Tasks", "等待任务"],
  ["Need evidence or follow-up date", "需要证据或跟进日期"],
  ["Completed by Founder action", "由创始人动作完成"],
  ["Candidate linked by task contract.", "候选人由任务契约关联。"],
  ["Job linked by task contract.", "岗位由任务契约关联。"],
  ["No extra risk summary is attached to this MVP task.", "此 MVP 任务未附加额外风险摘要。"],
  ["Recommended Next Action", "推荐下一步"],
  ["Continue", "继续"],
  ["Reject", "拒绝"],
  ["Request More Evidence", "请求更多证据"],
  ["Hold / Waiting", "暂缓 / 等待"],
  ["No decision recorded yet.", "尚未记录决策。"],
  ["No active Founder decision tasks", "没有活跃的创始人决策任务"],
  ["Completed and cancelled tasks stay in the task store, but this role view only shows active decisions.", "已完成和已取消任务保留在任务存储中，但此角色视图只显示活跃决策。"],
  ["Task contract alignment", "任务契约对齐"],
  ["This Founder view reads from window.HireOSTasks.taskStore and only uses allowed statuses: Open, In Progress, Waiting, Done, Cancelled.", "此创始人视图读取 window.HireOSTasks.taskStore，且只使用允许状态：打开、处理中、等待、完成、已取消。"],
  ["Filter", "筛选"],
  ["Required fields", "必填字段"],
  ["Write-back target", "写回目标"],
  ["Decision action updates task status and prepares an Application Timeline completion_action.", "决策动作会更新任务状态，并准备申请时间线的 completion_action。"],
  ["Selected task preview", "已选任务预览"],
  ["linked evidence records.", "条关联证据记录。"],
  ["Task In Progress", "任务处理中"],
  ["Task Waiting", "任务等待"],
  ["Task Done", "任务完成"],
  ["Task Cancelled", "任务已取消"],
  ["Application / Candidate Summary", "申请 / 候选人摘要"],
  ["Candidate identity plus job-specific workflow state", "候选人身份与岗位流程状态"],
  ["Application", "申请"],
  ["Application is the candidate plus job workflow record.", "申请是候选人 + 岗位流程记录。"],
  ["AI / HR Recommendation", "AI / HR 建议"],
  ["Recommendation is a briefing; final decisions remain human-confirmed", "建议仅作简报；最终决策仍需人工确认"],
  ["Human boundary", "人工边界"],
  ["Evidence gap", "证据缺口"],
  ["Human decision required", "需要人工决策"],
  ["Application Timeline", "申请时间线"],
  ["Task results, state changes, and evidence links stay together", "任务结果、状态变化和证据链接保持在一起"],
  ["Ownership / SLA", "负责人 / SLA"],
  ["Who owns the next move and when it is due", "谁负责下一步以及何时到期"],
  ["Linked Tasks", "关联任务"],
  ["Application detail is reached from task context, not primary navigation", "申请详情从任务上下文进入，不作为一级导航"],
  ["What changes after the next task is completed", "下一个任务完成后会发生什么"],
  ["No candidate message is sent from this detail page unless a separate communication task is approved.", "除非单独的沟通任务被批准，否则此详情页不发送候选人消息。"],
  ["AI can recommend the next step, but human owners confirm final interview, rejection, and offer decisions.", "AI 可以建议下一步，但终面、拒绝和 Offer 决策必须由人工负责人确认。"],
  ["Analytics Agent", "分析 Agent"],
  ["Metrics with evidence", "有证据的指标"],
  ["Operating insight", "运营洞察"],
  ["Open blocked", "打开阻塞项"],
  ["Open tasks", "打开任务"],
  ["Export view", "导出视图"],
  ["Job Creation", "职位创建"],
  ["Who do you want to hire?", "你想招聘谁？"],
  ["Describe the role in plain language. I will ask only the questions that change the JD.", "用自然语言描述岗位。我只会追问真正影响 JD 的问题。"],
  ["Start speaking", "开始说话"],
  ["Stop speaking", "停止"],
  ["Listening...", "正在听..."],
  ["Use example", "使用示例"],
  ["Send", "发送"],
  ["Confirm interviews", "确认面试"],
  ["Generate package", "生成岗位包"],
  ["Revise", "修改"],
  ["I can draft this. Three role conditions materially change the JD:", "我可以起草。真正影响 JD 的岗位条件主要是这三件事："],
  ["1. Success in 90 days", "1. 90 天成功标准"],
  ["Ship stable task APIs and reduce manual HR coordination.", "交付稳定任务 API，并减少 HR 手动协调。"],
  ["2. Must-have signal", "2. 必要能力信号"],
  ["Backend ownership, workflow systems, and production debugging.", "后端 ownership、工作流系统和生产调试。"],
  ["3. Hard conditions", "3. 必要条件"],
  ["Senior budget, Vietnam hybrid, reports to Tech Lead, Saturday release support when needed.", "高级预算、越南混合办公、向 Tech Lead 汇报，必要时支持周六上线。"],
  ["Reply with edits, or send again to confirm interview rounds and interviewers.", "可以回复修改意见，或再次发送来确认面试轮次和面试官。"],
  ["Before I generate the package, confirm the interview workflow and who should interview.", "生成岗位包前，先确认面试流程和由谁面试。"],
  ["1. HR screen", "1. HR 初筛"],
  ["Owner: Linh Tran. Confirm motivation, salary range, location, and Saturday support acceptance.", "负责人：Linh Tran。确认动机、薪资范围、地点，以及是否接受周六支持。"],
  ["2. Technical interview", "2. 技术面试"],
  ["Owner: Tech Lead. Validate API design, workflow state, debugging, and production reliability.", "负责人：Tech Lead。验证 API 设计、工作流状态、调试和生产稳定性。"],
  ["3. Founder / final round", "3. 创始人 / 终面"],
  ["Owner: Founder. Validate ownership scope, urgency, tradeoffs, and culture fit.", "负责人：Founder。验证 ownership 范围、紧急度、取舍和文化匹配。"],
  ["Reply with interviewer changes, or send again to generate JD, Scorecard, Workflow, Interview Plan, and Challenge.", "可以回复面试官调整，或再次发送来生成 JD、Scorecard、Workflow、Interview Plan 和 Challenge。"],
  ["Here is the latest JD template and the challenge review before launch.", "这是发布前的最新版 JD 模板和 Challenge 说明。"],
  ["JD Template", "JD 模板"],
  ["Own HireOS task APIs, workflow orchestration, evidence data integrity, and production reliability for the recruiting operating system.", "负责 HireOS 任务 API、工作流编排、证据数据完整性，以及招聘操作系统的生产稳定性。"],
  ["Mission", "使命"],
  ["Build stable backend foundations for task queues, application state, and AI-assisted hiring operations.", "为任务队列、申请状态和 AI 辅助招聘运营构建稳定后端基础。"],
  ["Responsibilities", "职责"],
  ["Design APIs, maintain workflow state, improve observability, partner with HR and product on operational edge cases.", "设计 API、维护工作流状态、提升可观测性，并与 HR 和产品协作处理运营边界情况。"],
  ["Scorecard", "评分卡"],
  ["Systems design, debugging depth, data modeling, API ownership, async communication, hiring-domain judgment.", "系统设计、调试深度、数据建模、API ownership、异步沟通、招聘领域判断。"],
  ["Interview Plan", "面试计划"],
  ["HR screen by Linh Tran -> technical interview by Tech Lead + Backend Staff -> founder final round.", "Linh Tran 负责 HR 初筛 -> Tech Lead + Backend Staff 负责技术面试 -> 创始人终面。"],
  ["Hard Conditions", "必要条件"],
  ["Vietnam hybrid, senior budget band, reports to Tech Lead, accepts Saturday release support when production launch requires it.", "越南混合办公、高级预算带、向 Tech Lead 汇报，生产上线需要时接受周六发布支持。"],
  ["Start with plain language. No field form is required.", "用自然语言开始，不需要先填字段表单。"],
  ["I only need the questions that change the role definition.", "我只问真正影响岗位定义的问题。"],
  ["I generated the job package from the intent and answers.", "我已根据意图和回答生成岗位包。"],
  ["Before launch, I found the risks that could make this JD fail.", "发布前，我找到了可能让这个 JD 失败的风险。"],
  ["Ready to approve and launch. The following follow-up tasks will be created as frontend preview only.", "可以审核并发布。以下后续任务只作为前端预览创建。"],
  ["Intent", "意图"],
  ["Clarify", "澄清"],
  ["Generate", "生成"],
  ["Challenge", "挑战"],
  ["Budget:", "预算："],
  ["Senior scope may exceed current band unless ownership is narrowed.", "如果不收窄 ownership，高级岗位范围可能超出当前预算带。"],
  ["Talent pool:", "人才池："],
  ["Workflow-system experience is rarer than general backend API experience.", "工作流系统经验比通用后端 API 经验更稀缺。"],
  ["Interview risk:", "面试风险："],
  ["If Tech Lead and Backend Staff both interview, keep evidence areas separate to avoid duplicate questions.", "如果 Tech Lead 和 Backend Staff 都参与面试，需要拆开证据维度，避免重复提问。"],
  ["Condition risk:", "条件风险："],
  ["Saturday release support must be stated clearly as occasional launch coverage, not normalized overtime.", "周六发布支持必须明确为偶发上线保障，而不是常态化加班。"],
  ["Approve when this reflects the role. I will ask which mailbox should receive the package before marking Job Creation complete.", "确认它符合岗位后，我会先询问岗位包发送到哪个邮箱；发送成功后 Job Creation 才算完成。"],
  ["Launch", "发布"],
  ["Approve and Launch", "确认并发布"],
  ["Which mailbox should receive this Job Creation package?", "这个 Job Creation 岗位包要发送到哪个邮箱？"],
  ["Recommended", "推荐"],
  ["Package", "岗位包"],
  ["JD, Scorecard, Workflow, Interview Plan, Challenge notes, and hard conditions.", "JD、Scorecard、Workflow、Interview Plan、Challenge 说明和必要条件。"],
  ["Completion rule", "完成规则"],
  ["Job Creation completes only after the email is sent successfully.", "只有邮件发送成功后，Job Creation 才算正式完成。"],
  ["Enter an email address, then send. The page will stay open after success.", "输入收件邮箱后发送。发送成功后页面保持打开。"],
  ["Send email", "发送邮件"],
  ["Email sent successfully. Job Creation is complete.", "邮件发送成功。Job Creation 已完成。"],
  ["Sent to", "已发送到"],
  ["This prototype keeps the page open so the completed conversation remains visible.", "本原型会保持页面打开，方便继续查看完整对话。"],
  ["Job Creation completed", "Job Creation 已完成"],
  ["Email sent to", "邮件已发送至"],
  ["Please enter the recipient mailbox before I send the package.", "请先输入收件邮箱，我再发送岗位包。"],
  ["Voice input is not available in this browser. Please open this local page in Chrome, or type the hiring need instead.", "当前内置浏览器无法使用语音输入。请用 Chrome 打开这个本地页面，或先改用键盘输入招聘需求。"],
  ["I did not catch any speech. Please hold the button and speak again.", "这次没有识别到语音，请按住按钮再说一次。"],
  ["Job Ready for Intake", "岗位可接收简历"],
  ["JD, Scorecard, Workflow, Interview Plan", "JD、Scorecard、流程、面试计划"],
  ["Next", "下一步"],
  ["Manage this role in Jobs list", "在 Jobs 列表中管理该岗位"],
  ["Job package launched", "岗位包已发布"],
  ["This is a frontend-only preview. No backend write happened.", "这是纯前端预览，没有后端写入。"],
  ["Review AI generated JD and Scorecard.", "审核 AI 生成的 JD 和 Scorecard。"],
  ["Confirm mailbox matching and active intake rules.", "确认邮箱匹配和活跃录入规则。"],
  ["Approve structured interview evidence areas.", "批准结构化面试证据维度。"],
].forEach(([en, zh]) => zhTextMap.set(en, zh));

const enTextMap = new Map();
[...zhTextMap].forEach(([en, zh]) => {
  if (!enTextMap.has(zh)) enTextMap.set(zh, en);
});

const zhPlaceholderMap = new Map([
  ["Ask about pipeline, evidence, risk...", "询问流程、证据、风险..."],
  ["Ask about this mailbox...", "询问这个邮箱..."],
  ["Ask about job setup...", "询问岗位设置..."],
  ["Ask about applications...", "询问申请流程..."],
  ["Ask about candidate history...", "询问候选人历史..."],
  ["Ask about assessment evidence...", "询问测评证据..."],
  ["Ask about founder decisions...", "询问创始人决策..."],
  ["Ask how to unblock...", "询问如何解除阻塞..."],
  ["Ask about hiring metrics...", "询问招聘指标..."],
  ["Ask about analytics...", "询问分析..."],
  ["Ask about this job...", "询问这个岗位..."],
  ["Ask about this inbox...", "询问这个待办箱..."],
  ["Ask about tasks...", "询问任务..."],
  ["Ask about this task...", "询问这个任务..."],
  ["Ask about this queue item...", "询问这个队列项..."],
  ["Ask about this application...", "询问这个申请..."],
  ["Ask about rules or templates...", "询问规则或模板..."],
  ["Ask about mailbox rules...", "询问邮箱规则..."],
  ["例如：我们要招聘一位高级后端工程师，负责招聘 OS 的 API、任务流和数据稳定性，越南混合办公，预算高级级别。", "For example: We need a senior backend engineer to own Hiring OS APIs, task workflows, and data reliability, hybrid in Vietnam, senior budget band."],
  ["Search thread, candidate, job, owner", "搜索邮件线程、候选人、岗位、负责人"],
  ["Search sender, job, attachment", "搜索发件人、岗位、附件"],
  ["Search candidate, job, rubric", "搜索候选人、岗位、Rubric"],
  ["Search jobs, owner, location", "搜索岗位、负责人、地点"],
  ["Search candidate, job, owner", "搜索候选人、岗位、负责人"],
  ["Search name, email, source", "搜索姓名、邮箱、来源"],
  ["Search blocked item, owner, reason", "搜索阻塞项、负责人、原因"],
]);

const enPlaceholderMap = new Map([...zhPlaceholderMap].map(([en, zh]) => [zh, en]));

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function translateInlineText(text, map) {
  return [...map.entries()]
    .sort((a, b) => b[0].length - a[0].length)
    .reduce((result, [source, target]) => {
      if (source.length < 2) return result;
      if (!source || source === target || !result.includes(source)) return result;
      return result.replace(new RegExp(escapeRegExp(source), "g"), target);
    }, text);
}

function replaceTextNode(node, map) {
  const value = node.nodeValue;
  const trimmed = value.trim();
  if (!trimmed) return;
  const translated = map.has(trimmed) ? map.get(trimmed) : translateInlineText(trimmed, map);
  if (translated === trimmed) return;
  node.nodeValue = value.replace(trimmed, translated);
}

function walkText(root, map) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest("[data-no-translate]")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => replaceTextNode(node, map));
}

function applyLanguage(lang) {
  const toZh = lang === "zh";
  walkText(document.body, toZh ? zhTextMap : enTextMap);
  document.querySelectorAll("input[placeholder]").forEach((input) => {
    const map = toZh ? zhPlaceholderMap : enPlaceholderMap;
    if (map.has(input.placeholder)) input.placeholder = map.get(input.placeholder);
  });
  document.documentElement.lang = toZh ? "zh-CN" : "en";
  localStorage.setItem("hireos-language-v2", lang);
  document.querySelectorAll(".language-switch button").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });
}

function currentLanguage() {
  return localStorage.getItem("hireos-language-v2") || "zh";
}

function syncCurrentLanguage() {
  applyLanguage(currentLanguage());
}

function refreshLanguageDynamicContent() {
  updateJobsMetrics();
  renderTaskMetrics();
  renderTasksList();
  renderTaskDetail();
  renderJobSourceTasks();
  renderInboxTaskSourceList();
  renderInboxTaskContract();
  renderMailboxConnectionState();
  renderCandidateTaskMetrics();
  renderCandidateTaskQueue();
  const founderList = document.querySelector("[data-founder-task-list]");
  const store = getTasksStore();
  if (founderList && store) {
    const founderTasks = store.listTasks().filter(isFounderDecisionTask);
    renderFounderTaskMetrics(founderTasks);
    renderFounderTaskCards(founderTasks);
    renderFounderInspector(founderTasks);
  }
  refreshIcons();
}

function setSidebarState(collapsed, persist = true) {
  document.body.classList.toggle("sidebar-collapsed", collapsed);
  document.body.classList.remove("account-menu-open");
  if (persist) {
    localStorage.setItem("hireos-sidebar-collapsed", collapsed ? "true" : "false");
  }
  document.querySelectorAll(".sidebar-toggle").forEach((button) => {
    setToggleIcon(button, "panel-left-close", "收起侧边栏");
  });
  document.querySelectorAll(".sidebar-logo-toggle").forEach((button) => {
    if (collapsed) {
      setToggleIcon(button, "panel-left-open", "展开侧边栏");
    } else {
      button.textContent = "H";
      button.setAttribute("aria-label", "HireOS");
      button.setAttribute("title", "HireOS");
      refreshIcons();
    }
  });
}

const primaryNavItems = [
  { label: "Tasks", href: "./hireos-tasks.html", icon: "list-checks", count: "4", match: ["hireos-tasks.html", "hireos-task-detail.html"] },
  { label: "Dashboard", href: "./hireos-dashboard-design.html", icon: "layout-dashboard" },
  { label: "Settings", href: "./hireos-settings.html", icon: "settings", match: ["hireos-settings.html", "hireos-settings-mailbox.html"] },
];

function isNavItemActive(item, currentFile) {
  const matches = item.match || [item.href.replace("./", "")];
  return matches.includes(currentFile);
}

function navItemMarkup(item, currentFile) {
  const active = isNavItemActive(item, currentFile) ? " active" : "";
  const count = item.count ? `<span class="count">${item.count}</span>` : "";
  return `<a class="nav-item${active}" href="${item.href}"><i data-lucide="${item.icon}"></i><span>${item.label}</span>${count}</a>`;
}

function ensureTasksNav() {
  const operateNav = document.querySelector(".nav");
  if (!operateNav) return;
  const currentFile = window.location.pathname.split("/").pop() || "hireos-tasks.html";
  operateNav.innerHTML = primaryNavItems.map((item) => navItemMarkup(item, currentFile)).join("");
  const navSection = document.querySelector(".nav-section");
  if (navSection) navSection.textContent = "Operate";
}

document.querySelectorAll(".sidebar-toggle, .sidebar-logo-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    setSidebarState(!document.body.classList.contains("sidebar-collapsed"));
  });
});

document.querySelectorAll(".agent-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    if (document.body.dataset.page === "tasks") return;
    const collapsed = document.body.classList.toggle("agent-collapsed");
    if (!collapsed) {
      document.body.classList.remove("dock-expanded");
    }
    setToggleIcon(button, collapsed ? "panel-right-open" : "panel-right-close", collapsed ? "展开 Agent" : "收起 Agent");
  });
});

document.querySelectorAll(".agent-dock-bar").forEach((button) => {
  button.addEventListener("click", () => {
    document.body.classList.toggle("dock-expanded");
  });
});

document.querySelectorAll(".agent-dock-prompts button").forEach((button) => {
  button.addEventListener("click", () => {
    document.body.classList.remove("agent-collapsed", "dock-expanded");
    document.querySelectorAll(".agent-toggle").forEach((toggle) => {
      setToggleIcon(toggle, "panel-right-close", "收起 Agent");
    });
  });
});

document.querySelectorAll(".user-status, .account-toggle").forEach((target) => {
  target.addEventListener("click", (event) => {
    event.stopPropagation();
    if (document.body.classList.contains("sidebar-collapsed")) return;
    const open = document.body.classList.toggle("account-menu-open");
    document.querySelectorAll(".user-status").forEach((status) => {
      status.setAttribute("aria-expanded", String(open));
    });
  });
});

document.querySelectorAll(".language-switch button").forEach((button) => {
  const label = button.textContent.trim();
  button.dataset.lang = label === "中文" ? "zh" : "en";
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    applyLanguage(button.dataset.lang);
    refreshLanguageDynamicContent();
  });
});

document.addEventListener("click", () => {
  document.body.classList.remove("account-menu-open");
});

const jobsFilterState = {
  status: "all",
  job: "all",
};

const jobFilterAliases = {
  job_senior_backend: "backend",
  senior_backend: "backend",
  backend: "backend",
  job_product_designer: "designer",
  product_designer: "designer",
  designer: "designer",
  job_gtm_lead: "gtm",
  gtm_lead: "gtm",
  gtm: "gtm",
  job_finance_director: "finance_director",
  finance_director: "finance_director",
  finance: "finance_director",
  job_strategic_investment_associate: "investment_associate",
  strategic_investment_associate: "investment_associate",
  investment_associate: "investment_associate",
};

const HIREOS_JOBS_STORAGE_KEY = "hireos-jobs-store-v1";
const HIREOS_SUPABASE_JOBS_TABLE = "hireos_jobs";
const HIREOS_SUPABASE_JOB_EVENTS_TABLE = "hireos_job_events";
let supabaseJobsWarningShown = false;

function canPersistJobs() {
  return Boolean(window.localStorage);
}

function toPositiveInteger(value, fallback = 0) {
  const number = Number.parseInt(value, 10);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function normalizeJobRecord(job) {
  const headcount = Math.max(1, toPositiveInteger(job.headcount, 1));
  const filledCount = Math.min(Math.max(0, toPositiveInteger(job.filledCount, 0)), 999);
  const manuallyClosed = job.closedManually === true;
  const status = manuallyClosed || filledCount >= headcount ? "Closed" : "Active";
  return {
    id: job.id,
    title: String(job.title || "New Role").trim() || "New Role",
    department: String(job.department || "Hiring Team").trim() || "Hiring Team",
    owner: String(job.owner || "Linh Tran").trim() || "Linh Tran",
    location: String(job.location || "Vietnam hybrid").trim() || "Vietnam hybrid",
    headcount,
    filledCount,
    status,
    closedManually: manuallyClosed,
    createdAt: job.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function normalizeSupabaseStatus(status) {
  return String(status || "").toLowerCase() === "closed" ? "Closed" : "Active";
}

function supabaseConfig() {
  const config = window.HIREOS_SUPABASE_CONFIG || {};
  const url = String(config.url || "").replace(/\/$/, "");
  const key = String(config.publishableKey || config.anonKey || "").trim();
  if (!url || !key) return null;
  return { url, key };
}

function supabaseHeaders(extra = {}) {
  const config = supabaseConfig();
  if (!config) return {};
  return {
    apikey: config.key,
    authorization: `Bearer ${config.key}`,
    "content-type": "application/json",
    ...extra,
  };
}

function supabaseTableUrl(table, query = "") {
  const config = supabaseConfig();
  if (!config) return "";
  return `${config.url}/rest/v1/${table}${query}`;
}

function jobFromSupabaseRow(row) {
  return normalizeJobRecord({
    id: row.id,
    title: row.title,
    department: row.department,
    owner: row.owner_name,
    location: row.location,
    headcount: row.headcount,
    filledCount: row.filled_count,
    status: normalizeSupabaseStatus(row.status),
    closedManually: row.closed_reason === "manual",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function jobToSupabaseRow(job) {
  const normalized = normalizeJobRecord(job);
  return {
    id: normalized.id,
    title: normalized.title,
    department: normalized.department,
    owner_name: normalized.owner,
    location: normalized.location,
    headcount: normalized.headcount,
    filled_count: normalized.filledCount,
    status: normalized.status.toLowerCase(),
    closed_reason: normalized.status === "Closed"
      ? normalized.closedManually ? "manual" : "headcount_filled"
      : null,
    updated_at: new Date().toISOString(),
  };
}

async function fetchSupabaseJobs() {
  if (!supabaseConfig()) return [];
  const response = await fetch(supabaseTableUrl(HIREOS_SUPABASE_JOBS_TABLE, "?select=*&order=created_at.desc"), {
    headers: supabaseHeaders(),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(body || `Supabase jobs read failed: ${response.status}`);
  }
  const rows = await response.json();
  return Array.isArray(rows) ? rows.map(jobFromSupabaseRow) : [];
}

async function insertSupabaseJobEvent(job, eventType, payload = {}) {
  if (!supabaseConfig()) return;
  await fetch(supabaseTableUrl(HIREOS_SUPABASE_JOB_EVENTS_TABLE), {
    method: "POST",
    headers: supabaseHeaders({ prefer: "return=minimal" }),
    body: JSON.stringify({
      job_id: job.id,
      event_type: eventType,
      event_payload: payload,
    }),
  });
}

async function saveJobToSupabase(job, eventType = "edited", payload = {}) {
  if (!supabaseConfig()) return;
  const response = await fetch(supabaseTableUrl(HIREOS_SUPABASE_JOBS_TABLE, "?on_conflict=id"), {
    method: "POST",
    headers: supabaseHeaders({ prefer: "resolution=merge-duplicates,return=representation" }),
    body: JSON.stringify(jobToSupabaseRow(job)),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(body || `Supabase jobs write failed: ${response.status}`);
  }
  await insertSupabaseJobEvent(normalizeJobRecord(job), eventType, payload);
}

function warnSupabaseJobsSync(error) {
  if (supabaseJobsWarningShown || !supabaseConfig()) return;
  supabaseJobsWarningShown = true;
  showHireOSToast(`Supabase 未完成连接：${error.message || "请先建 jobs 表"}`);
}

function scheduleSupabaseJobSave(job, eventType, payload) {
  if (!supabaseConfig()) return;
  saveJobToSupabase(job, eventType, payload).catch(warnSupabaseJobsSync);
}

function readCreatedJobs() {
  if (!canPersistJobs()) return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(HIREOS_JOBS_STORAGE_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((job) => job && job.id).map(normalizeJobRecord);
  } catch (error) {
    return [];
  }
}

function writeCreatedJobs(jobs) {
  if (!canPersistJobs()) return;
  window.localStorage.setItem(HIREOS_JOBS_STORAGE_KEY, JSON.stringify(jobs.map(normalizeJobRecord)));
}

function upsertCreatedJob(job) {
  const normalized = normalizeJobRecord(job);
  const jobs = readCreatedJobs();
  const index = jobs.findIndex((item) => item.id === normalized.id);
  const eventType = normalized.status === "Closed" && normalized.filledCount >= normalized.headcount && !normalized.closedManually
    ? "auto_closed"
    : index >= 0 ? "edited" : "created";
  if (index >= 0) {
    jobs[index] = { ...jobs[index], ...normalized };
  } else {
    jobs.unshift(normalized);
  }
  writeCreatedJobs(jobs);
  scheduleSupabaseJobSave(normalized, eventType, { source: "jobs_list" });
  return normalized;
}

function closeCreatedJob(jobId) {
  const jobs = readCreatedJobs();
  const index = jobs.findIndex((job) => job.id === jobId);
  if (index < 0) return null;
  jobs[index] = normalizeJobRecord({ ...jobs[index], status: "Closed", closedManually: true });
  writeCreatedJobs(jobs);
  scheduleSupabaseJobSave(jobs[index], "closed", { reason: "manual" });
  return jobs[index];
}

function createdJobIdFromTitle(title) {
  const slug = String(title || "new-role").toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "_").replace(/^_|_$/g, "");
  return `created_${slug || "new_role"}_${Date.now().toString(36)}`;
}

function inferHeadcountFromMessages(messages) {
  const text = (messages || []).join(" ");
  const match = text.match(/(\d+)\s*(?:人|位|个|名|hc|headcount|head count)/i);
  return match ? Math.max(1, toPositiveInteger(match[1], 1)) : 1;
}

function inferLocationFromMessages(messages) {
  const text = (messages || []).join(" ");
  const match = text.match(/(?:胡志明市|河内|Ho Chi Minh|Hanoi|Remote|remote|Hybrid|hybrid|远程|混合办公)[^，。,.]*/i);
  return match ? match[0] : "Vietnam hybrid";
}

function saveCreatedJobFromIntake(messages, email) {
  const draft = deriveAiIntakeDraft(messages);
  return upsertCreatedJob({
    id: createdJobIdFromTitle(draft.roleTitle),
    title: draft.roleTitle,
    department: /finance|财务/i.test(draft.roleTitle) ? "Finance" : "Product & Engineering",
    owner: currentTaskOwnerName(),
    location: inferLocationFromMessages(messages),
    headcount: inferHeadcountFromMessages(messages),
    filledCount: 0,
    status: "Active",
    recipientEmail: email,
  });
}

const jobsMetricPresets = {
  all: [
    ["活跃岗位", "12", "8 个岗位已完整配置"],
    ["暂停岗位", "2", "不参与邮件自动匹配"],
    ["JD 草稿", "4", "需要创始人确认"],
    ["流程缺口", "6", "Scorecard 或评分标准不完整"],
  ],
  active: [
    ["活跃岗位", "12", "8 个岗位已完整配置"],
    ["活跃申请", "168", "正在推进的岗位申请"],
    ["今日到期", "22", "主要是面试反馈"],
    ["异常流程", "9", "创始人可见"],
  ],
  paused: [
    ["暂停岗位", "2", "不参与邮件自动匹配"],
    ["保留申请", "38", "仍可查看历史流程"],
    ["待恢复", "1", "等待创始人确认"],
    ["匹配关闭", "2", "邮箱不自动创建申请"],
  ],
  draft: [
    ["草稿岗位", "4", "创建后可继续修改"],
    ["JD 草稿", "4", "需要创始人确认"],
    ["流程缺口", "6", "缺少默认负责人或 SLA"],
    ["匹配阻断", "4", "未进入自动匹配"],
  ],
  closed: [
    ["已关闭岗位", "0", "当前筛选无成员"],
    ["历史申请", "0", "未展示在当前列表"],
    ["邮箱匹配", "0", "关闭岗位不匹配"],
    ["待归档", "0", "暂无"],
  ],
  backend: [
    ["岗位申请", "74", "高级后端工程师"],
    ["活跃流程", "29", "当前处于测评阶段"],
    ["阻塞项", "3", "需要 HR 跟进"],
    ["Scorecard", "92%", "证据维度覆盖"],
  ],
  designer: [
    ["岗位申请", "43", "产品设计师"],
    ["活跃流程", "31", "当前处于面试阶段"],
    ["反馈逾期", "4", "需要面试官提交"],
    ["Scorecard", "66%", "部分完成"],
  ],
  gtm: [
    ["岗位申请", "38", "GTM 负责人"],
    ["岗位状态", "暂停", "邮件匹配关闭"],
    ["Offer 决策", "1", "等待创始人"],
    ["Scorecard", "74%", "已就绪"],
  ],
  finance_director: [
    ["岗位申请", "18", "Finance Director"],
    ["活跃流程", "7", "当前处于创始人审核"],
    ["财务案例", "2", "等待评分校准"],
    ["Scorecard", "81%", "控制、合规、融资维度已覆盖"],
  ],
  investment_associate: [
    ["岗位申请", "26", "Strategic Investment Associate"],
    ["活跃流程", "12", "当前处于投资面试和建模测评"],
    ["建模测评", "4", "等待投资团队反馈"],
    ["Scorecard", "78%", "研究、模型、投资判断维度已覆盖"],
  ],
  platform: [
    ["岗位申请", "29", "平台工程师"],
    ["岗位状态", "草稿", "邮件匹配阻断"],
    ["流程缺口", "2", "缺少默认值"],
    ["Scorecard", "草稿", "待确认"],
  ],
};

function updateJobsMetrics() {
  const metrics = document.querySelectorAll("[data-job-metric]");
  if (!metrics.length) return;
  const presetKey = jobsFilterState.job !== "all" ? jobsFilterState.job : jobsFilterState.status;
  const preset = jobsMetricPresets[presetKey] || jobsMetricPresets.all;
  metrics.forEach((metric, index) => {
    const data = preset[index];
    if (!data) return;
    const label = metric.querySelector(".metric-label");
    const value = metric.querySelector("strong");
    const note = metric.querySelector("small");
    const icon = label?.querySelector("svg");
    if (label) {
      label.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) node.nodeValue = "";
      });
      label.prepend(document.createTextNode(data[0] + " "));
      if (icon && !label.contains(icon)) label.append(icon);
    }
    if (value) value.textContent = data[1];
    if (note) note.textContent = data[2];
  });
  syncCurrentLanguage();
}

function createdJobStatusTone(status) {
  return status === "Closed" ? "danger" : "green";
}

function createdJobStatusLabel(job) {
  if (job.status === "Closed" && job.filledCount >= job.headcount) return "Closed · Headcount filled";
  return job.status;
}

function createdJobFilterChipMarkup(job) {
  return `<button class="filter-chip" data-filter-group="job" data-filter-value="${escapeHTML(job.id)}" data-created-job-chip><i data-lucide="briefcase-business"></i>${escapeHTML(job.title)}</button>`;
}

function createdJobSummaryMarkup(job) {
  return `
    <div class="job-summary-strip is-hidden" data-job-summary data-job="${escapeHTML(job.id)}" data-created-job-summary>
      <div><span>Owner</span><strong>${escapeHTML(job.owner)}</strong></div>
      <div><span>Headcount</span><strong>${job.filledCount}/${job.headcount}</strong></div>
      <div><span>Status</span><strong class="summary-status-tag">${escapeHTML(createdJobStatusLabel(job))}</strong></div>
      <div><span>Location</span><strong>${escapeHTML(job.location)}</strong></div>
    </div>
  `;
}

function renderCreatedJobsUI() {
  const jobs = readCreatedJobs();
  const filterOptions = document.querySelector(".filter-options");
  const list = document.querySelector(".job-candidate-list");
  if (!filterOptions || !list) return;
  filterOptions.querySelectorAll("[data-created-job-chip]").forEach((node) => node.remove());
  document.querySelectorAll("[data-created-job-summary]").forEach((node) => node.remove());
  filterOptions.insertAdjacentHTML("beforeend", jobs.map(createdJobFilterChipMarkup).join(""));
  const section = document.querySelector(".unframed-section");
  const listHead = section?.querySelector(".job-candidate-list");
  if (listHead && jobs.length) {
    listHead.insertAdjacentHTML("beforebegin", jobs.map(createdJobSummaryMarkup).join(""));
  }
}

function updateJobsList() {
  const rows = document.querySelectorAll("[data-job-row]");
  if (!rows.length) return;
  let visibleCount = 0;
  document.querySelectorAll("[data-jobs-back]").forEach((back) => {
    back.classList.toggle("is-hidden", jobsFilterState.job === "all");
  });
  document.querySelectorAll("[data-job-summary]").forEach((summary) => {
    summary.classList.toggle("is-hidden", jobsFilterState.job === "all" || summary.dataset.job !== jobsFilterState.job);
  });
  rows.forEach((row) => {
    const statusMatch = jobsFilterState.status === "all" || row.dataset.status === jobsFilterState.status;
    const jobMatch = jobsFilterState.job === "all" || row.dataset.job === jobsFilterState.job;
    const visible = statusMatch && jobMatch;
    row.classList.toggle("is-hidden", !visible);
    if (visible) visibleCount += 1;
  });
  const empty = document.querySelector("[data-jobs-empty]");
  if (empty) empty.classList.toggle("is-hidden", visibleCount > 0);
  updateJobDetailFixedActions();
}

function updateJobFilterChips() {
  document.querySelectorAll("[data-filter-group][data-filter-value]").forEach((chip) => {
    const group = chip.dataset.filterGroup;
    chip.classList.toggle("active", jobsFilterState[group] === chip.dataset.filterValue);
  });
}

function refreshJobsPage() {
  renderCreatedJobsUI();
  updateJobFilterChips();
  updateJobsMetrics();
  updateJobsList();
  refreshIcons();
}

async function initSupabaseJobsSync() {
  if (!document.querySelector('body[data-page="jobs"]') || !supabaseConfig()) return;
  try {
    const jobs = await fetchSupabaseJobs();
    if (jobs.length) {
      writeCreatedJobs(jobs);
      refreshJobsPage();
      showHireOSToast("Supabase Jobs 已连接");
    }
  } catch (error) {
    warnSupabaseJobsSync(error);
  }
}

function initJobsFilters() {
  renderCreatedJobsUI();
  const filterOptions = document.querySelector(".filter-options");
  if (!filterOptions) return;
  const params = new URLSearchParams(window.location.search);
  const jobParam = params.get("job");
  const createdJobIds = new Set(readCreatedJobs().map((job) => job.id));
  const initialJob = jobFilterAliases[jobParam] || (createdJobIds.has(jobParam) ? jobParam : "all");
  jobsFilterState.job = initialJob;
  updateJobFilterChips();
  if (filterOptions.dataset.jobsFilterReady !== "true") {
    filterOptions.dataset.jobsFilterReady = "true";
    filterOptions.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-filter-group][data-filter-value]");
      if (!chip) return;
      event.preventDefault();
      jobsFilterState[chip.dataset.filterGroup] = chip.dataset.filterValue;
      updateJobFilterChips();
      updateJobsMetrics();
      updateJobsList();
    });
  }
  updateJobsMetrics();
  updateJobsList();
}

function selectedJobLabel() {
  const chip = document.querySelector(`[data-filter-group="job"][data-filter-value="${jobsFilterState.job}"]`);
  return chip?.textContent.trim() || "Selected Job";
}

function jobFilterForTaskPosition(position) {
  const normalized = String(position || "").toLowerCase();
  if (/backend/.test(normalized)) return "backend";
  if (/designer|design/.test(normalized)) return "designer";
  if (/gtm/.test(normalized)) return "gtm";
  if (/finance/.test(normalized)) return "finance_director";
  if (/investment/.test(normalized)) return "investment_associate";
  return "all";
}

function aiIntakeJobHref(task) {
  return `./hireos-jobs.html?job=${encodeURIComponent(jobFilterForTaskPosition(task.position))}&created=job_creation`;
}

function updateJobDetailFixedActions() {
  const main = document.querySelector('body[data-page="jobs"] main.main');
  if (!main) return;
  let fixed = document.querySelector("[data-job-fixed-actions]");
  fixed?.remove();
  if (jobsFilterState.job === "all") {
    return;
  }
  const summary = document.querySelector(`[data-job-summary][data-job="${jobsFilterState.job}"]`);
  if (!summary) return;
  fixed = document.createElement("div");
  fixed.className = "job-detail-actions is-bottom-fixed";
  fixed.dataset.jobFixedActions = "true";
  fixed.setAttribute("data-no-translate", "");
  const createdJob = readCreatedJobs().find((job) => job.id === jobsFilterState.job);
  const closeDisabled = createdJob?.status === "Closed" ? " disabled" : "";
  fixed.innerHTML = createdJob
    ? `
      <span class="pill ${createdJobStatusTone(createdJob.status)}">Job Creation · ${selectedJobLabel()}</span>
      <button type="button" data-job-detail-action="edit" data-created-job-edit="${escapeHTML(jobsFilterState.job)}" data-success="Job editing opened">编辑岗位</button>
      <button type="button" data-job-detail-action="close" data-created-job-close="${escapeHTML(jobsFilterState.job)}" data-success="Job closed"${closeDisabled}>关闭岗位</button>
    `
    : `
      <span class="pill green">Job Creation · ${selectedJobLabel()}</span>
      <button type="button" data-job-detail-action="edit" data-success="Job editing opened">编辑岗位</button>
      <button type="button" data-job-detail-action="close" data-success="Job closed">关闭岗位</button>
    `;
  main.appendChild(fixed);
}

function ensureCreatedJobEditModal() {
  let backdrop = document.querySelector("[data-created-job-edit-modal]");
  if (backdrop) return backdrop;
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal-backdrop is-hidden" data-created-job-edit-modal>
      <section class="mail-connect-modal job-create-modal" role="dialog" aria-modal="true" aria-labelledby="created-job-edit-title">
        <header class="modal-header">
          <div>
            <h2 id="created-job-edit-title">编辑岗位</h2>
            <p>只修改 Jobs 列表里的岗位管理字段。已录用人数达到岗位人数时会自动关闭。</p>
          </div>
          <button class="icon-button" type="button" aria-label="关闭编辑" title="关闭" data-created-job-edit-close><i data-lucide="x"></i></button>
        </header>
        <div class="connect-panels">
          <form class="job-form-grid" data-created-job-edit-form>
            <input type="hidden" name="id" />
            <label class="form-field">岗位名称<input name="title" required /></label>
            <label class="form-field">部门 / 团队<input name="department" /></label>
            <label class="form-field">负责人<input name="owner" /></label>
            <label class="form-field">地点<input name="location" /></label>
            <label class="form-field">岗位人数<input name="headcount" type="number" min="1" step="1" required /></label>
            <label class="form-field">已录用人数<input name="filledCount" type="number" min="0" step="1" required /></label>
          </form>
        </div>
        <footer class="modal-footer">
          <span class="intake-status" data-created-job-edit-note>保存后会刷新 Jobs 列表。</span>
          <button class="ghost-button" type="button" data-created-job-edit-close>取消</button>
          <button class="primary-button" type="submit" form="created-job-edit-form" data-created-job-save>保存岗位</button>
        </footer>
      </section>
    </div>
  `);
  backdrop = document.querySelector("[data-created-job-edit-modal]");
  const form = backdrop.querySelector("[data-created-job-edit-form]");
  form.id = "created-job-edit-form";
  backdrop.querySelectorAll("[data-created-job-edit-close]").forEach((button) => {
    button.addEventListener("click", () => closeCreatedJobEditModal());
  });
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) closeCreatedJobEditModal();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const existing = readCreatedJobs().find((job) => job.id === form.elements.id.value);
    if (!existing) return;
    const saved = upsertCreatedJob({
      ...existing,
      title: form.elements.title.value,
      department: form.elements.department.value,
      owner: form.elements.owner.value,
      location: form.elements.location.value,
      headcount: form.elements.headcount.value,
      filledCount: form.elements.filledCount.value,
    });
    jobsFilterState.job = saved.id;
    closeCreatedJobEditModal();
    refreshJobsPage();
    showHireOSToast(saved.status === "Closed" && saved.filledCount >= saved.headcount ? `${saved.title} 人数已满，已自动关闭` : `${saved.title} 已保存`);
  });
  return backdrop;
}

function openCreatedJobEditModal(job) {
  const modal = ensureCreatedJobEditModal();
  const form = modal.querySelector("[data-created-job-edit-form]");
  form.elements.id.value = job.id;
  form.elements.title.value = job.title;
  form.elements.department.value = job.department;
  form.elements.owner.value = job.owner;
  form.elements.location.value = job.location;
  form.elements.headcount.value = job.headcount;
  form.elements.filledCount.value = job.filledCount;
  modal.classList.remove("is-hidden");
  document.body.classList.add("modal-open");
  form.elements.title.focus();
  refreshIcons();
}

function closeCreatedJobEditModal() {
  const modal = document.querySelector("[data-created-job-edit-modal]");
  if (!modal) return;
  modal.classList.add("is-hidden");
  document.body.classList.remove("modal-open");
}

function initJobDetailFixedActions() {
  const main = document.querySelector('body[data-page="jobs"] main.main');
  if (!main || main.dataset.jobDetailActionsReady === "true") return;
  main.dataset.jobDetailActionsReady = "true";
  main.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-job-fixed-actions] [data-more-menu-toggle]");
    if (toggle) {
      event.preventDefault();
      toggle.closest(".more-menu")?.classList.toggle("is-open");
      return;
    }
    const editAction = event.target.closest("[data-created-job-edit]");
    if (editAction) {
      const job = readCreatedJobs().find((item) => item.id === editAction.dataset.createdJobEdit);
      if (job) openCreatedJobEditModal(job);
      return;
    }
    const closeAction = event.target.closest("[data-created-job-close]");
    if (closeAction) {
      const job = closeCreatedJob(closeAction.dataset.createdJobClose);
      if (job) {
        refreshJobsPage();
        showHireOSToast(`${job.title} 已关闭`);
      }
      return;
    }
    const action = event.target.closest("[data-job-detail-action], [data-job-fixed-actions] [data-surface-action]");
    if (!action) return;
    event.preventDefault();
    const result = action.dataset.success || `${action.textContent.trim()} completed`;
    const summary = document.querySelector(`[data-job-summary][data-job="${jobsFilterState.job}"]`);
    if (summary) {
      summary.classList.add("is-updated");
      const status = summary.querySelector("div:nth-child(3) strong");
      if (status && action.dataset.jobDetailAction === "publish") status.textContent = "Open";
      if (status && action.dataset.jobDetailAction === "close") status.textContent = "Closed";
    }
    showHireOSToast(result);
  });
}

function showHireOSToast(message) {
  let toast = document.querySelector("[data-hireos-toast]");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "hireos-toast";
    toast.dataset.hireosToast = "true";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  window.clearTimeout(showHireOSToast.timer);
  showHireOSToast.timer = window.setTimeout(() => {
    toast.remove();
  }, 2600);
}

function moreMenuHTML(actions) {
  if (!actions?.length) return "";
  return `<span class="more-menu"><button class="more-menu-button" type="button" data-more-menu-toggle>More</button><span class="more-menu-list">${actions
    .slice(0, 2)
    .map((action) => `<button type="button" data-surface-action="${action.action}" data-success="${action.success}">${action.label}</button>`)
    .join("")}</span></span>`;
}

function jobRowCTAs(round) {
  if (/Screening/i.test(round)) {
    return {
      primary: ["Shortlist", "Candidate moved to HR Interview"],
      secondary: ["淘汰", "Candidate rejected"],
      more: [
        { label: "补充信息", action: "request-info", success: "Missing information task created" },
        { label: "加入人才库", action: "talent-pool", success: "Candidate added to talent pool" },
      ],
    };
  }
  if (/Offer/i.test(round)) {
    return {
      primary: ["查看 Offer", "Offer opened from candidate detail"],
      secondary: ["联系候选人", "Candidate communication task created"],
      more: [{ label: "重新分配", action: "reassign", success: "Owner reassigned" }],
    };
  }
  if (/Exception/i.test(round)) {
    return {
      primary: ["解决异常", "Exception resolved"],
      secondary: ["升级处理", "Exception escalated"],
      more: [
        { label: "重新分配", action: "reassign", success: "Owner reassigned" },
        { label: "关闭异常", action: "close-exception", success: "Exception closed with reason" },
      ],
    };
  }
  if (/Communication/i.test(round)) {
    return {
      primary: ["发送跟进", "Follow-up message sent"],
      secondary: ["查看候选人", "Candidate detail opened"],
      more: [{ label: "重新分配", action: "reassign", success: "Owner reassigned" }],
    };
  }
  if (/Interview|Assessment/i.test(round)) {
    return {
      primary: ["查看结果", "Candidate detail opened"],
      secondary: ["发送提醒", "Reminder sent"],
      more: [{ label: "重新分配", action: "reassign", success: "Owner reassigned" }],
    };
  }
  return {
    primary: ["查看候选人", "Candidate detail opened"],
    secondary: ["发送提醒", "Reminder sent"],
    more: [{ label: "重新分配", action: "reassign", success: "Owner reassigned" }],
  };
}

function initJobCandidateActions() {
  const list = document.querySelector(".job-candidate-list");
  if (!list || list.dataset.actionsReady === "true") return;
  list.dataset.actionsReady = "true";
  list.querySelectorAll("[data-job-row]").forEach((row, index) => {
    const href = row.getAttribute("href") || "./hireos-application-detail.html";
    row.dataset.applicationHref = `${href}?application=${encodeURIComponent(["app_trang_backend", "app_minh_gtm", "app_anh_designer", "app_anh_designer", "app_anh_designer", "app_minh_gtm", "app_quang_platform"][index] || "app_trang_backend")}`;
    row.setAttribute("href", row.dataset.applicationHref);
  });
}

const candidateStageCTA = {
  app_trang_backend: {
    stage: "Candidate Screening",
    workflowAction: "shortlist",
    primary: ["Shortlist", "Candidate shortlisted; HR Interview scheduling task created"],
    secondary: ["Need More Info", "Missing information task created"],
    more: [
      { label: "查看证据", action: "evidence", success: "Evidence opened" },
      { label: "淘汰", action: "reject", success: "Candidate rejected" },
    ],
  },
  app_anh_designer: {
    stage: "Interview Evaluation",
    primary: ["提交评价", "Interview evaluation submitted"],
    secondary: ["保存草稿", "Evaluation draft saved"],
    more: [
      { label: "查看证据", action: "evidence", success: "Evidence opened" },
      { label: "请求补充反馈", action: "request-feedback", success: "Feedback request sent" },
    ],
  },
  app_minh_gtm: {
    stage: "Offer",
    primary: ["发送 Offer", "Offer sent"],
    secondary: ["预览 Offer", "Offer preview opened"],
    more: [{ label: "撤回 Offer", action: "withdraw-offer", success: "Offer withdrawn" }],
  },
  app_quang_platform: {
    stage: "Exception Handling",
    primary: ["重新分配", "Owner reassigned"],
    secondary: ["升级处理", "Exception escalated"],
    more: [
      { label: "关闭异常", action: "close-exception", success: "Exception closed with reason" },
      { label: "恢复流程", action: "restore-flow", success: "Workflow restored" },
    ],
  },
};

function initCandidateDetailActions() {
  const topActions = document.querySelector("body:not([data-page]) .topbar .top-actions");
  const detail = document.querySelector("[data-task-sink='application-detail']");
  if (!topActions || !detail) return;
  const id = new URLSearchParams(window.location.search).get("application") || "app_trang_backend";
  const cta = candidateStageCTA[id] || candidateStageCTA.app_trang_backend;
  topActions.innerHTML = "";
  let fixedActions = document.querySelector("[data-candidate-fixed-actions]");
  if (!fixedActions) {
    fixedActions = document.createElement("div");
    fixedActions.dataset.candidateFixedActions = "true";
    document.querySelector("main.main")?.appendChild(fixedActions);
  }
  fixedActions.className = "candidate-stage-actions is-bottom-fixed";
  fixedActions.setAttribute("data-no-translate", "");
  fixedActions.innerHTML = `
    <span class="pill green">${cta.stage}</span>
    <button class="primary-row-action" type="button" data-candidate-action data-candidate-workflow-action="${cta.workflowAction || ""}" data-success="${cta.primary[1]}">${cta.primary[0]}</button>
    <button type="button" data-candidate-action data-success="${cta.secondary[1]}">${cta.secondary[0]}</button>
    ${moreMenuHTML(cta.more)}
  `;
  if (!document.querySelector("[data-candidate-activity-log]")) {
    detail.insertAdjacentHTML("afterend", `<section class="candidate-activity-log is-visible" data-candidate-activity-log><strong>Activity</strong><span class="candidate-action-result">等待当前阶段操作。</span></section>`);
  }
  fixedActions.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-more-menu-toggle]");
    if (toggle) {
      event.preventDefault();
      toggle.closest(".more-menu")?.classList.toggle("is-open");
      return;
    }
    const action = event.target.closest("[data-candidate-action], [data-surface-action]");
    if (!action) return;
    const label = action.textContent.trim();
    let result = action.dataset.success || `${label} completed`;
    if (action.dataset.candidateWorkflowAction === "shortlist") {
      const shortlistResult = shortlistCurrentApplication(id);
      if (shortlistResult?.nextTask) result = shortlistResult.nextTask.title || result;
      if (typeof refreshTaskSinkPageFromStorage === "function") refreshTaskSinkPageFromStorage();
    }
    const log = document.querySelector("[data-candidate-activity-log] .candidate-action-result");
    if (log) log.textContent = `${result} · ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    const state = document.querySelector(".application-basic-card .detail-field-row:nth-child(2) strong");
    if (state && /Shortlist|进入终面|发送 Offer|重新分配|提交评价/.test(label)) state.textContent = "Ready for Next Action";
    showHireOSToast(result);
    action.setAttribute("data-completed", "true");
  });
  syncCurrentLanguage();
  refreshIcons();
}

function shortlistCurrentApplication(applicationId) {
  const taskApi = window.HireOSTasks;
  const taskStore = getFreshTasksStore();
  const reviewStore = taskApi?.reviewStateStore;
  if (!taskApi?.createCandidateScreeningTask || !reviewStore?.shortlistCandidateForApplication) return null;
  const screeningTask =
    taskStore
      ?.listTasks({ view: "all" })
      .find((task) => task.task_type === "Candidate Review" && task.related_application_id === applicationId && task.status !== "Done") ||
    taskApi.createCandidateScreeningTask(taskStore, {
      jobId: "job_senior_backend",
      jobTitle: "Senior Backend Engineer",
      candidateId: "cand_trang_nguyen",
      applicationId,
      ownerId: currentTaskOwnerId,
    });
  return reviewStore.shortlistCandidateForApplication({
    taskStore,
    taskId: screeningTask?.task_id,
    applicationId,
    actor_user_id: currentTaskOwnerId,
  });
}

function initJobDetailTabs() {
  const tabs = document.querySelectorAll("[data-job-detail-tab]");
  const panels = document.querySelectorAll("[data-job-detail-panel]");
  if (!tabs.length || !panels.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.jobDetailTab;
      tabs.forEach((item) => item.classList.toggle("active", item === tab));
      panels.forEach((panel) => {
        panel.classList.toggle("is-hidden", panel.dataset.jobDetailPanel !== target);
      });
    });
  });
}

function initInboxWorkTabs() {
  const tabs = document.querySelectorAll("[data-inbox-work-tab]");
  const panels = document.querySelectorAll("[data-inbox-work-panel]");
  if (!tabs.length || !panels.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.inboxWorkTab;
      tabs.forEach((item) => item.classList.toggle("active", item === tab));
      panels.forEach((panel) => {
        panel.classList.toggle("is-hidden", panel.dataset.inboxWorkPanel !== target);
      });
      refreshIcons();
    });
  });
}

const inboxTaskTypes = ["Inbox Review", "Candidate Review", "Job Match Review", "Duplicate Review"];

const inboxSourceTaskInputs = [
  {
    task_id: "task_inbox_identity_review",
    task_type: "Duplicate Review",
    title: "Confirm agency-forwarded candidate identity",
    status: "Open",
    priority: "High",
    owner_role: "HR Lead",
    owner_id: "user_linh_tran",
    due_at: "2026-07-28T15:00:00+08:00",
    source_module: "Inbox",
    related_job_id: "job_platform_engineer",
    related_candidate_id: "cand_quang_do",
    related_application_id: "app_quang_platform",
    next_action: "Review raw email and decide whether this is the existing Backend candidate or a new Platform profile.",
    evidence_ids: ["ev_agency_forward", "ev_phone_match", "ev_job_match_low_confidence"],
    completion_action: "Create or update the candidate/application only after HR confirms identity and intended job.",
  },
  {
    task_id: "task_inbox_candidate_review",
    task_type: "Candidate Review",
    title: "Complete candidate identity from unknown CV",
    status: "Open",
    priority: "High",
    owner_role: "HR Lead",
    owner_id: "user_linh_tran",
    due_at: "2026-07-29T14:00:00+08:00",
    source_module: "Inbox",
    related_job_id: "",
    related_candidate_id: "cand_unknown_cv_draft",
    related_application_id: "",
    next_action: "Fill the missing candidate identity from the CV and raw email evidence.",
    evidence_ids: ["ev_unknown_cv_email", "ev_unknown_cv_attachment"],
    completion_action: "Create or update the Candidate only after identity is confirmed.",
  },
  {
    task_id: "task_inbox_job_match_review",
    task_type: "Job Match Review",
    title: "Choose active job for Mai Nguyen referral",
    status: "Open",
    priority: "Medium",
    owner_role: "HR Lead",
    owner_id: "user_mai_ho",
    due_at: "2026-07-29T11:00:00+08:00",
    source_module: "Inbox",
    related_job_id: "",
    related_candidate_id: "cand_mai_nguyen",
    related_application_id: "",
    next_action: "Select an active job or send the candidate to the unassigned pool.",
    evidence_ids: ["ev_founder_forward", "ev_referral_thread"],
    completion_action: "Prepare an Application draft only after the intended job is selected.",
  },
  {
    task_id: "task_inbox_parse_review",
    task_type: "Inbox Review",
    title: "Classify bounce thread from recruiting mailbox",
    status: "Open",
    priority: "Low",
    owner_role: "Ops",
    owner_id: "user_ops",
    due_at: "2026-07-30T10:00:00+08:00",
    source_module: "Inbox",
    related_job_id: "",
    related_candidate_id: "",
    related_application_id: "",
    next_action: "Confirm whether the thread is recruiting-related or cancel it with no write-back.",
    evidence_ids: ["ev_bounce_thread"],
    completion_action: "Cancel the task if it is non-recruiting, or reclassify it into the correct Inbox task type.",
  },
];

function ensureInboxSourceTasks() {
  const store = getTasksStore();
  if (!store) return [];
  inboxSourceTaskInputs.forEach((input) => {
    if (!store.getTask(input.task_id)) store.createTask(input);
  });
  return store.listTasks({ view: "all" }).filter((task) => task.source_module === "Inbox" && inboxTaskTypes.includes(task.task_type));
}

function relatedTaskSummary(task) {
  return [
    task.related_candidate_id && `candidate: ${task.related_candidate_id}`,
    task.related_job_id && `job: ${task.related_job_id}`,
    task.related_application_id && `application: ${task.related_application_id}`,
    task.evidence_ids?.length ? `evidence_ids: ${task.evidence_ids.join(", ")}` : "",
  ].filter(Boolean).join(" · ") || "No related object";
}

function renderInboxTaskSourceList() {
  const list = document.querySelector("[data-inbox-task-source-list]");
  if (!list) return;
  const tasks = ensureInboxSourceTasks();
  const rows = tasks.map((task) => `
    <a class="table-row" href="./hireos-inbox-detail.html?task_id=${encodeURIComponent(task.task_id)}">
      <div class="cell-main"><strong>${task.task_type} · ${task.title}</strong><span>${task.task_id} · ${task.source_module}</span></div>
      <span>${task.owner_id}</span>
      <span>${task.next_action}</span>
      <span>${task.due_at}</span>
      <span>${relatedTaskSummary(task)}</span>
      <span class="pill ${taskStatusClass(task.status)}">${task.status}</span>
    </a>
  `).join("");
  list.innerHTML = `
    <div class="table-row header"><span>Task</span><span>owner_id</span><span>next_action</span><span>due_at</span><span>Related</span><span>Status</span></div>
    ${rows}
  `;
  syncCurrentLanguage();
  refreshIcons();
}

function selectedInboxTask() {
  const store = getTasksStore();
  if (!store) return null;
  ensureInboxSourceTasks();
  const params = new URLSearchParams(window.location.search);
  const taskId = params.get("task_id") || "task_inbox_identity_review";
  return store.getTask(taskId) || store.getTask("task_inbox_identity_review");
}

function renderInboxTaskContract() {
  const task = selectedInboxTask();
  const result = document.querySelector("[data-inbox-task-result]");
  const contract = document.querySelector("[data-inbox-task-contract]");
  if (!task) return;
  if (contract) {
    const fields = [
      ["task_id", task.task_id],
      ["task_type", task.task_type],
      ["title", task.title],
      ["status", task.status],
      ["priority", task.priority],
      ["owner_role", task.owner_role],
      ["owner_id", task.owner_id],
      ["due_at", task.due_at],
      ["source_module", task.source_module],
      ["related_job_id", task.related_job_id || "none"],
      ["related_candidate_id", task.related_candidate_id || "none"],
      ["related_application_id", task.related_application_id || "none"],
      ["next_action", task.next_action],
      ["evidence_ids", task.evidence_ids.join(", ")],
      ["completion_action", task.completion_action],
    ];
    const rows = [];
    for (let index = 0; index < fields.length; index += 3) {
      rows.push(`<div class="table-row">${fields.slice(index, index + 3).map(([field, value]) => `<span>${field}</span><strong>${value}</strong>`).join("")}</div>`);
    }
    contract.innerHTML = `<div class="table-row header"><span>Field</span><span>Value</span><span>Field</span><span>Value</span><span>Field</span><span>Value</span></div>${rows.join("")}`;
  }
  if (result) {
    result.classList.remove("confirmed", "modified", "rejected");
    if (task.status === "Done") result.classList.add("confirmed");
    if (task.status === "Waiting") result.classList.add("modified");
    if (task.status === "Cancelled") result.classList.add("rejected");
    result.innerHTML = `<strong>${task.status}</strong><span>${task.completion_action}</span>`;
  }
  syncCurrentLanguage();
}

function getReviewStateStore() {
  return window.HireOSTasks?.reviewStateStore;
}

function renderInboxCandidateReviewEntry() {
  const root = document.querySelector("[data-inbox-candidate-review-entry]");
  if (!root) return;
  const reviewStore = getReviewStateStore();
  const taskStore = getTasksStore();
  if (!reviewStore || !taskStore || typeof reviewStore.getInboxCandidateReviewEntry !== "function") return;
  const entry = reviewStore.getInboxCandidateReviewEntry({
    inboxItemId: "inbox_quang_agency_forward",
    taskStore,
  });
  const status = root.querySelector("[data-inbox-review-status]");
  const material = root.querySelector("[data-inbox-candidate-material]");
  const parsed = root.querySelector("[data-inbox-parsed-fields]");
  const evidence = root.querySelector("[data-inbox-evidence-links]");
  const shared = root.querySelector("[data-inbox-shared-state]");
  const payload = root.querySelector("[data-inbox-exception-payload]");
  const actionResult = root.querySelector("[data-inbox-action-result]");

  if (status) {
    status.textContent = `${entry.candidate.review_status} · ${entry.application ? entry.application.job_link_status : "No Application"}`;
    status.className = `pill ${entry.candidate.review_status === "Complete" ? "green" : entry.inboxItem.review_status === "Task Created" ? "danger" : "warn"}`;
  }
  if (material) {
    material.innerHTML = reviewTable("Candidate material", [
      ["Source", entry.source.material],
      ["Sender", entry.source.sender],
      ["Received", entry.source.receivedAt],
      ["Attachments", entry.source.attachments.join(", ") || "none"],
      ["Attachment summary", entry.source.attachmentSummary],
    ]);
  }
  if (parsed) {
    parsed.innerHTML = reviewTable("Parsed fields", Object.entries(entry.parsedFields));
  }
  if (evidence) {
    evidence.innerHTML = `
      <div class="table-row header"><span>Evidence</span><span>Source</span><span>File</span></div>
      ${entry.evidenceLinks.map((item) => `<div class="table-row" id="${item.evidence_id}"><div class="cell-main"><strong>${item.title}</strong><span>${item.content_excerpt}</span></div><span>${item.source_type}</span><span>${item.file_name || item.href}</span></div>`).join("")}
    `;
  }
  if (shared) {
    shared.innerHTML = reviewTable("Shared review state", [
      ["Candidate", entry.candidate.candidate_id],
      ["Candidate review", entry.candidate.review_status],
      ["Profile completeness", entry.candidate.profile_completeness],
      ["Missing fields", entry.completeness.missingFields.join(", ") || "none"],
      ["Application", entry.application ? entry.application.application_id : "none"],
      ["Application status", entry.application ? entry.application.status : "none"],
      ["Job link status", entry.jobLink.status],
      ["Suggested job", entry.jobLink.suggestedJobId || "none"],
    ]);
  }
  if (payload) {
    payload.innerHTML = reviewTable("S3 handoff payload", [
      ["Target", entry.exceptionHandoff.target],
      ["Task type", entry.exceptionHandoff.payload.task_type],
      ["Exception", entry.exceptionHandoff.payload.exception_type || "none"],
      ["Inbox item", entry.exceptionHandoff.payload.related_inbox_item_id],
      ["Candidate", entry.exceptionHandoff.payload.related_candidate_id],
      ["Application", entry.exceptionHandoff.payload.related_application_id || "none"],
    ]);
  }
  if (actionResult && !actionResult.dataset.hasActionResult) {
    actionResult.innerHTML = "<strong>Ready for review</strong><span>Select an HR action to write Candidate/Application review state.</span>";
  }
  syncCurrentLanguage();
  refreshIcons();
}

function reviewTable(title, rows) {
  return `
    <div class="table-row header"><span>${title}</span><span>Value</span></div>
    ${rows.map(([field, value]) => `<div class="table-row"><span>${field}</span><strong>${value || "none"}</strong></div>`).join("")}
  `;
}

function initInboxCandidateReviewActions() {
  const buttons = document.querySelectorAll("[data-inbox-review-action]");
  if (!buttons.length) return;
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const reviewStore = getReviewStateStore();
      const taskStore = getTasksStore();
      if (!reviewStore || typeof reviewStore.applyInboxCandidateReviewAction !== "function") return;
      const result = reviewStore.applyInboxCandidateReviewAction({
        inboxItemId: "inbox_quang_agency_forward",
        action: button.dataset.inboxReviewAction,
        actor_user_id: "user_linh_tran",
        missing_fields: ["location"],
        duplicate_candidate_ids: ["cand_quang_backend_existing"],
        taskStore,
      });
      renderInboxCandidateReviewEntry();
      renderInboxActionResult(result, button.textContent.trim());
      renderInboxTaskSourceList();
    });
  });
  renderInboxCandidateReviewEntry();
}

function renderInboxActionResult(result, label) {
  const node = document.querySelector("[data-inbox-action-result]");
  if (!node || !result) return;
  node.dataset.hasActionResult = "true";
  node.classList.remove("confirmed", "modified", "rejected");
  if (result.inboxItem.review_status === "Applied") node.classList.add("confirmed");
  if (result.inboxItem.review_status === "Task Created") node.classList.add("modified");
  node.innerHTML = `
    <strong>${label} applied</strong>
    <span>Candidate: ${result.candidate.review_status} / ${result.candidate.profile_completeness} · Application: ${result.application ? `${result.application.status} / ${result.application.job_link_status}` : "none"} · Inbox: ${result.inboxItem.review_status}</span>
  `;
}

const mailboxConnectionStorageKey = "hireos-mailbox-connection-v1";

function getMailboxConnectionState() {
  try {
    return localStorage.getItem(mailboxConnectionStorageKey) || "disconnected";
  } catch (error) {
    return "disconnected";
  }
}

function setMailboxConnectionState(state) {
  try {
    localStorage.setItem(mailboxConnectionStorageKey, state);
  } catch (error) {
    // File preview can still render without storage; the visible state updates below.
  }
}

function mailboxConnectModalMarkup() {
  return `
    <div class="modal-backdrop is-hidden" data-mail-connect-modal>
      <section class="mail-connect-modal" role="dialog" aria-modal="true" aria-labelledby="mail-connect-title">
        <header class="modal-header">
          <div>
            <h2 id="mail-connect-title">连接招聘邮箱</h2>
            <p>选择默认招聘邮箱并运行本地连接模拟。当前未接入真实 Gmail 或 Outlook API。</p>
          </div>
          <button class="icon-button" type="button" aria-label="关闭邮箱连接流程" title="关闭" data-mail-connect-close><i data-lucide="x"></i></button>
        </header>
        <div class="connect-steps mailbox-mvp-steps" aria-label="邮箱连接步骤">
          <button class="connect-step active" type="button" data-mail-step="0"><span>1</span>邮箱类型</button>
          <button class="connect-step" type="button" data-mail-step="1"><span>2</span>连接模拟</button>
          <button class="connect-step" type="button" data-mail-step="2"><span>3</span>完成</button>
        </div>
        <div class="connect-panels">
          <section class="connect-panel" data-mail-step-panel="0">
            <div class="option-grid">
              <button class="mail-provider active" type="button"><i data-lucide="mail"></i><strong>默认招聘邮箱</strong><span>recruiting@company.vn</span></button>
              <button class="mail-provider" type="button"><i data-lucide="mailbox"></i><strong>其他邮箱类型</strong><span>本地模拟同一连接流程</span></button>
            </div>
            <div class="rule-note"><strong>MVP 边界</strong><span>连接入口可以来自 Tasks 或 Inbox，但状态和结果只由这一套 Mailbox Connect 模拟流程更新。</span></div>
          </section>
          <section class="connect-panel is-hidden" data-mail-step-panel="1">
            <div class="permission-grid">
              <article><strong>模拟授权</strong><span>本地 deterministic local simulator 连接成功或失败，不访问外部邮箱服务。</span></article>
              <article><strong>读取范围</strong><span>模拟队列只覆盖招聘相关邮件：CV、面试、测评和候选人回复。</span></article>
              <article><strong>任务联动</strong><span>成功后 Mailbox Disconnected 任务变为 Done。</span></article>
              <article><strong>失败反馈</strong><span>如果模拟授权失败，页面保留错误提示并允许重新尝试。</span></article>
            </div>
            <div class="rule-note" data-mailbox-feedback><strong>连接状态</strong><span>准备运行本地连接模拟。</span></div>
            <div class="inline-actions">
              <button class="primary-button connect-oauth" type="button" data-mail-next><i data-lucide="badge-check"></i> 运行连接模拟</button>
              <button class="ghost-button" type="button" data-mail-connect-fail><i data-lucide="circle-alert"></i> 模拟失败</button>
            </div>
          </section>
          <section class="connect-panel is-hidden" data-mail-step-panel="2">
            <div class="connect-done">
              <div class="done-icon"><i data-lucide="check"></i></div>
              <h3>招聘邮箱已连接</h3>
              <p>Inbox 已切换到可读取模拟邮件状态，并显示 Inbox Review、Candidate Review、Duplicate Review 等后续任务队列。</p>
              <div class="config-meta"><span class="pill green">Mailbox Connected</span><span class="pill">Local simulator</span><span class="pill warn">9 个待审核</span></div>
            </div>
          </section>
        </div>
        <footer class="modal-footer">
          <button class="ghost-button" type="button" data-mail-prev>上一步</button>
          <div class="footer-spacer"></div>
          <button class="ghost-button" type="button" data-mail-connect-close>取消</button>
          <button class="primary-button" type="button" data-mail-next>下一步</button>
        </footer>
      </section>
    </div>
  `;
}

function ensureMailboxConnectModal() {
  let modal = document.querySelector("[data-mail-connect-modal]");
  if (!modal) {
    document.body.insertAdjacentHTML("beforeend", mailboxConnectModalMarkup());
    modal = document.querySelector("[data-mail-connect-modal]");
  }
  return modal;
}

function syncMailboxDisconnectedTask() {
  const store = getTasksStore();
  if (!store || getMailboxConnectionState() !== "connected") return;
  store.listTasks({ view: "all" })
    .filter((task) => task.task_type === "Mailbox Disconnected")
    .forEach((task) => store.updateTask(task.task_id, {
      status: "Done",
      completion_action: "Recruiting mailbox connected through the shared Mailbox Connect local simulator.",
    }));
}

function setMailboxFeedback(message, tone = "info") {
  document.querySelectorAll("[data-mailbox-feedback]").forEach((node) => {
    node.classList.toggle("warning", tone === "error");
    node.innerHTML = node.classList.contains("rule-note")
      ? `<strong>连接状态</strong><span>${message}</span>`
      : message;
  });
}

function renderMailboxConnectionState() {
  const connected = getMailboxConnectionState() === "connected";
  if (connected) syncMailboxDisconnectedTask();
  document.querySelectorAll('[data-mailbox-state="disconnected"]').forEach((node) => node.classList.toggle("is-hidden", connected));
  document.querySelectorAll('[data-mailbox-state="connected"], [data-inbox-readable]').forEach((node) => node.classList.toggle("is-hidden", !connected));
  document.querySelectorAll("[data-mail-connect-status]").forEach((button) => {
    button.innerHTML = connected ? '<i data-lucide="check"></i> 邮箱已连接' : '<i data-lucide="mail-plus"></i> Connect recruiting mailbox';
    button.classList.toggle("primary-button", !connected);
    button.classList.toggle("ai-button", connected);
  });
  setMailboxFeedback(connected ? "招聘邮箱已连接。Inbox 正在显示可读取的本地模拟邮件队列。" : "当前使用本地连接模拟；未接入真实 Gmail 或 Outlook API。", connected ? "success" : "info");
  syncCurrentLanguage();
  refreshIcons();
}

function completeMailboxConnection() {
  setMailboxConnectionState("connected");
  syncMailboxDisconnectedTask();
  renderMailboxConnectionState();
  renderTaskMetrics();
  if (document.querySelector("[data-task-detail]")) renderTaskDetail();
}

function failMailboxConnection() {
  setMailboxConnectionState("disconnected");
  renderMailboxConnectionState();
  setMailboxFeedback("连接模拟失败：未获得可用授权。请重新运行连接模拟，或继续从 Tasks 处理该异常。", "error");
}

function initMailboxConnectFlow() {
  const modal = ensureMailboxConnectModal();
  const closeButtons = modal.querySelectorAll("[data-mail-connect-close]");
  const nextButtons = modal.querySelectorAll("[data-mail-next]");
  const prevButton = modal.querySelector("[data-mail-prev]");
  const failButtons = modal.querySelectorAll("[data-mail-connect-fail]");
  const stepButtons = modal.querySelectorAll("[data-mail-step]");
  const panels = modal.querySelectorAll("[data-mail-step-panel]");
  let currentStep = 0;

  function renderStep() {
    stepButtons.forEach((button) => {
      const step = Number(button.dataset.mailStep);
      button.classList.toggle("active", step === currentStep);
      button.disabled = step > currentStep;
    });
    panels.forEach((panel) => {
      panel.classList.toggle("is-hidden", Number(panel.dataset.mailStepPanel) !== currentStep);
    });
    if (prevButton) prevButton.disabled = currentStep === 0;
    nextButtons.forEach((button) => {
      if (button.classList.contains("connect-oauth")) return;
      button.textContent = currentStep === panels.length - 1 ? "完成" : "下一步";
    });
    refreshIcons();
  }

  function openMailboxConnect() {
    currentStep = 0;
    modal.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    renderStep();
    setMailboxFeedback("准备运行本地连接模拟。");
  }

  function closeModal() {
    modal.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
  }

  document.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-mail-connect-open], [data-mailbox-bind-open]");
    if (openButton) {
      event.preventDefault();
      openMailboxConnect();
    }
  });
  closeButtons.forEach((button) => button.addEventListener("click", closeModal));
  failButtons.forEach((button) => button.addEventListener("click", failMailboxConnection));
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("is-hidden")) closeModal();
  });
  nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (currentStep < panels.length - 1) {
        currentStep += 1;
        if (currentStep === panels.length - 1) completeMailboxConnection();
        renderStep();
        return;
      }
      completeMailboxConnection();
      closeModal();
    });
  });
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      currentStep = Math.max(0, currentStep - 1);
      renderStep();
    });
  }
  stepButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetStep = Number(button.dataset.mailStep);
      if (targetStep <= currentStep) {
        currentStep = targetStep;
        renderStep();
      }
    });
  });
  window.HireOSMailboxConnect = {
    open: openMailboxConnect,
    complete: completeMailboxConnection,
    fail: failMailboxConnection,
    state: getMailboxConnectionState,
  };
  renderMailboxConnectionState();
}

function initInboxTaskActions() {
  const result = document.querySelector("[data-inbox-task-result]");
  const buttons = document.querySelectorAll("[data-inbox-task-action]");
  if (!result || !buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const store = getTasksStore();
      const task = selectedInboxTask();
      if (!store || !task) return;
      const patch = {
        start: { status: "In Progress" },
        confirm: { status: "Done" },
        modify: { status: "Waiting" },
        reject: { status: "Cancelled" },
      }[button.dataset.inboxTaskAction];
      if (!patch) return;
      store.updateTask(task.task_id, patch);
      renderInboxTaskContract();
      renderInboxTaskSourceList();
    });
  });
  renderInboxTaskContract();
}

function initJobCreateFlow() {
  const modal = document.querySelector("[data-job-create-modal]");
  if (!modal) return;

  const openButtons = document.querySelectorAll("[data-job-create-open]");
  const closeButtons = modal.querySelectorAll("[data-job-create-close]");
  const nextButton = modal.querySelector("[data-job-next]");
  const prevButton = modal.querySelector("[data-job-prev]");
  const stepButtons = modal.querySelectorAll("[data-job-step]");
  const panels = modal.querySelectorAll("[data-job-step-panel]");
  const needInput = modal.querySelector("[data-ai-need-input]");
  const voiceButton = modal.querySelector("[data-ai-voice]");
  const voiceStatus = modal.querySelector("[data-ai-voice-status]");
  const titleInput = modal.querySelector("[data-ai-title]");
  const jdInput = modal.querySelector("[data-ai-jd]");
  const requirementsInput = modal.querySelector("[data-ai-requirements]");
  const budgetInput = modal.querySelector("[data-ai-budget]");
  const locationInput = modal.querySelector("[data-ai-location]");
  let currentStep = 0;

  function renderStep() {
    stepButtons.forEach((button) => {
      const step = Number(button.dataset.jobStep);
      button.classList.toggle("active", step === currentStep);
      button.disabled = step > currentStep;
    });
    panels.forEach((panel) => {
      panel.classList.toggle("is-hidden", Number(panel.dataset.jobStepPanel) !== currentStep);
    });
    if (prevButton) prevButton.disabled = currentStep === 0;
    if (nextButton) {
      nextButton.textContent = currentStep === panels.length - 1 ? "确认发布" : currentStep === 0 ? "生成 JD" : "下一步";
    }
    syncCurrentLanguage();
    refreshIcons();
  }

  function inferTitle(text) {
    if (!text) return "高级数据工程师";
    const finance = text.match(/Finance Director|财务总监|Finance Lead/i);
    if (finance) return finance[0].replace(/finance director/i, "Finance Director");
    const data = text.match(/高级数据工程师|Data Engineer|数据工程师/i);
    if (data) return data[0].includes("Data") ? "Senior Data Engineer" : data[0];
    return "AI 生成岗位";
  }

  function generateTemplate() {
    const need = needInput?.value?.trim() || "";
    const title = inferTitle(need);
    const budget = need.match(/(?:USD|VND|\$)\s?[\d,]+(?:[-–]\s?[\d,]+)?(?:\s?\w+)?/i)?.[0] || "AI 建议：高级级别，预算待 HR 确认";
    const location = need.match(/(?:胡志明市|河内|Ho Chi Minh|Hanoi|remote|hybrid|远程|混合办公)[^，。,.]*/i)?.[0] || "AI 建议：地点/办公方式待确认";
    if (titleInput) titleInput.value = title;
    if (budgetInput) budgetInput.value = budget;
    if (locationInput) locationInput.value = location;
    if (jdInput) jdInput.value = `${title} 将负责 ${need || "岗位核心目标、团队协作和招聘流程落地"}。该 JD 由本地 AI 模拟根据自然语言招聘需求生成，请在发布前编辑确认职责、汇报关系和入职后 30/60/90 天要达成的结果。`;
    if (requirementsInput) requirementsInput.value = `AI 生成要求：\n1. 有与“${title}”相关的可验证经验。\n2. 能独立负责核心交付，并与 HR、招聘经理和跨团队协作。\n3. 能说明过往成果、风险处理和 90 天落地计划。\n4. 不符合画像：缺少岗位相关证据或只做执行不承担 owner。`;
    if (voiceStatus) voiceStatus.textContent = "本地 AI 模拟已根据自然语言需求生成 JD 和岗位模板，请编辑确认。";
    currentStep = Math.max(currentStep, 1);
    renderStep();
  }

  function publishJob() {
    const title = titleInput?.value?.trim() || "新岗位";
    const job = upsertCreatedJob({
      id: createdJobIdFromTitle(title),
      title,
      department: "Hiring Team",
      owner: currentTaskOwnerName(),
      location: locationInput?.value?.trim() || "Vietnam hybrid",
      headcount: 1,
      filledCount: 0,
      status: "Active",
    });
    createPublishedJobTaskForList(job);
    const agentBody = document.querySelector(".agent-body");
    if (agentBody && !agentBody.querySelector("[data-ai-publish-card]")) {
      const card = document.createElement("section");
      card.className = "agent-card";
      card.dataset.aiPublishCard = "true";
      card.innerHTML = `<h3>${title} 已发布</h3><p>本地 AI 模拟已生成 JD、岗位模板和 Scorecard；用户确认后岗位已发布，并同步产生审计反馈。</p><div class="evidence-list"><div class="evidence-item"><span>状态</span><strong>Active</strong></div><div class="evidence-item"><span>Next task</span><strong>Candidate Screening task created</strong></div><div class="evidence-item"><span>边界</span><strong>AI 生成模板，发布由用户确认。</strong></div></div>`;
      agentBody.insertBefore(card, agentBody.children[1] || null);
    }
    jobsFilterState.job = job.id;
    refreshJobsPage();
    closeModal();
    refreshIcons();
  }

  function startVoice() {
    if (voiceStatus) voiceStatus.textContent = "正在检查浏览器语音能力...";
    if (voiceButton) voiceButton.classList.add("active");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      window.setTimeout(() => {
        if (voiceStatus) voiceStatus.textContent = "当前浏览器不支持语音输入，可以继续手动输入。";
        if (voiceButton) voiceButton.classList.remove("active");
      }, 120);
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "zh-CN";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results).map((result) => result[0].transcript).join(" ").trim();
        if (transcript && needInput) needInput.value = [needInput.value.trim(), transcript].filter(Boolean).join(" ");
        if (voiceStatus) voiceStatus.textContent = "语音已写入输入框，请检查后生成 JD。";
        if (voiceButton) voiceButton.classList.remove("active");
      };
      recognition.onerror = () => {
        if (voiceStatus) voiceStatus.textContent = "语音权限不可用或输入已停止，可以继续手动输入。";
        if (voiceButton) voiceButton.classList.remove("active");
      };
      recognition.onend = () => {
        if (voiceButton) voiceButton.classList.remove("active");
      };
      if (voiceStatus) voiceStatus.textContent = "正在听，请说出招聘需求...";
      recognition.start();
    } catch (error) {
      if (voiceStatus) voiceStatus.textContent = "语音入口启动失败，可以继续手动输入。";
      if (voiceButton) voiceButton.classList.remove("active");
    }
  }

  function openModal() {
    currentStep = 0;
    modal.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    renderStep();
  }

  function closeModal() {
    modal.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
  }

  openButtons.forEach((button) => button.addEventListener("click", openModal));
  closeButtons.forEach((button) => button.addEventListener("click", closeModal));
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("is-hidden")) closeModal();
  });
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (currentStep === 0) {
        generateTemplate();
        return;
      }
      if (currentStep < panels.length - 1) {
        currentStep += 1;
        renderStep();
        return;
      }
      publishJob();
    });
  }
  if (voiceButton) voiceButton.addEventListener("click", startVoice);
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      currentStep = Math.max(0, currentStep - 1);
      renderStep();
    });
  }
  stepButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetStep = Number(button.dataset.jobStep);
      if (targetStep <= currentStep) {
        currentStep = targetStep;
        renderStep();
      }
    });
  });
}

function initTaskJobCreationFlow() {
  const modal = document.querySelector("[data-task-job-create-modal]");
  if (!modal) return;
  const openButtons = document.querySelectorAll("[data-task-job-create-open]");
  const closeButtons = modal.querySelectorAll("[data-task-job-create-close]");
  const thread = modal.querySelector("[data-task-job-thread]");
  const fillButton = modal.querySelector("[data-task-job-fill]");
  const voiceButton = modal.querySelector("[data-task-job-voice]");
  const intentInput = modal.querySelector("[data-task-job-intent]");
  const sendButton = modal.querySelector("[data-task-job-send]");
  const launchButton = modal.querySelector("[data-task-job-launch]");
  const exampleIntent = "我们要招聘一位高级后端工程师，负责招聘 OS 的 API、任务流和数据稳定性，越南混合办公，预算高级级别，向 Tech Lead 汇报。需要能接受上线期周六加班或轮值。";
  let conversationStage = 0;
  let thinkingTimer = null;
  let intakeMessages = [];
  let voiceRecognition = null;
  let voiceBaseText = "";
  let voiceTranscript = "";

  function scrollThread() {
    if (thread) thread.scrollTop = thread.scrollHeight;
  }

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function setSendButton(enabled = true) {
    if (!sendButton) return;
    sendButton.classList.remove("is-hidden");
    sendButton.disabled = !enabled;
    sendButton.innerHTML = `<i data-lucide="send-horizontal"></i> Send`;
    syncCurrentLanguage();
    refreshIcons();
  }

  function typingTurn() {
    if (!thread) return null;
    thread.insertAdjacentHTML("beforeend", `
      <div class="chat-turn agent-turn is-typing" data-task-job-typing>
        <div class="chat-avatar">AI</div>
        <div class="chat-bubble"><span class="typing-dots"><i></i><i></i><i></i></span></div>
      </div>
    `);
    scrollThread();
    return thread.querySelector("[data-task-job-typing]");
  }

  function scheduleAgentTurn(callback) {
    const typing = typingTurn();
    setSendButton(false);
    window.clearTimeout(thinkingTimer);
    thinkingTimer = window.setTimeout(() => {
      if (typing) typing.remove();
      Promise.resolve(callback())
        .catch((error) => failEmailSend(error.message || "Email send failed. Please check the mailbox or try again."))
        .finally(() => setSendButton(conversationStage !== 5));
    }, 380);
  }

  function agentTurn(markup) {
    if (!thread) return;
    thread.insertAdjacentHTML("beforeend", `
      <div class="chat-turn agent-turn">
        <div class="chat-avatar">AI</div>
        <div class="chat-bubble">${markup}</div>
      </div>
    `);
    syncCurrentLanguage();
    refreshIcons();
    scrollThread();
  }

  function userTurn(text) {
    if (!thread) return;
    thread.insertAdjacentHTML("beforeend", `
      <div class="chat-turn user-turn">
        <div class="chat-bubble"><p>${escapeHTML(text)}</p></div>
        <div class="chat-avatar">LT</div>
      </div>
    `);
    scrollThread();
  }

  function currentIntakeDraft() {
    return deriveAiIntakeDraft(intakeMessages);
  }

  function resetConversation() {
    conversationStage = 0;
    intakeMessages = [];
    if (intentInput) {
      intentInput.value = "";
      intentInput.placeholder = "例如：我们要招聘一位高级后端工程师，负责招聘 OS 的 API、任务流和数据稳定性，越南混合办公，预算高级级别，必要时支持周六上线。";
      intentInput.disabled = false;
    }
    if (sendButton) {
      setSendButton(true);
    }
    if (launchButton) launchButton.classList.add("is-hidden");
    if (thread) {
      thread.innerHTML = `
        <div class="chat-turn agent-turn">
          <div class="chat-avatar">AI</div>
          <div class="chat-bubble">
            <p>Who do you want to hire?</p>
            <small>Describe the role in plain language. I will ask only the questions that change the JD.</small>
            <div class="chat-quick-actions">
              <button type="button" data-task-job-chip="${escapeHTML(exampleIntent)}">使用示例</button>
              <button type="button" data-task-job-chip="我要招聘 Finance Director，负责预算、现金流、审计和区域财务合规。">Finance Director</button>
            </div>
          </div>
        </div>
      `;
    }
    syncCurrentLanguage();
    refreshIcons();
    scrollThread();
  }

  function requestClarification() {
    agentTurn(`
      <p>I can draft this. Three role conditions materially change the JD:</p>
      <div class="chat-question-list">
        <div><strong>1. Success in 90 days</strong><span>Ship stable task APIs and reduce manual HR coordination.</span></div>
        <div><strong>2. Must-have signal</strong><span>Backend ownership, workflow systems, and production debugging.</span></div>
        <div><strong>3. Hard conditions</strong><span>Senior budget, Vietnam hybrid, reports to Tech Lead, Saturday release support when needed.</span></div>
      </div>
      <small>Reply with edits, or send again to confirm interview rounds and interviewers.</small>
      <div class="chat-quick-actions">
        <button type="button" data-task-job-chip="确认这些条件，继续生成面试流程。">确认条件</button>
        <button type="button" data-task-job-chip="周六支持只写成偶发上线保障，不写成固定加班。">调整「我们希望你具备」</button>
      </div>
    `);
    conversationStage = 1;
    setSendButton(true);
    if (intentInput) {
      intentInput.value = "";
      intentInput.placeholder = "补充或修改右侧大纲字段，也可以直接发送确认。";
      intentInput.focus();
    }
    syncCurrentLanguage();
    refreshIcons();
  }

  function requestInterviewPlan() {
    agentTurn(`
      <p>Before I generate the package, confirm the interview workflow and who should interview.</p>
      <div class="chat-question-list">
        <div><strong>1. HR screen</strong><span>Owner: Linh Tran. Confirm motivation, salary range, location, and Saturday support acceptance.</span></div>
        <div><strong>2. Technical interview</strong><span>Owner: Tech Lead. Validate API design, workflow state, debugging, and production reliability.</span></div>
        <div><strong>3. Founder / final round</strong><span>Owner: Founder. Validate ownership scope, urgency, tradeoffs, and culture fit.</span></div>
      </div>
      <small>Reply with interviewer changes, or send again to generate JD, Scorecard, Workflow, Interview Plan, and Challenge.</small>
      <div class="chat-quick-actions">
        <button type="button" data-task-job-chip="确认面试流程，生成岗位包。">确认流程</button>
        <button type="button" data-task-job-chip="技术面由 Tech Lead 和 Backend Staff 共同面试，但问题不要重复。">调整面试官</button>
      </div>
    `);
    conversationStage = 2;
    setSendButton(true);
    if (intentInput) {
      intentInput.value = "";
      intentInput.placeholder = "例如：技术面由 Tech Lead + Backend Staff 共同面试，Founder 只看最终轮。";
      intentInput.focus();
    }
    syncCurrentLanguage();
    refreshIcons();
  }

  function generateJD() {
    const draft = currentIntakeDraft();
    agentTurn(`
      <p>Here is the latest JD template and the challenge review before launch.</p>
      <section class="jd-template-card">
        <span>JD Template</span>
        <h3>${escapeHTML(draft.roleTitle)}</h3>
        <p>${escapeHTML(draft.mission)}</p>
        <dl>
          <div><dt>Mission</dt><dd>${escapeHTML(draft.mission)}</dd></div>
          <div><dt>Responsibilities</dt><dd>${escapeHTML(draft.responsibilities)}</dd></div>
          <div><dt>Scorecard</dt><dd>${escapeHTML(draft.scorecard)}</dd></div>
          <div><dt>Interview Plan</dt><dd>HR screen by Linh Tran -> technical interview by Tech Lead + Backend Staff -> founder final round.</dd></div>
          <div><dt>Hard Conditions</dt><dd>${escapeHTML(draft.conditions)}</dd></div>
        </dl>
      </section>
      <section class="challenge-card">
        <span>Challenge</span>
        <p><strong>Budget:</strong> Senior scope may exceed current band unless ownership is narrowed.</p>
        <p><strong>Talent pool:</strong> Workflow-system experience is rarer than general backend API experience.</p>
        <p><strong>Interview risk:</strong> If Tech Lead and Backend Staff both interview, keep evidence areas separate to avoid duplicate questions.</p>
        <p><strong>Condition risk:</strong> Saturday release support must be stated clearly as occasional launch coverage, not normalized overtime.</p>
      </section>
      <small>Approve when this reflects the role. I will ask which mailbox should receive the package before marking Job Creation complete.</small>
      <div class="chat-quick-actions">
        <button type="button" data-task-job-chip="内容确认，可以进入发布前确认。">内容确认</button>
        <button type="button" data-task-job-chip="把预算风险写得更保守一点，再保留岗位发布。">继续修改</button>
      </div>
    `);
    conversationStage = 3;
    if (intentInput) {
      intentInput.value = "";
      intentInput.placeholder = "如需调整 JD 或 Challenge，可继续输入修改意见。";
    }
    setSendButton(true);
    if (launchButton) launchButton.classList.remove("is-hidden");
    syncCurrentLanguage();
    refreshIcons();
  }

  function requestRecipientEmail() {
    agentTurn(`
      <p>Which mailbox should receive this Job Creation package?</p>
      <div class="chat-question-list">
        <div><strong>Recipient</strong><span>Enter the mailbox that should receive this recruitment request.</span></div>
        <div><strong>Package</strong><span>JD, Scorecard, Workflow, Interview Plan, Challenge notes, and hard conditions.</span></div>
        <div><strong>Completion rule</strong><span>Job Creation completes only after the email is sent successfully.</span></div>
      </div>
      <small>Enter an email address, then send. The page will stay open after success.</small>
    `);
    conversationStage = 4;
    if (intentInput) {
      intentInput.value = "";
      intentInput.placeholder = "输入收件邮箱，例如 tyyslj7927@gmail.com";
      intentInput.focus();
    }
    if (sendButton) {
      setSendButton(true);
    }
    if (launchButton) launchButton.classList.add("is-hidden");
    syncCurrentLanguage();
    refreshIcons();
  }

  function setSendingState(isSending) {
    if (!sendButton) return;
    sendButton.disabled = isSending;
    sendButton.innerHTML = isSending
      ? `<i data-lucide="loader-circle"></i> Sending`
      : `<i data-lucide="send-horizontal"></i> Send`;
    syncCurrentLanguage();
    refreshIcons();
  }

  function failEmailSend(message) {
    agentTurn(`
      <p>${escapeHTML(message || "Email send failed. Please check the mailbox or try again.")}</p>
      <small>The Job Creation package is still open. Fix the recipient mailbox and send again.</small>
    `);
    conversationStage = 4;
    if (intentInput) {
      intentInput.disabled = false;
      intentInput.focus();
    }
    setSendingState(false);
  }

  function completeEmailSend(email, delivery) {
    const intakeRecord = buildAiIntakeTaskRecord(intakeMessages, email, delivery);
    const createdJob = saveCreatedJobFromIntake(intakeMessages, email);
    if (createdJob) {
      intakeRecord.related_job_id = createdJob.id;
      intakeRecord.next_action = "在 Jobs 列表中编辑、关闭或继续管理该岗位。";
      intakeRecord.related_objects = [createdJob.title, email ? `Sent to ${email}` : "AI Intake", "Jobs list"];
    }
    agentTurn(`
      <p>Email sent successfully. Job Creation is complete.</p>
      <div class="followup-task-list">
        <div><strong>Sent to</strong><span>${escapeHTML(email)}</span></div>
        <div><strong>JD PDF attached</strong><span>${escapeHTML(delivery.attachments?.[0]?.filename || "JD package PDF")}</span></div>
        <div><strong>Jobs list saved</strong><span>${escapeHTML(createdJob?.title || intakeRecord.related_objects[0])}</span></div>
        <div><strong>Job Ready for Intake</strong><span>${escapeHTML(createdJob ? `${createdJob.filledCount}/${createdJob.headcount} headcount` : intakeRecord.related_objects[0])}</span></div>
        <div><strong>Next</strong><span>Manage this role in Jobs list</span></div>
      </div>
      <small>This prototype keeps the page open so the completed conversation remains visible.</small>
    `);
    conversationStage = 5;
    if (intentInput) {
      intentInput.value = "";
      intentInput.placeholder = "已发送成功。页面保持打开，可继续查看对话记录。";
      intentInput.disabled = true;
    }
    if (sendButton) {
      sendButton.classList.remove("is-hidden");
      sendButton.disabled = true;
      sendButton.innerHTML = `<i data-lucide="send-horizontal"></i> Send`;
    }
    if (launchButton) launchButton.classList.add("is-hidden");
    addCreatedJobTask(intakeRecord);
    if (createdJob && document.body.dataset.page === "jobs") {
      jobsFilterState.job = createdJob.id;
      refreshJobsPage();
    }
    const agentBody = document.querySelector(".agent-body");
    if (agentBody && !agentBody.querySelector("[data-task-job-launch-card]")) {
      const card = document.createElement("section");
      card.className = "agent-card";
      card.dataset.taskJobLaunchCard = "true";
      card.innerHTML = `<h3>Job Creation completed</h3><p>Email sent to ${escapeHTML(email)}. ${escapeHTML(intakeRecord.related_objects[0])} 已保存到 Jobs 列表。</p><div class="evidence-list"><div class="evidence-item"><span>Source</span><strong>来自本次 AI Intake 对话。</strong></div><div class="evidence-item"><span>Next</span><strong>在 Jobs 列表中编辑、关闭或继续管理岗位。</strong></div></div>`;
      agentBody.insertBefore(card, agentBody.children[1] || null);
    }
    syncCurrentLanguage();
    refreshIcons();
  }

  function submitMessage() {
    const text = intentInput?.value?.trim();
    if (!text && conversationStage === 0) {
      agentTurn(`<p>先告诉我岗位目标、级别或工作地点中的任意一项，我再继续追问。</p>`);
      return;
    }
    if (text) userTurn(text);
    if (text && conversationStage !== 4) intakeMessages.push(text);
    if (conversationStage === 0) {
      scheduleAgentTurn(requestClarification);
      return;
    }
    if (conversationStage === 1) {
      scheduleAgentTurn(requestInterviewPlan);
      return;
    }
    if (conversationStage === 2) {
      scheduleAgentTurn(generateJD);
      return;
    }
    if (conversationStage === 3 && text) {
      scheduleAgentTurn(generateJD);
      return;
    }
    if (conversationStage === 4) {
      if (!text) {
        agentTurn(`<p>Please enter the recipient mailbox before I send the package.</p>`);
        return;
      }
      if (!isValidEmailAddress(text)) {
        agentTurn(`<p>Please enter a valid recipient mailbox before I send the package.</p>`);
        return;
      }
      setSendingState(true);
      scheduleAgentTurn(async () => {
        const delivery = await sendJobPackageEmail(text, intakeMessages);
        if (!delivery.ok) {
          failEmailSend(delivery.error);
          return;
        }
        completeEmailSend(text, delivery);
      });
      return;
    }
  }

  function openModal() {
    modal.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    resetConversation();
  }

  function closeModal() {
    modal.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
  }

  function fillExample() {
    if (!intentInput || intentInput.disabled) return;
    intentInput.value = exampleIntent;
    intentInput.focus();
  }

  function speechRecognitionConstructor() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }

  function setVoiceButtonListening(isListening) {
    if (!voiceButton) return;
    if (isListening) {
      voiceButton.classList.add("is-listening");
    } else {
      voiceButton.classList.remove("is-listening");
    }
    voiceButton.setAttribute("aria-pressed", String(isListening));
    voiceButton.innerHTML = isListening
      ? `<i data-lucide="square"></i> Stop speaking`
      : `<i data-lucide="mic"></i> Start speaking`;
    syncCurrentLanguage();
    refreshIcons();
  }

  function appendVoiceTranscript(transcript) {
    const text = String(transcript || "").replace(/\s+/g, " ").trim();
    if (!text || !intentInput) return;
    intentInput.value = [voiceBaseText, text].filter(Boolean).join(" ");
    intentInput.focus();
  }

  function finishVoiceInput() {
    if (!voiceButton?.classList.contains("is-listening")) return;
    setVoiceButtonListening(false);
    if (!voiceTranscript) {
      agentTurn(`<p>I did not catch any speech. Please hold the button and speak again.</p>`);
    }
  }

  function startVoiceInput(event) {
    event?.preventDefault();
    if (!intentInput || intentInput.disabled || voiceButton?.classList.contains("is-listening")) return;
    const SpeechRecognition = speechRecognitionConstructor();
    if (!SpeechRecognition) {
      agentTurn(`<p>Voice input is not available in this browser. Please open this local page in Chrome, or type the hiring need instead.</p>`);
      return;
    }
    try {
      voiceBaseText = intentInput.value.trim();
      voiceTranscript = "";
      voiceRecognition = new SpeechRecognition();
      const recognition = voiceRecognition;
      recognition.lang = "zh-CN";
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        voiceTranscript = Array.from(event.results)
          .map((result) => result[0]?.transcript || "")
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        appendVoiceTranscript(voiceTranscript);
      };
      recognition.onerror = () => {
        voiceTranscript = voiceTranscript || "";
        setVoiceButtonListening(false);
        agentTurn(`<p>Voice input is not available in this browser. Please open this local page in Chrome, or type the hiring need instead.</p>`);
      };
      recognition.onend = finishVoiceInput;
      setVoiceButtonListening(true);
      recognition.start();
    } catch (error) {
      setVoiceButtonListening(false);
      agentTurn(`<p>Voice input is not available in this browser. Please open this local page in Chrome, or type the hiring need instead.</p>`);
    }
  }

  function stopVoiceInput(event) {
    event?.preventDefault();
    if (!voiceRecognition) {
      setVoiceButtonListening(false);
      return;
    }
    try {
      voiceRecognition.stop();
    } catch (error) {
      setVoiceButtonListening(false);
    }
  }

  function toggleVoiceInput(event) {
    event?.preventDefault();
    if (voiceButton?.classList.contains("is-listening")) {
      stopVoiceInput(event);
      return;
    }
    startVoiceInput(event);
  }

  openButtons.forEach((button) => button.addEventListener("click", openModal));
  closeButtons.forEach((button) => button.addEventListener("click", closeModal));
  if (fillButton) fillButton.addEventListener("click", fillExample);
  if (voiceButton) {
    voiceButton.setAttribute("aria-pressed", "false");
    voiceButton.addEventListener("click", toggleVoiceInput);
  }
  if (sendButton) sendButton.addEventListener("click", submitMessage);
  if (launchButton) launchButton.addEventListener("click", requestRecipientEmail);
  if (thread) {
    thread.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-task-job-chip]");
      if (!chip || !intentInput || intentInput.disabled) return;
      intentInput.value = chip.dataset.taskJobChip || chip.textContent.trim();
      intentInput.focus();
    });
  }
  if (intentInput) {
    intentInput.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        submitMessage();
      }
    });
  }
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("is-hidden")) closeModal();
  });
}

function initTaskAgentJobCreationFlow() {
  if (document.body.dataset.page !== "tasks") return;
  const agentBody = document.querySelector(".agent-body");
  const agentPreview = document.querySelector("[data-agent-preview]");
  const agentToggle = document.querySelector(".agent-toggle");
  const agentFooter = document.querySelector(".agent-compose");
  const compose = document.querySelector(".agent-compose .compose-box");
  const input = compose?.querySelector("input");
  const voiceButton = compose?.querySelector("[data-agent-voice]");
  const sendButton = compose?.querySelector("button:not([data-agent-voice])");
  const resetPreviewButton = document.querySelector("[data-reset-jd-preview]");
  const jdDraftsButton = document.querySelector("[data-jd-drafts-open]");
  const taskBoardSection = document.querySelector(".page-content .unframed-section");
  if (!agentBody || !input || !sendButton) return;

  const exampleIntent = "我们要招聘一位高级后端工程师，负责招聘 OS 的 API、任务流和数据稳定性，越南混合办公，预算高级级别，向 Tech Lead 汇报。需要能接受上线期周六加班或轮值。";
  let stage = 0;
  let messages = [];
  let agentConversation = [];
  let agentDocumentPatch = {};
  let pendingDocumentProposal = null;
  let sending = false;
  let draftVersion = 0;
  let draftVersions = [];
  let draftArtifacts = [];
  let selectedDraftArtifactId = "";
  let draftArtifactSeq = 0;
  let activeDraft = null;
  let flowStarted = false;
  let voiceRecognition = null;
  let voiceBaseText = "";
  let voiceTranscript = "";
  let savedPreviewHtml = "";
  let savedPreviewKey = "";
  let previewSaveTimer = null;
  const previewStoragePrefix = "hireos:tasks:job-description-preview:";
  const jdDraftStorageKey = "hireos:tasks:jd-drafts:v1";
  const jdDraftPanel = document.createElement("section");
  jdDraftPanel.className = "jd-drafts-panel is-hidden";
  jdDraftPanel.setAttribute("data-jd-drafts-panel", "");
  if (taskBoardSection?.parentNode) {
    taskBoardSection.parentNode.insertBefore(jdDraftPanel, taskBoardSection.nextSibling);
  }

  const artifactRail = document.createElement("div");
  artifactRail.className = "agent-artifact-rail is-empty";
  artifactRail.setAttribute("aria-label", "JD 卡片列表");
  if (agentFooter && compose) {
    agentFooter.insertBefore(artifactRail, compose);
  }
  const skillPopover = document.createElement("div");
  skillPopover.className = "agent-skill-popover is-hidden";
  skillPopover.innerHTML = `
    <button type="button" data-agent-compose-skill="send_email">
      <i data-lucide="mail"></i>
      <span data-no-translate>SendEmail</span>
    </button>
  `;
  const skillChip = document.createElement("button");
  skillChip.className = "agent-compose-skill-chip is-hidden";
  skillChip.type = "button";
  skillChip.setAttribute("data-agent-compose-skill-chip", "send_email");
  skillChip.setAttribute("data-no-translate", "");
  skillChip.innerHTML = `<span>SendEmail</span><i data-lucide="x"></i>`;
  const composeJdReferences = document.createElement("div");
  composeJdReferences.className = "agent-compose-jd-references is-hidden";
  composeJdReferences.setAttribute("data-no-translate", "");
  if (agentFooter && compose) {
    agentFooter.insertBefore(skillPopover, compose);
    compose.insertBefore(skillChip, input);
    compose.insertBefore(composeJdReferences, input);
  }
  let activeComposeSkill = "";
  let activeComposeJdArtifactId = "";

  function scrollAgent() {
    agentBody.scrollTop = agentBody.scrollHeight;
  }

  function setWorkspaceExpanded(expanded) {
    document.body.classList.toggle("agent-workspace-expanded", expanded);
    document.body.classList.remove("agent-collapsed", "dock-expanded");
    if (agentToggle) {
      setToggleIcon(agentToggle, expanded ? "x" : "expand", expanded ? "关闭内容区" : "展开 AI 工作区");
    }
  }

  function closePreview() {
    setWorkspaceExpanded(false);
  }

  function isPlaceholderRoleTitle(roleTitle) {
    return !roleTitle || hasPlaceholder(roleTitle) || roleTitle === "New Role";
  }

  function selectedDraftArtifact() {
    return draftArtifacts.find((item) => item.id === selectedDraftArtifactId) || null;
  }

  function draftTitleForArtifact(draft = {}) {
    return isPlaceholderRoleTitle(draft.roleTitle) ? "未命名 JD" : draft.roleTitle;
  }

  function draftArtifactCompletion(draft = {}) {
    return buildTemplateFillSummary(buildJobDescriptionDocument(draft)).percent;
  }

  function shouldCreateNewDraftArtifact(documentPatch = {}) {
    const roleTitle = normalizePatchValue(documentPatch.roleTitle || documentPatch.title);
    const selected = selectedDraftArtifact();
    if (!roleTitle || isPlaceholderRoleTitle(roleTitle)) return false;
    if (!selected) return true;
    const currentTitle = normalizePatchValue(selected.draft?.roleTitle);
    return currentTitle && !isPlaceholderRoleTitle(currentTitle) && currentTitle.toLowerCase() !== roleTitle.toLowerCase();
  }

  function upsertDraftArtifact(draft = {}, options = {}) {
    const normalizedDraft = { ...draft };
    const roleTitle = normalizePatchValue(normalizedDraft.roleTitle);
    const selected = selectedDraftArtifact();
    let artifact = options.createNew ? null : selected;
    if (!artifact && roleTitle && !isPlaceholderRoleTitle(roleTitle)) {
      artifact = draftArtifacts.find((item) => normalizePatchValue(item.draft?.roleTitle).toLowerCase() === roleTitle.toLowerCase()) || null;
    }
    if (!artifact) {
      artifact = {
        id: `jd-${++draftArtifactSeq}`,
        draft: normalizedDraft,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      draftArtifacts.push(artifact);
    } else {
      artifact.draft = { ...artifact.draft, ...normalizedDraft };
      artifact.updatedAt = Date.now();
    }
    selectedDraftArtifactId = artifact.id;
    activeDraft = artifact.draft;
    agentDocumentPatch = { ...artifact.draft };
    renderArtifactRail();
    return artifact;
  }

  function selectDraftArtifact(id, options = {}) {
    const artifact = draftArtifacts.find((item) => item.id === id);
    if (!artifact) return null;
    selectedDraftArtifactId = artifact.id;
    activeDraft = artifact.draft;
    agentDocumentPatch = { ...artifact.draft };
    renderArtifactRail();
    if (options.openPreview !== false) {
      renderPreview(artifact.draft, { useSavedMarkup: true, skipArtifactSync: true });
      setWorkspaceExpanded(true);
    }
    return artifact;
  }

  function renderArtifactRail() {
    if (!artifactRail) return;
    artifactRail.classList.toggle("is-empty", !draftArtifacts.length);
    artifactRail.innerHTML = draftArtifacts.map((artifact) => {
      const selected = artifact.id === selectedDraftArtifactId;
      const title = draftTitleForArtifact(artifact.draft);
      const percent = draftArtifactCompletion(artifact.draft);
      return `
        <button class="agent-rail-card ${selected ? "is-selected" : ""}" type="button" data-agent-draft-card="${escapeHTML(artifact.id)}" aria-pressed="${selected ? "true" : "false"}">
          <strong>${escapeHTML(title)}</strong>
          <span>完成度 ${percent}%</span>
        </button>
      `;
    }).join("");
    refreshIcons();
  }

  function artifactEmailTitle(artifact) {
    const title = draftTitleForArtifact(artifact?.draft || {});
    return `${title} 招聘 JD`;
  }

  function composeJdArtifact() {
    return draftArtifacts.find((item) => item.id === activeComposeJdArtifactId) || null;
  }

  function renderComposeJdReferences() {
    const artifact = composeJdArtifact();
    const visible = activeComposeSkill === "send_email" && Boolean(artifact);
    compose.classList.toggle("has-jd-reference", visible);
    composeJdReferences.classList.toggle("is-hidden", !visible);
    composeJdReferences.innerHTML = visible ? `
      <button class="agent-compose-jd-token" type="button" data-agent-compose-jd-reference="${escapeHTML(artifact.id)}" title="${escapeHTML(artifactEmailTitle(artifact))}">
        <span>${escapeHTML(artifactEmailTitle(artifact))}</span>
        <i data-lucide="x"></i>
      </button>
    ` : "";
    refreshIcons();
  }

  function setComposeJdReference(id = "") {
    activeComposeJdArtifactId = draftArtifacts.some((item) => item.id === id) ? id : "";
    renderComposeJdReferences();
    if (activeComposeSkill === "send_email") {
      input.placeholder = activeComposeJdArtifactId
        ? "输入收件邮箱，例如：name@example.com"
        : "收件邮箱 + 邮件内容，例如：name@example.com 请确认面试安排";
    }
    input.focus();
  }

  function normalizeCommandText(value) {
    return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function resolveEmailJdReference(messageText = "", preferredArtifact = null) {
    const value = String(messageText || "").trim();
    if (!draftArtifacts.length) return null;
    if (preferredArtifact) {
      return {
        type: "jd_reference",
        artifactId: preferredArtifact.id,
        title: artifactEmailTitle(preferredArtifact),
        draft: preferredArtifact.draft,
      };
    }
    if (!value) return null;
    const normalizedValue = normalizeCommandText(value.replace(/[【】\[\]]/g, ""));
    const selected = selectedDraftArtifact();
    const candidates = [
      ...(selected ? [selected] : []),
      ...draftArtifacts.filter((artifact) => artifact.id !== selectedDraftArtifactId),
    ];
    const matched = candidates.find((artifact) => {
      const title = normalizeCommandText(draftTitleForArtifact(artifact.draft));
      const emailTitle = normalizeCommandText(artifactEmailTitle(artifact));
      return normalizedValue === title ||
        normalizedValue === emailTitle ||
        normalizedValue.includes(emailTitle) ||
        normalizedValue.includes(title) && /jd|岗位说明书|招聘/.test(normalizedValue);
    });
    if (!matched) return null;
    return {
      type: "jd_reference",
      artifactId: matched.id,
      title: artifactEmailTitle(matched),
      draft: matched.draft,
    };
  }

  function parseSendEmailCommand(text = "") {
    const value = String(text || "").trim();
    const match = value.match(/^@SendEmail:\+([^+]+)\+([\s\S]+)$/i);
    if (!match) return null;
    const to = match[1].trim();
    const rawMessage = match[2].trim();
    if (!to || !rawMessage) return null;
    return {
      type: "send_email",
      to,
      rawMessage,
      message: resolveEmailJdReference(rawMessage) || {
        type: "text",
        text: rawMessage,
      },
    };
  }

  function parseSendEmailSkillInput(text = "") {
    const value = String(text || "").trim();
    const emailMatch = value.match(/[^\s+，,；;:：]+@[^\s+，,；;:：]+\.[^\s+，,；;:：]+/);
    if (!emailMatch) return null;
    const to = emailMatch[0].trim();
    const jdArtifact = composeJdArtifact();
    const rawMessage = value
      .slice(emailMatch.index + emailMatch[0].length)
      .replace(/^[\s+，,；;:：-]+/, "")
      .trim();
    if (!rawMessage && !jdArtifact) return null;
    const messageText = rawMessage || (jdArtifact ? artifactEmailTitle(jdArtifact) : "");
    return {
      type: "send_email",
      to,
      rawMessage: messageText,
      message: resolveEmailJdReference(messageText, jdArtifact) || {
        type: "text",
        text: messageText,
      },
    };
  }

  function serializeSendEmailCommand(command) {
    if (!command) return "";
    return `@SendEmail:+${command.to}+${command.rawMessage}`;
  }

  function setComposeSkill(skill = "") {
    activeComposeSkill = skill;
    compose.classList.toggle("has-skill", Boolean(activeComposeSkill));
    skillChip.classList.toggle("is-hidden", activeComposeSkill !== "send_email");
    skillPopover.classList.add("is-hidden");
    if (activeComposeSkill === "send_email") {
      input.value = input.value.replace(/@SendEmail|@/gi, "").trimStart();
      if (!composeJdArtifact() && selectedDraftArtifact()) setComposeJdReference(selectedDraftArtifactId);
      input.placeholder = composeJdArtifact()
        ? "输入收件邮箱，例如：name@example.com"
        : "收件邮箱 + 邮件内容，例如：name@example.com 请确认面试安排";
    } else {
      setComposeJdReference("");
      input.placeholder = "继续描述岗位需求，或者告诉我想补哪个字段";
    }
    renderComposeJdReferences();
    refreshIcons();
    input.focus();
  }

  function showSkillPopover() {
    if (activeComposeSkill) return;
    skillPopover.classList.remove("is-hidden");
    refreshIcons();
  }

  function hideSkillPopover() {
    skillPopover.classList.add("is-hidden");
  }

  function previewDraftKey(documentDraft) {
    return [
      "public-template-document-v1",
      documentDraft.roleTitle,
      documentDraft.status,
      documentDraft.headline,
      documentDraft.mission,
      documentDraft.reason,
      documentDraft.workflow,
    ].join("::");
  }

  function previewStorageKey(documentKey) {
    return `${previewStoragePrefix}${documentKey}`;
  }

  function readSavedPreview(documentKey) {
    if (savedPreviewKey === documentKey && savedPreviewHtml) return savedPreviewHtml;
    try {
      const html = window.localStorage.getItem(previewStorageKey(documentKey));
      if (!html) return "";
      savedPreviewKey = documentKey;
      savedPreviewHtml = html;
      return html;
    } catch (error) {
      return "";
    }
  }

  function writeSavedPreview(documentKey, html) {
    savedPreviewKey = documentKey;
    savedPreviewHtml = html;
    try {
      window.localStorage.setItem(previewStorageKey(documentKey), html);
    } catch (error) {
      // Saving in memory still keeps edits until the page is refreshed.
    }
  }

  function clearSavedPreview(documentKey) {
    if (savedPreviewKey === documentKey) {
      savedPreviewKey = "";
      savedPreviewHtml = "";
    }
    try {
      window.localStorage.removeItem(previewStorageKey(documentKey));
    } catch (error) {
      // Local storage may be unavailable in private browser contexts.
    }
  }

  function readJdDrafts() {
    try {
      const raw = window.localStorage.getItem(jdDraftStorageKey);
      const drafts = raw ? JSON.parse(raw) : [];
      return Array.isArray(drafts) ? drafts : [];
    } catch (error) {
      return [];
    }
  }

  function writeJdDrafts(drafts) {
    try {
      window.localStorage.setItem(jdDraftStorageKey, JSON.stringify(drafts));
    } catch (error) {
      // The live preview still remains available even if local draft storage is blocked.
    }
  }

  function jdDraftIdFor(documentDraft) {
    const base = normalizePatchValue(documentDraft.roleTitle || documentDraft.headline || "jd")
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, "_")
      .replace(/^_|_$/g, "");
    return `jd_draft_${base || "new"}_${Date.now().toString(36)}`;
  }

  function saveJdDraftRecord(documentDraft, html, status = "draft") {
    const fill = buildTemplateFillSummary(documentDraft);
    const title = documentDraft.headline || `${documentDraft.roleTitle || "未命名 JD"} 招聘 JD`;
    const existing = readJdDrafts();
    const selected = selectedDraftArtifact();
    const stableKey = selected?.id || previewDraftKey(documentDraft);
    const current = existing.find((item) => item.stableKey === stableKey) || {};
    const record = {
      ...current,
      id: current.id || jdDraftIdFor(documentDraft),
      stableKey,
      title,
      roleTitle: documentDraft.roleTitle || "未命名 JD",
      percent: fill.percent,
      status,
      draft: activeDraft || currentDraft(),
      html,
      updatedAt: Date.now(),
      publishedAt: status === "published" ? Date.now() : current.publishedAt || null,
    };
    writeJdDrafts([record, ...existing.filter((item) => item.id !== record.id && item.stableKey !== stableKey)]);
    renderJdDraftsPanel();
    if (activeTaskView === "jd_drafts") renderTasksList();
    return record;
  }

  function renderJdDraftsPanel() {
    if (!jdDraftPanel) return;
    const drafts = readJdDrafts().filter((draft) => draft.status !== "published");
    jdDraftPanel.innerHTML = `
      <header class="jd-drafts-header">
        <div>
          <h2>JD Draft</h2>
          <p>${drafts.length ? `${drafts.length} drafts saved locally` : "No saved drafts yet"}</p>
        </div>
        <button class="icon-button" type="button" aria-label="关闭草稿箱" title="关闭草稿箱" data-jd-drafts-close><i data-lucide="x"></i></button>
      </header>
      <div class="jd-drafts-list">
        ${drafts.length ? drafts.map((draft) => `
          <button class="jd-draft-item" type="button" data-jd-draft-open="${escapeHTML(draft.id)}">
            <i data-lucide="${draft.status === "published" ? "send" : "file-text"}"></i>
            <span>
              <strong>${escapeHTML(draft.title)}</strong>
              <small>${draft.status === "published" ? "Published" : "Draft"} · 完成度 ${Number(draft.percent || 0)}%</small>
            </span>
            <i data-lucide="chevron-right"></i>
          </button>
        `).join("") : `
          <div class="jd-drafts-empty">
            <i data-lucide="file-text"></i>
            <strong>暂无 JD 草稿</strong>
            <span>点击右侧保存按钮后，未发布的 JD 会出现在这里。</span>
          </div>
        `}
      </div>
    `;
    refreshIcons();
  }

  function showJdDraftsPanel() {
    activeTaskView = "jd_drafts";
    document.querySelectorAll("[data-task-view]").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.taskView === "jd_drafts");
    });
    renderTasksList();
  }

  function hideJdDraftsPanel() {
    jdDraftPanel.classList.add("is-hidden");
    taskBoardSection?.classList.remove("is-hidden");
  }

  function openSavedJdDraft(id) {
    const record = readJdDrafts().find((item) => item.id === id);
    if (!record) return;
    const draft = record.draft || {};
    upsertDraftArtifact(draft);
    const documentDraft = buildJobDescriptionDocument(draft);
    writeSavedPreview(previewDraftKey(documentDraft), record.html || renderJobDescriptionDocument(documentDraft));
    renderPreview(draft, { useSavedMarkup: true });
    setWorkspaceExpanded(true);
  }

  function publishCurrentJd() {
    if (!agentPreview) return;
    const documentDraft = buildJobDescriptionDocument(activeDraft || currentDraft());
    const roleTitle = documentDraft.roleTitle || "这份 JD";
    if (!window.confirm(`确认发布 ${roleTitle}？发布后会从草稿状态进入招聘流程。`)) return;
    const documentNode = agentPreview.querySelector("[data-job-description-preview]");
    const html = documentNode?.outerHTML || renderJobDescriptionDocument(documentDraft);
    const record = saveJdDraftRecord(documentDraft, html, "published");
    createPublishedJdTask(record);
    activeTaskView = "my_tasks";
    document.querySelectorAll("[data-task-view]").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.taskView === "my_tasks");
    });
    renderTaskMetrics();
    renderTasksList();
    showHireOSToast(`${record.roleTitle} 已发布`);
  }

  function previewHeaderActions() {
    return `
      <div class="agent-preview-actions">
        <button class="agent-preview-publish-button" type="button" data-agent-preview-publish>
          发布
        </button>
        <button class="icon-button agent-preview-save" type="button" aria-label="保存岗位说明书" title="保存岗位说明书" data-agent-preview-save>
          <i data-lucide="save"></i>
        </button>
      </div>
    `;
  }

  function hasPlaceholder(value) {
    return !value || /【.*?】/.test(String(value));
  }

  function firstMatch(text, pattern) {
    const match = String(text || "").match(pattern);
    return match ? match[1] || match[0] : "";
  }

  function explicitLocation(summary) {
    const text = String(summary || "");
    if (/远程/.test(text)) return "远程";
    if (/混合办公|hybrid/i.test(text)) {
      const city = firstMatch(text, /([\u4e00-\u9fa5A-Za-z]+)(?:·|\s*)混合办公/i);
      return city ? `${city} · 混合办公` : "【地点/远程】";
    }
    const city = firstMatch(text, /(?:工作地点|地点|办公地点|base|坐标)[:：为在是\s]*([\u4e00-\u9fa5A-Za-z]+(?:市)?)/i);
    return city || "【地点/远程】";
  }

  function explicitSalary(summary) {
    const text = String(summary || "");
    return firstMatch(text, /(?:薪资范围|薪资|工资|待遇|月薪|年薪|预算|package|salary)?[:：为是\s]*((?:USD|VND|RMB|CNY|¥|\$)?\s*\d[\d,.]*(?:\s*[-~至]\s*(?:USD|VND|RMB|CNY|¥|\$)?\s*\d[\d,.]*)?\s*(?:K|k|万|万元|元)?(?:\s*(?:\/月|\/年|每月|每年|年薪|月薪))?)/i) || "【薪资范围】";
  }

  function explicitReportTo(summary) {
    return firstMatch(summary, /(?:向|汇报给|直接向|report to)\s*([A-Za-z\u4e00-\u9fa5 /]+?)(?:汇报|负责|，|。|,|$)/i) || "【汇报对象】";
  }

  function explicitOfficeMode(summary) {
    const text = String(summary || "");
    if (/混合办公|hybrid/i.test(text)) return "混合办公";
    if (/远程|remote/i.test(text)) return "远程";
    if (/坐班|办公室/.test(text)) return "坐班";
    return "【坐班/混合/远程】";
  }

  function roleFocusItems(summary) {
    const text = String(summary || "");
    const candidates = [
      ["预算", /预算/],
      ["现金流", /现金流/],
      ["审计", /审计/],
      ["区域财务合规", /区域.*合规|财务合规|合规/],
      ["越南市场增长", /越南.*增长/],
      ["渠道合作", /渠道/],
      ["销售漏斗转化", /销售漏斗|漏斗|转化/],
      ["API 与任务流稳定性", /API|任务流|数据稳定/],
    ];
    return candidates.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
  }

  function buildTemplateFillSummary(documentDraft) {
    const checks = [
      ["岗位名称", !hasPlaceholder(documentDraft.roleTitle)],
      ["发布标题 / 核心卖点", documentDraft.focusItems.length > 0],
      ["工作方式", !hasPlaceholder(documentDraft.location) || !hasPlaceholder(documentDraft.officeMode)],
      ["薪资与福利", !hasPlaceholder(documentDraft.salaryRange)],
      ["岗位基本信息 / 汇报对象", !hasPlaceholder(documentDraft.reportTo)],
      ["入职后成功的样子", !documentDraft.success.some(hasPlaceholder)],
      ["我们希望你具备", !documentDraft.requirements.some(hasPlaceholder)],
      ["招聘流程", !hasPlaceholder(documentDraft.workflow)],
      ["申请方式", !hasPlaceholder(documentDraft.apply)],
    ];
    const completed = checks.filter(([, done]) => done).map(([label]) => label);
    const missing = checks.filter(([, done]) => !done).map(([label]) => label);
    return {
      percent: Math.round((completed.length / checks.length) * 100),
      completed,
      missing,
    };
  }

  function templateGuidedActions(draft, limit = 2) {
    const documentDraft = buildJobDescriptionDocument(draft || currentDraft());
    const fill = buildTemplateFillSummary(documentDraft);
    const actionByField = {
      "工作地点/办公方式": {
        label: "补充工作地点和办公方式",
        value: "工作地点是【请填写】，办公方式是【坐班/混合/远程】。",
      },
      "工作方式": {
        label: "填写「工作方式」",
        value: "工作方式：工作地点【请填写】，办公方式【坐班/混合/远程】，工作时间【请填写】。",
      },
      "薪资范围": {
        label: "补充薪资范围",
        value: "薪资范围是【请填写】，薪资结构是【请填写】。",
      },
      "薪资与福利": {
        label: "填写「薪资与福利」",
        value: "薪资与福利：薪资范围【请填写】，薪资结构【请填写】，福利【请填写】。",
      },
      "汇报对象": {
        label: "补充汇报对象",
        value: "汇报对象是【请填写】，团队规模是【请填写】。",
      },
      "岗位基本信息 / 汇报对象": {
        label: "填写「岗位基本信息」",
        value: "岗位基本信息：汇报对象【请填写】，团队规模【请填写】，预计到岗【请填写】。",
      },
      "入职后成功的样子": {
        label: "填写「入职后成功的样子」",
        value: "入职后成功的样子：前 30 天【请填写】，前 60 天【请填写】，前 90 天【请填写】，6-12 个月【请填写】。",
      },
      "我们希望你具备": {
        label: "填写「我们希望你具备」",
        value: "我们希望你具备：【经验年限/领域经验】、【关键项目经验】、【工具或专业能力】。",
      },
      "招聘流程": {
        label: "填写「招聘流程」",
        value: "招聘流程：HR 初筛 -> 【业务/专业面试】 -> 【终面】 -> Offer。",
      },
      "申请方式": {
        label: "填写「申请方式」",
        value: "申请方式：【邮箱/链接】，需要提交【简历/作品集/项目材料】。",
      },
    };
    const actions = fill.missing.map((field) => actionByField[field]).filter(Boolean);
    if (actions.length) return actions.slice(0, limit);
    return [
      { label: "确认字段，进入邮件发送", value: "确认字段，进入邮件发送。" },
      { label: "继续润色 JD 表达", value: "请把这份 JD 的语气调整得更正式、更适合对外发布。" },
    ].slice(0, limit);
  }

  function templateGuidedMessage(draft) {
    const documentDraft = buildJobDescriptionDocument(draft || currentDraft());
    const fill = buildTemplateFillSummary(documentDraft);
    const missing = fill.missing.slice(0, 2);
    if (!missing.length) return "我已按右侧大纲更新岗位说明书。所有关键模块都已有内容，可以继续润色或进入发送。";
    return `我已按右侧大纲更新岗位说明书。接下来优先补「${missing.join("」和「")}」这部分，这样右侧模板会继续自动更新。`;
  }

  function isAdviceOrDiscussionMessage(text) {
    const value = String(text || "").trim();
    if (!value) return false;
    return /吗|么|哪些|是否|会不会|合适|合理|建议|怎么看|怎么写|如何写|怎么定|如何定|应该|可不可以|能不能|有没有问题|风险|哪个更|哪种更|比较|还是|包括什么|是什么意思|是什么/i.test(value);
  }

  function isPolishMessage(text) {
    const value = String(text || "").trim();
    return /润色|改写|重写|优化表达|更正式|更外企|外企风|更委婉|更简洁|语气|口吻|tone|polish|rewrite/i.test(value);
  }

  function isDeleteMessage(text) {
    const value = String(text || "").trim();
    return /删除|删掉|去掉|不要写|移除|不体现|不要放|隐藏/i.test(value);
  }

  function isCapabilityMessage(text) {
    const value = String(text || "").trim();
    return /你能|你可以|能帮我|可以帮我|导出|保存|发送邮件|发邮件|下载|复制|怎么用|如何使用/i.test(value);
  }

  function isGreetingMessage(text) {
    const value = String(text || "").trim();
    return /^(你好|您好|hello|hi|hey|在吗|哈喽|嗨)[。.!！\s]*$/i.test(value);
  }

  function isExplicitUpdateMessage(text) {
    const value = String(text || "").trim();
    if (!value) return false;
    if (looksLikeStandaloneSalaryValue(value)) return true;
    return /改成|调整为|变成|设为|更新为|写成|填成|改为|写入|填入|采用|采纳|就按|确认用|招聘|我要招聘|需要招聘|工作地点[:：为是]|办公地点[:：为是]|薪资[:：为是]|\b工资|工资[:：为是]|待遇[:：为是]|月薪|年薪|汇报给|向.+汇报|团队\d|团队[一二三四五六七八九十]|招聘人数|全职|兼职|合同制|混合办公|远程|坐班|到岗|入职|流程[:：为是]|面试[:：为是]|申请方式[:：为是]/i.test(value);
  }

  function classifyInlineMessage(text) {
    const value = String(text || "").trim();
    const labels = extractedFieldLabelsFromMessage(value);
    if (!value) return { type: "empty", labels };
    if (isGreetingMessage(value)) return { type: "greeting", labels };
    if (isDeleteMessage(value)) return { type: "delete", labels };
    if (isPolishMessage(value)) return { type: "polish", labels };
    if (isCapabilityMessage(value) && !labels.length) return { type: "capability", labels };
    if (isAdviceOrDiscussionMessage(value) && !/改成|调整为|变成|设为|更新为|写入|填入|填成|确认|采用|就按/i.test(value)) {
      return { type: "discussion", labels };
    }
    if (labels.length || isJobDocumentMessage(value)) return { type: "facts", labels };
    if (isCapabilityMessage(value)) return { type: "capability", labels };
    if (isAdviceOrDiscussionMessage(value)) return { type: "discussion", labels };
    return { type: "unknown", labels };
  }

  function isJobDocumentMessage(text) {
    const value = String(text || "").trim();
    if (!value) return false;
    if (looksLikeStandaloneSalaryValue(value)) return true;
    return /招聘|岗位|职位|JD|jd|薪资|工资|待遇|月薪|年薪|工作地点|地点|办公|远程|混合|坐班|全职|兼职|合同制|到岗|入职|预计到岗|汇报|招聘人数|人数|团队|职责|要求|经验|流程|面试|申请方式|Finance|Director|Growth|Engineer|Head of|remote|hybrid|full[- ]?time|part[- ]?time|contract/i.test(value);
  }

  function extractedFieldLabelsFromMessage(text) {
    const value = String(text || "");
    const labels = [];
    if (/招聘|岗位|职位|Finance|Director|Growth|Engineer|Head of/i.test(value)) labels.push("岗位名称");
    if (/薪资|工资|待遇|月薪|年薪|预算|salary|package/i.test(value) || looksLikeStandaloneSalaryValue(value)) labels.push("薪资与福利");
    if (/工作地点|地点|办公|远程|混合|坐班|全职|兼职|合同制|remote|hybrid|full[- ]?time|part[- ]?time|contract/i.test(value)) labels.push("工作方式");
    if (/汇报|直接上级|report to/i.test(value)) labels.push("岗位基本信息 / 汇报对象");
    if (/招聘人数|人数|headcount/i.test(value)) labels.push("岗位基本信息 / 招聘人数");
    if (/到岗|入职|预计到岗|start date/i.test(value)) labels.push("岗位基本信息 / 预计到岗");
    if (/30\s*天|60\s*天|90\s*天|6-12\s*个月|一年|入职后/i.test(value)) labels.push("入职后成功的样子");
    if (/要求|经验|证书|能力|工具|语言|资格/i.test(value)) labels.push("我们希望你具备");
    if (/流程|面试|初筛|终面|offer/i.test(value)) labels.push("招聘流程");
    if (/申请方式|投递|邮箱|链接/i.test(value)) labels.push("申请方式");
    return [...new Set(labels)];
  }

  function isNonWritingDiscussion(text) {
    const value = String(text || "").trim();
    if (!value) return false;
    return isAdviceOrDiscussionMessage(value) && !isExplicitUpdateMessage(value);
  }

  function deletedFieldLabelsFromMessage(text) {
    const value = String(text || "");
    const labels = [];
    if (/薪资|工资|待遇|月薪|年薪|预算/i.test(value)) labels.push("薪资与福利");
    if (/地点|办公|远程|混合|坐班/i.test(value)) labels.push("工作方式");
    if (/汇报|直接上级|report to/i.test(value)) labels.push("岗位基本信息 / 汇报对象");
    if (/团队规模|团队/i.test(value)) labels.push("岗位基本信息 / 团队规模");
    if (/招聘人数|人数|headcount/i.test(value)) labels.push("岗位基本信息 / 招聘人数");
    if (/到岗|入职|预计到岗|start date/i.test(value)) labels.push("岗位基本信息 / 预计到岗");
    if (/用工性质|工作性质|全职|兼职|合同制/i.test(value)) labels.push("岗位基本信息 / 用工性质");
    return [...new Set(labels)];
  }

  function templateGuidedUpdateMessage(draft, message = "") {
    const labels = extractedFieldLabelsFromMessage(message);
    const base = labels.length
      ? `我分析了你刚才的内容，已更新右侧「${labels.join("」「")}」字段。`
      : templateGuidedMessage(draft);
    const documentDraft = buildJobDescriptionDocument(draft || currentDraft());
    const fill = buildTemplateFillSummary(documentDraft);
    const missing = fill.missing.slice(0, 2);
    if (!missing.length) return `${base} 右侧大纲关键字段已经补齐，可以继续润色或进入发送。`;
    return `${base} 下一步建议补「${missing.join("」和「")}」。`;
  }

  function renderCompletionText(draft) {
    const documentDraft = buildJobDescriptionDocument(draft || currentDraft());
    const fill = buildTemplateFillSummary(documentDraft);
    const completedText = fill.completed.length ? `已写入：${fill.completed.join("、")}。` : "";
    const missingText = fill.missing.length ? `还需要补：${fill.missing.slice(0, 4).join("、")}。` : "右侧大纲关键字段已经补齐。";
    return `
      <p class="agent-outline-summary">${escapeHTML([completedText, missingText].filter(Boolean).join(" "))}</p>
    `;
  }

  function emptyPreviewMarkup() {
    return `
      <div class="agent-preview-header">
        ${previewHeaderActions()}
      </div>
      ${renderJobDescriptionDocument(buildJobDescriptionDocument())}
    `;
  }

  function renderPreview(draft = activeDraft, options = {}) {
    if (!agentPreview) return;
    activeDraft = draft || activeDraft;
    if (!options.skipArtifactSync && activeDraft && !isPlaceholderRoleTitle(activeDraft.roleTitle)) {
      upsertDraftArtifact(activeDraft);
    }
    agentPreview.classList.remove("is-hidden");
    const documentDraft = buildJobDescriptionDocument(activeDraft || currentDraft());
    const documentKey = previewDraftKey(documentDraft);
    const shouldUseSavedMarkup = options.useSavedMarkup ?? !messages.length;
    const savedMarkup = shouldUseSavedMarkup ? readSavedPreview(documentKey) : "";
    const documentMarkup = savedMarkup || renderJobDescriptionDocument(documentDraft);
    agentPreview.innerHTML = `
      <div class="agent-preview-header">
        ${previewHeaderActions()}
      </div>
      ${documentMarkup}
    `;
    refreshIcons();
  }

  function buildJobDescriptionDocument(draft = {}) {
    const roleTitle = draft.roleTitle || "【岗位名称】";
    const summary = draft.summary || "";
    const isPlaceholder = roleTitle === "【岗位名称】";
    const focusItems = Array.isArray(draft.focusItems) && draft.focusItems.length ? draft.focusItems : roleFocusItems(summary);
    const salaryRange = draft.salaryRange || explicitSalary(summary);
    const location = draft.location || explicitLocation(summary);
    const officeMode = draft.officeMode || explicitOfficeMode(summary);
    const reportTo = draft.reportTo || explicitReportTo(summary);
    const department = draft.department || "【所属部门】";
    const employmentType = draft.employmentType || "【全职/兼职/合同制】";
    const headcount = draft.headcount || "【人数】";
    const teamSize = draft.teamSize || "【团队规模】";
    const startDate = draft.startDate || "【日期或尽快】";
    const workTime = draft.workTime || "【标准工时】";
    const travel = draft.travel || "【无/约 XX%】";
    const coreSellingPoint = focusItems.length ? `${focusItems.slice(0, 2).join("、")}方向` : "【核心卖点】";
    const titleFields = [
      ["岗位名称", roleTitle],
      ["地点/远程", location],
      ["薪资范围", salaryRange],
      ["核心卖点", coreSellingPoint],
    ];
    const basicFields = [
      ["所属部门", department],
      ["用工性质", employmentType],
      ["招聘人数", headcount],
      ["汇报对象", reportTo],
      ["团队规模", teamSize],
      ["预计到岗", startDate],
    ];
    const responsibilities = focusItems.length
      ? focusItems.slice(0, 6).map((item) => `围绕${item}推进相关工作，具体目标、衡量标准和协作边界待进一步确认。`)
      : [
          "负责【核心职责】，制定【策略/方案/计划】，并对【结果指标】负责。",
          "建立并优化【流程/制度/系统】，提升【效率、质量或转化结果】。",
          "主导【重点项目】，协调【相关团队】，确保【时间、质量、预算】达成。",
          "跟踪并分析【关键数据】，识别问题并推动改进。",
          "管理【团队/客户/供应商】，建立清晰的目标和协作机制。",
          "识别【业务、交付、成本或合规】风险并推动闭环。",
        ];
    const requirements = [
      "【X】年以上【岗位/领域】相关经验。",
      "独立完成过【关键项目或业务结果】。",
      "熟悉【行业、流程或业务模式】。",
      "掌握【必要工具、系统、语言或专业能力】。",
      "具备良好的业务判断、沟通协作和推动落地能力。",
    ];
    const preferred = ["【相似行业/公司阶段】经验。", "【从 0 到 1 / 规模化 / 跨区域】经验。", "【额外证书、工具或专业能力】。"];
    const workflow = "简历筛选 -> 【首轮沟通】 -> 【业务面试】 -> 【案例/作业】 -> 【终轮面试】 -> Offer";
    const apply = `请通过【邮箱/链接】申请，并附上【简历/作品集/项目材料】。邮件或申请标题注明“${roleTitle}-姓名-来源渠道”。我们预计在【X】个工作日内完成初步评估。`;
    const reasonFields = [
      ["招聘原因", "【业务扩张/组织升级/新产品或新市场】"],
      ["核心问题", focusItems.length ? focusItems.join("、") : "【1-3 个核心问题】"],
      ["岗位支持", "【团队、预算、系统或管理层支持】"],
    ];
    const missionFields = [
      ["业务范围", focusItems.length ? focusItems.join("、") : "【业务范围】"],
      ["关键方法", "【关键方法/管理机制】"],
      ["业务结果", "【业务结果】"],
      ["战略目标", "【战略目标】"],
    ];
    const responsibilityFields = responsibilities.map((item, index) => [`职责 ${index + 1}`, item]);
    const confirmedSuccess = Array.isArray(draft.successItems) ? draft.successItems : [];
    const successMap = new Map(confirmedSuccess);
    const successFields = [
      ["前 30 天", "【】"],
      ["前 60 天", "【】"],
      ["前 90 天", "【】"],
      ["6-12 个月", "【】"],
    ].map(([label, value]) => [label, successMap.get(label) || value]);
    const confirmedRequirements = Array.isArray(draft.requirementItems) && draft.requirementItems.length
      ? draft.requirementItems.map((item, index) => [`要求 ${index + 1}`, item])
      : [];
    const requirementFields = confirmedRequirements.length ? confirmedRequirements : requirements.map((item, index) => [`要求 ${index + 1}`, item]);
    const preferredFields = preferred.map((item, index) => [`加分项 ${index + 1}`, item]);
    const compensationFields = [
      ["薪资范围", salaryRange],
      ["薪资结构", "【固定薪资 + 绩效奖金 + 长期激励】"],
      ["试用期", "【X 个月，是否同薪】"],
      ["福利", "【五险一金、年假、补充医疗、体检、津贴等】"],
    ];
    const workStyleFields = [
      ["工作地点", location],
      ["办公方式", officeMode],
      ["工作时间", workTime],
      ["出差要求", travel],
    ];
    const workflowFields = [
      ["招聘流程", draft.workflow || workflow],
      ["申请方式", draft.apply || apply],
      ["平等招聘", "我们根据岗位胜任力和业务需要进行招聘。"],
      ["隐私说明", "候选人信息仅用于经授权的招聘评估，并按照适用的隐私与数据保护要求进行处理。"],
    ];
    const groups = [
      {
        title: "发布信息",
        sections: [
          { title: "发布标题", fields: titleFields },
          { title: "岗位基本信息", fields: basicFields },
        ],
      },
      {
        title: "岗位内容",
        sections: [
          { title: "为什么招聘这个岗位", fields: reasonFields },
          { title: "岗位使命", fields: missionFields },
          { title: "你将负责", fields: responsibilityFields },
          { title: "入职后成功的样子", fields: successFields },
        ],
      },
      {
        title: "候选人要求",
        sections: [
          { title: "我们希望你具备", fields: requirementFields },
          { title: "以下经历会加分", fields: preferredFields },
        ],
      },
      {
        title: "招聘与流程",
        sections: [
          { title: "薪资与福利", fields: compensationFields },
          { title: "工作方式", fields: workStyleFields },
          { title: "招聘流程、申请与合规", fields: workflowFields },
        ],
      },
    ];
    return {
      roleTitle,
      status: isPlaceholder ? "等待创建职位输入" : `模板填充中 · ${summary}`,
      headline: `${roleTitle} 招聘 JD`,
      titleFields,
      basicFields,
      groups,
      focusItems,
      location,
      officeMode,
      salaryRange,
      reportTo,
      meta: [
        "所属部门：【所属部门】",
        "用工性质：【全职/兼职/合同制】",
        "招聘人数：【人数】",
        `汇报对象：${reportTo}`,
        "团队规模：【团队规模】",
        "预计到岗：【日期或尽快】",
      ],
      reason: isPlaceholder
        ? "由于【业务扩张/组织升级/新产品或新市场】，我们正在招聘一名【岗位名称】。本岗位将重点解决【1-3 个核心问题】，并获得【团队、预算、系统或管理层支持】。"
        : `由于【业务扩张/组织升级/新产品或新市场】，我们正在招聘一名${roleTitle}。${focusItems.length ? `当前已确认岗位重点围绕${focusItems.join("、")}。` : "本岗位将重点解决【1-3 个核心问题】。"}其余招聘背景和岗位资源待确认。`,
      mission: focusItems.length
        ? `负责${focusItems.join("、")}相关工作，通过【关键方法/管理机制】，实现【业务结果】，并支持公司【战略目标】。`
        : "负责【业务范围】，通过【关键方法/管理机制】，实现【业务结果】，并支持公司【战略目标】。",
      responsibilities,
      success: successFields.map(([label, value]) => `${label}：${value}`),
      requirements: requirementFields.map(([, value]) => value),
      preferred,
      compensation: `薪资范围：${salaryRange}。薪资结构：【固定薪资 + 绩效奖金 + 长期激励】。试用期：【X 个月，是否同薪】。福利：【五险一金、年假、补充医疗、体检、津贴等】。`,
      workStyle: `工作地点：${location}｜办公方式：${officeMode}｜工作时间：${workTime}｜出差要求：${travel}`,
      workflow: draft.workflow || workflow,
      apply: draft.apply || apply,
      privacy: "我们根据岗位胜任力和业务需要进行招聘。候选人信息仅用于经授权的招聘评估，并按照适用的隐私与数据保护要求进行处理。",
    };
  }

  function splitPreviewItems(text) {
    return String(text || "")
      .split(/[、,，;；]/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 8);
  }

  function renderJDField([label, value]) {
    const missing = hasPlaceholder(value);
    const stateLabel = missing ? "待确认" : "已确认";
    const stateIcon = missing ? "triangle-alert" : "check";
    return `
      <div class="jd-template-field ${missing ? "is-missing" : "is-filled"}">
        <span class="jd-template-field-label">${escapeHTML(label)}</span>
        <strong class="jd-template-field-value">${escapeHTML(value)}</strong>
        <em class="jd-template-field-state" aria-label="${stateLabel}" title="${stateLabel}"><i data-lucide="${stateIcon}"></i></em>
      </div>
    `;
  }

  function renderJDSection(section) {
    return `
      <section class="jd-template-section">
        <h3>${escapeHTML(section.title)}</h3>
        <div class="jd-template-field-list">
          ${section.fields.map(renderJDField).join("")}
        </div>
      </section>
    `;
  }

  function renderJDGroup(group) {
    return `
      <section class="jd-template-group">
        <h2>${escapeHTML(group.title)}</h2>
        ${group.sections.map(renderJDSection).join("")}
      </section>
    `;
  }

  function renderJobDescriptionDocument(documentDraft) {
    return `
      <article class="job-description-preview" data-job-description-preview contenteditable="true" spellcheck="false" aria-label="可编辑岗位说明书">
        <header class="jd-template-title">
          <span>对外发布版招聘 JD</span>
          <h1>${escapeHTML(documentDraft.headline)}</h1>
          <p>系统会根据对话逐步补全字段，未确认信息会保留为待确认项。</p>
        </header>
        ${documentDraft.groups.map(renderJDGroup).join("")}
      </article>
    `;
  }

  function savePreviewEdits() {
    if (!agentPreview) return;
    const documentNode = agentPreview.querySelector("[data-job-description-preview]");
    if (!documentNode) return;
    const documentDraft = buildJobDescriptionDocument(activeDraft || currentDraft());
    const documentKey = previewDraftKey(documentDraft);
    writeSavedPreview(documentKey, documentNode.outerHTML);
    const draftRecord = saveJdDraftRecord(documentDraft, documentNode.outerHTML, "draft");
    const saveButton = agentPreview.querySelector("[data-agent-preview-save]");
    if (saveButton) {
      saveButton.classList.add("is-saved");
      saveButton.setAttribute("aria-label", "已保存岗位说明书");
      saveButton.setAttribute("title", "已保存");
      saveButton.innerHTML = `<i data-lucide="check"></i>`;
      refreshIcons();
      window.clearTimeout(previewSaveTimer);
      previewSaveTimer = window.setTimeout(() => {
        saveButton.classList.remove("is-saved");
        saveButton.setAttribute("aria-label", "保存岗位说明书");
        saveButton.setAttribute("title", "保存岗位说明书");
        saveButton.innerHTML = `<i data-lucide="save"></i>`;
        refreshIcons();
      }, 1400);
    }
    showHireOSToast(`${draftRecord.roleTitle} 已保存到 JD Draft`);
  }

  function resetSavedPreview() {
    const documentDraft = buildJobDescriptionDocument(activeDraft || currentDraft());
    clearSavedPreview(previewDraftKey(documentDraft));
    if (agentPreview) renderPreview(activeDraft || currentDraft());
    showHireOSToast("岗位说明书已重置");
  }

  function openDraftPreview(draft) {
    renderPreview(draft, { useSavedMarkup: false });
    setWorkspaceExpanded(true);
  }

  function createDraftArtifactCard(draft, label = "") {
    const targetDraft = draft || currentDraft();
    if (targetDraft && !isPlaceholderRoleTitle(targetDraft.roleTitle)) {
      upsertDraftArtifact(targetDraft);
    } else {
      renderArtifactRail();
    }
    return "";
  }

  function nextActionList(actions) {
    return `
      <div class="chat-next-actions">
        ${actions.map((action) => `
          <button type="button" data-agent-job-chip="${escapeHTML(action.value)}">
            <span>${escapeHTML(action.label)}</span>
            <i data-lucide="arrow-right"></i>
          </button>
        `).join("")}
      </div>
    `;
  }

  function resetInlineConversation() {
    stage = 0;
    messages = [];
    agentConversation = [];
    agentDocumentPatch = {};
    pendingDocumentProposal = null;
    sending = false;
    draftVersion = 0;
    draftVersions = [];
    draftArtifacts = [];
    selectedDraftArtifactId = "";
    draftArtifactSeq = 0;
    activeDraft = null;
    flowStarted = false;
    setComposeSkill("");
    input.disabled = false;
    input.value = "";
    input.placeholder = "描述要创建的岗位，或问我怎么处理任务";
    sendButton.disabled = false;
    sendButton.innerHTML = `<i data-lucide="send-horizontal"></i>`;
    agentBody.innerHTML = `
      <section class="agent-chat-card" data-agent-job-thread>
        <div class="agent-chat-turn is-agent">
          <h3>开始</h3>
          <p>我可以帮你创建职位、生成岗位说明书，并根据任务列表给出下一步处理建议。</p>
          <button class="agent-create-job-button" type="button" data-agent-create-start>
            <i data-lucide="sparkles"></i>
            <span>创建职位</span>
          </button>
          ${nextActionList([
            { label: "使用示例", value: exampleIntent },
            { label: "创建 Finance Director 岗位", value: "我要招聘 Finance Director，负责预算、现金流、审计和区域财务合规。" },
          ])}
        </div>
      </section>
    `;
    if (agentPreview) {
      agentPreview.classList.add("is-hidden");
      agentPreview.innerHTML = emptyPreviewMarkup();
    }
    renderArtifactRail();
    setWorkspaceExpanded(false);
    syncCurrentLanguage();
    refreshIcons();
  }

  function startInlineConversation(options = {}) {
    const preserveInput = Boolean(options.preserveInput);
    flowStarted = true;
    stage = 0;
    input.disabled = false;
    if (!preserveInput) input.value = "";
    input.placeholder = "描述要创建的岗位，例如：Finance Director";
    agentBody.innerHTML = `
      <section class="agent-chat-card" data-agent-job-thread>
        <div class="agent-chat-turn is-agent">
          <h3>开始</h3>
          <p>请先输入岗位需求。我会按职位创建流程追问，并在右侧同步生成岗位说明书。</p>
          ${nextActionList([
            { label: "使用示例", value: exampleIntent },
            { label: "创建 Finance Director 岗位", value: "我要招聘 Finance Director，负责预算、现金流、审计和区域财务合规。" },
          ])}
        </div>
      </section>
    `;
    renderPreview(currentDraft());
    setWorkspaceExpanded(true);
    syncCurrentLanguage();
    refreshIcons();
    input.focus();
  }

  function thread() {
    return agentBody.querySelector("[data-agent-job-thread]");
  }

  function agentTurn(markup) {
    thread()?.insertAdjacentHTML("beforeend", `<div class="agent-chat-turn is-agent" data-no-translate>${markup}</div>`);
    syncCurrentLanguage();
    refreshIcons();
    scrollAgent();
  }

  function renderUserTurnContent(text) {
    const command = parseSendEmailCommand(text);
    if (!command || command.message.type !== "jd_reference") {
      return `<p>${escapeHTML(text)}</p>`;
    }
    return `
      <p class="agent-command-message">
        <span>${escapeHTML(`@SendEmail:+${command.to}+`)}</span>
        <button class="agent-message-token" type="button" data-agent-message-artifact="${escapeHTML(command.message.artifactId)}">
          ${escapeHTML(command.message.title)}
        </button>
      </p>
    `;
  }

  function userTurn(text) {
    thread()?.insertAdjacentHTML("beforeend", `<div class="agent-chat-turn is-user" data-no-translate>${renderUserTurnContent(text)}</div>`);
    refreshIcons();
    scrollAgent();
  }

  function setSendingState(isSending) {
    sending = isSending;
    sendButton.disabled = isSending;
    sendButton.innerHTML = isSending ? `<i data-lucide="loader-circle"></i>` : `<i data-lucide="send-horizontal"></i>`;
    refreshIcons();
  }

  function speechRecognitionConstructor() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }

  function setVoiceListening(isListening) {
    if (!voiceButton) return;
    voiceButton.classList.toggle("is-listening", isListening);
    voiceButton.setAttribute("aria-pressed", String(isListening));
    voiceButton.setAttribute("aria-label", isListening ? "停止语音输入" : "语音输入");
    voiceButton.setAttribute("title", isListening ? "停止语音输入" : "语音输入");
    voiceButton.innerHTML = isListening ? `<i data-lucide="square"></i>` : `<i data-lucide="mic"></i>`;
    refreshIcons();
  }

  function appendVoiceTranscript(transcript) {
    const text = String(transcript || "").replace(/\s+/g, " ").trim();
    if (!text) return;
    input.value = [voiceBaseText, text].filter(Boolean).join(" ");
    input.focus();
  }

  function stopVoiceInput() {
    if (voiceRecognition) {
      try {
        voiceRecognition.stop();
      } catch (error) {
        // Browser already stopped listening.
      }
    }
    voiceRecognition = null;
    setVoiceListening(false);
  }

  function toggleVoiceInput() {
    if (!voiceButton || input.disabled || sending) return;
    if (voiceButton.classList.contains("is-listening")) {
      stopVoiceInput();
      return;
    }
    const SpeechRecognition = speechRecognitionConstructor();
    if (!SpeechRecognition) {
      agentTurn(`<p>当前浏览器不支持语音输入。可以继续用键盘输入岗位需求。</p>`);
      return;
    }
    try {
      voiceBaseText = input.value.trim();
      voiceTranscript = "";
      voiceRecognition = new SpeechRecognition();
      voiceRecognition.lang = "zh-CN";
      voiceRecognition.continuous = true;
      voiceRecognition.interimResults = true;
      voiceRecognition.onresult = (event) => {
        voiceTranscript = Array.from(event.results)
          .map((result) => result[0]?.transcript || "")
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        appendVoiceTranscript(voiceTranscript);
      };
      voiceRecognition.onerror = () => {
        agentTurn(`<p>语音输入没有启动成功。可以继续用键盘输入岗位需求。</p>`);
        stopVoiceInput();
      };
      voiceRecognition.onend = () => setVoiceListening(false);
      setVoiceListening(true);
      voiceRecognition.start();
    } catch (error) {
      agentTurn(`<p>语音输入没有启动成功。可以继续用键盘输入岗位需求。</p>`);
      stopVoiceInput();
    }
  }

  function currentDraft() {
    const selected = selectedDraftArtifact();
    if (selected?.draft) return { ...selected.draft };
    const baseDraft = messages.length ? deriveAiIntakeDraft(messages) : {};
    return { ...baseDraft, ...agentDocumentPatch };
  }

  function jobDescriptionAgentApiUrl() {
    return window.HIREOS_JOB_DESCRIPTION_AGENT_API_URL || "http://localhost:8000/role-intelligence/job-description-agent";
  }

  async function requestJobDescriptionAgent(message) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(jobDescriptionAgentApiUrl(), {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          stage,
          message,
          messages,
          conversation: agentConversation,
          document: buildJobDescriptionDocument(currentDraft()),
          missing_fields: buildTemplateFillSummary(buildJobDescriptionDocument(currentDraft())).missing,
          locale: currentLanguage() === "zh" ? "zh-CN" : "en-US",
        }),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      return null;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function renderAgentServiceResponse(result, latestMessage = "") {
    if (!result || !result.assistant_message) return false;
    const draft = { ...(result.draft || {}), ...currentDraft() };
    activeDraft = draft;
    const nextActions = templateGuidedActions(draft);
    agentTurn(`
      <p>${escapeHTML(templateGuidedUpdateMessage(draft, latestMessage))}</p>
      ${Array.isArray(result.bullets) && result.bullets.length ? `<ul class="agent-response-list">${result.bullets.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>` : ""}
      ${renderCompletionText(draft)}
      ${createDraftArtifactCard(draft, result.artifact_label || "岗位说明书预览")}
      <p class="chat-next-query">下一步想怎么处理？</p>
      ${nextActionList(nextActions)}
    `);
    stage = Number.isFinite(result.next_stage) ? result.next_stage : stage + 1;
    input.placeholder = result.input_placeholder || input.placeholder;
    renderPreview(draft);
    return true;
  }

  function normalizePatchValue(entry) {
    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      return String(entry.value ?? "").trim();
    }
    return String(entry ?? "").trim();
  }

  function patchEntry(value, mode = "replace") {
    return { value: String(value || "").trim(), mode };
  }

  function localDocumentPatchFromMessage(message = "") {
    const text = String(message || "").trim();
    const patch = {};
    if (!text || isNonWritingDiscussion(text)) return patch;
    const roleMatch = text.match(/(?:我要招聘|需要招聘|计划招聘|创建)\s*(?:一位|一个|一名|1位|名)?\s*([^，,。；;\n]+)/i);
    if (roleMatch) patch.roleTitle = patchEntry(roleMatch[1].trim());
    const salaryMatch = text.match(/(?:薪资范围|薪资|工资|待遇|月薪|年薪|预算|salary|package)[:：为是\s]*((?:USD|VND|RMB|CNY|¥|\$)?\s*\d[\d,.]*(?:\s*[-~至]\s*(?:USD|VND|RMB|CNY|¥|\$)?\s*\d[\d,.]*)?\s*(?:K|k|万|万元|元)?(?:\s*(?:\/月|\/年|每月|每年|年薪|月薪))?)/i) ||
      (looksLikeStandaloneSalaryValue(text) ? text.match(/((?:USD|VND|RMB|CNY|¥|\$)?\s*\d[\d,.]*(?:\s*[-~至]\s*(?:USD|VND|RMB|CNY|¥|\$)?\s*\d[\d,.]*)?\s*(?:K|k|万|万元|元)?(?:\s*(?:\/月|\/年|每月|每年|年薪|月薪))?)/i) : null);
    if (salaryMatch) patch.salaryRange = patchEntry(salaryMatch[1]);
    const locationMatch = text.match(/(?:工作地点|地点|办公地点|base|坐标)[:：为在是\s]*([\u4e00-\u9fa5A-Za-z ]+?)(?:，|。|；|,|;|$)/i) ||
      text.match(/(胡志明市|河内|越南|Ho Chi Minh|Hanoi|Singapore|新加坡|上海|北京|深圳|广州)/i);
    if (locationMatch) patch.location = patchEntry(locationMatch[1]);
    if (/混合办公|hybrid/i.test(text)) patch.officeMode = patchEntry("混合办公");
    else if (/远程|remote/i.test(text)) patch.officeMode = patchEntry("远程");
    else if (/坐班|办公室/.test(text)) patch.officeMode = patchEntry("坐班");
    const workTimeMatch = text.match(/(标准工时|弹性工作|弹性工时|大小周|双休|单休|[0-9]{1,2}\s*点\s*[-到至]\s*[0-9]{1,2}\s*点)/);
    if (workTimeMatch) patch.workTime = patchEntry(workTimeMatch[1]);
    const travelMatch = text.match(/(无需出差|不出差|低频出差|高频出差|偶尔出差|约\s*\d+%?\s*出差|\d+%?\s*出差)/);
    if (travelMatch) patch.travel = patchEntry(travelMatch[1]);
    const reportMatch = text.match(/(?:汇报对象|直接上级|汇报给|直接向|report to)[:：为是\s]*([A-Za-z\u4e00-\u9fa5 /]+?)(?:汇报|负责|，|。|,|；|;|$)/i) ||
      text.match(/向\s*([A-Za-z\u4e00-\u9fa5 /]+?)\s*汇报/i);
    if (reportMatch) patch.reportTo = patchEntry(reportMatch[1]);
    const teamMatch = text.match(/(?:团队规模|团队)[:：为是\s]*([\d一二三四五六七八九十]+(?:\s*[-~至]\s*[\d一二三四五六七八九十]+)?\s*(?:人|位)?)/);
    if (teamMatch) patch.teamSize = patchEntry(teamMatch[1]);
    const headcountMatch = text.match(/(?:招聘人数|人数|headcount)[:：为是\s]*(\d+\s*(?:人|位)?)/i);
    if (headcountMatch) patch.headcount = patchEntry(headcountMatch[1]);
    if (/全职|full[- ]?time/i.test(text)) patch.employmentType = patchEntry("全职");
    else if (/兼职|part[- ]?time/i.test(text)) patch.employmentType = patchEntry("兼职");
    else if (/合同制|contract/i.test(text)) patch.employmentType = patchEntry("合同制");
    const startMatch = text.match(/(?:预计到岗|到岗|入职时间|入职|start date)[:：为是\s]*([\u4e00-\u9fa5A-Za-z0-9 /.-]+?)(?:，|。|,|；|;|$)/i) ||
      text.match(/(?:最好|希望|尽量|需要|要求|可)?\s*([0-9]{1,2}\s*号(?:前|之前|左右)?|[0-9]{1,2}[/-][0-9]{1,2}(?:前|之前|左右)?|下周|本周|月底前|月初|尽快|asap)\s*(?:前|之前|左右)?\s*(?:到岗|入职)/i);
    if (startMatch) patch.startDate = patchEntry(startMatch[1]);
    return patch;
  }

  function mergeDocumentPatch(...patches) {
    return patches.reduce((merged, patch) => {
      if (!patch || typeof patch !== "object" || Array.isArray(patch)) return merged;
      Object.entries(patch).forEach(([key, value]) => {
        if (normalizePatchValue(value)) merged[key] = value;
      });
      return merged;
    }, {});
  }

  function isAdoptionMessage(text) {
    const value = String(text || "").trim();
    if (!value) return false;
    return /^(可以|好|好的|行|就这样|按这个|采纳|采用|确认|同意|写入|填进去|放进去|就按这个|就按刚才|按刚才|按你说的)[。.!！\s]*$/i.test(value) ||
      /采纳|采用|就这样|按这个|按刚才|按你说的|写入右侧|填入右侧|放到右侧/i.test(value);
  }

  function rememberPendingDocumentProposal(result, latestMessage = "") {
    const suggestions = Array.isArray(result?.suggestions) ? result.suggestions : [];
    const candidatePatches = suggestions
      .map((item) => {
        if (!item || typeof item !== "object") return {};
        return mergeDocumentPatch(item.document_patch || {}, localDocumentPatchFromMessage(item.message || item.value || ""));
      })
      .filter((patch) => Object.keys(patch).length);
    const modelPatch = sanitizeModelPatchForMessage(result?.document_patch || {}, latestMessage);
    const patch = candidatePatches[0] || (
      result?.needs_confirmation && Object.keys(modelPatch).length ? modelPatch : {}
    );
    if (!Object.keys(patch).length) return;
    pendingDocumentProposal = {
      patch,
      summary: patchLabels(patch).join("、") || "右侧 JD 字段",
      createdAt: Date.now(),
    };
  }

  function acceptPendingDocumentProposal(message = "") {
    if (!isAdoptionMessage(message) || !pendingDocumentProposal?.patch) return false;
    const changedFields = applyDocumentPatch(pendingDocumentProposal.patch);
    if (!changedFields.length) return false;
    const draft = currentDraft();
    activeDraft = draft;
    renderPreview(draft, { useSavedMarkup: false });
    agentConversation.push({
      role: "assistant",
      intent: "accept_proposal",
      content: `已采纳上一轮建议并写入：${pendingDocumentProposal.summary}`,
      document_patch: pendingDocumentProposal.patch,
    });
    agentTurn(`
      <p>已采纳上一轮建议，并写入右侧「${escapeHTML(pendingDocumentProposal.summary)}」。</p>
      ${renderCompletionText(draft)}
      ${createDraftArtifactCard(draft, "岗位说明书预览")}
      <p class="chat-next-query">下一步可以继续补这些字段：</p>
      ${nextActionList(templateGuidedActions(draft))}
    `);
    pendingDocumentProposal = null;
    input.placeholder = "继续补充字段，或问我某一段怎么写";
    return true;
  }

  function modelPatchAllowedForMessage(result, latestMessage = "", localPatch = {}, localIntent = classifyInlineMessage(latestMessage)) {
    const text = String(latestMessage || "").trim();
    if (!text || isNonWritingDiscussion(text)) return false;
    if (Object.keys(localPatch).length) return true;
    if (!result?.should_update_document) return false;
    if (!["provide_fact", "edit_field"].includes(String(result.intent || ""))) return false;
    if (!isExplicitUpdateMessage(text) && localIntent.type !== "facts") return false;
    if (/^(你好|您好|hello|hi|在吗)[。.!！\s]*$/i.test(text)) return false;
    return true;
  }

  function sanitizeModelPatchForMessage(documentPatch = {}, message = "") {
    const patch = { ...(documentPatch || {}) };
    const text = String(message || "");
    if (/^(你好|您好|hello|hi|在吗)[。.!！\s]*$/i.test(text)) return {};
    if (
      patch.roleTitle &&
      !/(我要招聘|需要招聘|计划招聘|创建|岗位|职位|role|position|Finance|Director|Growth|Engineer|Head of|负责人|工程师|设计师)/i.test(text)
    ) {
      delete patch.roleTitle;
    }
    if (
      patch.officeMode &&
      /到岗|入职|预计到岗/.test(text) &&
      !/办公方式|工作方式|坐班|办公室|混合办公|远程|hybrid|remote/i.test(text)
    ) {
      delete patch.officeMode;
    }
    if (patch.workTime && /^(全职|兼职|合同制|full[- ]?time|part[- ]?time|contract)$/i.test(normalizePatchValue(patch.workTime))) {
      delete patch.workTime;
    }
    return patch;
  }

  function patchLabels(documentPatch = {}) {
    const labels = {
      roleTitle: "岗位名称",
      salaryRange: "薪资与福利",
      location: "工作方式",
      officeMode: "工作方式",
      reportTo: "汇报对象",
      headcount: "招聘人数",
      teamSize: "团队规模",
      startDate: "预计到岗",
      employmentType: "用工性质",
      workTime: "工作时间",
      travel: "出差要求",
      department: "所属部门",
      workflow: "招聘流程",
      apply: "申请方式",
    };
    return [...new Set(Object.keys(documentPatch || {}).map((key) => labels[key]).filter(Boolean))];
  }

  function applyDocumentPatch(documentPatch = {}) {
    if (!documentPatch || typeof documentPatch !== "object" || Array.isArray(documentPatch)) return [];
    const createNewArtifact = shouldCreateNewDraftArtifact(documentPatch);
    let nextDraft = createNewArtifact ? {} : currentDraft();
    const fieldMap = {
      roleTitle: "roleTitle",
      title: "roleTitle",
      salaryRange: "salaryRange",
      salary: "salaryRange",
      location: "location",
      officeMode: "officeMode",
      workMode: "officeMode",
      reportTo: "reportTo",
      headcount: "headcount",
      teamSize: "teamSize",
      startDate: "startDate",
      employmentType: "employmentType",
      department: "department",
      workTime: "workTime",
      travel: "travel",
      workflow: "workflow",
      apply: "apply",
    };
    const changed = [];
    Object.entries(documentPatch).forEach(([key, entry]) => {
      const target = fieldMap[key] || key;
      if (!Object.prototype.hasOwnProperty.call(fieldMap, key) && !Object.prototype.hasOwnProperty.call(nextDraft, target)) return;
      const mode = entry && typeof entry === "object" && !Array.isArray(entry) ? String(entry.mode || "replace") : "replace";
      const value = normalizePatchValue(entry);
      if (mode === "delete" || mode === "clear" || value === "__DELETE__") {
        delete nextDraft[target];
        changed.push(target);
        return;
      }
      if (!value) return;
      nextDraft[target] = value;
      changed.push(target);
    });
    if (changed.length) {
      const artifact = upsertDraftArtifact(nextDraft, { createNew: createNewArtifact });
      activeDraft = artifact.draft;
      agentDocumentPatch = { ...artifact.draft };
    }
    return changed;
  }

  function structuredActions(result) {
    const normalizeAction = (text) => String(text || "")
      .replace(/确认成功标准/g, "填写「入职后成功的样子」")
      .replace(/确认硬性条件/g, "填写「我们希望你具备」")
      .replace(/修改成功标准和硬性条件/g, "修改「入职后成功的样子」和「我们希望你具备」");
    const suggestions = Array.isArray(result?.suggestions) ? result.suggestions : [];
    const suggestionActions = suggestions
      .map((item) => {
        if (typeof item === "string") return { label: normalizeAction(item), value: item };
        if (!item || typeof item !== "object") return null;
        return {
          label: normalizeAction(item.label || item.message || item.value || "采纳建议"),
          value: item.message || item.value || item.label || "",
        };
      })
      .filter((item) => item && item.label && item.value)
      .slice(0, 2);
    if (suggestionActions.length) return suggestionActions;
    return templateGuidedActions(currentDraft());
  }

  function renderStructuredAgentDecision(result, latestMessage = "", localIntent = classifyInlineMessage(latestMessage)) {
    if (!result || !result.intent || !result.assistant_message) return false;
    const localPatch = localDocumentPatchFromMessage(latestMessage);
    const discussionOnly = latestMessage && isNonWritingDiscussion(latestMessage);
    const modelPatch = modelPatchAllowedForMessage(result, latestMessage, localPatch, localIntent)
      ? sanitizeModelPatchForMessage(result.document_patch || {}, latestMessage)
      : {};
    const combinedPatch = mergeDocumentPatch(modelPatch, localPatch);
    const shouldUpdate = !discussionOnly && Object.keys(combinedPatch).length > 0;
    const changedFields = shouldUpdate ? applyDocumentPatch(combinedPatch) : [];
    if (shouldUpdate && latestMessage && !messages.includes(latestMessage)) messages.push(latestMessage);
    const draft = currentDraft();
    activeDraft = draft;
    if (shouldUpdate) renderPreview(draft, { useSavedMarkup: false });
    const roleAdvice = !shouldUpdate ? roleDiscussionAdviceForMessage(latestMessage) : null;
    const bullets = roleAdvice?.bullets || (Array.isArray(result.bullets) ? result.bullets : []);
    const changedLabels = patchLabels(combinedPatch);
    const assistantMessage = shouldUpdate && changedLabels.length
      ? `我已识别到你补充的是「${changedLabels.join("」「")}」，并同步更新到右侧 JD。`
      : roleAdvice?.lead || result.assistant_message;
    if (!shouldUpdate) rememberPendingDocumentProposal(result, latestMessage);
    agentConversation.push({ role: "assistant", intent: result.intent, content: result.assistant_message, suggestions: result.suggestions || [], document_patch: shouldUpdate ? combinedPatch : null });
    const artifactMarkup = shouldUpdate ? createDraftArtifactCard(draft, result.artifact_label || "岗位说明书预览") : "";
    agentTurn(`
      <p>${escapeHTML(assistantMessage)}</p>
      ${bullets.length ? `<ul class="agent-response-list">${bullets.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>` : ""}
      ${shouldUpdate ? renderCompletionText(draft) : ""}
      ${artifactMarkup}
      <p class="chat-next-query">${escapeHTML(result.needs_confirmation ? "需要你确认：" : "下一步可以这样继续：")}</p>
      ${nextActionList(roleAdvice?.actions || structuredActions(result))}
    `);
    stage = Number.isFinite(result.next_stage) ? result.next_stage : Math.max(stage, shouldUpdate ? 1 : stage);
    input.placeholder = result.input_placeholder || (shouldUpdate ? "继续补充字段，或询问我怎么写更合适" : "继续讨论，或明确说要写入哪个字段");
    return true;
  }

  function renderGeneralAgentResponse(result, message = "") {
    const greetingOnly = isGreetingMessage(message);
    const assistantMessage = result?.assistant_message || "你好，我是 HireOS JD Agent。我可以根据你的对话创建岗位说明书，并把岗位名称、职责、工作方式、薪资福利、候选人要求和招聘流程同步到右侧模板。";
    const bullets = Array.isArray(result?.bullets) && result.bullets.length
      ? result.bullets
      : ["输入岗位需求后，我会生成右侧 JD 模板。", "你也可以只补充某个字段，例如地点、薪资、汇报对象或招聘流程。", "后续每次修改都会同步更新右侧内容。"];
    const greetingMessage = "你好，我是 HireOS JD Agent。你可以先和我讨论岗位，也可以直接给我岗位信息；只有识别到明确 JD 字段，或你确认采纳建议时，我才会更新右侧模板。";
    const greetingBullets = [
      "普通问题我会先正常回答，不会改右侧。",
      "如果你说“薪资 5000”“汇报给 Davis”“最好 15 号前到岗”，我会自动填入对应字段。",
      "如果我们先讨论出方案，你再说“采纳”或“写入右侧”，我会把结论同步进去。",
    ];
    agentTurn(`
      <p>${escapeHTML(greetingOnly ? greetingMessage : assistantMessage)}</p>
      <ul class="agent-response-list">${(greetingOnly ? greetingBullets : bullets).map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
      ${greetingOnly ? "" : createDraftArtifactCard(activeDraft || currentDraft() || { roleTitle: "岗位说明书模板", summary: "输入岗位需求后，我会同步生成右侧 JD。" }, "JD Agent 指引")}
      <p class="chat-next-query">你可以这样开始：</p>
      ${nextActionList([
        { label: "创建 Finance Director 岗位", value: "我要招聘 Finance Director，负责预算、现金流、审计和区域财务合规。" },
        { label: "补充某个 JD 字段", value: "工作地点是越南混合办公，薪资范围是 8-12 万/月。" },
      ])}
    `);
    input.placeholder = message ? "继续描述岗位需求，或告诉我要补哪个字段" : input.placeholder;
  }

  function renderUnrecognizedJobInput(message = "") {
    const draft = currentDraft();
    agentTurn(`
      <p>我还没有从这句话里识别到可以直接写入右侧 JD 的字段。</p>
      <ul class="agent-response-list">
        <li>你可以继续用自然语言补充，比如“薪资 5000”“15号前到岗”“向 CFO 汇报”。</li>
        <li>如果这句话是对某个字段的修改，请带上字段名或更明确的对象。</li>
      </ul>
      ${createDraftArtifactCard(draft, "岗位说明书预览")}
      <p class="chat-next-query">你可以优先补这些字段：</p>
      ${nextActionList(templateGuidedActions(draft))}
    `);
    input.placeholder = "继续描述岗位需求，或告诉我要补哪个字段";
  }

  function roleDiscussionAdviceForMessage(message) {
    const value = String(message || "");
    if (/finan?ce\s*director|财务总监|财务负责人/i.test(value)) {
      return {
        lead: "Finance Director 通常是财务总监或财务负责人，重点负责公司财务战略、预算、现金流、财务报告、审计合规和经营决策支持。",
        bullets: [
          "在 JD 里，它通常不是单纯做账岗位，而是要对预算节奏、现金流安全和财务合规结果负责。",
          "如果公司在跨区域或增长阶段，这个角色还会承担业务伙伴、风险判断和管理层决策支持。",
          "写 JD 时建议先确认：汇报对象、管理团队规模、预算范围、现金流/审计/合规的优先级。",
        ],
        actions: [
          { label: "写入岗位使命", value: "请把 Finance Director 的岗位使命写入右侧，重点是预算、现金流、审计合规和经营决策支持。" },
          { label: "继续讨论职责边界", value: "继续帮我分析 Finance Director 和 Finance Manager 的职责边界。" },
        ],
      };
    }
    if (/head\s*of\s*growth|增长负责人|增长总监/i.test(value)) {
      return {
        lead: "Head of Growth 通常负责增长策略、获客渠道、销售漏斗、转化效率和跨团队增长实验。",
        bullets: [
          "它更偏业务结果和增长机制，不只是市场投放或销售管理。",
          "JD 里建议明确负责的市场、主要渠道、核心指标和与销售/产品/运营的协作边界。",
          "如果要写入右侧，可以确认增长目标、渠道范围、团队规模和汇报对象。",
        ],
        actions: [
          { label: "写入岗位使命", value: "请把 Head of Growth 的岗位使命写入右侧，重点是增长策略、渠道合作和销售漏斗转化。" },
          { label: "继续讨论指标", value: "继续帮我分析 Head of Growth 应该看哪些核心指标。" },
        ],
      };
    }
    return null;
  }

  function discussionAdviceForMessage(message) {
    const roleAdvice = roleDiscussionAdviceForMessage(message);
    if (roleAdvice) return roleAdvice.bullets;
    const value = String(message || "");
    if (/薪资|工资|待遇|月薪|年薪|预算/i.test(value)) {
      return [
        "这更像是在讨论薪资策略，我先不写入右侧模板。",
        "建议确认三个点：币种和周期、固定薪资与奖金结构、这个范围是否匹配岗位级别和市场稀缺度。",
        "如果你确认采用这个范围，可以直接说“薪资范围是……”，我再写入右侧。",
      ];
    }
    if (/成功|目标|KPI|指标|30\s*天|60\s*天|90\s*天|入职后/i.test(value)) {
      return [
        "这更像是在讨论「入职后成功的样子」，我先不自动写入。",
        "建议按时间拆：前 30 天理解业务和关键关系，前 60 天交付第一个可见结果，前 90 天形成稳定机制或指标改善。",
        "你确认后可以说“前 90 天目标是……”，我会写到右侧对应字段。",
      ];
    }
    if (/要求|条件|经验|能力|资格|证书|工具/i.test(value)) {
      return [
        "这更像是在讨论候选人要求，我先不直接写入，避免把建议当成硬性条件。",
        "建议区分“必须具备”和“加分项”：必须项控制在 3-5 条，加分项用于扩大筛选弹性。",
        "如果要写入，可以说“必须要求是……”或“加分项是……”。",
      ];
    }
    if (/流程|面试|初筛|终面|offer|案例/i.test(value)) {
      return [
        "这更像是在讨论招聘流程，我先不给右侧模板做强制修改。",
        "建议流程保持轻量：HR 初筛、业务/专业面试、终面确认；只有需要验证实操能力时再加案例。",
        "你确认后可以说“招聘流程是……”，我会写入右侧流程字段。",
      ];
    }
    if (/工作方式|工作地点|办公|远程|混合|坐班|出差|工作时间/i.test(value)) {
      return [
        "工作方式通常包括：工作地点、办公方式、工作时间、出差要求。",
        "对当前岗位，建议先确认地点和办公方式，再补工作时间与出差要求。",
        "确认后你可以直接说“越南混合办公，标准工时，低频出差”，我再写入右侧。",
      ];
    }
    return [
      "这更像是在讨论 JD 方案，我先不改右侧模板。",
      "我的建议是先判断它属于哪个模块：发布信息、岗位内容、候选人要求，还是招聘与流程。",
      "你确认要采用后，用“写入到……”或直接给字段内容，我会再更新右侧。",
    ];
  }

  function renderDiscussionResponse(message = "") {
    const roleAdvice = roleDiscussionAdviceForMessage(message);
    const advice = roleAdvice ? roleAdvice.bullets : discussionAdviceForMessage(message);
    agentTurn(`
      <p>${escapeHTML(roleAdvice?.lead || "我判断这句话是在向我征求意见，不是明确字段录入，所以暂时不更新右侧 JD。")}</p>
      <ul class="agent-response-list">${advice.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
      <p class="chat-next-query">可以这样继续：</p>
      ${nextActionList(roleAdvice?.actions || [
        { label: "采纳建议并写入字段", value: "请把刚才建议整理后写入右侧对应字段。" },
        { label: "继续讨论这个模块", value: "继续帮我分析这个模块怎么写更合适。" },
      ])}
    `);
    input.placeholder = "继续讨论，或明确说要写入哪个字段";
  }

  function renderPolishResponse(message = "") {
    const draft = currentDraft();
    agentTurn(`
      <p>我理解这是对 JD 表达方式的润色需求，不是新增事实字段。</p>
      <ul class="agent-response-list">
        <li>建议保留右侧已确认字段，只调整未确认段落和对外表述。</li>
        <li>可以按“更正式”“更外企商务风”“更简洁直接”三种方向生成新版本。</li>
        <li>如果你确认方向，我会生成一版新的 JD 文案并保留当前版本。</li>
      </ul>
      ${createDraftArtifactCard(draft, "岗位说明书预览")}
      <p class="chat-next-query">选择一个润色方向：</p>
      ${nextActionList([
        { label: "更正式", value: "请把右侧 JD 润色得更正式，但不要改变事实字段。" },
        { label: "更外企商务风", value: "请把右侧 JD 改成更外企商务风，但不要改变事实字段。" },
      ])}
    `);
    input.placeholder = "告诉我要哪种语气，或继续补充字段";
  }

  function renderDeleteGuidance(message = "") {
    const draft = currentDraft();
    const labels = deletedFieldLabelsFromMessage(message);
    if (labels.length) {
      agentTurn(`
        <p>我已按你的删除指令处理右侧模板，把「${escapeHTML(labels.join("」「"))}」恢复为待确认。</p>
        ${renderCompletionText(draft)}
        ${createDraftArtifactCard(draft, "岗位说明书预览")}
        <p class="chat-next-query">接下来可以继续：</p>
        ${nextActionList(templateGuidedActions(draft))}
      `);
      renderPreview(draft);
      input.placeholder = "继续补充字段，或说明要删除哪一段";
      return;
    }
    agentTurn(`
      <p>我理解你想删除或弱化某些内容。为了避免误删，我先不直接修改右侧。</p>
      <ul class="agent-response-list">
        <li>请告诉我要删除哪个字段或哪一段，例如“删除团队规模”或“去掉加班相关要求”。</li>
        <li>如果只是不要对外展示，我可以把它恢复为待确认或移到内部备注。</li>
      </ul>
      ${createDraftArtifactCard(draft, "岗位说明书预览")}
      <p class="chat-next-query">你可以这样说：</p>
      ${nextActionList([
        { label: "删除某个字段", value: "删除【字段名】。" },
        { label: "改成待确认", value: "把【字段名】改成待确认。" },
      ])}
    `);
    input.placeholder = "说明要删除或弱化的具体字段";
  }

  function renderCapabilityResponse(message = "") {
    const draft = currentDraft();
    agentTurn(`
      <p>我可以继续帮你创建和调整 JD，并把明确字段同步到右侧模板。</p>
      <ul class="agent-response-list">
        <li>支持：字段补充、字段覆盖、到岗时间、薪资、汇报对象、招聘流程等自动写入。</li>
        <li>支持：对 JD 方案给建议，建议类内容不会自动写入。</li>
        <li>支持：保存右侧可编辑内容；发送邮件需要本地 Gmail Send API 可用。</li>
      </ul>
      ${createDraftArtifactCard(draft, "岗位说明书预览")}
      <p class="chat-next-query">你可以继续：</p>
      ${nextActionList(templateGuidedActions(draft))}
    `);
  }

  function renderTemplateGuidedTurn(draft = currentDraft(), latestMessage = "") {
    activeDraft = draft;
    agentTurn(`
      <p>${escapeHTML(templateGuidedUpdateMessage(draft, latestMessage))}</p>
      ${renderCompletionText(draft)}
      ${createDraftArtifactCard(draft, "岗位说明书预览")}
      <p class="chat-next-query">下一步想怎么处理？</p>
      ${nextActionList(templateGuidedActions(draft))}
    `);
    renderPreview(draft);
  }

  function requestClarification() {
    const draft = currentDraft();
    const latestMessage = messages[messages.length - 1] || "";
    const isFinance = /finance|财务|预算|现金流|审计|合规/i.test(`${draft.roleTitle || ""} ${draft.summary || ""}`);
    const focusText = isFinance ? "预算、现金流、审计、区域财务合规" : "岗位目标、协作边界、交付结果";
    const nextText = isFinance ? "岗位基本信息、工作方式、薪资与福利、招聘流程" : "岗位基本信息、入职后成功的样子、我们希望你具备、招聘流程";
    agentTurn(`
      <p>${escapeHTML(templateGuidedUpdateMessage(draft, latestMessage))}</p>
      <ul class="agent-response-list">
        <li>已识别岗位方向：${escapeHTML(draft.roleTitle || "【岗位名称】")}</li>
        <li>已放入右侧模板的岗位重点：${escapeHTML(focusText)}</li>
        <li>下一轮会按大纲继续补：${escapeHTML(nextText)}</li>
      </ul>
      ${renderCompletionText(draft)}
      ${createDraftArtifactCard(draft, "岗位说明书预览")}
      <p class="chat-next-query">下一步想怎么处理？</p>
      ${nextActionList(templateGuidedActions(draft))}
    `);
    stage = 1;
    input.placeholder = "补充或修改右侧大纲字段，也可以直接发送确认。";
  }

  function requestInterviewPlan() {
    const draft = currentDraft();
    const isFinance = /finance|财务|预算|现金流|审计|合规/i.test(`${draft.roleTitle || ""} ${draft.summary || ""}`);
    const professionalOwner = isFinance ? "CFO / Regional Finance Lead" : "Tech Lead";
    const professionalSignal = isFinance ? "预算规划、现金流预测、审计协作、区域合规和经营分析。" : "API 设计、工作流状态、调试和生产稳定性。";
    agentTurn(`
      <p>我会继续根据你确认的信息填充模板；下面是建议补齐的招聘流程字段。</p>
      <ul class="agent-response-list">
        <li>HR 初筛：Linh Tran 负责动机、薪资范围、地点和入职节奏。</li>
        <li>专业面试：${escapeHTML(professionalOwner)} 负责验证${escapeHTML(professionalSignal)}</li>
        <li>终面 / 业务确认：Founder / Hiring Manager 负责最终匹配确认。</li>
      </ul>
      ${renderCompletionText(draft)}
      ${createDraftArtifactCard(draft, "岗位说明书预览")}
      <p class="chat-next-query">下一步想怎么处理？</p>
      ${nextActionList(templateGuidedActions(draft))}
    `);
    stage = 2;
    input.placeholder = "例如：技术面由 Tech Lead + Backend Staff 共同面试，Founder 只看最终轮。";
  }

  function generatePackage() {
    const draft = {
      ...currentDraft(),
      version: ++draftVersion,
    };
    draftVersions.push(draft);
    activeDraft = draft;
    agentTurn(`
      <p>已更新右侧 JD 模板。当前版本仍会保留未确认字段，避免发布前出现未经确认的信息。</p>
      ${renderCompletionText(draft)}
      ${createDraftArtifactCard(draft)}
      <p class="chat-next-query">下一步想怎么处理？</p>
      ${nextActionList(templateGuidedActions(draft))}
    `);
    stage = 3;
    renderPreview(draft);
    input.placeholder = "输入“确认”进入邮箱步骤，或继续输入修改意见。";
  }

  function requestRecipientEmail() {
    agentTurn(`
      <p>Which mailbox should receive this Job Creation package?</p>
      <div class="chat-question-list">
        <div><strong>Recipient</strong><span>Enter the mailbox that should receive this recruitment request.</span></div>
        <div><strong>Completion rule</strong><span>Job Creation completes only after the email is sent successfully.</span></div>
      </div>
    `);
    stage = 4;
    input.placeholder = "输入收件邮箱，例如 tyyslj7927@gmail.com";
  }

  function completeInlineEmail(email, delivery) {
    const intakeRecord = buildAiIntakeTaskRecord(messages, email, delivery);
    const createdJob = saveCreatedJobFromIntake(messages, email);
    if (createdJob) {
      intakeRecord.related_job_id = createdJob.id;
      intakeRecord.next_action = "在 Jobs 列表中编辑、关闭或继续管理该岗位。";
      intakeRecord.related_objects = [createdJob.title, `Sent to ${email}`, "Jobs list"];
    }
    addCreatedJobTask(intakeRecord);
    agentTurn(`
      <p>Email sent successfully. Job Creation is complete.</p>
      <div class="followup-task-list">
        <div><strong>Sent to</strong><span>${escapeHTML(email)}</span></div>
        <div><strong>Jobs list saved</strong><span>${escapeHTML(createdJob?.title || intakeRecord.related_objects[0])}</span></div>
        <div><strong>Next</strong><span>Manage this role in Jobs list</span></div>
      </div>
    `);
    stage = 5;
    input.value = "";
    input.placeholder = "已发送成功。输入新的岗位需求可再次创建职位。";
    input.disabled = false;
    setSendingState(false);
    renderTasksList();
  }

  function sendEmailSuccessTurn(command, delivery) {
    const isJd = command.message.type === "jd_reference";
    agentTurn(`
      <p>${isJd ? "已发送 JD 邮件。" : "已发送邮件。"}</p>
      <ul class="agent-response-list">
        <li>收件人：${escapeHTML(command.to)}</li>
        <li>内容：${escapeHTML(isJd ? command.message.title : command.message.text)}</li>
        <li>状态：${escapeHTML(delivery.provider || "gmail")} 已接受发送请求。</li>
      </ul>
    `);
  }

  async function handleSendEmailCommand(command) {
    if (!isValidEmailAddress(command.to)) {
      agentTurn(`<p>收件邮箱格式看起来不对。请按 <strong>@SendEmail:+name@example.com+邮件内容</strong> 重新发送。</p>`);
      return true;
    }
    const payload = command.message.type === "jd_reference"
      ? buildJobPackageEmailPayload(command.to, messages, command.message.draft)
      : buildPlainEmailPayload(command.to, command.message.text);
    setSendingState(true);
    const delivery = await postHireOSEmailPayload(payload);
    setSendingState(false);
    if (!delivery.ok) {
      agentTurn(`<p>${escapeHTML(delivery.error)}</p><small>邮件还没有发出，请检查收件邮箱或本地 Gmail send API 后再试。</small>`);
      return true;
    }
    sendEmailSuccessTurn(command, delivery);
    return true;
  }

  async function submitInlineMessage() {
    if (sending) return;
    if (!flowStarted) startInlineConversation({ preserveInput: true });
    const text = input.value.trim();
    if (!text && stage !== 0) return;
    if (stage === 5 && text) resetInlineConversation();
    const nextText = input.value.trim();
    const skillCommand = activeComposeSkill === "send_email" ? parseSendEmailSkillInput(nextText) : null;
    const turnText = skillCommand ? serializeSendEmailCommand(skillCommand) : nextText;
    if (activeComposeSkill === "send_email" && nextText && !skillCommand) {
      userTurn(`@SendEmail ${nextText}`);
      input.value = "";
      agentTurn(`<p>SendEmail 需要同时包含收件邮箱和内容。可以这样写：<strong>name@example.com 请确认明天面试安排</strong>。</p>`);
      return;
    }
    if (turnText) userTurn(turnText);
    input.value = "";
    if (turnText) agentConversation.push({ role: "user", content: turnText });
    const sendEmailCommand = skillCommand || parseSendEmailCommand(nextText);
    if (sendEmailCommand && await handleSendEmailCommand(sendEmailCommand)) {
      setComposeSkill("");
      return;
    }
    const intent = classifyInlineMessage(nextText);
    if (nextText && acceptPendingDocumentProposal(nextText)) return;
    if (nextText && stage !== 4 && intent.type === "greeting") {
      renderGeneralAgentResponse(null, nextText);
      return;
    }
    const immediatePatch = nextText && intent.type === "facts" ? localDocumentPatchFromMessage(nextText) : {};
    if (Object.keys(immediatePatch).length) {
      applyDocumentPatch(immediatePatch);
      if (!messages.includes(nextText)) messages.push(nextText);
      renderPreview(currentDraft(), { useSavedMarkup: false });
    }
    if (nextText && stage !== 4) {
      const structuredResult = await requestJobDescriptionAgent(nextText);
      if (renderStructuredAgentDecision(structuredResult, nextText, intent)) return;
    }
    if (nextText && stage !== 4 && intent.type === "discussion") {
      renderDiscussionResponse(nextText);
      return;
    }
    if (nextText && stage !== 4 && intent.type === "polish") {
      renderPolishResponse(nextText);
      return;
    }
    if (nextText && stage !== 4 && intent.type === "delete") {
      if (messages.length) messages.push(nextText);
      if (messages.length) renderPreview(currentDraft());
      renderDeleteGuidance(nextText);
      return;
    }
    if (nextText && stage !== 4 && intent.type === "capability") {
      renderCapabilityResponse(nextText);
      return;
    }
    const shouldUpdateDocument = stage !== 4 && intent.type === "facts";
    if (shouldUpdateDocument && !messages.includes(nextText)) messages.push(nextText);
    if (shouldUpdateDocument) renderPreview(currentDraft());
    if (!nextText && stage === 0) {
      agentTurn(`<p>先告诉我岗位目标、级别或工作地点中的任意一项，我再继续追问。</p>`);
      return;
    }
    if (nextText && !shouldUpdateDocument && stage !== 4) {
      if (messages.length) {
        renderUnrecognizedJobInput(nextText);
        return;
      }
      const result = await requestJobDescriptionAgent(nextText);
      renderGeneralAgentResponse(result, nextText);
      return;
    }
    if (stage === 0) {
      const result = await requestJobDescriptionAgent(nextText);
      if (renderAgentServiceResponse(result, nextText)) return;
      return requestClarification();
    }
    if (stage === 1) {
      const result = await requestJobDescriptionAgent(nextText);
      if (renderAgentServiceResponse(result, nextText)) return;
      stage = 2;
      return renderTemplateGuidedTurn(currentDraft(), nextText);
    }
    if (stage === 2) {
      const result = await requestJobDescriptionAgent(nextText);
      if (renderAgentServiceResponse(result, nextText)) return;
      stage = 3;
      return renderTemplateGuidedTurn(currentDraft(), nextText);
    }
    if (stage === 3) {
      if (/确认|发送|approve|launch/i.test(nextText)) return requestRecipientEmail();
      return renderTemplateGuidedTurn(currentDraft(), nextText);
    }
    if (stage === 4) {
      if (!isValidEmailAddress(nextText)) {
        agentTurn(`<p>Please enter a valid recipient mailbox before I send the package.</p>`);
        return;
      }
      setSendingState(true);
      const delivery = await sendJobPackageEmail(nextText, messages);
      if (!delivery.ok) {
        agentTurn(`<p>${escapeHTML(delivery.error)}</p><small>The Job Creation package is still open. Fix the recipient mailbox and send again.</small>`);
        setSendingState(false);
        return;
      }
      completeInlineEmail(nextText, delivery);
    }
  }

  resetInlineConversation();
  if (agentToggle) {
    setToggleIcon(agentToggle, "expand", "展开 AI 工作区");
    agentToggle.addEventListener("click", () => {
      if (document.body.classList.contains("agent-workspace-expanded")) {
        closePreview();
        return;
      }
      if (!flowStarted) {
        startInlineConversation();
        return;
      }
      openDraftPreview(activeDraft || currentDraft());
    });
  }
  if (voiceButton) {
    voiceButton.setAttribute("aria-pressed", "false");
    voiceButton.addEventListener("click", toggleVoiceInput);
  }
  if (resetPreviewButton) {
    resetPreviewButton.addEventListener("click", resetSavedPreview);
  }
  if (jdDraftsButton) {
    jdDraftsButton.addEventListener("click", showJdDraftsPanel);
  }
  jdDraftPanel.addEventListener("click", (event) => {
    if (event.target.closest("[data-jd-drafts-close]")) {
      hideJdDraftsPanel();
      return;
    }
    const draftItem = event.target.closest("[data-jd-draft-open]");
    if (draftItem) openSavedJdDraft(draftItem.dataset.jdDraftOpen);
  });
  document.querySelector("[data-task-list]")?.addEventListener("click", (event) => {
    const draftItem = event.target.closest("[data-jd-draft-open]");
    if (!draftItem) return;
    openSavedJdDraft(draftItem.dataset.jdDraftOpen);
  });
  skillPopover.addEventListener("click", (event) => {
    const skillButton = event.target.closest("[data-agent-compose-skill]");
    if (!skillButton) return;
    setComposeSkill(skillButton.dataset.agentComposeSkill || "");
  });
  skillChip.addEventListener("click", () => {
    setComposeSkill("");
  });
  composeJdReferences.addEventListener("click", (event) => {
    const jdReference = event.target.closest("[data-agent-compose-jd-reference]");
    if (!jdReference) return;
    setComposeJdReference("");
  });
  artifactRail.addEventListener("click", (event) => {
    const draftCard = event.target.closest("[data-agent-draft-card]");
    if (!draftCard) return;
    const artifact = selectDraftArtifact(draftCard.dataset.agentDraftCard);
    if (artifact && activeComposeSkill === "send_email") {
      setComposeJdReference(artifact.id);
    }
  });
  sendButton.addEventListener("click", submitInlineMessage);
  input.addEventListener("input", () => {
    if (input.value.trim().endsWith("@")) {
      showSkillPopover();
      return;
    }
    if (!/@$/.test(input.value.trim())) hideSkillPopover();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideSkillPopover();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      submitInlineMessage();
    }
  });
  agentBody.addEventListener("click", (event) => {
    const messageArtifact = event.target.closest("[data-agent-message-artifact]");
    if (messageArtifact) {
      selectDraftArtifact(messageArtifact.dataset.agentMessageArtifact);
      return;
    }
    const draftCard = event.target.closest("[data-agent-draft-card]");
    if (draftCard) {
      selectDraftArtifact(draftCard.dataset.agentDraftCard);
      return;
    }
    const createStart = event.target.closest("[data-agent-create-start]");
    if (createStart) {
      startInlineConversation();
      return;
    }
    const chip = event.target.closest("[data-agent-job-chip]");
    if (!chip) return;
    input.value = chip.dataset.agentJobChip || chip.textContent.trim();
    input.focus();
    if (/创建|我要招聘|招聘\s+/i.test(input.value)) {
      submitInlineMessage();
    }
  });
  if (agentPreview) {
    agentPreview.addEventListener("click", (event) => {
      if (event.target.closest("[data-agent-preview-publish]")) {
        publishCurrentJd();
        return;
      }
      if (event.target.closest("[data-agent-preview-save]")) {
        savePreviewEdits();
        return;
      }
      if (event.target.closest("[data-agent-preview-close]")) closePreview();
    });
  }
}

const currentTaskOwnerId = "user_linh_tran";
let activeTaskView = "my_tasks";
const jdDraftBoardStorageKey = "hireos:tasks:jd-drafts:v1";

function readTaskBoardJdDrafts() {
  try {
    return JSON.parse(localStorage.getItem(jdDraftBoardStorageKey) || "[]")
      .filter((draft) => draft.status !== "published");
  } catch (error) {
    return [];
  }
}

function createPublishedJdTask(publishedDraft) {
  const store = getTasksStore();
  if (!store || !publishedDraft) return null;
  const stableId = String(publishedDraft.stableKey || publishedDraft.id || publishedDraft.roleTitle || Date.now())
    .replace(/[^a-zA-Z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48) || "jd";
  const roleTitle = publishedDraft.roleTitle || "New Role";
  const taskId = `jd_publish_${stableId}`;
  const payload = {
    task_id: taskId,
    task_type: "Job Ready for Intake",
    title: "发布岗位并导入简历",
    status: "Open",
    priority: "High",
    owner_role: "HR Lead",
    owner_id: currentTaskOwnerId,
    due_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    source_module: "Jobs",
    related_job_id: `job_${stableId}`,
    related_candidate_id: "",
    related_application_id: "",
    next_action: "JD 已发布。导入第一批候选人简历，并开始招聘监控。",
    evidence_ids: ["ev_jd_published", "ev_jd_draft_confirmed"],
    completion_action: "岗位进入 Active，CV Import 生成候选人审核任务。",
    context_summary: `${roleTitle} JD 已从草稿发布，下一步处理候选人来源和 CV 导入。`,
    related_objects: [roleTitle, "Publish", "CV Import"],
    evidence_summary: ["JD 已发布。", "未发布草稿已从 JD Draft 筛选列表移除。", "下一步进入发布/导入简历流程。"],
  };
  return store.getTask(taskId) ? store.updateTask(taskId, payload) : store.createTask(payload);
}
const candidateTaskTypes = ["Candidate Review", "Duplicate Review", "Missing Candidate Info"];
const taskBoardCards = [
  {
    type: "AI Intake",
    candidate: "",
    position: "Senior Backend Engineer",
    taskTime: "Package drafted",
    ai: "JD, scorecard, workflow, interview plan, and challenge risks are generated from the hiring intent.",
    risk: "",
    status: "Done",
    priority: "High",
    owner: "Linh Tran",
    due: "Today 09:00",
    icon: "sparkles",
    href: "./hireos-jobs.html?job=backend&created=job_creation",
    taskId: "flow_01_ai_intake",
    groups: ["my_tasks", "today", "completed_ai", "all_tasks"],
  },
  {
    type: "Review Job Package",
    candidate: "",
    position: "Senior Backend Engineer",
    taskTime: "JD package",
    ai: "Review the generated JD, scorecard, workflow, interview plan, and challenge notes before launch.",
    risk: "",
    status: "Open",
    priority: "High",
    owner: "Linh Tran",
    due: "Today 10:00",
    icon: "clipboard-check",
    href: "./hireos-task-detail.html?task_id=flow_02_review_job_package",
    groups: ["my_tasks", "today", "critical", "all_tasks"],
  },
  {
    type: "Publish / CV Import",
    candidate: "",
    position: "Senior Backend Engineer",
    taskTime: "Ready to publish",
    ai: "Publish the reviewed job and import the first clean CV batch from recruiting intake.",
    risk: "",
    status: "Open",
    priority: "High",
    owner: "Linh Tran",
    due: "Today 11:00",
    icon: "rocket",
    href: "./hireos-task-detail.html?task_id=flow_03_publish_and_import",
    groups: ["my_tasks", "today", "critical", "all_tasks"],
  },
  {
    type: "Recruiting Monitor",
    candidate: "Trang Nguyen",
    position: "Senior Backend Engineer",
    taskTime: "CV imported",
    ai: "Validate source, candidate identity, and job match before the application workflow starts.",
    risk: "",
    status: "Open",
    priority: "High",
    owner: "Linh Tran",
    due: "Today 12:00",
    icon: "radar",
    href: "./hireos-task-detail.html?task_id=flow_04_recruiting_monitor",
    groups: ["my_tasks", "today", "critical", "all_tasks"],
  },
  {
    type: "Schedule HR Screen",
    candidate: "Trang Nguyen",
    position: "Senior Backend Engineer",
    taskTime: "HR screen",
    ai: "Schedule the HR screen and keep motivation, salary range, location, and launch support questions attached.",
    risk: "",
    status: "Open",
    priority: "High",
    owner: "Linh Tran",
    due: "Today 14:00",
    icon: "calendar-plus",
    href: "./hireos-task-detail.html?task_id=flow_05_schedule_hr_screen",
    groups: ["my_tasks", "today", "upcoming_interviews", "all_tasks"],
  },
  {
    type: "Review HR Feedback",
    candidate: "Trang Nguyen",
    position: "Senior Backend Engineer",
    taskTime: "Feedback ready",
    ai: "Review HR feedback and decide whether the candidate should move into technical interview.",
    risk: "",
    status: "Open",
    priority: "High",
    owner: "Linh Tran",
    due: "Today 16:00",
    icon: "messages-square",
    href: "./hireos-task-detail.html?task_id=flow_06_review_hr_feedback",
    groups: ["my_tasks", "today", "waiting_decision", "critical", "all_tasks"],
  },
  {
    type: "Interview Decision",
    candidate: "Trang Nguyen",
    position: "Senior Backend Engineer",
    taskTime: "Tech interview",
    ai: "Move to technical interview and pass the evidence gaps to Tech Lead.",
    risk: "",
    status: "Open",
    priority: "High",
    owner: "Linh Tran",
    due: "Jul 30 10:00",
    icon: "route",
    href: "./hireos-task-detail.html?task_id=flow_07_interview_decision",
    groups: ["my_tasks", "upcoming_interviews", "waiting_decision", "critical", "all_tasks"],
  },
  {
    type: "Assessment Decision",
    candidate: "Trang Nguyen",
    position: "Senior Backend Engineer",
    taskTime: "Evidence gap",
    ai: "Decide whether to send an assessment or route directly to founder review.",
    risk: "",
    status: "Open",
    priority: "High",
    owner: "Linh Tran",
    due: "Jul 30 15:00",
    icon: "clipboard-check",
    href: "./hireos-task-detail.html?task_id=flow_08_assessment_decision",
    groups: ["my_tasks", "batch_review", "waiting_decision", "critical", "all_tasks"],
  },
];

function taskPriorityClass(priority) {
  if (priority === "Urgent") return "danger";
  if (priority === "High") return "warn";
  if (priority === "Medium") return "green";
  return "";
}

function taskStatusClass(status) {
  if (status === "Waiting") return "warn";
  if (status === "Done") return "green";
  if (status === "Cancelled") return "danger";
  if (status === "Blocked") return "danger";
  if (status === "In Progress") return "green";
  return "";
}

function formatTaskDate(value) {
  if (!value) return "No due date";
  const date = new Date(value);
  const locale = currentLanguage() === "zh" ? "zh-CN" : "en";
  return date.toLocaleString(locale, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function taskDetailHref(task) {
  return `./hireos-task-detail.html?task_id=${encodeURIComponent(task.task_id)}`;
}

function getTasksStore() {
  return window.HireOSTasks?.taskStore;
}

function getFreshTasksStore() {
  if (!window.HireOSTasks?.createTaskStore || !window.localStorage) return getTasksStore();
  return window.HireOSTasks.createTaskStore(undefined, { storage: window.localStorage });
}

function createPublishedJobTaskForList(job) {
  const taskApi = window.HireOSTasks;
  if (!taskApi?.createPublishedJobFollowupTask || !job) return null;
  return taskApi.createPublishedJobFollowupTask(getFreshTasksStore(), {
    jobId: job.id,
    jobTitle: job.title,
    candidateId: "cand_trang_nguyen",
    applicationId: "app_trang_backend",
    ownerId: currentTaskOwnerId,
  });
}

function taskOwnerName(task) {
  const ownerNames = {
    user_linh_tran: "Linh Tran",
    user_founder: "Founder",
    user_mai_ho: "Mai Ho",
    user_tech_lead: "Tech Lead",
    user_ops: "Ops",
  };
  return ownerNames[task.owner_id] || task.owner_id || "Unassigned";
}

function currentTaskOwnerName() {
  return taskOwnerName({ owner_id: currentTaskOwnerId });
}

function deriveAiIntakeRoleTitle(messages) {
  const text = (messages || []).filter(Boolean).join(" ").trim();
  const knownRole = text.match(/(Finance Director|Strategic Investment Associate|Senior Backend Engineer|高级后端工程师|产品设计师|GTM 负责人)/i);
  if (knownRole) return knownRole[1];
  const hiringMatch = text.match(/(?:我要招聘|需要招聘|计划招聘|创建)\s*(?:一位|一个|一名|1位|名)?\s*([^，,。；;\n]+)/);
  if (hiringMatch) return hiringMatch[1].replace(/^位/, "").trim();
  return "New Role";
}

function compactAiIntakeSummary(messages) {
  const text = (messages || []).filter(Boolean).join("；").replace(/\s+/g, " ").trim();
  if (!text) return "AI Intake conversation completed from the user's role description.";
  return text.length > 150 ? `${text.slice(0, 150)}...` : text;
}

function isValidEmailAddress(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function jobPackageSendApiUrl() {
  return window.HIREOS_GMAIL_SEND_API_URL || "http://localhost:8787/api/mail/send-job-package";
}

function createAiIntakeTaskId(email) {
  const timestamp = Date.now().toString(36);
  const recipient = String(email || "recipient").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  return `ai_intake_${recipient || "recipient"}_${timestamp}`;
}

function jobCreationDetailUrl(roleTitle) {
  const detailBase = window.HIREOS_JD_DETAIL_BASE_URL || "http://localhost:8787/jd-detail";
  const url = new URL(detailBase);
  url.searchParams.set("job", jobFilterForTaskPosition(roleTitle));
  url.searchParams.set("created", "job_creation");
  return url.toString();
}

function textFirstMatch(text, pattern) {
  const match = String(text || "").match(pattern);
  return match ? (match[1] || match[0] || "").trim() : "";
}

function normalizePlaceholderValue(value) {
  return String(value || "").replace(/[。；;，,]+$/g, "").trim();
}

function latestTextMatch(messages, pattern) {
  const list = Array.isArray(messages) ? messages : [];
  for (let index = list.length - 1; index >= 0; index -= 1) {
    const match = String(list[index] || "").match(pattern);
    const value = match ? normalizePlaceholderValue(match[1] || match[0] || "") : "";
    if (value) return value;
  }
  return "";
}

function latestMatchIndex(messages, pattern) {
  const list = Array.isArray(messages) ? messages : [];
  for (let index = list.length - 1; index >= 0; index -= 1) {
    if (pattern.test(String(list[index] || ""))) return index;
  }
  return -1;
}

function isFieldDeletedAfterValue(messages, valuePattern, deletePattern) {
  return latestMatchIndex(messages, deletePattern) > latestMatchIndex(messages, valuePattern);
}

function looksLikeStandaloneSalaryValue(text) {
  const value = String(text || "").trim();
  if (!value || /(?:人|位|天|个月|年经验|年以上|岁)$/.test(value)) return false;
  const match = value.match(/^(?:薪资|薪资范围|工资|待遇|月薪|年薪|预算|salary|package)?\s*(?:改成|调整为|变成|设为|是|为)?\s*((?:USD|VND|RMB|CNY|¥|\$)?\s*\d[\d,.]*(?:\s*[-~至]\s*(?:USD|VND|RMB|CNY|¥|\$)?\s*\d[\d,.]*)?\s*(?:K|k|万|万元|元)?(?:\s*(?:\/月|\/年|每月|每年|年薪|月薪))?)$/i);
  if (!match) return false;
  const amount = match[1] || "";
  return /(?:USD|VND|RMB|CNY|¥|\$|K|k|万|元|\/月|\/年|每月|每年|年薪|月薪)/i.test(amount) || /\d{4,}/.test(amount);
}

function latestStandaloneSalary(messages) {
  const list = Array.isArray(messages) ? messages : [];
  for (let index = list.length - 1; index >= 0; index -= 1) {
    const value = String(list[index] || "").trim();
    if (!looksLikeStandaloneSalaryValue(value)) continue;
    const match = value.match(/((?:USD|VND|RMB|CNY|¥|\$)?\s*\d[\d,.]*(?:\s*[-~至]\s*(?:USD|VND|RMB|CNY|¥|\$)?\s*\d[\d,.]*)?\s*(?:K|k|万|万元|元)?(?:\s*(?:\/月|\/年|每月|每年|年薪|月薪))?)/i);
    const amount = normalizePlaceholderValue(match ? match[1] : "");
    if (amount) return amount;
  }
  return "";
}

function latestStartDate(messages) {
  const list = Array.isArray(messages) ? messages : [];
  const directPattern = /(?:预计到岗|到岗|入职时间|入职|start date)[:：为是\s]*([\u4e00-\u9fa5A-Za-z0-9 /.-]+?)(?:，|。|,|；|;|$)/i;
  const beforeKeywordPattern = /(?:最好|希望|尽量|需要|要求|可)?\s*([0-9]{1,2}\s*号(?:前|之前|左右)?|[0-9]{1,2}[/-][0-9]{1,2}(?:前|之前|左右)?|下周|本周|月底前|月初|尽快|asap)\s*(?:前|之前|左右)?\s*(?:到岗|入职)/i;
  for (let index = list.length - 1; index >= 0; index -= 1) {
    const value = String(list[index] || "");
    const direct = value.match(directPattern);
    const beforeKeyword = value.match(beforeKeywordPattern);
    const result = normalizePlaceholderValue((beforeKeyword && beforeKeyword[1]) || (direct && direct[1]) || "");
    if (result) return result;
  }
  return "";
}

function deriveFocusItemsFromText(text) {
  const candidates = [
    ["预算", /预算/],
    ["现金流", /现金流/],
    ["审计", /审计/],
    ["区域财务合规", /区域.*合规|财务合规|合规/],
    ["越南市场增长", /越南.*增长|市场增长|增长/],
    ["渠道合作", /渠道|合作伙伴/],
    ["销售漏斗转化", /销售漏斗|漏斗|转化/],
    ["品牌与获客", /品牌|获客/],
    ["API 与任务流稳定性", /API|任务流|数据稳定|后端|backend/i],
  ];
  return candidates.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
}

function splitFactList(value, fallback = []) {
  const items = String(value || "")
    .split(/[、,，;；\n]/)
    .map((item) => normalizePlaceholderValue(item))
    .filter(Boolean)
    .filter((item) => item.length > 1);
  return items.length ? items : fallback;
}

function extractJobFactsFromMessages(messages) {
  const text = (messages || []).filter(Boolean).join("；").replace(/\s+/g, " ").trim();
  const focusItems = deriveFocusItemsFromText(text);
  let salaryRange = normalizePlaceholderValue(
    latestTextMatch(messages, /(?:薪资范围|薪资|工资|待遇|月薪|年薪|预算|package|salary)[:：为是\s]*((?:USD|VND|RMB|CNY|¥|\$)?\s*\d[\d,.]*(?:\s*[-~至]\s*(?:USD|VND|RMB|CNY|¥|\$)?\s*\d[\d,.]*)?\s*(?:K|k|万|万元|元)?(?:\s*(?:\/月|\/年|每月|每年|年薪|月薪))?)/i) ||
    latestStandaloneSalary(messages)
  );
  let location = normalizePlaceholderValue(
    latestTextMatch(messages, /(?:工作地点|地点|办公地点|base|坐标)[:：为在是\s]*([\u4e00-\u9fa5A-Za-z ]+?)(?:，|。|；|,|;|$)/i) ||
    latestTextMatch(messages, /(胡志明市|河内|越南|Ho Chi Minh|Hanoi|Singapore|新加坡|上海|北京|深圳|广州)/i) ||
    (/远程|remote/i.test(text) ? "远程" : "")
  );
  const latestOfficeModeSignal = latestTextMatch(messages, /(混合办公|hybrid|远程|remote|坐班|办公室)/i);
  let officeMode = /混合办公|hybrid/i.test(latestOfficeModeSignal)
    ? "混合办公"
    : /远程|remote/i.test(latestOfficeModeSignal)
      ? "远程"
      : /坐班|办公室/.test(latestOfficeModeSignal)
        ? "坐班"
        : "";
  let reportTo = normalizePlaceholderValue(latestTextMatch(messages, /(?:汇报对象|直接上级|向|汇报给|直接向|report to)[:：为是\s]*([A-Za-z\u4e00-\u9fa5 /]+?)(?:汇报|负责|，|。|,|；|;|$)/i));
  const department = normalizePlaceholderValue(latestTextMatch(messages, /(?:所属部门|部门)[:：为是\s]*([\u4e00-\u9fa5A-Za-z /]+?)(?:，|。|,|；|;|$)/i)) ||
    (/finance|财务|预算|现金流|审计|合规/i.test(text) ? "Finance / 财务部" : "") ||
    (/growth|增长|市场|渠道|销售/i.test(text) ? "Growth / 增长部" : "");
  let headcount = normalizePlaceholderValue(latestTextMatch(messages, /(?:招聘人数|人数|headcount)[:：为是\s]*(\d+\s*(?:人|位)?)/i));
  let teamSize = normalizePlaceholderValue(latestTextMatch(messages, /(?:团队规模|团队)[:：为是\s]*([\d一二三四五六七八九十]+(?:\s*[-~至]\s*[\d一二三四五六七八九十]+)?\s*(?:人|位)?)/i));
  let startDate = normalizePlaceholderValue(latestStartDate(messages));
  let employmentType = normalizePlaceholderValue(latestTextMatch(messages, /(?:用工性质|工作性质|类型)[:：为是\s]*(全职|兼职|合同制|full[- ]?time|part[- ]?time|contract)/i)) ||
    (/全职|full[- ]?time/i.test(text) ? "全职" : "");
  let workTime = normalizePlaceholderValue(latestTextMatch(messages, /(标准工时|弹性工作|弹性工时|大小周|双休|单休|[0-9]{1,2}\s*点\s*[-到至]\s*[0-9]{1,2}\s*点)/));
  let travel = normalizePlaceholderValue(latestTextMatch(messages, /(无需出差|不出差|低频出差|高频出差|偶尔出差|约\s*\d+%?\s*出差|\d+%?\s*出差)/));
  if (isFieldDeletedAfterValue(messages, /(?:薪资范围|薪资|工资|待遇|月薪|年薪|预算|package|salary)/i, /(?:删除|删掉|去掉|不要写|移除|不体现|不要放|隐藏).*(?:薪资|工资|待遇|月薪|年薪|预算)/i)) salaryRange = "";
  if (isFieldDeletedAfterValue(messages, /(?:工作地点|地点|办公地点|base|坐标|胡志明市|河内|越南|Ho Chi Minh|Hanoi|Singapore|新加坡|上海|北京|深圳|广州)/i, /(?:删除|删掉|去掉|不要写|移除|不体现|不要放|隐藏).*(?:地点|办公|工作方式)/i)) location = "";
  if (isFieldDeletedAfterValue(messages, /(?:混合办公|hybrid|远程|remote|坐班|到岗|办公室)/i, /(?:删除|删掉|去掉|不要写|移除|不体现|不要放|隐藏).*(?:办公|远程|混合|坐班|工作方式)/i)) officeMode = "";
  if (isFieldDeletedAfterValue(messages, /(?:汇报对象|直接上级|向|汇报给|直接向|report to)/i, /(?:删除|删掉|去掉|不要写|移除|不体现|不要放|隐藏).*(?:汇报|直接上级|report to)/i)) reportTo = "";
  if (isFieldDeletedAfterValue(messages, /(?:招聘人数|人数|headcount)/i, /(?:删除|删掉|去掉|不要写|移除|不体现|不要放|隐藏).*(?:招聘人数|人数|headcount)/i)) headcount = "";
  if (isFieldDeletedAfterValue(messages, /(?:团队规模|团队)[:：为是\s]*[\d一二三四五六七八九十]/i, /(?:删除|删掉|去掉|不要写|移除|不体现|不要放|隐藏).*(?:团队规模|团队)/i)) teamSize = "";
  if (isFieldDeletedAfterValue(messages, /(?:预计到岗|到岗|入职时间|入职|start date)/i, /(?:删除|删掉|去掉|不要写|移除|不体现|不要放|隐藏).*(?:到岗|入职|预计到岗|start date)/i)) startDate = "";
  if (isFieldDeletedAfterValue(messages, /(?:用工性质|工作性质|类型|全职|兼职|合同制|full[- ]?time|part[- ]?time|contract)/i, /(?:删除|删掉|去掉|不要写|移除|不体现|不要放|隐藏).*(?:用工性质|工作性质|全职|兼职|合同制)/i)) employmentType = "";
  if (isFieldDeletedAfterValue(messages, /(?:标准工时|弹性工作|弹性工时|大小周|双休|单休)/i, /(?:删除|删掉|去掉|不要写|移除|不体现|不要放|隐藏).*(?:工作时间|工时)/i)) workTime = "";
  if (isFieldDeletedAfterValue(messages, /(?:无需出差|不出差|低频出差|高频出差|偶尔出差|出差)/i, /(?:删除|删掉|去掉|不要写|移除|不体现|不要放|隐藏).*(?:出差)/i)) travel = "";
  const successItems = [];
  const day30 = normalizePlaceholderValue(textFirstMatch(text, /(?:前\s*30\s*天|30\s*天)[:：要需目标是\s]*([^。；;，,]+)/i));
  const day60 = normalizePlaceholderValue(textFirstMatch(text, /(?:前\s*60\s*天|60\s*天)[:：要需目标是\s]*([^。；;，,]+)/i));
  const day90 = normalizePlaceholderValue(textFirstMatch(text, /(?:前\s*90\s*天|90\s*天)[:：要需目标是\s]*([^。；;，,]+)/i));
  const month12 = normalizePlaceholderValue(textFirstMatch(text, /(?:6-12\s*个月|12\s*个月|一年)[:：要需目标是\s]*([^。；;，,]+)/i));
  if (day30) successItems.push(["前 30 天", day30]);
  if (day60) successItems.push(["前 60 天", day60]);
  if (day90) successItems.push(["前 90 天", day90]);
  if (month12) successItems.push(["6-12 个月", month12]);
  const requirementText = textFirstMatch(text, /(?:硬性条件|必要条件|任职要求|要求)[:：为是\s]*([^。]+)/i);
  const requirementItems = splitFactList(requirementText);
  const workflow = normalizePlaceholderValue(textFirstMatch(text, /(?:招聘流程|面试流程|流程)[:：为是\s]*([^。]+)/i));
  const apply = normalizePlaceholderValue(textFirstMatch(text, /(?:申请方式|投递方式|邮箱|链接)[:：为是\s]*([^。]+)/i));
  return {
    focusItems,
    salaryRange,
    location,
    officeMode,
    reportTo,
    department,
    headcount,
    teamSize,
    startDate,
    employmentType,
    workTime,
    travel,
    successItems,
    requirementItems,
    workflow,
    apply,
  };
}

function buildJobPackageEmailPayload(email, messages, draftOverride = null) {
  const normalizedEmail = String(email || "").trim();
  const draft = draftOverride || deriveAiIntakeDraft(messages);
  return {
    to: normalizedEmail,
    subject: `Recruitment Request – ${draft.roleTitle} – ${currentTaskOwnerName()}`,
    messageType: "jd_reference",
    body: `请查看 ${draft.roleTitle} 的岗位说明书。邮件中包含 JD PDF 附件和详情链接。`,
    jobTitle: draft.roleTitle,
    senderName: currentTaskOwnerName(),
    jobDetailUrl: jobCreationDetailUrl(draft.roleTitle),
    package: {
      roleTitle: draft.roleTitle,
      jd: draft.mission,
      scorecard: draft.scorecard,
      workflow: "Job Setup -> Job Ready for Intake -> Inbox Review -> Application Next Action",
      interviewPlan: "HR screen by Linh Tran -> technical interview by Tech Lead + Backend Staff -> founder final round.",
      challengeNotes: "Budget, talent pool, interview duplication, and hard-condition wording require human review before intake.",
      hardConditions: draft.conditions,
    },
  };
}

function buildPlainEmailPayload(email, message) {
  return {
    to: String(email || "").trim(),
    subject: `HireOS Message – ${currentTaskOwnerName()}`,
    messageType: "text",
    senderName: currentTaskOwnerName(),
    body: String(message || "").trim(),
  };
}

async function postHireOSEmailPayload(payload) {
  try {
    const response = await fetch(jobPackageSendApiUrl(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      return {
        ok: false,
        error: result.error || "Gmail send API rejected the job package email.",
      };
    }
    return {
      ok: true,
      messageId: result.providerMessageId || result.messageId || "",
      provider: result.provider || "gmail",
      sentAt: result.sentAt || "",
      attachments: result.attachments || [],
    };
  } catch (error) {
    return {
      ok: false,
      error: "Gmail send API is not running or is not configured. Start it with `npm run gmail:send-api` and check config/gmail.local.env.",
    };
  }
}

async function sendJobPackageEmail(email, messages, draftOverride = null) {
  return postHireOSEmailPayload(buildJobPackageEmailPayload(email, messages, draftOverride));
}

function deriveAiIntakeDraft(messages) {
  const roleTitle = deriveAiIntakeRoleTitle(messages);
  const summary = compactAiIntakeSummary(messages);
  const facts = extractJobFactsFromMessages(messages);
  const isFinance = /finance|财务|预算|现金流|审计|合规/i.test(`${roleTitle} ${summary}`);
  if (isFinance) {
    return {
      roleTitle,
      summary,
      ...facts,
      mission: "负责预算、现金流、审计和区域财务合规，建立可持续的财务运营节奏。",
      responsibilities: "管理预算流程、现金流预测、审计协作、区域合规和经营数据复盘。",
      scorecard: "财务控制、预算规划、现金流管理、审计经验、区域合规、业务伙伴能力。",
      conditions: summary,
    };
  }
  return {
    roleTitle,
    summary,
    ...facts,
    mission: `围绕 ${roleTitle} 的岗位目标，交付本次 Intake 中确认的核心职责和业务结果。`,
    responsibilities: "根据本次 Intake 描述拆解岗位职责、协作对象、交付边界和风险条件。",
    scorecard: "岗位硬条件、核心经验、协作方式、交付质量、风险判断和面试证据完整性。",
    conditions: summary,
  };
}

function buildAiIntakeTaskRecord(messages, email, delivery = {}) {
  const draft = deriveAiIntakeDraft(messages);
  return {
    task_id: createAiIntakeTaskId(email),
    task_type: "Job Setup",
    title: "AI INTAKE",
    status: "Done",
    priority: "High",
    owner_role: "HR Lead",
    owner_id: currentTaskOwnerId,
    due_at: new Date().toISOString(),
    source_module: "Jobs",
    related_job_id: "",
    related_candidate_id: "",
    related_application_id: "",
    next_action: "进入 Jobs 列表编辑、关闭或继续管理岗位。",
    evidence_ids: ["ev_job_title_set", "ev_screening_criteria_set"],
    completion_action: `AI Intake 已完成：${draft.summary}`,
    context_summary: draft.summary,
    related_objects: [draft.roleTitle, email ? `Sent to ${email}` : "AI Intake", "Jobs list"],
    evidence_summary: messages && messages.length ? messages.slice() : [draft.summary],
    recipient_email: email,
    email_delivery_status: "Sent",
    email_delivery_message_id: delivery.messageId || "",
  };
}

function isFounderDecisionTask(task) {
  return task.owner_role === "Founder" || ["Founder Decision", "Offer Decision"].includes(task.task_type);
}

function founderTaskActionPatch(action) {
  return {
    continue: {
      status: "Done",
      completion_action: "Application Timeline event prepared: Founder continued the application to the next workflow state.",
    },
    reject: {
      status: "Done",
      completion_action: "Application Timeline event prepared: Founder rejected the application with a decision record.",
    },
    evidence: {
      status: "Waiting",
      next_action: "Waiting for HR or interviewer to attach the requested evidence.",
      completion_action: "Application remains active while evidence is collected for Founder review.",
    },
    offer: {
      status: "Done",
      completion_action: "Application Timeline event prepared: Founder recorded Offer Decision as the MVP endpoint.",
    },
    hold: {
      status: "Waiting",
      next_action: "Revisit this Founder decision on the follow-up date.",
      completion_action: "Application moved to Hold / Waiting Founder until revisit date.",
    },
  }[action];
}

function candidateTasksFromStore(store) {
  return store.listTasks({ view: "all" }).filter((task) => candidateTaskTypes.includes(task.task_type));
}

function taskCardFromStoreTask(task) {
  const relatedObjects = task.related_objects || [];
  const isJobReady = task.task_type === "Job Ready for Intake";
  const candidate = isJobReady ? "" : relatedObjects[0] || "";
  const position = isJobReady ? relatedObjects[0] || jobLabel(task.related_job_id) : relatedObjects[1] || jobLabel(task.related_job_id);
  const isCandidateScreening = task.task_type === "Candidate Review";
  return {
    type: isJobReady ? task.title || "发布岗位并导入简历" : isCandidateScreening ? "Candidate Screening" : taskTypeLabel(task.task_type),
    candidate,
    position,
    taskTime: task.status === "Done" ? "Completed" : "Task created",
    ai: task.next_action || task.context_summary || "Review this task and write back the workflow state.",
    risk: "",
    status: task.status,
    priority: task.priority,
    owner: taskOwnerName(task),
    due: formatTaskDate(task.due_at),
    icon: isCandidateScreening ? "user-round-check" : "list-checks",
    href: task.related_application_id ? applicationDetailHref(task.related_application_id) : taskDetailHref(task),
    taskId: task.task_id,
    groups: ["my_tasks", "today", "critical", "all_tasks"],
  };
}

function storedTaskCards(store) {
  if (!store) return [];
  const staticTaskIds = new Set(taskBoardCards.map((task) => task.taskId || new URL(task.href, window.location.href).searchParams.get("task_id")).filter(Boolean));
  return store
    .listTasks({ view: "all" })
    .filter((task) => !staticTaskIds.has(task.task_id))
    .filter((task) => ["Open", "In Progress", "Waiting", "Done"].includes(task.status))
    .map(taskCardFromStoreTask);
}

function renderTaskMetrics() {
  const metrics = document.querySelector("[data-task-metrics]");
  const store = getTasksStore();
  if (!metrics || !store) return;
  const metricData = [
    ["My Tasks", store.listTasks({ view: "my", ownerId: currentTaskOwnerId }).length, "Owned by Linh Tran", "user-check", ""],
    ["All Open", store.listTasks({ view: "all_open" }).length, "Open or in progress", "list-todo", ""],
    ["Due Today", store.listTasks({ view: "due_today" }).length, "Needs same-day action", "calendar-clock", "warning"],
    ["Overdue", store.listTasks({ view: "overdue" }).length, "Handle first", "octagon-alert", "warning"],
    ["Waiting", store.listTasks({ view: "waiting" }).length, "Paused with owner", "pause-circle", ""],
  ];
  metrics.innerHTML = metricData.map(([label, value, note, icon, tone]) => `
    <div class="metric ${tone}">
      <div class="metric-label">${label} <i data-lucide="${icon}"></i></div>
      <strong>${value}</strong>
      <small>${note}</small>
    </div>
  `).join("");
  syncCurrentLanguage();
}

function renderTasksList() {
  const list = document.querySelector("[data-task-list]");
  if (!list) return;
  if (activeTaskView === "jd_drafts") {
    const drafts = readTaskBoardJdDrafts();
    list.innerHTML = drafts.length ? drafts.map((draft) => `
      <button class="task-card jd-draft-task-card" type="button" data-jd-draft-open="${escapeHTML(draft.id)}" data-jd-draft-status="${escapeHTML(draft.status || "draft")}">
        <header class="task-card-head">
          <span class="task-card-icon"><i data-lucide="${draft.status === "published" ? "send" : "file-text"}"></i></span>
          <div>
            <span class="task-card-type" data-no-translate>${draft.status === "published" ? "PUBLISHED JD" : "JD DRAFT"}</span>
            <strong data-no-translate>${escapeHTML(draft.roleTitle || draft.title || "未命名 JD")}</strong>
          </div>
          <span class="pill ${draft.status === "published" ? "green" : "warn"}">${draft.status === "published" ? "Published" : "Draft"}</span>
        </header>
        <div class="task-card-fields" data-no-translate>
          <span><b>Completion</b><strong>${Number(draft.percent || 0)}%</strong></span>
          <span><b>Updated</b><strong>${draft.updatedAt ? new Date(draft.updatedAt).toLocaleString("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Local draft"}</strong></span>
          <span><b>Status</b><strong>${draft.status === "published" ? "Published" : "Unpublished"}</strong></span>
        </div>
        <div class="task-card-signals" data-no-translate>
          <p><i data-lucide="sparkles" aria-hidden="true"></i><span>点击打开右侧 JD 详情，继续编辑或发布。</span></p>
        </div>
      </button>
    `).join("") : `
      <div class="empty-state">
        <strong>暂无 JD 草稿</strong>
        <span>在右侧岗位说明书点击保存后，未发布内容会出现在这里。</span>
      </div>
    `;
    syncCurrentLanguage();
    refreshIcons();
    return;
  }
  const createdJobReturn = new URLSearchParams(window.location.search).get("created") === "job_creation";
  const store = getTasksStore();
  const tasks = [...taskBoardCards, ...storedTaskCards(store)]
    .filter((task) => task.groups.includes(activeTaskView))
    .map((task) => {
      const taskId = task.taskId || new URL(task.href, window.location.href).searchParams.get("task_id");
      const storeTask = taskId && store ? store.getTask(taskId) : null;
      return {
        ...task,
        taskId,
        href: task.type === "AI Intake" ? aiIntakeJobHref(task) : task.href,
        status: storeTask?.status || task.status,
        priority: storeTask?.priority || task.priority,
      };
    });
  list.innerHTML = tasks.map((task) => `
    <a class="task-card ${createdJobReturn && task.isCreatedJob ? "is-new" : ""}" href="${task.href}" data-task-card-type="${task.type}" data-task-card-id="${task.taskId || ""}">
      <header class="task-card-head">
        <span class="task-card-icon"><i data-lucide="${task.icon}"></i></span>
        <div>
          <span class="task-card-type" data-no-translate>${task.type}</span>
          <strong data-no-translate>${task.candidate || task.position}</strong>
        </div>
        <span class="pill ${taskPriorityClass(task.priority)}">${task.priority}</span>
      </header>
      <div class="task-card-fields" data-no-translate>
        ${task.candidate ? `<span><b>Position</b><strong>${task.position}</strong></span>` : ""}
        ${task.headcount ? `<span><b>Headcount</b><strong>${task.headcount}</strong></span>` : ""}
        <span><b>Owner</b><strong>${task.owner}</strong></span>
        <span><b>Time</b><strong>${task.taskTime}</strong></span>
        <span><b>Due</b><strong>${task.due}</strong></span>
        <span><b>Status</b><strong>${task.status}</strong></span>
      </div>
      <div class="task-card-signals" data-no-translate>
        <p><i data-lucide="sparkles" aria-hidden="true"></i><span>${task.ai}</span></p>
      </div>
    </a>
  `).join("") || '<div class="empty-state">No tasks in this view</div>';
  syncCurrentLanguage();
  refreshIcons();
}

function createAiIntakeRecord(store, intakeRecord) {
  if (!store) return null;
  const existing = store.getTask(intakeRecord.task_id);
  if (existing) return store.updateTask(intakeRecord.task_id, intakeRecord);
  return store.createTask(intakeRecord);
}

function createdJobTaskCard(intakeTask) {
  const task = intakeTask || {};
  return {
    type: task.title || "AI INTAKE",
    candidate: "",
    position: (task.related_objects || [])[0] || "New Role",
    taskTime: "Intake completed",
    ai: task.completion_action || task.context_summary || "AI Intake completed from the submitted conversation.",
    risk: "",
    status: task.status || "Done",
    priority: task.priority || "High",
    owner: taskOwnerName(task),
    due: formatTaskDate(task.due_at),
    icon: "sparkles",
    href: `./hireos-jobs.html?job=${encodeURIComponent(task.related_job_id || jobFilterForTaskPosition(task.related_objects?.[0]))}&created=job_creation`,
    taskId: task.task_id || createAiIntakeTaskId(task.recipient_email),
    openLabel: "Open job",
    isCreatedJob: true,
    groups: ["my_tasks", "today", "critical", "all_tasks"],
  };
}

function ensureCreatedJobTaskCard(intakeRecord) {
  const intakeTask = createAiIntakeRecord(getTasksStore(), intakeRecord);
  if (!intakeTask) return;
  taskBoardCards.unshift(createdJobTaskCard(intakeTask));
}

function addCreatedJobTask(intakeRecord) {
  ensureCreatedJobTaskCard(intakeRecord);
  if (!document.querySelector("[data-task-list]")) return;
  activeTaskView = "my_tasks";
  document.querySelectorAll("[data-task-view]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.taskView === "my_tasks");
  });
  renderTasksList();
}

const taskTypeDisplayLabels = {
  "T01 确认招聘需求": "确认招聘需求",
  "T02 审核 AI 岗位包": "审核岗位包",
  "T03 审核岗位调整": "审核岗位调整",
  "T04 审核 AI 推荐候选人": "审核候选人",
  "T05 处理 AI / HR 分歧": "处理分歧",
  "T06 审核 HR 初面": "审核初面",
  "T07 确认补充问题": "补充问题",
  "T08 审核 AI 面试计划": "审核面试计划",
  "T09 准备即将面试": "面试准备",
  "T10 执行结构化面试": "结构化面试",
  "T11 审核 AI 面试总结": "审核面试总结",
  "T12 决定面试下一轮": "决定下一轮",
  "T13 审核 AI 笔试题": "审核笔试题",
  "T14 审核批量笔试方案": "审核批量笔试",
  "T15 处理候选人问题": "处理疑问",
  "T16 处理笔试超期": "处理超期",
  "T17 审核 AI 笔试评分": "审核笔试评分",
  "T18 比较笔试版本": "比较笔试版本",
  "T19 审核 AI 下一轮建议": "审核下一轮建议",
  "T20 审核终面 Brief": "审核终面 Brief",
  "T21 最终录用决定": "录用决定",
  "T22 审核 Offer 建议": "审核Offer",
  "T23 处理 Offer 谈判": "Offer谈判",
  "T24 审核 AI 消息": "审核消息",
  "T25 处理 Agent 升级": "处理升级",
  "T26 确认自动跟进": "确认跟进",
  "T27 确认 Offer 签署": "确认签署",
  "T28 处理入职前风险": "入职风险",
  "T29 30 / 60 / 90 天反馈": "入职反馈",
  "T30 处理 Blocked Candidate": "处理阻塞",
  "T31 高价值流失风险": "流失风险",
  "T32 招聘漏斗异常": "漏斗异常",
  "T33 AI 质量异常": "AI异常",
  "Job Setup": "审核岗位调整",
  "Job Ready for Intake": "确认招聘需求",
  "Inbox Review": "审核候选人",
  "Candidate Review": "审核候选人",
  "Duplicate Review": "处理分歧",
  "Missing Candidate Info": "补充问题",
  "Job Match Review": "审核候选人",
  "Application Next Action": "决定下一轮",
  "Blocked Resolution": "处理阻塞",
  "Mailbox Disconnected": "邮箱重连",
};

function taskTypeLabel(taskType) {
  return taskTypeDisplayLabels[taskType] || taskType;
}

const jobTaskTypes = ["Job Setup", "Job Ready for Intake"];

function jobLabel(jobId) {
  return {
    job_senior_backend: "高级后端工程师",
    job_product_designer: "产品设计师",
    job_gtm_lead: "GTM 负责人",
    job_platform_engineer: "平台工程师",
  }[jobId] || jobId || "未关联";
}

function selectedJobId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("job") || "job_senior_backend";
}

function jobDetailHref(jobId) {
  const job = jobFilterAliases[jobId] || jobId || "all";
  return `./hireos-jobs.html?job=${encodeURIComponent(job)}`;
}

function jobSetupTaskFromStore(store, jobId = selectedJobId()) {
  return store?.listTasks()
    .find((task) => task.related_job_id === jobId && task.task_type === "Job Setup");
}

function renderJobSetupWriteback(store = getTasksStore()) {
  const risk = document.querySelector("[data-job-setup-risk]");
  const count = document.querySelector("[data-job-setup-risk-count]");
  const note = document.querySelector("[data-job-setup-risk-note]");
  const writeback = document.querySelector("[data-job-setup-writeback]");
  const requirements = document.querySelector("[data-job-core-requirements]");
  if (!risk || !count || !note || !writeback || !requirements) return;

  const task = jobSetupTaskFromStore(store);
  const writtenBack = task?.status === "Done";
  const screeningStandard = "基础筛选标准：后端架构、API 设计、系统调试和跨团队协作达到岗位要求。";

  risk.classList.toggle("warning", !writtenBack);
  count.textContent = writtenBack ? "0" : "1";
  note.textContent = writtenBack ? "岗位筛选标准已写回" : "Scorecard 摘要需要补一句筛选标准";
  writeback.classList.toggle("is-hidden", !writtenBack);
  if (writtenBack && !requirements.value.includes(screeningStandard)) {
    requirements.value = `${requirements.value.trim()}\n${screeningStandard}`;
  }
}

function renderJobSourceTasks() {
  const list = document.querySelector("[data-job-task-list]");
  const store = getTasksStore();
  if (!list || !store) return;
  const tasks = store
    .listTasks()
    .filter((task) => task.source_module === "Jobs" && jobTaskTypes.includes(task.task_type));
  const rows = tasks.map((task) => `
    <a class="table-row" href="${taskDetailHref(task)}">
      <div class="cell-main"><strong>${task.task_type}</strong><span>${task.next_action}</span></div>
      <span>${jobLabel(task.related_job_id)}</span>
      <span>${task.owner_role}</span>
      <span>${formatTaskDate(task.due_at)}</span>
      <span class="pill ${taskStatusClass(task.status)}">${task.status}</span>
    </a>
  `).join("");
  list.innerHTML = `
    <div class="table-row header"><span>任务</span><span>Job</span><span>负责人</span><span>到期</span><span>状态</span></div>
    ${rows || '<div class="table-row"><div class="cell-main"><strong>No Jobs tasks</strong><span>Jobs setup tasks will appear after a Job is activated or misses configuration.</span></div><span></span><span></span><span></span><span></span></div>'}
  `;
  syncCurrentLanguage();
}

function renderSettingsTasks() {
  const list = document.querySelector("[data-settings-task-list]");
  const store = getTasksStore();
  if (!list || !store) return;
  const allowedTypes = ["Mailbox Disconnected"];
  const settingsTasks = store.listTasks()
    .filter((task) => task.source_module === "System" && allowedTypes.includes(task.task_type))
    .sort((a, b) => allowedTypes.indexOf(a.task_type) - allowedTypes.indexOf(b.task_type));
  const rows = settingsTasks.map((task) => `
    <a class="table-row" href="${taskDetailHref(task)}">
      <div class="cell-main"><strong>${task.title}</strong><span>${task.next_action}</span></div>
      <span>${task.task_type}</span>
      <span>${task.owner_role}</span>
      <span class="pill ${taskPriorityClass(task.priority)}">${task.priority}</span>
      <span>${formatTaskDate(task.due_at)}</span>
      <span class="pill ${taskStatusClass(task.status)}">${task.status}</span>
    </a>
  `).join("");
  list.innerHTML = `
    <div class="table-row header"><span>Task</span><span>Type</span><span>Owner</span><span>Priority</span><span>Due</span><span>Status</span></div>
    ${rows || '<div class="table-row"><div class="cell-main"><strong>No system tasks</strong><span>Mailbox intake is available.</span></div><span></span><span></span><span></span><span></span><span></span></div>'}
  `;
  syncCurrentLanguage();
  refreshIcons();
}

function initTasksPage() {
  if (!document.querySelector("[data-task-list]")) return;
  const tabs = document.querySelectorAll("[data-task-view]");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activeTaskView = tab.dataset.taskView;
      tabs.forEach((item) => item.classList.toggle("active", item === tab));
      renderTasksList();
    });
  });
  renderTaskMetrics();
  renderTasksList();
}

function renderCandidateTaskMetrics() {
  const metrics = document.querySelector("[data-candidate-task-metrics]");
  const store = getTasksStore();
  if (!metrics || !store) return;
  const tasks = candidateTasksFromStore(store);
  const metricData = [
    ["Candidate Review", tasks.filter((task) => task.task_type === "Candidate Review").length, "Parsed profiles need confirmation", "user-check", ""],
    ["Duplicate Review", tasks.filter((task) => task.task_type === "Duplicate Review").length, "Email, name, or source evidence match", "copy-check", "warning"],
    ["Missing Info", tasks.filter((task) => task.task_type === "Missing Candidate Info").length, "Phone, CV, or source is incomplete", "file-question", "warning"],
    ["Ready for Application", tasks.filter((task) => task.status === "Done").length, "Candidate task completed first", "kanban-square", ""],
  ];
  metrics.innerHTML = metricData.map(([label, value, note, icon, tone]) => `
    <div class="metric ${tone}">
      <div class="metric-label">${label} <i data-lucide="${icon}"></i></div>
      <strong>${value}</strong>
      <small>${note}</small>
    </div>
  `).join("");
  syncCurrentLanguage();
}

function candidateTaskCandidateLabel(task) {
  const name = (task.related_objects || [])[0] || task.related_candidate_id || "Candidate";
  return `<div class="cell-main"><strong>${name}</strong><span>${task.related_candidate_id || "No candidate id"} · ${task.evidence_ids.length} evidence links</span></div>`;
}

function renderCandidateTaskQueue() {
  const queue = document.querySelector("[data-candidate-task-queue]");
  const store = getTasksStore();
  if (!queue || !store) return;
  const tasks = candidateTasksFromStore(store);
  const rows = tasks.map((task) => `
    <a class="table-row" href="${taskDetailHref(task)}">
      <div class="cell-main"><strong>${task.task_type}</strong><span>${task.title}</span></div>
      ${candidateTaskCandidateLabel(task)}
      <span class="pill ${taskStatusClass(task.status)}">${task.status}</span>
      <span>${task.owner_role}</span>
      <span>${formatTaskDate(task.due_at)}</span>
      <span>${task.completion_action}</span>
    </a>
  `).join("");
  queue.innerHTML = `
    <div class="table-row header"><span>Task</span><span>Candidate</span><span>Status</span><span>Owner</span><span>Due</span><span>Completion Action</span></div>
    ${rows}
  `;
  syncCurrentLanguage();
  refreshIcons();
}

function initCandidateTaskSurface() {
  if (!document.querySelector("[data-candidate-task-queue]")) return;
  renderCandidateTaskMetrics();
  renderCandidateTaskQueue();
}

function renderFounderTaskMetrics(tasks) {
  const metrics = document.querySelector("[data-founder-task-metrics]");
  if (!metrics) return;
  const activeTasks = tasks.filter((task) => ["Open", "In Progress", "Waiting"].includes(task.status));
  const doneTasks = tasks.filter((task) => task.status === "Done");
  const waitingTasks = tasks.filter((task) => task.status === "Waiting");
  const todayTasks = activeTasks.filter((task) => String(task.due_at).slice(0, 10) === "2026-07-28");
  metrics.innerHTML = [
    ["Founder Tasks", activeTasks.length, `${tasks.length} contract-aligned tasks`, "clipboard-check", ""],
    ["Due Today", todayTasks.length, "Decision SLA owned by Founder", "timer", ""],
    ["Waiting Tasks", waitingTasks.length, "Need evidence or follow-up date", "hourglass", "warning"],
    ["Done", doneTasks.length, "Completed by Founder action", "check-circle-2", ""],
  ].map(([label, value, note, icon, tone]) => `
    <div class="metric ${tone}">
      <div class="metric-label">${label} <i data-lucide="${icon}"></i></div>
      <strong>${value}</strong>
      <small>${note}</small>
    </div>
  `).join("");
  syncCurrentLanguage();
}

function founderDecisionSummary(task) {
  const objects = task.related_objects || [];
  const evidenceSummary = task.evidence_summary || [];
  return `
    <div><dt>Candidate</dt><dd>${objects[0] || task.related_candidate_id || "Candidate linked by task contract."}</dd></div>
    <div><dt>Job</dt><dd>${objects[1] || task.related_job_id || "Job linked by task contract."}</dd></div>
    <div><dt>Current State</dt><dd>${objects[2] || task.source_module}</dd></div>
    <div><dt>Evidence Summary</dt><dd>${evidenceSummary.join(" ") || `${task.evidence_ids.length} linked evidence records.`}</dd></div>
    <div><dt>Risk Summary</dt><dd>${task.context_summary || "No extra risk summary is attached to this MVP task."}</dd></div>
    <div><dt>Recommended Next Action</dt><dd>${task.next_action}</dd></div>
  `;
}

function renderFounderTaskCards(tasks) {
  const list = document.querySelector("[data-founder-task-list]");
  if (!list) return;
  const activeTasks = tasks.filter((task) => ["Open", "In Progress", "Waiting"].includes(task.status));
  list.innerHTML = activeTasks.map((task, index) => `
    <article class="work-card founder-task-card ${index === 0 ? "ai" : ""}" data-founder-task-id="${task.task_id}">
      <div class="card-top">
        <div class="person-row"><div class="avatar">${(task.related_objects?.[0] || task.title).split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div><div class="card-copy"><strong>${task.title}</strong><p>${task.task_type} · ${task.status} · ${formatTaskDate(task.due_at)}</p></div></div>
        <span class="pill ${taskStatusClass(task.status)}">${task.status}</span>
      </div>
      <dl class="decision-summary">${founderDecisionSummary(task)}</dl>
      <div class="contract-grid founder-contract-grid"><span>task_id</span><strong>${task.task_id}</strong><span>owner_role</span><strong>${task.owner_role}</strong><span>application</span><strong>${task.related_application_id || "none"}</strong></div>
      <div class="decision-actions" aria-label="${task.title} decision actions">
        <button type="button" data-founder-action="continue">Continue</button>
        <button type="button" data-founder-action="reject">Reject</button>
        <button type="button" data-founder-action="evidence">Request More Evidence</button>
        <button type="button" data-founder-action="offer">Offer Decision</button>
        <button type="button" data-founder-action="hold">Hold / Waiting</button>
      </div>
      <div class="decision-result" aria-live="polite">No decision recorded yet.</div>
    </article>
  `).join("") || '<div class="work-card"><div class="card-copy"><strong>No active Founder decision tasks</strong><span>Completed and cancelled tasks stay in the task store, but this role view only shows active decisions.</span></div></div>';
  syncCurrentLanguage();
}

function renderFounderInspector(tasks) {
  const inspector = document.querySelector("[data-founder-task-inspector]");
  if (!inspector) return;
  const task = tasks.find((item) => ["Open", "In Progress", "Waiting"].includes(item.status)) || tasks[0];
  inspector.innerHTML = `
    <section class="agent-card"><h3>Task contract alignment</h3><p>This Founder view reads from window.HireOSTasks.taskStore and only uses allowed statuses: Open, In Progress, Waiting, Done, Cancelled.</p><div class="evidence-list"><div class="evidence-item"><span>Filter</span><strong>owner_role=Founder or task_type=Founder Decision / Offer Decision.</strong></div><div class="evidence-item"><span>Required fields</span><strong>task_id, task_type, title, status, priority, owner_role, owner_id, due_at, source_module, related_job_id, related_candidate_id, related_application_id, next_action, evidence_ids, completion_action.</strong></div><div class="evidence-item"><span>Write-back target</span><strong>Decision action updates task status and prepares an Application Timeline completion_action.</strong></div></div></section>
    ${task ? `<section class="agent-card ai"><h3>Selected task preview</h3><p>${task.title}</p><div class="evidence-list"><div class="evidence-item"><span>Application</span><strong>${task.related_application_id || "none"} · ${task.source_module} · owner_role=${task.owner_role}.</strong></div><div class="evidence-item"><span>Evidence</span><strong>${task.evidence_ids.length} linked evidence records.</strong></div><div class="evidence-item"><span>Next action</span><strong>${task.next_action}</strong></div></div></section>` : ""}
  `;
  syncCurrentLanguage();
}

function updateFounderTask(taskId, action, button) {
  const store = getTasksStore();
  const patch = founderTaskActionPatch(action);
  if (!store || !patch) return;
  const updated = store.updateTask(taskId, patch);
  const card = button.closest(".founder-task-card");
  const result = card?.querySelector(".decision-result");
  if (result) {
    result.innerHTML = `<strong>Task ${updated.status}</strong><span>${updated.completion_action}</span>`;
    result.classList.toggle("waiting", updated.status === "Waiting");
  }
  button.closest(".decision-actions")?.querySelectorAll("button").forEach((actionButton) => actionButton.classList.remove("active"));
  button.classList.add("active");
  renderFounderTaskMetrics(store.listTasks().filter(isFounderDecisionTask));
  syncCurrentLanguage();
  refreshIcons();
}

function initFounderTaskView() {
  const list = document.querySelector("[data-founder-task-list]");
  const store = getTasksStore();
  if (!list || !store) return;
  const founderTasks = store.listTasks().filter(isFounderDecisionTask);
  renderFounderTaskMetrics(founderTasks);
  renderFounderTaskCards(founderTasks);
  renderFounderInspector(founderTasks);
  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-founder-action]");
    const card = event.target.closest("[data-founder-task-id]");
    if (!button || !card) return;
    updateFounderTask(card.dataset.founderTaskId, button.dataset.founderAction, button);
  });
  refreshIcons();
}

function selectedTaskId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("task_id") || "flow_02_review_job_package";
}

function taskDetailModel(task) {
  return window.HireOSTasks?.createTaskDetailModel
    ? window.HireOSTasks.createTaskDetailModel(task)
    : null;
}

function taskDetailActionButton(action, primaryAction) {
  const isPrimary = action.action === primaryAction.action;
  if (action.action === "connect_mailbox") {
    return `<button class="primary-button" type="button" data-mail-connect-open data-mailbox-bind-open data-mail-connect-status><i data-lucide="${action.icon}"></i> ${action.label}</button>`;
  }
  return `<button class="${isPrimary ? "primary-button" : "ghost-button"}" type="button" data-task-action="${action.action}"><i data-lucide="${action.icon}"></i> ${action.label}</button>`;
}

function taskDetailActions(detailModel) {
  return detailModel.actions.map((action) => taskDetailActionButton(action, detailModel.primaryAction)).join("");
}

function listItems(items, fallback) {
  const values = (items || []).filter(Boolean);
  if (!values.length) return `<div class="evidence-item"><span>None</span><strong>${fallback}</strong></div>`;
  return values.map((item, index) => `<div class="evidence-item"><span>${index + 1}</span><strong>${item}</strong></div>`).join("");
}

function taskDetailFieldRows(rows) {
  return rows.map(([label, value]) => `
    <div class="detail-field-row">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");
}

function workflowPreviewRows(preview) {
  return taskDetailFieldRows([
    ["Next step", preview.nextStep],
    ["Next owner", preview.nextOwner],
    ["Next due", preview.nextDue],
    ["Timeline", preview.timelineWrite],
    ["Candidate message", preview.candidateMessage],
  ]);
}

function taskDocumentFields(rows) {
  return rows.map(([label, value]) => `
    <div class="task-document-field">
      <dt>${label}</dt>
      <dd>${value}</dd>
    </div>
  `).join("");
}

function taskDocumentList(items, fallback) {
  const values = (items || []).filter(Boolean);
  if (!values.length) return `<li>${fallback}</li>`;
  return values.map((item) => `<li>${item}</li>`).join("");
}

function taskDocumentMeta(detailModel) {
  return taskDocumentFields([
    ["Status", detailModel.status],
    ["Priority", detailModel.priority],
    ["Owner", detailModel.ownerRole],
    ["SLA", `${detailModel.slaStatus} · ${formatTaskDate(detailModel.dueAt)}`],
    ["Task Type", detailModel.category],
    ["Risk", `${detailModel.riskLevel} · ${detailModel.confidence} confidence`],
  ]);
}

function applicationDetailHref(applicationId) {
  return `./hireos-application-detail.html?application=${encodeURIComponent(applicationId)}`;
}

function taskWritebackNotice(task) {
  if (task.status !== "Done") return "";
  if (task.related_job_id && jobTaskTypes.includes(task.task_type)) {
    return `
      <div class="task-writeback-notice" data-task-writeback-notice>
        <div>
          <strong>已写回岗位</strong>
          <span>任务结果已经更新到岗位详情，可查看岗位状态和筛选标准。</span>
        </div>
        <a class="ghost-button" href="${jobDetailHref(task.related_job_id)}">查看岗位详情</a>
      </div>
    `;
  }
  if (!task.related_application_id) return "";
  if (!["Application Next Action", "Blocked Resolution"].includes(task.task_type)) return "";
  return `
    <div class="task-writeback-notice" data-task-writeback-notice>
      <div>
        <strong>已写回申请</strong>
        <span>任务结果已经更新到对应申请，可在申请详情里查看当前状态和下一步。</span>
      </div>
      <a class="ghost-button" href="${applicationDetailHref(task.related_application_id)}">查看申请详情</a>
    </div>
  `;
}

function taskDetailPatch(action, detailModel) {
  return {
    start: { status: "In Progress" },
    reassign: {
      owner_role: "Tech Lead",
      owner_id: "user_tech_lead",
      status: "Open",
      next_action: "Tech Lead owns the next response for this task.",
    },
    wait: { status: "Waiting" },
    complete: { status: "Done" },
    request_evidence: {
      status: "Waiting",
      next_action: `Waiting for evidence: ${(detailModel.missingInformation || []).join(", ") || "requested evidence"}.`,
    },
    resolve: {
      status: "Done",
      completion_action: detailModel.workflowPreview.nextStep,
    },
    cancel: { status: "Cancelled" },
  }[action];
}

function renderTaskDetail() {
  const detail = document.querySelector("[data-task-detail]");
  const title = document.querySelector("[data-task-detail-title]");
  const actions = document.querySelector("[data-task-detail-actions]");
  const agent = document.querySelector("[data-task-agent]");
  const store = getTasksStore();
  if (!detail || !title || !actions || !agent || !store) return;
  const task = store.getTask(selectedTaskId()) || store.listTasks({ view: "my", ownerId: currentTaskOwnerId })[0];
  if (!task) return;
  const detailModel = taskDetailModel(task);
  if (!detailModel) return;

  title.innerHTML = `<h1>${task.title}</h1><p>${task.task_type} · ${task.source_module} · ${task.task_id}</p>`;
  actions.innerHTML = "";
  detail.innerHTML = `
    <section class="task-document-shell">
      <article class="task-document-page">
        <header class="task-document-header">
          <p class="task-document-kicker">Task Detail</p>
          <h2>${task.title}</h2>
          <p>${task.task_type} · ${task.source_module} · ${task.task_id}</p>
          <dl class="task-document-meta">${taskDocumentMeta(detailModel)}</dl>
        </header>
        ${taskWritebackNotice(task)}

        <section class="task-document-section">
          <h3>1. Decision / Execution</h3>
          <p class="task-document-lead">${detailModel.requiredGoal}</p>
          <div class="task-document-callout"><strong>Recommended action</strong><span>${detailModel.recommendedAction}</span></div>
          <p>${detailModel.decisionImpact}</p>
        </section>

        <section class="task-document-section">
          <h3>2. Evidence & Context</h3>
          <p>${task.context_summary}</p>
          <div class="task-document-list-grid">
            <div><h4>Source Evidence</h4><ol class="task-document-list">${taskDocumentList(detailModel.evidence.source, "No source evidence attached.")}</ol></div>
            <div><h4>Supporting Evidence</h4><ol class="task-document-list">${taskDocumentList(detailModel.evidence.supporting, "No extra supporting evidence attached.")}</ol></div>
            <div><h4>Counter / Unknowns</h4><ol class="task-document-list">${taskDocumentList([...detailModel.evidence.counter, ...detailModel.evidence.unknowns], "No counter evidence or unknowns listed.")}</ol></div>
          </div>
        </section>

        <section class="task-document-section">
          <h3>3. AI / HR Recommendation</h3>
          <p class="task-document-lead">${detailModel.aiRecommendation.summary}</p>
          <p>${detailModel.aiRecommendation.boundary}</p>
          <dl class="task-document-fields">${taskDocumentFields([["Confirmation", detailModel.aiRecommendation.humanConfirmationRequired ? "Human confirmation required" : "Assistive recommendation only"]])}</dl>
        </section>

        <section class="task-document-section">
          <h3>4. ${detailModel.typeSpecific.title}</h3>
          <dl class="task-document-fields">${taskDocumentFields(detailModel.typeSpecific.rows)}</dl>
        </section>

        <section class="task-document-section">
          <h3>5. Next Workflow Preview</h3>
          <dl class="task-document-fields">${taskDocumentFields([
            ["Next step", detailModel.workflowPreview.nextStep],
            ["Next owner", detailModel.workflowPreview.nextOwner],
            ["Next due", detailModel.workflowPreview.nextDue],
            ["Timeline", detailModel.workflowPreview.timelineWrite],
            ["Candidate message", detailModel.workflowPreview.candidateMessage],
          ])}</dl>
        </section>

        <section class="task-document-section">
          <h3>6. Ownership, Links & Audit</h3>
          <dl class="task-document-fields">${taskDocumentFields([
            ["Current owner", detailModel.sidebar.owner],
            ["Source", detailModel.sourceModule],
            ["Job", detailModel.jobId || "none"],
            ["Candidate", detailModel.candidateId || "none"],
            ["Application", detailModel.applicationId || "none"],
            ["Approval boundary", detailModel.automation.approval],
            ["Message boundary", detailModel.automation.sendsCandidateMessage],
            ...detailModel.sidebar.auditRecords,
          ])}</dl>
        </section>
      </article>
      <footer class="task-detail-action-bar" aria-label="Task actions">${taskDetailActions(detailModel)}</footer>
    </section>
  `;
  agent.innerHTML = `<section class="agent-card ai"><h3>Recommended handling</h3><p>${detailModel.recommendedAction}</p><div class="evidence-list"><div class="evidence-item"><span>Status</span><strong>${detailModel.status}</strong></div><div class="evidence-item"><span>Owner</span><strong>${detailModel.ownerRole}</strong></div><div class="evidence-item"><span>Boundary</span><strong>${detailModel.aiRecommendation.boundary}</strong></div></div></section>`;

  document.querySelectorAll("[data-task-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.taskAction;
      const patch = taskDetailPatch(action, detailModel);
      if (!patch) return;
      store.updateTask(task.task_id, patch);
      renderTaskDetail();
      renderTaskMetrics();
    });
  });
  renderMailboxConnectionState();
  syncCurrentLanguage();
  refreshIcons();
}

ensureTasksNav();
setSidebarState(localStorage.getItem("hireos-sidebar-collapsed") === "true", false);
applyLanguage(localStorage.getItem("hireos-language-v2") || "zh");
initJobsFilters();
initJobCandidateActions();
initJobDetailFixedActions();
initCandidateDetailActions();
initJobDetailTabs();
initInboxWorkTabs();
initMailboxConnectFlow();
initJobCreateFlow();
initTaskJobCreationFlow();
initTaskAgentJobCreationFlow();
initTasksPage();
initSupabaseJobsSync();
renderTaskDetail();
renderJobSetupWriteback();
renderJobSourceTasks();
renderInboxTaskSourceList();
initInboxTaskActions();
initInboxCandidateReviewActions();
initCandidateTaskSurface();
initFounderTaskView();
renderSettingsTasks();
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "hireos-task-store-v1") {
      renderJobSetupWriteback(getFreshTasksStore());
    }
  });
}
syncCurrentLanguage();
refreshIcons();

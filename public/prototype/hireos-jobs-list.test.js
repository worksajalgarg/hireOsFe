const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const pagesJs = fs.readFileSync(path.join(__dirname, "hireos-pages.js"), "utf8");
const pagesCss = fs.readFileSync(path.join(__dirname, "hireos-pages.css"), "utf8");
const jobsHtml = fs.readFileSync(path.join(__dirname, "hireos-jobs.html"), "utf8");
const tasksHtml = fs.readFileSync(path.join(__dirname, "hireos-tasks.html"), "utf8");
const supabaseConfigJs = fs.readFileSync(path.join(__dirname, "hireos-supabase-config.js"), "utf8");

test("job creation success persists a created job into the Jobs list store", () => {
  assert.match(pagesJs, /HIREOS_JOBS_STORAGE_KEY = "hireos-jobs-store-v1"/);
  assert.match(pagesJs, /function saveCreatedJobFromIntake/);
  assert.match(pagesJs, /const createdJob = saveCreatedJobFromIntake\(intakeMessages, email\)/);
  assert.match(pagesJs, /Jobs list saved/);
  assert.doesNotMatch(pagesJs, /进入 Job 详情页管理岗位和候选人/);
});

test("created jobs render with list-level edit and close actions", () => {
  assert.doesNotMatch(pagesJs, /function createdJobRowMarkup/);
  assert.doesNotMatch(pagesJs, /data-created-job-row/);
  assert.match(pagesJs, /data-created-job-edit/);
  assert.match(pagesJs, /data-created-job-close/);
  assert.match(pagesJs, /function openCreatedJobEditModal/);
  assert.match(pagesJs, /function closeCreatedJob/);
  assert.match(jobsHtml, /data-page="jobs"/);
});

test("publishing from Jobs creates the task-list follow-up through the shared task store", () => {
  assert.match(pagesJs, /createPublishedJobFollowupTask/);
  assert.match(pagesJs, /Candidate Screening task created/);
});

test("created jobs use the green summary area and fixed bottom actions", () => {
  assert.match(pagesJs, /data-created-job-summary/);
  assert.match(pagesJs, /fixed.className = "job-detail-actions is-bottom-fixed"/);
  assert.match(pagesJs, /main.appendChild\(fixed\)/);
  assert.match(pagesCss, /\.job-summary-strip/);
  assert.match(pagesCss, /\.job-detail-actions\.is-bottom-fixed/);
});

test("filled headcount automatically closes a job while manual close stays explicit", () => {
  assert.match(pagesJs, /filledCount >= headcount \? "Closed" : "Active"/);
  assert.match(pagesJs, /closedManually === true/);
  assert.match(pagesJs, /人数已满，已自动关闭/);
  assert.match(pagesJs, /Closed · Headcount filled/);
});

test("Jobs prototype keeps Supabase sync optional and unconfigured by default", () => {
  assert.doesNotMatch(supabaseConfigJs, /https:\/\/[a-z0-9-]+\.supabase\.co/);
  assert.doesNotMatch(supabaseConfigJs, /sb_publishable_[A-Za-z0-9_-]+/);
  assert.match(jobsHtml, /hireos-supabase-config\.js/);
  assert.match(tasksHtml, /hireos-supabase-config\.js/);
  assert.match(pagesJs, /HIREOS_SUPABASE_JOBS_TABLE = "hireos_jobs"/);
  assert.match(pagesJs, /HIREOS_SUPABASE_JOB_EVENTS_TABLE = "hireos_job_events"/);
  assert.match(pagesJs, /function saveJobToSupabase/);
  assert.match(pagesJs, /function initSupabaseJobsSync/);
});

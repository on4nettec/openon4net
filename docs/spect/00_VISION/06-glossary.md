# Glossary — Open on4net

> **فایل:** 00_VISION/06-glossary.md
> **نسخه:** 1.0

---

## A

### Agent

یک سیستم خودمختار که بر پایه‌ی یک مدل زبانی، در یک حلقه‌ی **ادراک → تصمیم/برنامه‌ریزی → عمل**
(perceive → reason/plan → act) کار می‌کند: ورودی (پیام کاربر، پیام یک Agent دیگر، یا trigger
زمان‌بندی‌شده) را می‌گیرد، تصمیم می‌گیرد چه اقدامی لازم است، آن را با ابزارهای در دسترسش انجام
می‌دهد، و نتیجه را دوباره به‌عنوان context قدم بعدی می‌بیند — تا هدف محقق شود یا شرط توقف برسد.

روی این حلقه‌ی فنی، O₂N استعاره‌ی «کارمند دیجیتال» را سوار کرده (نقش، بودجه، KPI، گزارش‌دهی —
جزئیات کامل در `04-digital-employee.md`). هر Agent این اجزا را واقعاً در Runtime دارد:

- **نقش (role)** — عنوان/دپارتمان مشخص (`agents.role`, `agents.department`)، به‌همراه
  سلسله‌مراتب گزارش‌دهی (`reportsTo`) و تیم.
- **مهارت‌ها (Skills)** — توالی‌های خودکار (manual یا auto-detected) که فقط توسط کسی با
  permission مربوطه (ادمین یا هر نقشی که `skills:grant` دارد) به Agent تخصیص داده می‌شوند
  (`agent_skill_grants`).
- **ابزارها (Tools)** — از طریق Pluginهای نصب‌شده روی سیستم در دسترس Agent قرار می‌گیرند؛
  تخصیص هر Plugin به یک Agent هم permission-gated است (`plugins:grant`، جدول
  `agent_plugin_grants`).
- **ارتباط با Agentهای دیگر** — یک Agent می‌تواند برای Agent دیگری پیام بفرستد
  (`agent_messages`)؛ پیام تحویل‌شده صرفاً در یک صندوق نمی‌ماند، بلکه به‌صورت یک نوبت چت واقعی
  روی Agent گیرنده اجرا می‌شود — یعنی گیرنده با همان حلقه‌ی ادراک/تصمیم/عمل خودش پردازشش
  می‌کند، نه یک اعلان ساده.
- **مشارکت در Workflow** — یک Workflow (DAG از stepها) می‌تواند step از نوع `agent` داشته
  باشد؛ یعنی یک Agent می‌تواند بخشی یا کل یک فرآیند چندمرحله‌ای را به پایان برساند، نه فقط
  یک پیام تکی را جواب بدهد.
- **حافظه، بودجه، KPI، گزارش‌دهی دوره‌ای** — طبق سند `04-digital-employee.md`.

> **وضعیت شناخته‌شده، هنوز ساخته نشده (RT-084):** trace صریح «فرایند فکری» — reasoning/
> chain-of-thought قابل‌مشاهده، جدا از پاسخ نهایی. فعلاً فقط پاسخ نهایی مدل ذخیره/نمایش داده
> می‌شود، نه مراحل استدلال میانی.

### Agent Lifecycle

چرخه حیات یک Agent: Defined → Onboarded → Active → Paused → Archived → Terminated.

### Agent-to-Agent Communication

پروتکلی که به Agentها اجازه می‌دهد با هم حرف بزنند، درخواست بدهند، و کار گروهی کنند. از طریق Communication Bus انجام می‌شود.

### AI Gateway

قلب O₂N. تمام درخواست‌ها به AI Gateway می‌رسد، Model Router مدل مناسب را انتخاب می‌کند، و پاسخ به Agent برمی‌گردد.

### Approval Queue

صف درخواست‌هایی که نیاز به تأیید انسانی دارند. manager وارد می‌شود، بررسی می‌کند، approve یا reject می‌کند.

### Audit Log

ثبت کامل همه تصمیمات و اقدامات Agentها. غیرقابل تغییر (append-only). برای compliance و troubleshooting.

### Auto-Skill Detection

وقتی Agent کاری را > ۵ بار تکرار کرد، به کاربر پیشنهاد می‌دهد که آن را به Skill تبدیل کند.

---

## B

### BI Dashboard (Business Intelligence)

داشبوردی که KPIها، هزینه‌ها، performance Agentها و insightهای خودکار را نمایش می‌دهد.

### Budget

محدودیت هزینه ماهانه برای هر Agent. در cents ذخیره می‌شود.

### Broadcast

نوعی پیام که به همه Agentهای یک Workspace ارسال می‌شود.

---

## C

### CEO AI

Agent مدیرعامل. بالای همه Agentهاست. نظارت، تصمیم‌گیری استراتژیک، و گزارش به مدیر انسانی.

### Circuit Breaker

مکانیزمی که اگر یک مدل/سرویس خطای زیادی داشت، درخواست‌ها را به مدل دیگر redirect می‌کند.

### Communication Bus

زیرساخت messaging بین Agentها. مبتنی بر RabbitMQ/Redis Streams. شامل inbox, outbox, broadcast queues.

### Company Knowledge (لایه ۴)

دانش مربوط به کل شرکت: محصولات، مشتریان، رویه‌ها، سیاست‌ها. همه Agentهای شرکت به این لایه دسترسی دارند.

### Conversation Memory (لایه ۲)

تاریخچه مکالمات Agent با کاربران. تا ۶ ماه ذخیره می‌شود و سپس خلاصه می‌گردد.

### Cost Tracker

ردیابی هزینه هر درخواست به تفکیک Agent, Model, Organization.

---

## D

### Digital Employee

مفهوم Agent به‌عنوان کارمند واقعی. با role, budget, KPI, schedule, گزارش. ۲۴/۷ کار می‌کند، حقوق ندارد، مرخصی ندارد.

### Delegation

یک Agent کار را به Agent دیگر واگذار می‌کند. مثلاً CEO به Marketing اختیار کامل می‌دهد.

---

## E

### Escalation

وقتی Agent نمی‌تواند مشکلی را حل کند، به Agent بالاتر (یا انسان) ارجاع می‌دهد.

### Outcome Engine

سیستمی که نتیجه کار Agentها را اندازه‌گیری می‌کند. مثلاً: "این کمپین ۱۸٪ نرخ تبدیل افزایش داد."

---

## F

### Failover

اگر مدل اصلی در دسترس نباشد، به مدل بعدی سوئیچ می‌کند. زنجیره: Claude → GPT → Gemini → Qwen (محلی).

---

## G

### Global Knowledge (لایه ۶)

دانش عمومی و best practices. از همه شرکت‌ها (anonymous) جمع‌آوری می‌شود.

### Governance

سیستم کنترل سازمانی: لاگ کامل، Human-in-the-Loop, budget, access control, rollback.

### Graph Memory (Memory Graph)

ذخیره روابط بین افراد، پروژه‌ها، فایل‌ها و تصمیمات در Neo4j. Agent می‌داند "چه کسی، چه تصمیمی، برای کدام پروژه گرفته".

---

## H

### Human-in-the-Loop (HITL)

نقاطی در workflow که نیاز به تأیید انسان دارند. سطح‌بندی: Auto → Notify → Approve → Escalate.

---

## K

### KPI (Key Performance Indicator)

شاخص کلیدی عملکرد هر Agent. مثلاً Marketing: "تعداد کمپین/ماه", Sales: "درآمد/ماه".

---

## L

### Layers (لایه‌های حافظه)

۶ لایه حافظه: Short → Conversation → Project → Company → Personal → Global. هر لایه retention و access control جدا دارد.

---

## M

### Marketplace

فروشگاه Pluginها و Skillها. توسعه‌دهندگان Plugin می‌سازند و ۷۰٪ درآمد می‌برند.

### Memory Engine

سیستم حافظه O₂N. شامل ۶ لایه حافظه + Memory Graph + Vector Search.

### Model Router

مسیریاب هوشمند درخواست‌ها به بهترین مدل. بر اساس intent, cost, availability.

### Multi-AI

پشتیبانی از چندین مدل AI به صورت یکپارچه: GPT, Claude, Gemini, DeepSeek, Qwen, Grok, Mistral, Llama, Ollama.

---

## O

### O₂N (Open on4net)

نام محصول. AI Operating System شرکتی.

### Organization

یک شرکت یا سازمان که از O₂N استفاده می‌کند. هر Organization Workspaceها و کاربران خود را دارد.

### Outcome

نتیجه قابل اندازه‌گیری کار یک Agent. نه "ایمیل ارسال شد" بلکه "نرخ باز شدن ایمیل ۴۲٪ بود".

---

## P

### Personal Knowledge (لایه ۵)

دانش شخصی کاربر: ترجیحات، سبک کار. فقط خود کاربر می‌بیند.

### Plugin

برنامه‌های افزودنی که توسط توسعه‌دهندگان Third-party ساخته می‌شوند. مثل WordPress plugins.

### Plugin SDK

کیت توسعه Plugin برای O₂N. شامل API برای تعریف Tool, Action, Hook.

### Project Memory (لایه ۳)

دانش مربوط به یک پروژه خاص. اهداف، تسک‌ها، تصمیمات، فایل‌ها.

### Prompt Bible

مجموعه پرامپت‌های استاندارد برای Agentها. System Prompt, Agent Prompts, Templates.

### Prompt Injection

حمله امنیتی که در آن کاربر سعی می‌کند System Prompt را دور بزند. O₂N mechanisms برای detection دارد.

---

## R

### Rate Limiter

محدودکننده تعداد درخواست‌ها در بازه زمانی. برای جلوگیری از سوءاستفاده و کنترل هزینه.

### RBAC (Role-Based Access Control)

سیستم دسترسی بر اساس نقش: Admin, Manager, Editor, Viewer.

### Rollback

قابلیت برگرداندن تصمیمات Agent. مثلاً حذف یک ایمیل ارسال شده یا برگرداندن یک تغییر.

---

## S

### Short Memory (لایه ۱)

حافظه لحظه‌ای در Redis. تا ۳۰ دقیقه inactivity یا ۵۰ پیام آخر.

### Skill

یک توالی خودکار از steps که Agent یاد گرفته است. می‌تواند manual یا auto-detected باشد.

### Skill Engine

موتور مدیریت و اجرای Skillها. شامل Pattern Detector, Registry, Executor.

### Skill Proposal

پیشنهاد Agent برای تبدیل یک کار تکراری به Skill. کاربر approve یا dismiss می‌کند.

---

## T

### Tool

یک قابلیت پایه که Agent می‌تواند استفاده کند: email-sender, database-query, github-api, ...

### Tool Registry

ثبت‌نام و مدیریت Toolهایی که Agentها دسترسی دارند.

---

## W

### WASM Sandbox

محیط امن برای اجرای Pluginها. Plugin در WebAssembly Sandbox اجرا می‌شود و به سیستم اصلی دسترسی ندارد.

### WebSocket

پروتکل real-time برای استریم پاسخ Agentها و notificationها.

### Workflow

یک DAG از steps که یک فرآیند business را اتومات می‌کند. انواع step: Agent, Tool, Human, Parallel, Condition, Loop.

### Workflow Engine

موتور اجرای Workflowها. State machine, Retry, Error Handling, Template Library.

### Workspace

فضای کار یک تیم در O₂N. شامل Agentها، Workflowها، Memory, Skills. هر Organization چندین Workspace دارد.

---

> **خلاصه:** Glossary تمام مفاهیم کلیدی O₂N را تعریف می‌کند. از Agent و Memory Engine گرفته تا Governance و Plugin SDK. هر کسی که مستندات را می‌خواند می‌تواند به این glossary مراجعه کند.

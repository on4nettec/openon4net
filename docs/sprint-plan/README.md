# Sprint Plan — Open on4net

> هدف این پوشه تبدیل مستندات `docs/spect/` به «پلن پیاده‌سازی اجرایی» است: استوری‌بورد → بک‌لاگ → اسپرینت‌پلن.
>
> مرجع‌ها:
>
> - Spec اصلی: `docs/spect/`
> - Sprint 0 (فعلی): `docs/spect/09_TASKS/01-current-sprint.md`
> - Roadmap 12 ماهه: `docs/spect/01_ROADMAP/01-roadmap-12-months.md`

---

## محتویات

- `01_storyboard.md`: سناریوهای کاربری (User Journeys) که خروجی‌شان «اپیک/استوری» می‌شود.
- `02_backlog.md`: اپیک‌ها، یوزر استوری‌ها، و تفکیک به تسک‌های قابل تحویل — مخصوص `apps/openon4net-runtime` (Plane 1).
- `03_sprint-plan.md`: برنامه اسپرینت‌ها (۲ هفته‌ای)، اهداف، و ظرفیت/ریسک‌ها — مخصوص `apps/openon4net-runtime` (Plane 1).
- `04_control-plane-backlog.md`: اپیک/استوری/تسک/اسپرینت مخصوص `apps/openon4net-Platform` (Plane 2) — namespace شناسه‌های جدا (`E-06#`/`US-6##`/`T-CP-###`/`CP-SP-##`) تا با Runtime تداخل نکند.
- `traceability.md`: نگاشت Spec → Epic → Sprint برای اطمینان از پوشش کامل.
- `production-readiness/`: شاخص‌های تولید (SLO/SLA، release gates، امنیت/کامپلاینس، runbooks، ظرفیت/هزینه).
- `templates.md`: قالب‌های استاندارد برای استوری/تسک/اسپرینت.

---

## قراردادها (Conventions)

- cadence: اسپرینت‌های ۲ هفته‌ای (۱۴ روز).
- تاریخ‌ها به میلادی نوشته می‌شوند و باید با تاریخ‌های `docs/spect/09_TASKS/` همخوان باشند.
- بازه تاریخ‌ها به شکل `YYYY-MM-DD..YYYY-MM-DD` نوشته می‌شود و **انتهای بازه end-exclusive** است (یعنی `[start, end)`).
- شناسه‌ها:
  - `E-###` برای Epic
  - `US-###` برای User Story
  - `T-###` برای Task (اگر در `docs/spect/09_TASKS/` وجود دارد همان را reuse کنید)
  - `SP-#` برای Sprint (مثلاً `SP-0`, `SP-1`)

---

## نحوه استفاده

1. اگر سناریوی جدید دارید، اول به `01_storyboard.md` اضافه کنید.
2. سپس در `02_backlog.md` آن را به Epic/Story/Task تبدیل کنید.
3. در `03_sprint-plan.md` آیتم‌ها را با توجه به وابستگی‌ها و ظرفیت تیم زمان‌بندی کنید.

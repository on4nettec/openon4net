# Meetings — Open on4net

> **فایل:** 06_MEETINGS/01-template.md
> **نسخه:** 1.0

---

## قالب صورت جلسه

```markdown
# جلسه [شماره] — [تاریخ]

**حضور:** [اسامی]
**مدت:** [زمان]
**موضوع:** [عنوان جلسه]

---

## ۱. دستور کار (Agenda)

۱. [مورد اول]
۲. [مورد دوم]
۳. [مورد سوم]

## ۲. بحث و تصمیمات

### موضوع ۱: [عنوان]

- **بحث:** [خلاصه بحث]
- **تصمیم:** [تصمیم گرفته شده]
- **ADR:** [ارجاع به ADR مربوطه]

### موضوع ۲: [عنوان]

- **بحث:** [خلاصه بحث]
- **تصمیم:** [تصمیم گرفته شده]

## ۳. Action Items

| #   | Task  | مسئول | Deadline | Status |
| --- | ----- | ----- | -------- | ------ |
| ۱   | [کار] | [فرد] | [تاریخ]  | ⏳     |
| ۲   | [کار] | [فرد] | [تاریخ]  | ⏳     |

## ۴. نکات آزاد

- [نکته ۱]
- [نکته ۲]

## ۵. جلسه بعدی

- **تاریخ:** [تاریخ]
- **موضوع:** [موضوع]
```

---

## جلسات برگزار شده

| #   | تاریخ      | موضوع                                                                                                                                                  | فایل                                                                |
| --- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| ۲   | ۲۰۲۶-۰۷-۱۲ | مدل کسب‌وکار Skills/Plugins در Marketplace (رایگان/فروشی) + CLI Plugin                                                                                 | `06_MEETINGS/02-skills-plugins-marketplace-model.md`                |
| ۳   | ۲۰۲۶-۰۷-۱۳ | Fine-tuning برای سازمان‌های بزرگ (Q&A) + مرز multi-model routing بین Runtime/Control-Plane + پلن‌های reseller/هاست                                     | `06_MEETINGS/03-finetuning-and-model-routing.md`                    |
| ۴   | ۲۰۲۶-۰۷-۱۶ | اکوسیستم Plugin (معماری، مدل نصب/امنیت)                                                                                                                | `06_MEETINGS/04-plugin-ecosystem-architecture.md`                   |
| ۵   | ۲۰۲۶-۰۷-۱۷ | مدل کامل ثبت‌نام/activation در Control Plane + تفاوت شخصی/سازمانی + چندزبانگی (i18n)                                                                   | `06_MEETINGS/05-self-service-signup-and-activation-model.md`        |
| ۶   | ۲۰۲۶-۰۷-۱۷ | بازبینی تعریف رسمی Agent + خلأهای Runtime (tool-calling، delegation، Skill builder، Schedule، WebSocket، i18n کامل)                                    | `06_MEETINGS/06-agent-definition-review-and-runtime-gaps.md`        |
| ۷   | ۲۰۲۶-۰۷-۱۷ | جای AI Gateway + تغییر نام Control Plane به Platform + عبور اجباری ترافیک Runtime↔Memory/Marketplace از Platform                                       | `06_MEETINGS/07-platform-rename-and-mediated-cross-plane-access.md` |
| ۸   | ۲۰۲۶-۰۷-۱۹ | بازطراحی AI Gateway مدیریت‌شده به مدل OpenRouter (workspace/token/کاتالوگ provider)                                                                    | `06_MEETINGS/08-ai-gateway-openrouter-model.md`                     |
| ۹   | ۲۰۲۶-۰۷-۱۹ | ارزیابی Workflow Engine نسبت به n8n + loop/retry/sub-workflow + visual builder در مقابل ساخت با کمک Agent                                              | `06_MEETINGS/09-workflow-engine-n8n-parity.md`                      |
| ۱۰  | ۲۰۲۶-۰۷-۲۰ | Relay وب‌هوک عمومی از طریق Platform برای Runtimeهای لوکال/پشت NAT + target مستقیم `tool` برای webhook                                                  | `06_MEETINGS/10-public-webhook-relay-via-platform.md`               |
| ۱۱  | ۲۰۲۶-۰۷-۲۰ | اصلاح معماری ارتباطی ۴ پروژه (WebSocket هیبرید، حذف مسیر مستقیم Marketplace، fine-tuning→Memory، تست داوطلبانه‌ی Marketplace)                          | `06_MEETINGS/11-cross-plane-transport-architecture.md`              |
| ۱۲  | ۲۰۲۶-۰۷-۲۰ | LLM provider و کانال‌های ارتباطی به‌عنوان Plugin (per-agent) + device approval + شارژ کیف‌پول + افیلیت + جزئیات MKT-028                                | `06_MEETINGS/12-plugin-based-llm-providers-and-channels.md`         |
| ۱۳  | ۲۰۲۶-۰۷-۲۰ | تقویت enforcement استاندارد manifest پلاگین — schema مشترک Runtime/Marketplace + CLI validate                                                          | `06_MEETINGS/13-plugin-manifest-standard-enforcement.md`            |
| ۱۴  | ۲۰۲۶-۰۷-۲۰ | تفکیک پلاگین‌های LLM Provider به‌ازای هر provider + گسترش لیست به ۱۱ provider + اولویت‌بندی                                                            | `06_MEETINGS/14-llm-provider-plugin-granularity.md`                 |
| ۱۵  | ۲۰۲۶-۰۷-۲۱ | پلاگین‌های media generation + دسته‌بندی/کلمه‌کلیدی + بلاگ چندزبانه + پلاگین‌های Channel (جفت Platform+Runtime) + پلاگین Google + معماری دو دسته پلاگین | `06_MEETINGS/15-media-channel-google-plugins-and-blog.md`           |

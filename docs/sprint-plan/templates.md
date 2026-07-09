# Templates — قالب‌های استاندارد

## Epic template

```yaml
id: E-###
title: ''
goal: ''
references:
  - docs/spect/...
success_metrics:
  - ''
```

## User story template

```yaml
id: US-###
as_a: ''
i_want: ''
so_that: ''
acceptance_criteria:
  - ''
dependencies:
  - US-###
notes: ''
```

## Task template

```yaml
id: T-###
title: ''
priority: critical | high | normal | low
estimate: ''
assignee: ''
dependencies: []
status: pending | in_progress | done
steps:
  - ''
output: ''
```

## Sprint template

```yaml
id: SP-#
date_range: 'YYYY-MM-DD..YYYY-MM-DD' # end-exclusive: [start, end)
goal: ''
capacity_notes: ''
commitments:
  - T-###
demo:
  - ''
risks:
  - ''
```

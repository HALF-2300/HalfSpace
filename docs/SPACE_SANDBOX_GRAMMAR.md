# SPACE SANDBOX DSL

Small local-only language for the `/space/sandbox` playground. Commands are line-based; one command per line. Unknown commands are rejected with line/column errors.

## Tokens
- `identifier`: letters / numbers / `_` / `-`
- `number`: integers or decimals (no commas)
- `string`: double-quoted text only
- `assign`: `=`
- `newline`: line break

## General form
```
<command> [arg...] [key=value ...]
```

## Commands
- `starfield density=<number> speed=<number>`
  - density: 50–2000 (clamped)
  - speed: 0–1.5 (clamped)
- `nebula on|off intensity=<number>`
  - intensity: 0–1 (clamped; ignored when `off`)
- `travel to="<destination>" duration=<seconds>`
  - duration: 1–30 seconds (clamped; execution capped to 12s)
- `show fact topic="<topic>"`
- `quiz start level="<level>"`

## Errors & validation
- Missing command/args are reported with line/column
- Numbers outside limits are clamped and logged as warnings
- Only the commands above are allowed; nothing is executed dynamically

## Examples
```
starfield density=1200 speed=0.6
nebula on intensity=0.4
travel to="galaxy_core" duration=8
show fact topic="black_holes"
quiz start level="hard"
```

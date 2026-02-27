# SPACE Event Schema

The recorder and replay engine share one unified schema for all Space telemetry. Each event has a type, payload, timestamp, and optional metadata.

## Event shape

```json
{
  "id": "evt-123",
  "type": "scene_change",
  "payload": {},
  "source": "page-id",
  "createdAt": 1736300000000,
  "meta": {
    "replay": false
  },
  "offsetMs": 1200
}
```

- `id`: unique event id (generated automatically).
- `type`: one of the supported event types below.
- `payload`: data for that event type.
- `source`: optional string describing where the event originated.
- `createdAt`: absolute timestamp (ms).
- `meta.replay`: set to `true` when an event is emitted during playback (recorder ignores these).
- `offsetMs`: relative timestamp captured by the recorder (ms from the start of recording).

## Supported event types

### scene_change
- `sceneId`: unique scene identifier.
- `label` (optional): human readable label.
- `page` (optional): page emitting the event.

### slider_move
- `controlId`: stable id for the slider or numeric control.
- `value`: numeric value after the move.
- `page` (optional): page/component name.

### quiz_answer
- `quizTitle`: quiz title to scope the event.
- `questionIndex`: zero-based question index.
- `answerIndex` (optional): chosen answer index when `action` is `answer`.
- `action`: `answer` | `next` | `reset`.
- `correct` (optional): whether the answer was correct.

### nav
- `target`: navigation target identifier or route segment.
- `from` (optional): origin identifier.
- `method` (optional): `click` or `programmatic`.

### custom
- free-form object for any additional signals.

## Recording payload

`app/space/recorder` exports/imports a JSON file with:

```json
{
  "savedAt": 1736300000000,
  "events": [ /* RecordedSpaceEvent[] */ ]
}
```

Only additions use this schema; existing Space pages are left intact while emitting the above event types. During replay the bus re-emits the same events with `meta.replay = true` so listeners can react without re-recording.

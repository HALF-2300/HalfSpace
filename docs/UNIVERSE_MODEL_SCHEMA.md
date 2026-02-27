## UNIVERSE_MODEL_SCHEMA (SPACE DIGITAL TWIN)

**Source of truth:** `data/space/universe-model.json`

### Overview

The Universe Model is a single JSON document used by `/space/twin` to:
- Browse a unified knowledge graph (entities + relations)
- Power simulations (by referencing model entities/constants/methods)
- Generate learning paths (Beginner/Intermediate/Expert)

### Top-level shape

```json
{
  "schema_version": "1.0",
  "id_namespace": "space.twin",
  "title": "SPACE DIGITAL TWIN — Universe Model",
  "title_ar": "التوأم الرقمي للكون — نموذج موحّد",
  "entities": [ /* UniverseEntity[] */ ],
  "relations": [ /* UniverseRelation[] */ ]
}
```

### UniverseEntity

Required fields:
- **id**: string (unique within the file)
- **type**: one of: `era` | `object` | `method` | `mission` | `constant`
- **name**: string
- **summary**: string

Optional fields:
- **name_ar**: string
- **summary_ar**: string
- **tags**: string[] (free-form keywords)
- **recommended_for**: `["Beginner" | "Intermediate" | "Expert"][]`

Example:

```json
{
  "id": "method-redshift",
  "type": "method",
  "name": "Redshift (z)",
  "name_ar": "الانزياح الأحمر (z)",
  "summary": "Shift of spectral lines due to cosmic expansion or relative motion.",
  "summary_ar": "انزياح الخطوط الطيفية بسبب تمدد الكون أو الحركة النسبية.",
  "tags": ["cosmology", "spectroscopy", "distance"],
  "recommended_for": ["Beginner", "Intermediate", "Expert"]
}
```

### UniverseRelation

Required fields:
- **from**: string (must refer to an existing entity id)
- **to**: string (must refer to an existing entity id)
- **type**: one of:
  - `explains`
  - `depends_on`
  - `measured_by`
  - `observed_by`

Optional fields:
- **note**: string (human-readable explanation)

Example:

```json
{
  "from": "method-redshift",
  "to": "method-spectroscopy",
  "type": "measured_by",
  "note": "Redshift is determined by measuring shifted spectral lines."
}
```

### Intended semantics (guidance)

- **explains**: conceptual explanation / “this helps understand that”
- **depends_on**: prerequisite dependency / “this requires that”
- **measured_by**: measurement or inference method / “we determine this via that”
- **observed_by**: observational instrument/mission / “this is observed by that”

### Constraints & recommendations

- Keep `id` stable over time (use it for persistence and deep-linking inside the app).
- Keep entity names short, summaries 1–2 lines.
- Prefer many small, composable entities over long paragraphs.
- Use relations to connect simulations → concepts → missions whenever possible.

# UNIVERSE MODEL SCHEMA (Space Digital Twin)

This document defines the JSON schema contract for the **Universe Model** used by the `/space/twin` route.

- **Source-of-truth file**: `data/space/universe-model.json`
- **Goal**: provide a unified graph of knowledge (**entities + relations**) that powers:
  - Model Browser UI
  - Simulators (cosmology / stars / orbits)
  - Learning Path generator (Beginner / Intermediate / Expert)

## Top-level shape

```json
{
  "schema_version": "1.0.0",
  "model_id": "space-digital-twin",
  "title": "Universe Model (Space Digital Twin)",
  "title_ar": "…",
  "updated_at": "YYYY-MM-DD",
  "entities": [/* Entity[] */],
  "relations": [/* Relation[] */]
}
```

## Entity

### Allowed `type`

- `era`
- `object`
- `method`
- `mission`
- `constant`

### Required fields (all entity types)

```json
{
  "id": "string",
  "type": "era|object|method|mission|constant",
  "name": "string",
  "name_ar": "string",
  "summary": "string",
  "summary_ar": "string",
  "tags": ["string"]
}
```

### Optional fields (only when relevant)

Constants may include:

```json
{
  "value": 70,
  "units": "km/s/Mpc"
}
```

Notes:
- `id` must be **globally unique** across the model.
- Recommended `id` convention: `<type>.<slug>` (example: `constant.h0`, `mission.jwst`).
- `tags` are free-form strings used for search/filtering and future enrichment.

## Relation

The model is a directed, typed graph.

### Allowed `type`

- `explains`
- `depends_on`
- `measured_by`
- `observed_by`

### Required fields

```json
{
  "from": "entity_id",
  "type": "explains|depends_on|measured_by|observed_by",
  "to": "entity_id",
  "note": "string"
}
```

Notes:
- `from` and `to` must refer to existing `entities[].id`.
- The meaning is intentionally lightweight:
  - `explains`: a conceptual bridge or “next concept”
  - `depends_on`: prerequisites / required concepts/parameters
  - `measured_by`: how this is quantified/derived
  - `observed_by`: missions/instruments commonly used

## Compatibility rules

- Backward compatible changes should only:
  - add new entities
  - add new relations
  - add optional fields
- Breaking changes should bump `schema_version`.


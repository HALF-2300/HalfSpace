# Timeline.json Schema Documentation

## Version: 1.0.0

---

## Root Object

```
{
  "$schema": string,
  "version": string,
  "metadata": MetadataObject,
  "epochs": EpochObject[]
}
```

### Fields:
- **$schema** (string, required): URI identifying the schema version
- **version** (string, required): Semantic version of the timeline data (e.g., "1.0.0")
- **metadata** (object, required): High-level information about the timeline
- **epochs** (array, required): Ordered array of epoch objects (min: 1)

---

## MetadataObject

```
{
  "title": string,
  "description": string,
  "lastUpdated": string,
  "totalEpochs": number
}
```

### Fields:
- **title** (string, required): Display name for the entire timeline
- **description** (string, optional): Brief description of timeline scope
- **lastUpdated** (string, required): ISO date of last modification (YYYY-MM-DD)
- **totalEpochs** (number, required): Total count of epochs in timeline

---

## EpochObject

```
{
  "id": string,
  "version": string,
  "title": string,
  "timeRangeLabel": string,
  "hook": string,
  "backgroundPreset": BackgroundPresetObject,
  "featuredNodes": string[],
  "primaryExperience": ExperienceObject,
  "nextConsequence": ConsequenceObject | null
}
```

### Fields:

#### **id** (string, required)
- Unique identifier for the epoch
- Format: `epoch-{number}-{slug}`
- Example: `"epoch-01-bigbang"`
- Must be unique across all epochs
- Should be URL-safe (lowercase, hyphens only)

#### **version** (string, required)
- Semantic version of this specific epoch
- Format: "major.minor.patch" (e.g., "1.0")
- Allows for epoch-level versioning

#### **title** (string, required)
- Human-readable name for the epoch
- Max length: 80 characters
- Example: "The Big Bang"

#### **timeRangeLabel** (string, required)
- Human-readable time description
- Flexible format: "X years ago", "X - Y years ago", "YYYY CE - YYYY CE", etc.
- Example: "13.8 billion years ago"

#### **hook** (string, required)
- Compelling 1-2 sentence description
- Max length: 250 characters
- Should intrigue and inform the user
- Example: "The universe explodes into existence from a singularity..."

#### **backgroundPreset** (object, required)
- Visual configuration for the epoch's background
- See BackgroundPresetObject schema below

#### **featuredNodes** (array, required)
- Array of content IDs to feature in this epoch
- Min items: 1, Max items: 10 (recommended: 3-5)
- Each string must match a valid content ID from the content library
- Example: `["content-bigbang-singularity", "content-planck-epoch"]`

#### **primaryExperience** (object, required)
- The main interactive experience for this epoch
- See ExperienceObject schema below

#### **nextConsequence** (object | null, required)
- Link to the next epoch or node in the timeline
- Use `null` for the final epoch
- See ConsequenceObject schema below

---

## BackgroundPresetObject

```
{
  "type": string,
  "primaryColor": string,
  "secondaryColor": string,
  "density": number,
  "speed": number,
  "glow": boolean
}
```

### Fields:

#### **type** (string, required)
- Background animation/visual type
- Allowed values:
  - `"particle-field"` - Dense particle system
  - `"nebula-field"` - Gaseous, cloud-like
  - `"star-field"` - Scattered stars
  - `"galaxy-spiral"` - Spiral galaxy view
  - `"accretion-disk"` - Rotating disk
  - `"planet-surface"` - Planetary surface view
  - `"biosphere"` - Living ecosystem
  - `"orbital-view"` - Space station perspective
  - `"deep-space"` - Vast emptiness with distant objects
  - `"red-giant"` - Dying star atmosphere
  - `"void"` - Near-empty darkness

#### **primaryColor** (string, required)
- Hex color code (format: `#RRGGBB`)
- Example: `"#FF6B35"`

#### **secondaryColor** (string, required)
- Hex color code (format: `#RRGGBB`)
- Used for gradients/secondary elements

#### **density** (number, required)
- Visual density of the background effect
- Range: 0.0 - 1.0
- 0.0 = sparse, 1.0 = dense

#### **speed** (number, required)
- Animation speed multiplier
- Range: 0.0 - 3.0
- 0.0 = static, 1.0 = normal speed, 3.0 = very fast

#### **glow** (boolean, required)
- Whether elements should have a glow effect
- `true` = glowing, `false` = flat

---

## ExperienceObject

```
{
  "type": string,
  "id": string
}
```

### Fields:

#### **type** (string, required)
- Type of interactive experience
- Allowed values:
  - `"microModule"` - Short interactive module (< 5 min)
  - `"journey"` - Longer guided experience (5-15 min)

#### **id** (string, required)
- Unique identifier for the experience
- Format for microModule: `micro-{slug}`
- Format for journey: `journey-{slug}`
- Must match an existing experience ID in the system
- Examples: `"micro-bigbang-simulation"`, `"journey-light-freedom"`

---

## ConsequenceObject

```
{
  "type": string,
  "targetId": string,
  "transitionLabel": string
}
```

### Fields:

#### **type** (string, required)
- Type of consequence/transition
- Allowed values:
  - `"epoch"` - Links to another epoch
  - `"node"` - Links to a specific content node

#### **targetId** (string, required)
- ID of the target epoch or node
- Must be a valid epoch ID or content node ID
- Example: `"epoch-02-cosmic-dawn"` or `"content-specific-node"`

#### **transitionLabel** (string, optional)
- Narrative text for the transition
- Max length: 100 characters
- Example: "As the universe cools..."

---

## Validation Rules

### Required Fields (Cannot be null or empty)
- Root: `$schema`, `version`, `metadata`, `epochs`
- Metadata: `title`, `lastUpdated`, `totalEpochs`
- Epoch: `id`, `version`, `title`, `timeRangeLabel`, `hook`, `backgroundPreset`, `featuredNodes`, `primaryExperience`, `nextConsequence`
- BackgroundPreset: All fields required
- Experience: `type`, `id`
- Consequence: `type`, `targetId` (when consequence is not null)

### Optional Fields
- Metadata: `description`
- Consequence: `transitionLabel`

### Constraints

#### String Length Limits
- `epoch.title`: Max 80 characters
- `epoch.hook`: Max 250 characters
- `consequence.transitionLabel`: Max 100 characters

#### Numeric Ranges
- `backgroundPreset.density`: 0.0 - 1.0 (inclusive)
- `backgroundPreset.speed`: 0.0 - 3.0 (inclusive)
- `metadata.totalEpochs`: Must match actual `epochs.length`

#### Array Constraints
- `epochs`: Min 1 item
- `featuredNodes`: Min 1 item, Max 10 items (recommended: 3-5)

#### ID Format Rules
- Epoch IDs: `epoch-{number}-{slug}` (lowercase, hyphens)
- Content IDs: `content-{slug}` (lowercase, hyphens)
- MicroModule IDs: `micro-{slug}` (lowercase, hyphens)
- Journey IDs: `journey-{slug}` (lowercase, hyphens)

#### Color Format
- Must be valid hex color: `#RRGGBB` (6 hex digits)

#### Date Format
- ISO 8601 date: `YYYY-MM-DD`

### Referential Integrity
- All `featuredNodes` IDs must exist in content library
- All `primaryExperience.id` values must exist in experience library
- All `nextConsequence.targetId` values must reference valid epochs or nodes
- Last epoch should have `nextConsequence: null`

### Logical Constraints
- Epochs should be ordered chronologically
- Epoch numbers should be sequential (01, 02, 03...)
- `nextConsequence` should chain epochs logically
- Background presets should be thematically appropriate to epoch

### Version Rules
- Root version must follow semantic versioning (major.minor.patch)
- Epoch versions must follow semantic versioning
- Breaking changes to schema should increment major version
- New optional fields should increment minor version
- Bug fixes/clarifications should increment patch version

---

## Example ID References (Must Exist)

### Content IDs (from content library)
- `content-bigbang-singularity`
- `content-planck-epoch`
- `content-inflation-theory`
- `content-recombination`
- `content-cmb-radiation`
- (etc... all IDs in `featuredNodes`)

### Experience IDs (from experience library)
- `micro-bigbang-simulation`
- `journey-light-freedom`
- `micro-stellar-forge`
- `journey-galaxy-builder`
- (etc... all IDs in `primaryExperience`)

---

## Schema Summary

### Hierarchy
```
Timeline
├── metadata (1)
└── epochs (1..n)
    ├── backgroundPreset (1)
    ├── featuredNodes (1..10)
    ├── primaryExperience (1)
    └── nextConsequence (0..1)
```

### Total Fields
- Root level: 4 fields
- Metadata: 4 fields
- Epoch: 9 fields
- BackgroundPreset: 6 fields
- Experience: 2 fields
- Consequence: 3 fields (when present)

### Data Types
- String: 20 fields
- Number: 3 fields
- Boolean: 1 field
- Array: 2 fields
- Object: 5 fields
- Null: 1 field (nextConsequence in final epoch)

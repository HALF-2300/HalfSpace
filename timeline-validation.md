# Timeline.json Validation Rules

## Quick Reference Checklist

### ✅ REQUIRED Fields (Must Be Present)

#### Root Level
- [ ] `$schema` (string)
- [ ] `version` (string, format: X.Y.Z)
- [ ] `metadata` (object)
- [ ] `epochs` (array, min 1 item)

#### Metadata Object
- [ ] `title` (string)
- [ ] `lastUpdated` (string, format: YYYY-MM-DD)
- [ ] `totalEpochs` (number, must equal epochs.length)
- [ ] `description` (string) - OPTIONAL

#### Each Epoch Object
- [ ] `id` (string, format: epoch-##-slug)
- [ ] `version` (string, format: X.Y)
- [ ] `title` (string, max 80 chars)
- [ ] `timeRangeLabel` (string)
- [ ] `hook` (string, max 250 chars)
- [ ] `backgroundPreset` (object)
- [ ] `featuredNodes` (array, 1-10 items)
- [ ] `primaryExperience` (object)
- [ ] `nextConsequence` (object or null)

#### BackgroundPreset Object
- [ ] `type` (string, from allowed list)
- [ ] `primaryColor` (string, format: #RRGGBB)
- [ ] `secondaryColor` (string, format: #RRGGBB)
- [ ] `density` (number, 0.0-1.0)
- [ ] `speed` (number, 0.0-3.0)
- [ ] `glow` (boolean)

#### PrimaryExperience Object
- [ ] `type` (string: "microModule" or "journey")
- [ ] `id` (string, format: micro-slug or journey-slug)

#### NextConsequence Object (when not null)
- [ ] `type` (string: "epoch" or "node")
- [ ] `targetId` (string, valid epoch or node ID)
- [ ] `transitionLabel` (string, max 100 chars) - OPTIONAL

---

## Validation Rules by Category

### 1. ID Format Validation

```javascript
// Epoch ID format
/^epoch-\d{2}-[a-z0-9-]+$/
// Example: "epoch-01-bigbang" ✅
// Example: "Epoch-01-BigBang" ❌ (uppercase)
// Example: "epoch-1-bigbang" ❌ (missing leading zero)

// Content ID format
/^content-[a-z0-9-]+$/
// Example: "content-bigbang-singularity" ✅

// MicroModule ID format
/^micro-[a-z0-9-]+$/
// Example: "micro-bigbang-simulation" ✅

// Journey ID format
/^journey-[a-z0-9-]+$/
// Example: "journey-light-freedom" ✅
```

### 2. Uniqueness Validation

**Must Be Unique Across Timeline:**
- All `epoch.id` values
- Cannot have duplicate epoch IDs

**Must Exist in Content Library:**
- All values in `epoch.featuredNodes[]`
- All values in `epoch.primaryExperience.id`

**Must Exist in Epoch List:**
- All `nextConsequence.targetId` values (when type="epoch")

### 3. String Length Validation

| Field | Min | Max | Required |
|-------|-----|-----|----------|
| `epoch.title` | 1 | 80 | Yes |
| `epoch.timeRangeLabel` | 1 | - | Yes |
| `epoch.hook` | 1 | 250 | Yes |
| `consequence.transitionLabel` | 0 | 100 | No |

### 4. Numeric Range Validation

| Field | Min | Max | Type |
|-------|-----|-----|------|
| `backgroundPreset.density` | 0.0 | 1.0 | float |
| `backgroundPreset.speed` | 0.0 | 3.0 | float |
| `metadata.totalEpochs` | 1 | - | integer |
| `epochs.length` | 1 | - | integer |

**Special Rule:** `metadata.totalEpochs` MUST equal `epochs.length`

### 5. Array Validation

| Array | Min Items | Max Items | Item Type |
|-------|-----------|-----------|-----------|
| `epochs` | 1 | - | EpochObject |
| `featuredNodes` | 1 | 10 | string (content IDs) |

**Recommendation:** Keep `featuredNodes` between 3-5 items for best UX.

### 6. Enum Validation

#### Background Preset Types
```
ALLOWED_TYPES = [
  "particle-field",
  "nebula-field",
  "star-field",
  "galaxy-spiral",
  "accretion-disk",
  "planet-surface",
  "biosphere",
  "orbital-view",
  "deep-space",
  "red-giant",
  "void"
]
```

#### Experience Types
```
ALLOWED_TYPES = [
  "microModule",
  "journey"
]
```

#### Consequence Types
```
ALLOWED_TYPES = [
  "epoch",
  "node"
]
```

### 7. Color Format Validation

```javascript
// Hex color format
/^#[0-9A-F]{6}$/i

// Valid examples:
"#FF6B35" ✅
"#000000" ✅
"#FFFFFF" ✅

// Invalid examples:
"FF6B35" ❌ (missing #)
"#FFF" ❌ (too short)
"rgb(255,107,53)" ❌ (wrong format)
```

### 8. Date Format Validation

```javascript
// ISO 8601 date format (YYYY-MM-DD)
/^\d{4}-\d{2}-\d{2}$/

// Valid examples:
"2026-01-31" ✅
"2025-12-25" ✅

// Invalid examples:
"01-31-2026" ❌ (wrong order)
"2026/01/31" ❌ (wrong separator)
```

### 9. Version Format Validation

```javascript
// Semantic versioning
/^\d+\.\d+(\.\d+)?$/

// Valid examples:
"1.0.0" ✅
"1.0" ✅
"2.3.1" ✅

// Invalid examples:
"v1.0" ❌ (prefix not allowed)
"1" ❌ (too short)
```

### 10. Logical Chain Validation

**Epoch Chaining Rules:**
1. Each epoch (except last) should have `nextConsequence` pointing to another epoch
2. Last epoch should have `nextConsequence: null`
3. No circular references (epoch A → epoch B → epoch A)
4. No orphaned epochs (every epoch should be reachable from first)

**Example Valid Chain:**
```
epoch-01 → epoch-02 → epoch-03 → null
```

**Example Invalid Chain:**
```
epoch-01 → epoch-02 → epoch-01 (circular ❌)
epoch-01 → null, epoch-02 → null (orphaned epoch-02 ❌)
```

### 11. Content Reference Validation

**For Each Epoch:**
```javascript
// Check all featured nodes exist
for (let nodeId of epoch.featuredNodes) {
  if (!contentLibrary.has(nodeId)) {
    throw Error(`Node ${nodeId} not found in content library`);
  }
}

// Check primary experience exists
if (!experienceLibrary.has(epoch.primaryExperience.id)) {
  throw Error(`Experience ${epoch.primaryExperience.id} not found`);
}
```

### 12. Null Handling

**Fields That Can Be Null:**
- `nextConsequence` (should be null ONLY for final epoch)

**Fields That CANNOT Be Null:**
- All other required fields

---

## Validation Pseudocode

```javascript
function validateTimeline(timeline) {
  // 1. Schema validation
  validateSchema(timeline);
  
  // 2. Metadata validation
  if (timeline.metadata.totalEpochs !== timeline.epochs.length) {
    throw Error("totalEpochs mismatch");
  }
  
  // 3. Epoch validation
  let epochIds = new Set();
  for (let i = 0; i < timeline.epochs.length; i++) {
    let epoch = timeline.epochs[i];
    
    // Check uniqueness
    if (epochIds.has(epoch.id)) {
      throw Error(`Duplicate epoch ID: ${epoch.id}`);
    }
    epochIds.add(epoch.id);
    
    // Check format
    validateEpochId(epoch.id);
    validateStringLength(epoch.title, 1, 80);
    validateStringLength(epoch.hook, 1, 250);
    
    // Check background preset
    validateBackgroundPreset(epoch.backgroundPreset);
    
    // Check featured nodes
    if (epoch.featuredNodes.length < 1 || epoch.featuredNodes.length > 10) {
      throw Error("featuredNodes must have 1-10 items");
    }
    for (let nodeId of epoch.featuredNodes) {
      if (!contentLibrary.has(nodeId)) {
        throw Error(`Content not found: ${nodeId}`);
      }
    }
    
    // Check primary experience
    validateExperience(epoch.primaryExperience);
    
    // Check next consequence
    if (i === timeline.epochs.length - 1) {
      // Last epoch must have null consequence
      if (epoch.nextConsequence !== null) {
        throw Error("Last epoch must have null nextConsequence");
      }
    } else {
      // Other epochs must have valid consequence
      if (epoch.nextConsequence === null) {
        throw Error("Non-final epoch cannot have null nextConsequence");
      }
      validateConsequence(epoch.nextConsequence, epochIds);
    }
  }
  
  return true;
}
```

---

## Common Validation Errors

### Error 1: Epoch ID Format
```
❌ "epoch-1-bigbang" 
✅ "epoch-01-bigbang" (needs leading zero)
```

### Error 2: Missing Required Field
```json
❌ {
  "id": "epoch-01-bigbang",
  "title": "The Big Bang"
  // Missing: version, timeRangeLabel, hook, etc.
}
```

### Error 3: Invalid Color Format
```json
❌ "primaryColor": "orange"
✅ "primaryColor": "#FFA500"
```

### Error 4: Out of Range Values
```json
❌ "density": 1.5  // Max is 1.0
✅ "density": 0.95
```

### Error 5: Invalid Reference
```json
❌ "featuredNodes": ["content-does-not-exist"]
✅ "featuredNodes": ["content-bigbang-singularity"]
```

### Error 6: Array Length
```json
❌ "featuredNodes": []  // Must have at least 1 item
✅ "featuredNodes": ["content-bigbang-singularity"]
```

### Error 7: Wrong Enum Value
```json
❌ "type": "space-particles"
✅ "type": "particle-field"
```

### Error 8: Consequence Chain Break
```json
❌ epochs[5].nextConsequence = null  // Not the last epoch
✅ epochs[5].nextConsequence = { type: "epoch", targetId: "epoch-06-solar-system" }
```

---

## Validation Checklist for New Epochs

When adding a new epoch, verify:

- [ ] ID follows `epoch-##-slug` format with correct sequential number
- [ ] ID is unique (not already used)
- [ ] Version number is specified (e.g., "1.0")
- [ ] Title is 1-80 characters
- [ ] Hook is 1-250 characters and compelling
- [ ] TimeRangeLabel is present and makes sense
- [ ] Background preset has all 6 required fields
- [ ] Background colors are valid hex (#RRGGBB)
- [ ] Density is 0.0-1.0
- [ ] Speed is 0.0-3.0
- [ ] FeaturedNodes has 1-10 items
- [ ] All featured node IDs exist in content library
- [ ] PrimaryExperience type is "microModule" or "journey"
- [ ] PrimaryExperience ID exists in experience library
- [ ] NextConsequence points to valid epoch/node (or null if final)
- [ ] Previous epoch's nextConsequence points to this new epoch (if inserting)

---

## Testing Validation

### Test Cases to Run

1. **Valid Timeline Test**: Use the provided 12-epoch example
2. **Missing Field Test**: Remove required fields one at a time
3. **Invalid Format Test**: Use wrong ID formats
4. **Out of Range Test**: Use density=2.0, speed=-1.0
5. **Invalid Reference Test**: Use fake content IDs
6. **Broken Chain Test**: Set middle epoch nextConsequence to null
7. **Circular Reference Test**: Create epoch loop
8. **Duplicate ID Test**: Use same epoch ID twice
9. **Length Test**: Use 300-character hook
10. **Type Test**: Use wrong enum values

---

## Schema Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-31 | Initial schema release |

### Breaking Changes Policy
- Major version bump: Required field changes, format changes
- Minor version bump: New optional fields
- Patch version bump: Documentation clarifications

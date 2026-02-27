# SPACE Knowledge Graph

Purpose: convert existing Space content into a live knowledge graph with typed nodes, semantic relations, and suggested learning paths.

## Data model

- Node
  - `id`: stable identifier (slug)
  - `type`: `concept | mission | telescope | fact | term`
  - `title`: display name
  - `tags`: keywords for filtering
  - `difficulty`: `beginner | intermediate | advanced`
  - `summary` (optional): short description
  - `link` (optional): canonical route
- Edge
  - `source`: node id
  - `target`: node id
  - `relation`: `explains | depends_on | example_of | observed_by`

## Builder

- Location: `lib/space/graph/graphBuilder.ts`
- Source inputs: `data/spaceContent.json` (highlights, missions, facts).
- Outputs:
  - `nodes`: KnowledgeNode[]
  - `edges`: KnowledgeEdge[]
  - `suggestions`: `{ beginnerPath: string[]; deepDivePath: string[] }`

## UI route

- Path: `/space/graph`
- Default: canvas-based graph with pan/zoom and click-to-select.
- Fallback: list of nodes/relations on low-spec or reduced-motion devices.
- Filters: by `type` and `difficulty`.
- Node panel: summary, tags, link, and "next recommended" neighbor.
- Paths: Beginner and Deep Dive cards render the suggested sequences.

## Performance notes

- Canvas draw culls nodes outside viewport margins (virtualized draw).
- Reduced-motion or low hardware concurrency switches to list fallback.
- Scale bounded (0.5–2.4) to keep interactions smooth.

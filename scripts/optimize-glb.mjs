#!/usr/bin/env node
/**
 * Quick glTF/GLB optimizer using @gltf-transform/functions.
 * Usage: node scripts/optimize-glb.mjs input.glb output.glb
 */
import { NodeIO } from '@gltf-transform/core'
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, quantize, simplify, weld } from '@gltf-transform/functions'

const inputPath = process.argv[2] ?? 'input.glb'
const outputPath = process.argv[3] ?? 'output.glb'

const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS)
const document = await io.read(inputPath)

await document.transform(
  weld(), // merge duplicate vertices
  dedup(), // remove duplicate buffers/accessors
  quantize(), // reduce precision for smaller size
  simplify({ ratio: 0.9 }) // optional decimation; tweak per asset
)

await io.write(outputPath, document)
console.log(`Optimized → ${outputPath}`)

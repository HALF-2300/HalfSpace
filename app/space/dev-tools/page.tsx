import CanvasStarfield from '@/components/space/CanvasStarfield'
import '@/app/space/space-page.css'

const cardClass =
  'glass border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-purple-500/10 bg-gradient-to-b from-slate-900/70 to-slate-950/80'

export default function DevToolsPage() {
  return (
    <div className="universe-portal min-h-screen relative overflow-hidden">
      <CanvasStarfield intensity="medium" />

      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-gradient space-heading-glow">Dev Tools Hub</h1>
          <p className="text-xl text-gray-200">
            One-stop commands to install and use the tooling that pairs well with this project and Cursor.
          </p>
          <div className="inline-block w-36 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </div>
      </section>

      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className={cardClass}>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <div className="text-xs uppercase tracking-wide text-purple-200">Setup Script</div>
                <h2 className="text-2xl font-semibold text-white">Windows quick install (PowerShell)</h2>
                <p className="text-slate-200 text-sm">
                  Run this in the project root to grab pnpm, glTF-Transform CLI, sharp CLI, and GitHub CLI.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-sky-200">
                scripts/setup-dev-tools.ps1
              </span>
            </div>
            <pre className="mt-4 text-slate-100 bg-black/50 p-4 rounded-2xl border border-white/10 overflow-auto text-sm">
{`powershell -ExecutionPolicy Bypass -File scripts/setup-dev-tools.ps1`}
            </pre>
          </div>

          <div className={cardClass}>
            <div className="text-xs uppercase tracking-wide text-purple-200">React Three Fiber</div>
            <h2 className="text-2xl font-semibold text-white">Add Drei / postprocessing (already in deps)</h2>
            <p className="text-slate-200 text-sm">
              Components like OrbitControls, Stars, Environment, and bloom/DOF helpers are ready to use.
            </p>
            <pre className="mt-4 text-slate-100 bg-black/50 p-4 rounded-2xl border border-white/10 overflow-auto text-sm">
{`npm install @react-three/fiber @react-three/drei postprocessing`}
            </pre>
          </div>

          <div className={cardClass}>
            <div className="text-xs uppercase tracking-wide text-purple-200">3D asset optimization</div>
            <h2 className="text-2xl font-semibold text-white">gltf-transform CLI usage</h2>
            <p className="text-slate-200 text-sm">
              Compress models before shipping; Draco + WebP keep loads snappy.
            </p>
            <pre className="mt-4 text-slate-100 bg-black/50 p-4 rounded-2xl border border-white/10 overflow-auto text-sm">
{`gltf-transform optimize input.glb output.glb --compress draco --texture-compress webp`}
            </pre>
          </div>

          <div className={cardClass}>
            <div className="text-xs uppercase tracking-wide text-purple-200">Textures</div>
            <h2 className="text-2xl font-semibold text-white">Sharp CLI WebP/AVIF</h2>
            <p className="text-slate-200 text-sm">
              Convert and resize textures to keep GPU memory light.
            </p>
            <pre className="mt-4 text-slate-100 bg-black/50 p-4 rounded-2xl border border-white/10 overflow-auto text-sm">
{`sharp input.png -resize 1024 -o output.webp`}</pre>
          </div>

          <div className={cardClass}>
            <div className="text-xs uppercase tracking-wide text-purple-200">WebGL inspection</div>
            <h2 className="text-2xl font-semibold text-white">Spector.js quick inject</h2>
            <p className="text-slate-200 text-sm">
              Paste this in DevTools console to inspect draw calls and resources without installing anything.
            </p>
            <pre className="mt-4 text-slate-100 bg-black/50 p-4 rounded-2xl border border-white/10 overflow-auto text-sm">
{`const s=document.createElement('script');
s.src='https://spectorcdn.babylonjs.com/spector.bundle.js';
s.onload=()=>{ const sp=new SPECTOR.Spector(); sp.displayUI(); sp.spyCanvases(); };
document.head.appendChild(s);`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  )
}

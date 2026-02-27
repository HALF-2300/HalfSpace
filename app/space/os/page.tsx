import SpaceOS from './space-os'

export const metadata = {
  title: 'SPACE OS',
  description: 'A desktop-like operating system experience inside Space.',
}

export default function SpaceOSPage() {
  // NOTE: `/app/space/layout.tsx` adds global Space chrome (CTA/News/QuickNav).
  // We keep this route immersive by rendering a full-viewport, high z-index shell.
  return <SpaceOS />
}


export type PerfMode = 'high' | 'low'
export type UiMode = 'windows' | 'tabs'

export type WindowAppId =
  | 'atlas'
  | 'tools'
  | 'gallery'
  | 'encyclopedia'
  | 'lab'
  | 'observatory'
  | 'graph'
  | 'odyssey'

export type AppDefinition = {
  id: WindowAppId
  title: string
  icon: string
  href?: string
}

export type WindowRect = {
  x: number
  y: number
  w: number
  h: number
}

export type WindowState = {
  id: string
  appId: WindowAppId
  title: string
  icon: string
  rect: WindowRect
  z: number
  minimized: boolean
  maximized: boolean
  restoreRect?: WindowRect
}

export type SpaceOSSession = {
  uiMode: UiMode
  perfMode: PerfMode
  windows: WindowState[]
  activeWindowId: string | null
  activeTabAppId?: WindowAppId
}


export type TokenType = 'identifier' | 'number' | 'string' | 'assign' | 'newline' | 'eof'

export interface SourcePosition {
  line: number
  column: number
  index: number
}

export interface Token {
  type: TokenType
  value?: string
  position: SourcePosition
}

export interface ParseError {
  message: string
  hint?: string
  position: SourcePosition
}

export interface ValidationIssue {
  message: string
  hint?: string
  position?: SourcePosition
  severity: 'error' | 'warning'
}

export type CommandNode =
  | {
      kind: 'starfield'
      params: {
        density?: number
        speed?: number
      }
      position: SourcePosition
    }
  | {
      kind: 'nebula'
      params: {
        mode?: 'on' | 'off'
        intensity?: number
      }
      position: SourcePosition
    }
  | {
      kind: 'travel'
      params: {
        to?: string
        duration?: number
      }
      position: SourcePosition
    }
  | {
      kind: 'show'
      target: 'fact'
      params: {
        topic?: string
      }
      position: SourcePosition
    }
  | {
      kind: 'quiz'
      params: {
        action?: 'start'
        level?: string
      }
      position: SourcePosition
    }

export interface ParseResult {
  ast: CommandNode[]
  errors: ParseError[]
}

export type SandboxLogLevel = 'info' | 'success' | 'warning' | 'error'

export interface SandboxLog {
  level: SandboxLogLevel
  message: string
  detail?: string
  position?: SourcePosition
}

export interface SandboxSceneState {
  starfield: {
    density: number
    speed: number
  }
  nebula: {
    enabled: boolean
    intensity: number
  }
  travel: {
    status: 'idle' | 'enroute' | 'arrived'
    destination?: string
    etaMs?: number
    startedAt?: number
  }
  fact: {
    topic?: string
    content?: string
  }
  quiz: {
    active: boolean
    level?: string
  }
}

export interface ScheduledEffect {
  delayMs: number
  type: 'travelComplete'
  destination: string
}

export interface EngineResult {
  state: SandboxSceneState
  logs: SandboxLog[]
  scheduled: ScheduledEffect[]
}

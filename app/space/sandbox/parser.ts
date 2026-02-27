'use client'

import {
  CommandNode,
  ParseError,
  ParseResult,
  SourcePosition,
  Token,
  TokenType,
  ValidationIssue,
} from './types'

interface TokenizeResult {
  tokens: Token[]
  errors: ParseError[]
}

const isIdentifierStart = (char: string) => /[A-Za-z_]/.test(char)
const isIdentifierPart = (char: string) => /[A-Za-z0-9_\-]/.test(char)
const isDigit = (char: string) => /[0-9]/.test(char)

export function tokenize(source: string): TokenizeResult {
  const tokens: Token[] = []
  const errors: ParseError[] = []

  let index = 0
  let line = 1
  let column = 1

  const pushToken = (type: TokenType, value?: string) => {
    tokens.push({ type, value, position: { line, column, index } })
  }

  while (index < source.length) {
    const char = source[index]

    if (char === '\r') {
      index++
      continue
    }

    if (char === '\n') {
      pushToken('newline')
      index++
      line++
      column = 1
      continue
    }

    if (char === ' ' || char === '\t') {
      index++
      column++
      continue
    }

    if (char === '=') {
      pushToken('assign')
      index++
      column++
      continue
    }

    if (char === '"') {
      const startColumn = column
      let value = ''
      index++
      column++
      let closed = false
      while (index < source.length) {
        const current = source[index]
        if (current === '"') {
          closed = true
          index++
          column++
          break
        }
        if (current === '\n') {
          errors.push({
            message: 'Unterminated string',
            hint: 'Close the quote before the line ends',
            position: { line, column: startColumn, index: index - value.length - 1 },
          })
          break
        }
        value += current
        index++
        column++
      }

      if (closed) {
        pushToken('string', value)
      }
      continue
    }

    if (isDigit(char) || (char === '.' && isDigit(source[index + 1]))) {
      let value = char
      index++
      column++
      while (index < source.length && (isDigit(source[index]) || source[index] === '.')) {
        value += source[index]
        index++
        column++
      }
      pushToken('number', value)
      continue
    }

    if (isIdentifierStart(char)) {
      let value = char
      index++
      column++
      while (index < source.length && isIdentifierPart(source[index])) {
        value += source[index]
        index++
        column++
      }
      pushToken('identifier', value)
      continue
    }

    errors.push({
      message: `Unexpected character "${char}"`,
      hint: 'Only letters, numbers, underscores, dashes, quotes, and equals are allowed',
      position: { line, column, index },
    })
    index++
    column++
  }

  pushToken('eof', undefined)
  return { tokens, errors }
}

export function parseSandboxScript(source: string): ParseResult {
  const { tokens, errors: tokenizeErrors } = tokenize(source)
  const errors: ParseError[] = [...tokenizeErrors]
  const ast: CommandNode[] = []

  let cursor = 0

  const peek = (offset = 0) => tokens[cursor + offset]
  const advance = () => tokens[cursor++]

  const skipLine = () => {
    while (peek() && peek().type !== 'newline' && peek().type !== 'eof') {
      advance()
    }
    if (peek()?.type === 'newline') advance()
  }

  while (cursor < tokens.length) {
    const token = peek()
    if (!token || token.type === 'eof') break
    if (token.type === 'newline') {
      advance()
      continue
    }

    if (token.type !== 'identifier') {
      errors.push({
        message: 'Expected a command',
        hint: 'Commands start with a word like "starfield" or "travel"',
        position: token.position,
      })
      skipLine()
      continue
    }

    const { node, errors: commandErrors } = parseCommand(tokens, () => peek(), () => advance(), cursor)
    errors.push(...commandErrors)
    if (node) {
      ast.push(node)
    }
  }

  return { ast, errors }
}

interface ParseCommandResult {
  node?: CommandNode
  errors: ParseError[]
}

function parseCommand(
  tokens: Token[],
  peek: () => Token | undefined,
  advance: () => Token | undefined,
  startIndex: number
): ParseCommandResult {
  const errors: ParseError[] = []
  const startToken = tokens[startIndex]
  if (!startToken) {
    return { errors }
  }

  const take = () => advance()

  const readKeyValue = (): { key?: string; value?: string | number; position: SourcePosition } => {
    const keyToken = peek()
    if (!keyToken || keyToken.type !== 'identifier') {
      errors.push({
        message: 'Expected a parameter name',
        hint: 'Use key=value pairs like density=1200',
        position: keyToken?.position || startToken.position,
      })
      return { position: keyToken?.position || startToken.position }
    }
    take()
    const eq = peek()
    if (!eq || eq.type !== 'assign') {
      errors.push({
        message: `Missing "=" after "${keyToken.value}"`,
        hint: 'Parameters must be key=value',
        position: eq?.position || keyToken.position,
      })
      return { key: keyToken.value, position: keyToken.position }
    }
    take()
    const val = peek()
    if (!val || (val.type !== 'number' && val.type !== 'string' && val.type !== 'identifier')) {
      errors.push({
        message: `Missing value for "${keyToken.value}"`,
        hint: 'Provide a number or quoted string',
        position: val?.position || keyToken.position,
      })
      return { key: keyToken.value, position: keyToken.position }
    }
    take()
    const parsedValue =
      val.type === 'number'
        ? Number(val.value)
        : val.type === 'string'
        ? val.value
        : (val.value as string | number | undefined)
    return { key: keyToken.value?.toLowerCase(), value: parsedValue, position: keyToken.position }
  }

  const readUntilLineEnd = (allowedKeys: string[]) => {
    const params: Record<string, string | number> = {}
    while (true) {
      const current = peek()
      if (!current || current.type === 'newline' || current.type === 'eof') break
      if (current.type === 'identifier') {
        const { key, value, position } = readKeyValue()
        if (!key) continue
        if (!allowedKeys.includes(key)) {
          errors.push({
            message: `Unknown parameter "${key}"`,
            hint: `Allowed: ${allowedKeys.join(', ')}`,
            position,
          })
        } else if (value !== undefined) {
          params[key] = value
        }
      } else {
        errors.push({
          message: 'Unexpected token in parameters',
          hint: 'Use key=value format',
          position: current.position,
        })
        take()
      }
    }
    return params
  }

  const commandName = startToken.value?.toLowerCase()
  take()

  const finish = () => {
    let next = peek()
    while (next && next.type !== 'newline' && next.type !== 'eof') {
      take()
      next = peek()
    }
    if (next && next.type === 'newline') take()
  }

  let node: CommandNode | undefined

  switch (commandName) {
    case 'starfield': {
      const params = readUntilLineEnd(['density', 'speed'])
      node = {
        kind: 'starfield',
        params: {
          density: typeof params.density === 'number' ? params.density : undefined,
          speed: typeof params.speed === 'number' ? params.speed : undefined,
        },
        position: startToken.position,
      }
      finish()
      break
    }
    case 'nebula': {
      const modeToken = peek()
      if (!modeToken || modeToken.type !== 'identifier') {
        errors.push({
          message: 'Nebula requires "on" or "off"',
          hint: 'Example: nebula on intensity=0.4',
          position: startToken.position,
        })
      } else {
        take()
      }
      const params = readUntilLineEnd(['intensity'])
      node = {
        kind: 'nebula',
        params: {
          mode: modeToken && modeToken.type === 'identifier' ? (modeToken.value?.toLowerCase() as 'on' | 'off') : undefined,
          intensity: typeof params.intensity === 'number' ? params.intensity : undefined,
        },
        position: startToken.position,
      }
      finish()
      break
    }
    case 'travel': {
      const params = readUntilLineEnd(['to', 'duration'])
      node = {
        kind: 'travel',
        params: {
          to: params.to !== undefined ? String(params.to) : undefined,
          duration: typeof params.duration === 'number' ? params.duration : undefined,
        },
        position: startToken.position,
      }
      finish()
      break
    }
    case 'show': {
      const targetToken = peek()
      if (!targetToken || targetToken.type !== 'identifier') {
        errors.push({
          message: 'Show requires a target',
          hint: 'Example: show fact topic="black_holes"',
          position: startToken.position,
        })
      } else {
        take()
      }
      const params = readUntilLineEnd(['topic'])
      node = {
        kind: 'show',
        target: 'fact',
        params: {
          topic: params.topic !== undefined ? String(params.topic) : undefined,
        },
        position: startToken.position,
      }
      finish()
      break
    }
    case 'quiz': {
      const actionToken = peek()
      if (!actionToken || actionToken.type !== 'identifier') {
        errors.push({
          message: 'Quiz requires an action',
          hint: 'Use "quiz start level=\\"hard\\""',
          position: startToken.position,
        })
      } else {
        take()
      }
      const params = readUntilLineEnd(['level'])
      node = {
        kind: 'quiz',
        params: {
          action: actionToken && actionToken.type === 'identifier' ? (actionToken.value?.toLowerCase() as 'start') : undefined,
          level: params.level !== undefined ? String(params.level) : undefined,
        },
        position: startToken.position,
      }
      finish()
      break
    }
    default: {
      errors.push({
        message: `Unknown command "${commandName}"`,
        hint: 'Supported commands: starfield, nebula, travel, show, quiz',
        position: startToken.position,
      })
      finish()
    }
  }

  return { node, errors }
}

const limits = {
  density: { min: 50, max: 2000 },
  speed: { min: 0, max: 1.5 },
  intensity: { min: 0, max: 1 },
  duration: { min: 1, max: 30 },
}

export function validateAst(ast: CommandNode[]): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  const ensureNumber = (
    value: number | undefined,
    key: keyof typeof limits,
    position?: SourcePosition
  ): { value?: number } => {
    if (value === undefined) return { value }
    const { min, max } = limits[key]
    if (Number.isNaN(value)) {
      issues.push({
        severity: 'error',
        message: `"${key}" must be a number`,
        hint: 'Remove quotes around numbers',
        position,
      })
      return { value }
    }
    if (value < min || value > max) {
      issues.push({
        severity: 'warning',
        message: `"${key}" is out of bounds`,
        hint: `Clamping to ${min}-${max}`,
        position,
      })
    }
    return { value }
  }

  ast.forEach((node) => {
    switch (node.kind) {
      case 'starfield': {
        ensureNumber(node.params.density, 'density', node.position)
        ensureNumber(node.params.speed, 'speed', node.position)
        break
      }
      case 'nebula': {
        if (!node.params.mode) {
          issues.push({
            severity: 'error',
            message: 'Nebula requires "on" or "off"',
            position: node.position,
          })
        }
        ensureNumber(node.params.intensity, 'intensity', node.position)
        break
      }
      case 'travel': {
        if (!node.params.to) {
          issues.push({
            severity: 'error',
            message: 'Travel requires a destination via to="<place>"',
            position: node.position,
          })
        }
        ensureNumber(node.params.duration, 'duration', node.position)
        break
      }
      case 'show': {
        if (!node.params.topic) {
          issues.push({
            severity: 'error',
            message: 'Show fact requires topic="<subject>"',
            position: node.position,
          })
        }
        break
      }
      case 'quiz': {
        if (node.params.action !== 'start') {
          issues.push({
            severity: 'error',
            message: 'Quiz only supports "start"',
            hint: 'Use: quiz start level="hard"',
            position: node.position,
          })
        }
        break
      }
      default:
        break
    }
  })

  return issues
}

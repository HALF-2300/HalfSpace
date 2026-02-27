export type ChallengeCategory = 'cosmology' | 'stars' | 'orbits' | 'blackholes' | 'units'

export type ChallengeInputDef = {
  key: string
  label_ar: string
  type: 'number'
  unit?: string
  min?: number
  max?: number
  step?: number
  default: number
}

export type ChallengeOutputDef = {
  key: string
  label_ar: string
  unit?: string
}

export type ChallengeAnswerDef =
  | {
      kind: 'numeric'
      tolerance_pct: number
      points: number
    }
  | {
      kind: 'choice'
      choices_ar: string[]
      points: number
    }

export type ChallengeDef = {
  id: string
  category: ChallengeCategory
  title_ar: string
  scenario_ar: string
  inputs: ChallengeInputDef[]
  output: ChallengeOutputDef
  answer: ChallengeAnswerDef
  explain_ar: string
}

export type ChallengesBundle = {
  schema_version: string
  title: string
  title_ar: string
  challenges: ChallengeDef[]
}

export type ChallengeRun = {
  outputValue: number | string
  outputLabel_ar: string
  outputUnit?: string
  explanation_ar: string
  steps_ar: string[]
  expectedChoice_ar?: string
}


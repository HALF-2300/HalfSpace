export type UniverseEntityType = 'era' | 'object' | 'method' | 'mission' | 'constant'

export type UniverseRelationType = 'explains' | 'depends_on' | 'measured_by' | 'observed_by'

export type UniverseEntity = {
  id: string
  type: UniverseEntityType
  name: string
  name_ar?: string
  summary: string
  summary_ar?: string
  tags?: string[]
  value?: number
  units?: string
}

export type UniverseRelation = {
  from: string
  type: UniverseRelationType
  to: string
  note?: string
}

export type UniverseModel = {
  schema_version: string
  model_id: string
  title: string
  title_ar?: string
  updated_at: string
  entities: UniverseEntity[]
  relations: UniverseRelation[]
}

export type LearningLevel = 'Beginner' | 'Intermediate' | 'Expert'

export type LearningStep = {
  index: number
  entityId: string
  title: string
  type: UniverseEntityType
  reason: string
}

export type LearningPath = {
  level: LearningLevel
  steps: LearningStep[]
}

export type StoredProgressV1 = {
  version: 1
  updatedAt: string
  completedByLevel: Record<LearningLevel, string[]>
}


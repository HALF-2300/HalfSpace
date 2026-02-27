export type ShowcaseCategory = 'nebula' | 'galaxy' | 'planet' | 'mission'

export interface ShowcaseImage {
  id: string
  title: string
  description: string
  category: ShowcaseCategory
  url: string
  credit?: string
  location?: string
  year?: string
}

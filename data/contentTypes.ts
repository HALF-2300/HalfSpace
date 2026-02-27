export type PlanetId =
  | 'planet-mercury'
  | 'planet-venus'
  | 'planet-earth'
  | 'planet-mars'
  | 'planet-jupiter'
  | 'planet-saturn'
  | 'planet-uranus'
  | 'planet-neptune'

export type PlanetImageAnchorId =
  | 'planet-image-mercury'
  | 'planet-image-venus'
  | 'planet-image-earth'
  | 'planet-image-mars'
  | 'planet-image-jupiter'
  | 'planet-image-saturn'
  | 'planet-image-uranus'
  | 'planet-image-neptune'

export type TimelineEventId =
  | 'timeline-1610-galileo-jupiter-moons'
  | 'timeline-1655-huygens-saturn-rings'
  | 'timeline-1781-herschel-uranus'
  | 'timeline-1846-neptune-prediction'
  | 'timeline-1962-mariner-2-venus'
  | 'timeline-1965-mariner-4-mars'
  | 'timeline-1974-mariner-10-mercury'
  | 'timeline-1977-voyager-launch'
  | 'timeline-1995-galileo-jupiter-orbit'
  | 'timeline-2004-cassini-saturn-arrival'
  | 'timeline-2011-messenger-mercury-orbit'
  | 'timeline-2018-insight-mars-landing'

export type HistoricImageId =
  | 'historic-image-earthrise-1968'
  | 'historic-image-blue-marble-1972'
  | 'historic-image-apollo-11-bootprint-1969'
  | 'historic-image-pale-blue-dot-1990'
  | 'historic-image-hubble-deep-field-1995'
  | 'historic-image-first-black-hole-2019'

export interface Planet {
  id: PlanetId
  name: string
  href: string
  description: string
  image: string
  imageAnchorId: PlanetImageAnchorId
  facts: string[]
  related: {
    timelineEventIds: TimelineEventId[]
    historicImageIds: HistoricImageId[]
  }
}

export interface PlanetaryTimelineEvent {
  id: TimelineEventId
  year: string
  title: string
  description: string
  icon?: string
  planetId: PlanetId
  planetImageAnchorId: PlanetImageAnchorId
  related: {
    historicImageIds: HistoricImageId[]
  }
}

export interface HistoricImage {
  id: HistoricImageId
  year: string
  title: string
  subtitle: string
  image: string
  whatYouSee: string
  whyImportant: string
  whatChanged: string
  source?: {
    credit?: string
    url?: string
    license?: string
  }
  related: {
    planetIds: PlanetId[]
    timelineEventIds: TimelineEventId[]
  }
}




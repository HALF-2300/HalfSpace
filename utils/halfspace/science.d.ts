export type DistanceUnit = 'km' | 'au' | 'ly'
export function lightTravelSeconds(distance: number, unit: DistanceUnit): number
/** Constant-velocity travel between two locations at rest in the Earth frame. */
export function constantSpeedJourney(distance: number, unit: DistanceUnit, fractionOfC: number): { earthSeconds: number; shipSeconds: number }
export function gravitationalTimeFactor(radiusInRs: number): number
export function filterDestinations<T extends {category: string; title: {en: string; ar: string}; description: {en: string; ar: string}}>(destinations: T[], query: string, category: string): T[]
export function readExploredIds(raw: string | null, knownIds: string[]): string[]

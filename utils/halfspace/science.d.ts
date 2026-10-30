export type DistanceUnit = 'km' | 'au' | 'ly'
export function lightTravelSeconds(distance: number, unit: DistanceUnit): number
export function gravitationalTimeFactor(radiusInRs: number): number
export function filterDestinations<T extends {category: string; title: {en: string; ar: string}; description: {en: string; ar: string}}>(destinations: T[], query: string, category: string): T[]
export function readExploredIds(raw: string | null, knownIds: string[]): string[]

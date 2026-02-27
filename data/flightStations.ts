export type FlightStation = {
  id: string
  name: string
  description: string
  position: [number, number, number]
  color: string
}

export const flightStations: FlightStation[] = [
  {
    id: 'cmb',
    name: 'Cosmic Microwave Background',
    description: 'Afterglow of recombination — the first light we can observe in every direction.',
    position: [0, 0, 0],
    color: '#7dd3fc'
  },
  {
    id: 'first-stars',
    name: 'First Stars',
    description: 'Population III giants ignite and flood the universe with ultraviolet photons.',
    position: [30, 10, -20],
    color: '#a78bfa'
  },
  {
    id: 'galaxies',
    name: 'Emerging Galaxies',
    description: 'Protogalaxies merge and spin up, assembling the early cosmic web.',
    position: [70, -15, 5],
    color: '#22d3ee'
  },
  {
    id: 'milky-way',
    name: 'Milky Way',
    description: 'Our barred spiral with ~100B stars, sculpted by mergers and dark matter.',
    position: [120, 5, -40],
    color: '#60a5fa'
  },
  {
    id: 'solar-system',
    name: 'Solar System',
    description: 'A G-type star, rocky inner worlds, gas giants, and the distant Oort Cloud.',
    position: [165, 0, 15],
    color: '#f472b6'
  }
]

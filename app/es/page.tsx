import type { Metadata } from 'next'
import HomePageContent from '@/components/HomePageContent'

export const metadata: Metadata = {
  title: 'HalfSPACE - Viaje por el cosmos',
  description: 'Explora el universo, planetas, estrellas, galaxias y el espacio. Experiencias interactivas y viaje espacial.',
  openGraph: { locale: 'es' },
}

export default function EsHomePage() {
  return <HomePageContent locale="es" basePath="/es" />
}

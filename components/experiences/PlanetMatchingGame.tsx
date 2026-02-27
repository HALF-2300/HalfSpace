'use client'

import { useState, useEffect } from 'react'
import { awardXP } from '@/lib/gameEngine'

interface Card {
  id: number
  planetId: string
  emoji: string
  name: string
  flipped: boolean
  matched: boolean
}

const PLANETS = [
  { id: 'mercury', emoji: '☿️', name: 'Mercury', color: '#8C7853' },
  { id: 'venus', emoji: '♀️', name: 'Venus', color: '#FFC649' },
  { id: 'earth', emoji: '🌍', name: 'Earth', color: '#4A90E2' },
  { id: 'mars', emoji: '♂️', name: 'Mars', color: '#E27B58' },
  { id: 'jupiter', emoji: '♃', name: 'Jupiter', color: '#C88B3A' },
  { id: 'saturn', emoji: '♄', name: 'Saturn', color: '#FAD5A5' },
  { id: 'uranus', emoji: '♅', name: 'Uranus', color: '#4FD0E0' },
  { id: 'neptune', emoji: '♆', name: 'Neptune', color: '#4166F5' }
]

export default function PlanetMatchingGame() {
  const [isActive, setIsActive] = useState(false)
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [time, setTime] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  
  // Timer
  useEffect(() => {
    let interval: number | null = null
    
    if (timerActive && !gameComplete) {
      interval = window.setInterval(() => {
        setTime(t => t + 1)
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive, gameComplete])
  
  // Initialize game
  useEffect(() => {
    if (isActive) {
      // Create pairs
      const selectedPlanets = PLANETS.slice(0, 6) // Use 6 planets for 12 cards
      const pairs = [...selectedPlanets, ...selectedPlanets]
      
      // Shuffle
      const shuffled = pairs
        .sort(() => Math.random() - 0.5)
        .map((planet, index) => ({
          id: index,
          planetId: planet.id,
          emoji: planet.emoji,
          name: planet.name,
          flipped: false,
          matched: false
        }))
      
      setCards(shuffled)
      setFlippedCards([])
      setMoves(0)
      setMatches(0)
      setGameComplete(false)
      setTime(0)
      setTimerActive(true)
    }
  }, [isActive])
  
  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return
    if (flippedCards.includes(cardId)) return
    if (cards[cardId].matched) return
    
    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)
    
    // Update card state
    setCards(cards.map(card => 
      card.id === cardId ? { ...card, flipped: true } : card
    ))
    
    if (newFlipped.length === 2) {
      setMoves(moves + 1)
      
      const card1 = cards[newFlipped[0]]
      const card2 = cards[newFlipped[1]]
      
      if (card1.planetId === card2.planetId) {
        // Match!
        setTimeout(() => {
          setCards(cards.map(card => 
            card.id === newFlipped[0] || card.id === newFlipped[1]
              ? { ...card, matched: true }
              : card
          ))
          setFlippedCards([])
          setMatches(matches + 1)
          
          // Check if game complete
          if (matches + 1 === cards.length / 2) {
            setGameComplete(true)
            setTimerActive(false)
            
            // Award XP based on performance
            const baseXP = 200
            const timeBonus = Math.max(0, 100 - time * 2) // Faster = more bonus
            const moveBonus = Math.max(0, 100 - moves * 5) // Fewer moves = more bonus
            const totalXP = baseXP + timeBonus + moveBonus
            
            awardXP(totalXP, `Planet Match Complete! (${time}s, ${moves} moves)`)
          }
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards(cards.map(card => 
            card.id === newFlipped[0] || card.id === newFlipped[1]
              ? { ...card, flipped: false }
              : card
          ))
          setFlippedCards([])
        }, 1000)
      }
    }
  }
  
  const handleRestart = () => {
    const selectedPlanets = PLANETS.slice(0, 6)
    const pairs = [...selectedPlanets, ...selectedPlanets]
    const shuffled = pairs
      .sort(() => Math.random() - 0.5)
      .map((planet, index) => ({
        id: index,
        planetId: planet.id,
        emoji: planet.emoji,
        name: planet.name,
        flipped: false,
        matched: false
      }))
    
    setCards(shuffled)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setGameComplete(false)
    setTime(0)
    setTimerActive(true)
  }
  
  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="w-full min-h-[300px] bg-gradient-to-br from-pink-900/20 via-rose-900/20 to-red-900/20 backdrop-blur-sm rounded-2xl border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.2)_0%,rgba(0,0,0,1)_100%)]" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-3xl font-bold text-white mb-3">Planet Matching Game</h3>
          <p className="text-gray-300 text-lg mb-4">Memory game with planets - find the pairs!</p>
          <div className="px-6 py-3 bg-pink-600 rounded-lg text-white font-bold hover:bg-pink-500 transition-all">
            Play →
          </div>
        </div>
      </button>
    )
  }
  
  return (
    <div className="relative w-full min-h-[700px] bg-gradient-to-b from-black via-pink-900/10 to-black rounded-2xl overflow-hidden p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gradient mb-2">Planet Matching</h2>
          <p className="text-gray-400">Find all the matching pairs!</p>
        </div>
        <button
          onClick={() => setIsActive(false)}
          className="px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg text-white font-semibold transition-all"
        >
          Exit
        </button>
      </div>
      
      {/* Stats */}
      <div className="flex gap-4 justify-center mb-8">
        <div className="glass rounded-lg px-6 py-3">
          <div className="text-gray-400 text-sm">Time</div>
          <div className="text-white font-bold text-xl">{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</div>
        </div>
        <div className="glass rounded-lg px-6 py-3">
          <div className="text-gray-400 text-sm">Moves</div>
          <div className="text-white font-bold text-xl">{moves}</div>
        </div>
        <div className="glass rounded-lg px-6 py-3">
          <div className="text-gray-400 text-sm">Matches</div>
          <div className="text-white font-bold text-xl">{matches}/{cards.length / 2}</div>
        </div>
      </div>
      
      {/* Game Board */}
      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.matched || card.flipped || flippedCards.length === 2}
            className={`aspect-square rounded-xl transition-all duration-300 transform ${
              card.matched
                ? 'bg-green-600/30 border-2 border-green-500'
                : card.flipped
                  ? 'bg-purple-600/30 border-2 border-purple-500'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: card.flipped || card.matched ? 'rotateY(0deg)' : 'rotateY(180deg)'
            }}
          >
            {(card.flipped || card.matched) && (
              <div className="text-5xl">{card.emoji}</div>
            )}
            {!card.flipped && !card.matched && (
              <div className="text-3xl">❓</div>
            )}
          </button>
        ))}
      </div>
      
      {/* Game Complete */}
      {gameComplete && (
        <div className="glass rounded-xl p-8 max-w-md mx-auto text-center border-2 border-green-500/50">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold text-gradient mb-2">Perfect!</h3>
          <div className="text-gray-300 mb-4">
            <div>Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</div>
            <div>Moves: {moves}</div>
          </div>
          <div className="text-2xl text-yellow-400 font-bold mb-6">
            +{200 + Math.max(0, 100 - time * 2) + Math.max(0, 100 - moves * 5)} XP
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold transition-all"
            >
              Play Again
            </button>
            <button
              onClick={() => setIsActive(false)}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg text-white font-bold transition-all"
            >
              Exit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

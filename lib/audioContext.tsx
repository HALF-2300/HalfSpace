'use client'

import { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react'

interface AudioContextType {
  audio: AudioContext | null
  isPlaying: boolean
  isLoading: boolean
  play: () => Promise<void>
  pause: () => void
  toggle: () => Promise<void>
  setVolume: (volume: number) => void
}

const SpaceAudioContext = createContext<AudioContextType | null>(null)

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const bufferRef = useRef<AudioBuffer | null>(null)
  const isInitialized = useRef(false)
  const isPlayingRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const createBuffer = async (): Promise<AudioBuffer | null> => {
    if (!audioContextRef.current) {
      console.error('AudioContext not available')
      return null
    }

    try {
      // Resume context first
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }

      const sampleRate = audioContextRef.current.sampleRate
      const duration = 12 // 12 seconds loop
      const samples = sampleRate * duration
      const buffer = audioContextRef.current.createBuffer(2, samples, sampleRate)
      
      console.log('Creating impressive space audio buffer:', { sampleRate, duration, samples })

      // Create impressive layered space/galaxy/universe ambient sound
      for (let channel = 0; channel < 2; channel++) {
        const channelData = buffer.getChannelData(channel)
        const phaseOffset = channel === 0 ? 0 : Math.PI * 0.3 // Stereo separation

        for (let i = 0; i < samples; i++) {
          const t = i / sampleRate

          // Layer 1: Deep cosmic hum (galaxy background) - Rich and immersive
          const cosmicHum = 60 + Math.sin(t * 0.08) * 12
          const layer1 = Math.sin(2 * Math.PI * cosmicHum * t + phaseOffset) * 0.75

          // Layer 2: Mid-range space drone (universe presence) - More prominent
          const spaceDrone = 120 + Math.sin(t * 0.06) * 25
          const layer2 = Math.sin(2 * Math.PI * spaceDrone * t + phaseOffset * 1.5) * 0.7

          // Layer 3: Nebula shimmer (distant stars/nebulas) - Enhanced
          const nebulaFreq = 200 + Math.sin(t * 0.15) * 50
          const layer3 = Math.sin(2 * Math.PI * nebulaFreq * t + phaseOffset * 2) * 0.55

          // Layer 4: Star twinkle (high frequency sparkle) - More varied
          const starFreq = 400 + Math.sin(t * 0.3) * 120
          const layer4 = Math.sin(2 * Math.PI * starFreq * t + phaseOffset * 3) * 0.35 * (Math.random() * 0.6 + 0.4)

          // Layer 5: Cosmic wind (sweeping filter) - More dynamic
          const windSweep = Math.sin(t * 0.025 + phaseOffset) * 0.25 * Math.sin(t * 0.1)

          // Layer 6: Deep space reverb tail (very low) - Enhanced bass
          const reverbFreq = 35 + Math.sin(t * 0.05) * 8
          const layer6 = Math.sin(2 * Math.PI * reverbFreq * t + phaseOffset) * 0.45

          // Layer 7: Pulsar-like rhythmic pulse (new)
          const pulsarFreq = 80 + Math.sin(t * 0.04) * 15
          const pulsar = Math.sin(2 * Math.PI * pulsarFreq * t) * 0.2 * (0.5 + 0.5 * Math.sin(t * 2))

          // Combine all layers - Rich space ambient sound
          let mixed = layer1 + layer2 + layer3 + layer4 + windSweep + layer6 + pulsar

          // Only fade in the very first 0.05 seconds to prevent clicks
          if (i < sampleRate * 0.05) {
            mixed *= (i / (sampleRate * 0.05))
          }

          // Normalize and ensure good volume
          mixed = Math.max(-0.95, Math.min(0.95, mixed))
          channelData[i] = mixed
        }
      }

      console.log('Impressive space audio buffer created successfully!')
      console.log('Buffer duration:', buffer.duration, 'seconds')
      console.log('Sample rate:', buffer.sampleRate)
      
      return buffer
    } catch (error) {
      console.error('Failed to create audio buffer:', error)
      return null
    }
  }

  const startAudio = async () => {
    if (!audioContextRef.current) {
      console.error('Cannot start: AudioContext not available')
      return
    }

    if (!bufferRef.current) {
      console.error('Cannot start: Audio buffer not available')
      return
    }

    if (isPlayingRef.current) {
      console.log('Audio already playing')
      return
    }

    try {
      // Resume context if suspended (REQUIRED by browsers)
      if (audioContextRef.current.state === 'suspended') {
        console.log('Resuming suspended AudioContext...')
        await audioContextRef.current.resume()
        console.log('AudioContext resumed, state:', audioContextRef.current.state)
      }

      // Stop existing source if any
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop()
        } catch (e) {
          // Already stopped
        }
        try {
          sourceNodeRef.current.disconnect()
        } catch (e) {
          // Already disconnected
        }
      }

      // Create source node
      const source = audioContextRef.current.createBufferSource()
      source.buffer = bufferRef.current
      source.loop = true

      // Create gain node for volume control - SET TO HIGH VOLUME
      const gainNode = audioContextRef.current.createGain()
      gainNode.gain.value = 0.8 // 80% volume - VERY LOUD!
      
      console.log('Gain node created with value:', gainNode.gain.value)

      // Verify connections
      console.log('Connecting audio nodes...')
      source.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)
      console.log('Audio nodes connected')

      // Start playing
      console.log('Starting audio playback...')
      source.start(0)
      
      sourceNodeRef.current = source
      gainNodeRef.current = gainNode
      
      // Verify context is running before setting state
      if (audioContextRef.current.state !== 'running') {
        console.warn('AudioContext not running, attempting to resume...')
        await audioContextRef.current.resume()
      }

      isPlayingRef.current = true
      setIsPlaying(true)
      setIsLoading(false)
      
      console.log('✅ AUDIO STARTED SUCCESSFULLY!', {
        contextState: audioContextRef.current.state,
        sampleRate: audioContextRef.current.sampleRate,
        bufferDuration: bufferRef.current.duration,
        gainValue: gainNode.gain.value,
        destination: audioContextRef.current.destination ? 'connected' : 'NOT CONNECTED',
        numberOfChannels: bufferRef.current.numberOfChannels
      })

      // Verify it's actually playing after a short delay
      setTimeout(() => {
        if (sourceNodeRef.current && audioContextRef.current) {
          const currentState = audioContextRef.current.state
          console.log('Audio verification (100ms later):', {
            contextState: currentState,
            gainValue: gainNodeRef.current?.gain.value,
            isPlayingState: isPlayingRef.current
          })
          
          if (currentState !== 'running') {
            console.warn('⚠️ AudioContext is not running! State:', currentState)
          }
        }
      }, 100)

      // Handle end event (shouldn't happen with loop, but just in case)
      source.onended = () => {
        console.log('Audio ended unexpectedly, restarting...')
        if (isPlayingRef.current) {
          startAudio() // Restart if it ends
        }
      }
    } catch (error) {
      console.error('❌ Failed to start audio:', error)
      setIsPlaying(false)
      setIsLoading(false)
    }
  }

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop()
      } catch (e) {
        // Already stopped
      }
      sourceNodeRef.current.disconnect()
      sourceNodeRef.current = null
    }
    isPlayingRef.current = false
    setIsPlaying(false)
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized.current) {
      isInitialized.current = true

      try {
        // Create AudioContext
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        audioContextRef.current = new AudioContextClass()
        
        console.log('AudioContext created:', audioContextRef.current.state)

        // Create buffer
        createBuffer().then((buffer) => {
          if (buffer) {
            bufferRef.current = buffer
            // Don't try to autoplay - wait for user interaction
            console.log('Audio buffer ready, waiting for user interaction')
          }
          // Always set loading to false after buffer creation attempt
          setIsLoading(false)
        }).catch((error) => {
          console.error('Error creating audio buffer:', error)
          setIsLoading(false)
        })

        // Listen for user interaction to enable audio
        const enableOnInteraction = async () => {
          if (audioContextRef.current && bufferRef.current) {
            // Resume context if suspended
            if (audioContextRef.current.state === 'suspended') {
              await audioContextRef.current.resume()
            }
            // Start audio if not already playing
            if (!isPlayingRef.current) {
              await startAudio()
            }
          }
        }

        const events = ['click', 'touchstart', 'keydown']
        events.forEach(event => {
          document.addEventListener(event, enableOnInteraction, { once: false, passive: true })
        })

        return () => {
          stopAudio()
          events.forEach(event => {
            document.removeEventListener(event, enableOnInteraction)
          })
          if (audioContextRef.current) {
            audioContextRef.current.close().catch(() => {})
          }
        }
      } catch (error) {
        console.error('Failed to initialize audio:', error)
        setIsLoading(false)
      }
    } else {
      // If already initialized, ensure loading is false
      setIsLoading(false)
    }
  }, []) // Empty dependency array - initialization only once

  const play = async () => {
    if (!isPlayingRef.current && bufferRef.current) {
      await startAudio()
    }
  }

  const pause = () => {
    if (isPlayingRef.current) {
      stopAudio()
    }
  }

  const toggle = async () => {
    if (isPlayingRef.current) {
      stopAudio()
    } else {
      await play()
    }
  }

  const setVolume = (volume: number) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  return (
    <SpaceAudioContext.Provider
      value={{
        audio: audioContextRef.current,
        isPlaying,
        isLoading,
        play,
        pause,
        toggle,
        setVolume,
      }}
    >
      {children}
    </SpaceAudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(SpaceAudioContext)
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}

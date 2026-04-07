'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Trophy, RotateCcw, Home, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGameStore, DIFFICULTY_CONFIG, DEFAULT_IMAGES, type Card } from '@/lib/game-store'

const GAME_DURATION = 180 // 3 minutes in seconds
const MATCH_POINTS = 100
const REVEAL_TIME = 2000 // 2 seconds initial reveal
const FLIP_BACK_TIME = 1000 // 1 second before flipping back

type GameState = 'countdown' | 'revealing' | 'playing' | 'won' | 'lost'

export default function GamePage() {
  const { difficulty, isGoogleDriveConnected, customImages } = useGameStore()
  const config = DIFFICULTY_CONFIG[difficulty]
  
  const [gameState, setGameState] = useState<GameState>('countdown')
  const [cards, setCards] = useState<Card[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [countdown, setCountdown] = useState(3)
  const [isProcessing, setIsProcessing] = useState(false)

  // Initialize cards
  const initializeCards = useCallback(() => {
    const imagesToUse = isGoogleDriveConnected && customImages.length >= config.pairs
      ? customImages.slice(0, config.pairs)
      : DEFAULT_IMAGES.slice(0, config.pairs)

    const cardPairs: Card[] = []
    imagesToUse.forEach((imageUrl, idx) => {
      // Create two cards for each image (a pair)
      cardPairs.push({
        id: `${idx}-a`,
        imageUrl,
        isFlipped: false,
        isMatched: false,
      })
      cardPairs.push({
        id: `${idx}-b`,
        imageUrl,
        isFlipped: false,
        isMatched: false,
      })
    })

    // Shuffle cards
    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]]
    }

    setCards(cardPairs)
    setMatchedPairs(0)
    setScore(0)
    setTimeLeft(GAME_DURATION)
    setFlippedIndices([])
    setGameState('countdown')
    setCountdown(3)
  }, [config.pairs, isGoogleDriveConnected, customImages])

  // Initialize on mount
  useEffect(() => {
    initializeCards()
  }, [initializeCards])

  // Countdown timer
  useEffect(() => {
    if (gameState !== 'countdown') return

    if (countdown <= 0) {
      setGameState('revealing')
      // Flip all cards to show them
      setCards(prev => prev.map(card => ({ ...card, isFlipped: true })))
      
      // After reveal time, flip them back
      setTimeout(() => {
        setCards(prev => prev.map(card => ({ ...card, isFlipped: false })))
        setGameState('playing')
      }, REVEAL_TIME)
      return
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, gameState])

  // Game timer
  useEffect(() => {
    if (gameState !== 'playing') return

    if (timeLeft <= 0) {
      setGameState('lost')
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, gameState])

  // Check for win
  useEffect(() => {
    if (gameState === 'playing' && matchedPairs >= config.pairs) {
      const timeBonus = timeLeft
      setScore(prev => prev + timeBonus)
      setGameState('won')
    }
  }, [matchedPairs, config.pairs, timeLeft, gameState])

  // Handle card click
  const handleCardClick = (index: number) => {
    if (gameState !== 'playing') return
    if (isProcessing) return
    if (cards[index].isFlipped || cards[index].isMatched) return
    if (flippedIndices.length >= 2) return

    // Flip the card
    const newFlipped = [...flippedIndices, index]
    setFlippedIndices(newFlipped)
    setCards(prev => prev.map((card, i) => 
      i === index ? { ...card, isFlipped: true } : card
    ))

    // If two cards are flipped, check for match
    if (newFlipped.length === 2) {
      setIsProcessing(true)
      const [first, second] = newFlipped
      
      if (cards[first].imageUrl === cards[second].imageUrl) {
        // Match found!
        setTimeout(() => {
          setCards(prev => prev.map((card, i) => 
            i === first || i === second ? { ...card, isMatched: true } : card
          ))
          setMatchedPairs(prev => prev + 1)
          setScore(prev => prev + MATCH_POINTS)
          setFlippedIndices([])
          setIsProcessing(false)
        }, 500)
      } else {
        // No match, flip back
        setTimeout(() => {
          setCards(prev => prev.map((card, i) => 
            i === first || i === second ? { ...card, isFlipped: false } : card
          ))
          setFlippedIndices([])
          setIsProcessing(false)
        }, FLIP_BACK_TIME)
      }
    }
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Get time color based on remaining time
  const getTimeColor = () => {
    if (timeLeft <= 30) return 'text-game-danger'
    if (timeLeft <= 60) return 'text-game-warning'
    return 'text-foreground'
  }

  // Get grid columns based on number of cards
  const getGridCols = () => {
    const totalCards = config.pairs * 2
    if (totalCards <= 6) return 'grid-cols-3'
    if (totalCards <= 10) return 'grid-cols-4 sm:grid-cols-5'
    return 'grid-cols-4 sm:grid-cols-5 md:grid-cols-6'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Game Controls Bar */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-6">
          {/* Score */}
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-game-warning" />
            <span className="text-lg font-semibold">{score}</span>
          </div>
          
          {/* Timer */}
          <div className={`flex items-center gap-2 ${getTimeColor()}`}>
            <Clock className="h-5 w-5" />
            <span className="text-lg font-mono font-semibold">{formatTime(timeLeft)}</span>
          </div>
          
          {/* Matches */}
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-sm text-muted-foreground">Matches:</span>
            <span className="font-semibold">{matchedPairs}/{config.pairs}</span>
          </div>
        </div>
        
        <Button variant="outline" size="sm" onClick={initializeCards} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Restart
        </Button>
      </div>

      {/* Game Board */}
      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Countdown Overlay */}
        <AnimatePresence>
          {gameState === 'countdown' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            >
              <motion.div
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-9xl font-bold text-primary"
              >
                {countdown > 0 ? countdown : 'Go!'}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Revealing message */}
        <AnimatePresence>
          {gameState === 'revealing' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 text-center"
            >
              <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                Memorize the cards!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards Grid */}
        <div className={`grid ${getGridCols()} justify-center gap-3`}>
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="perspective-1000"
            >
              <button
                onClick={() => handleCardClick(index)}
                disabled={gameState !== 'playing' || card.isFlipped || card.isMatched || isProcessing}
                className={`relative h-28 w-20 sm:h-32 sm:w-24 ${
                  gameState === 'playing' && !card.isFlipped && !card.isMatched && !isProcessing
                    ? 'cursor-pointer'
                    : ''
                }`}
              >
                <div 
                  className="preserve-3d relative h-full w-full transition-transform duration-500"
                  style={{ 
                    transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* Card Back */}
                  <div className={`backface-hidden absolute inset-0 flex items-center justify-center rounded-xl border-2 shadow-lg transition-colors ${
                    card.isMatched ? 'border-game-success bg-game-success/10' : 'border-border bg-card'
                  }`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                      <span className="text-2xl font-bold text-muted-foreground">?</span>
                    </div>
                  </div>
                  
                  {/* Card Front */}
                  <div className={`backface-hidden absolute inset-0 overflow-hidden rounded-xl border-2 shadow-lg ${
                    card.isMatched ? 'border-game-success ring-2 ring-game-success/50' : 'border-border'
                  }`}
                  style={{ transform: 'rotateY(180deg)' }}
                  >
                    <Image
                      src={card.imageUrl}
                      alt="Card"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 80px, 96px"
                    />
                    {card.isMatched && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-game-success/30"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-game-success">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Game Over Modals */}
        <AnimatePresence>
          {(gameState === 'won' || gameState === 'lost') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-xl"
              >
                {gameState === 'won' ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-game-success/20"
                    >
                      <Sparkles className="h-10 w-10 text-game-success" />
                    </motion.div>
                    <h2 className="mb-2 text-3xl font-bold">You Won!</h2>
                    <p className="mb-6 text-muted-foreground">
                      Congratulations! You found all the matches!
                    </p>
                    <div className="mb-6 rounded-xl bg-muted p-4">
                      <div className="mb-2 flex justify-between">
                        <span className="text-muted-foreground">Match Points</span>
                        <span className="font-semibold">{matchedPairs * MATCH_POINTS}</span>
                      </div>
                      <div className="mb-2 flex justify-between">
                        <span className="text-muted-foreground">Time Bonus</span>
                        <span className="font-semibold">+{timeLeft}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Total Score</span>
                        <span className="text-xl font-bold text-primary">{score}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-game-danger/20"
                    >
                      <Clock className="h-10 w-10 text-game-danger" />
                    </motion.div>
                    <h2 className="mb-2 text-3xl font-bold">Time&apos;s Up!</h2>
                    <p className="mb-6 text-muted-foreground">
                      You ran out of time. Better luck next time!
                    </p>
                    <div className="mb-6 rounded-xl bg-muted p-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Matches Found</span>
                        <span className="font-semibold">{matchedPairs}/{config.pairs}</span>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <span className="font-semibold">Final Score</span>
                        <span className="text-xl font-bold">{score}</span>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex gap-3">
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full gap-2">
                      <Home className="h-4 w-4" />
                      Home
                    </Button>
                  </Link>
                  <Button onClick={initializeCards} className="flex-1 gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Play Again
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

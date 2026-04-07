'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { DEFAULT_IMAGES } from '@/lib/game-store'

const cards = DEFAULT_IMAGES.slice(0, 6).map((imageUrl, index) => ({
  id: index + 1,
  imageUrl,
}))

export function CardAnimation() {
  const [flippedCards, setFlippedCards] = useState<number[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly flip 2 cards
      const randomIndices: number[] = []
      while (randomIndices.length < 2) {
        const rand = Math.floor(Math.random() * cards.length)
        if (!randomIndices.includes(rand)) {
          randomIndices.push(rand)
        }
      }
      
      setFlippedCards(randomIndices)
      
      // Flip back after 1 second
      setTimeout(() => {
        setFlippedCards([])
      }, 1000)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            animate={{ 
              scale: flippedCards.includes(index) ? 1.05 : 1
            }}
            transition={{ 
              duration: 0.3,
              type: 'spring',
              stiffness: 200,
              damping: 20
            }}
            className="perspective-1000"
          >
            <div 
              className="preserve-3d relative h-20 w-16 sm:h-24 sm:w-20 transition-transform duration-500"
              style={{ 
                transform: flippedCards.includes(index) ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Card Back */}
              <div className="backface-hidden absolute inset-0 flex items-center justify-center rounded-xl border-2 border-border bg-card shadow-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <span className="text-lg font-bold text-muted-foreground">?</span>
                </div>
              </div>
              {/* Card Front */}
              <div 
                className="backface-hidden absolute inset-0 overflow-hidden rounded-xl border-2 border-border shadow-lg"
                style={{ transform: 'rotateY(180deg)' }}
              >
                <Image
                  src={card.imageUrl}
                  alt={`Card ${card.id}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 64px, 80px"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: flippedCards.includes(index) ? 1 : 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/10"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-md">
                    <svg className="h-5 w-5 text-game-warning" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

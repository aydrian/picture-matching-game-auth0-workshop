'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, Trophy, Clock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGameStore, type Difficulty, DIFFICULTY_CONFIG } from '@/lib/game-store'
import { CardAnimation } from '@/components/card-animation'

export default function HomePage() {
  const { difficulty, setDifficulty } = useGameStore()

  const difficulties: { value: Difficulty; label: string; description: string }[] = [
    { value: 'easy', label: 'Easy', description: '3 matches to win' },
    { value: 'medium', label: 'Medium', description: '5 matches to win' },
  ]


  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl">
              <span className="text-balance">Test Your</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Memory Skills
              </span>
            </h1>
            <p className="mx-auto max-w-lg text-lg text-muted-foreground">
              Flip cards, find matching pairs, and challenge your brain in this classic memory game.
            </p>
          </motion.div>
        </div>

        {/* Card Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <CardAnimation />
        </motion.div>

        {/* How to Play */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12 rounded-2xl border bg-card p-8"
        >
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold">
            <Sparkles className="h-6 w-6 text-accent" />
            How to Play
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="mb-2 font-semibold">Watch Carefully</h3>
              <p className="text-sm text-muted-foreground">
                Cards will flip face-up for 2 seconds at the start. Memorize their positions!
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10">
                <span className="text-2xl font-bold text-secondary">2</span>
              </div>
              <h3 className="mb-2 font-semibold">Find Matches</h3>
              <p className="text-sm text-muted-foreground">
                Click two cards to flip them. If they match, they stay face-up!
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                <span className="text-2xl font-bold text-accent-foreground">3</span>
              </div>
              <h3 className="mb-2 font-semibold">Beat the Clock</h3>
              <p className="text-sm text-muted-foreground">
                You have 3 minutes! Earn bonus points for every second remaining.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scoring Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12 grid gap-4 md:grid-cols-2"
        >
          <div className="flex items-start gap-4 rounded-xl border bg-card p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-game-success/20">
              <Trophy className="h-6 w-6 text-game-success" />
            </div>
            <div>
              <h3 className="font-semibold">Match Points</h3>
              <p className="text-sm text-muted-foreground">
                Earn 100 points for each matching pair you find
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-xl border bg-card p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-game-warning/20">
              <Clock className="h-6 w-6 text-game-warning" />
            </div>
            <div>
              <h3 className="font-semibold">Time Bonus</h3>
              <p className="text-sm text-muted-foreground">
                Get 1 bonus point for each second left on the clock
              </p>
            </div>
          </div>
        </motion.div>

        {/* Difficulty Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="mb-4 text-center text-xl font-semibold">Select Difficulty</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {difficulties.map((d) => (
              <button
                key={d.value}
                onClick={() => setDifficulty(d.value)}
                className={`group relative rounded-xl border-2 px-6 py-4 transition-all ${difficulty === d.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
                  }`}
              >
                <span className="block text-lg font-semibold">{d.label}</span>
                <span className="block text-sm text-muted-foreground">{d.description}</span>
                {difficulty === d.value && (
                  <motion.div
                    layoutId="difficulty-indicator"
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary"
                  >
                    <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Play Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <Link href="/game">
            <Button size="lg" className="h-14 gap-2 rounded-xl px-12 text-lg font-semibold">
              <Play className="h-5 w-5" />
              Play Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

import { create } from 'zustand'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Card {
  id: string
  imageUrl: string
  isFlipped: boolean
  isMatched: boolean
}

interface GameStore {
  difficulty: Difficulty
  setDifficulty: (difficulty: Difficulty) => void
  
  // Google Drive mock settings
  isGoogleDriveConnected: boolean
  googleDriveFolderName: string
  connectGoogleDrive: () => void
  disconnectGoogleDrive: () => void
  setGoogleDriveFolderName: (name: string) => void
  customImages: string[]
  setCustomImages: (images: string[]) => void
}

export const useGameStore = create<GameStore>((set) => ({
  difficulty: 'easy',
  setDifficulty: (difficulty) => set({ difficulty }),
  
  isGoogleDriveConnected: false,
  googleDriveFolderName: '',
  connectGoogleDrive: () => set({ isGoogleDriveConnected: true }),
  disconnectGoogleDrive: () => set({ 
    isGoogleDriveConnected: false, 
    googleDriveFolderName: '',
    customImages: []
  }),
  setGoogleDriveFolderName: (name) => set({ googleDriveFolderName: name }),
  customImages: [],
  setCustomImages: (images) => set({ customImages: images }),
}))

export const DIFFICULTY_CONFIG = {
  easy: { matches: 3, pairs: 3 },
  medium: { matches: 5, pairs: 5 },
  hard: { matches: 7, pairs: 7 },
}

export const DEFAULT_IMAGES = [
  '/cards/cat.jpg',
  '/cards/dog.jpg',
  '/cards/bird.jpg',
  '/cards/fish.jpg',
  '/cards/rabbit.jpg',
  '/cards/bear.jpg',
  '/cards/panda.jpg',
]

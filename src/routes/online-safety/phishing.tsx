import { createFileRoute } from '@tanstack/react-router'
import PhishingGame from '../../components/PhishingGame'

export const Route = createFileRoute('/online-safety/phishing')({
  component: PhishingGame,
})

import { createFileRoute } from '@tanstack/react-router'
import SocialCreditGame from '../../components/SocialCreditGame'

export const Route = createFileRoute('/online-safety/social-credit')({
  component: SocialCreditGame,
})

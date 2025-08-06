import { createFileRoute } from '@tanstack/react-router'
import MouseSkillsChallenge from '../../components/MouseSkillsChallenge'

export const Route = createFileRoute('/it-skills/mouse-skills')({
  component: MouseSkillsChallenge,
})

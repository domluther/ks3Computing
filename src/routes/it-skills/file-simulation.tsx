import { createFileRoute } from '@tanstack/react-router'
import FileSimulation from '../../components/FileSimulation'

export const Route = createFileRoute('/it-skills/file-simulation')({
  component: FileSimulation,
})

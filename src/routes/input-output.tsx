import { createFileRoute } from '@tanstack/react-router'
import InputOutputTool from '../components/InputOutputTool'

export const Route = createFileRoute('/input-output')({
  component: InputOutputTool,
})

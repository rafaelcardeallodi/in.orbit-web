import { Plus } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { OutlineButton } from './ui/outline-button'
import { getPendingGoals } from '../http/get-pending-goals'
import { createGoalCompletion } from '../http/create-goal-completion'

export function PendingGoals() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['pending-goals'],
    queryFn: getPendingGoals,
  })

  if (!data) {
    return null
  }

  async function handleCompleteGoal(goalId: string) {
    await createGoalCompletion(goalId)

    await queryClient.invalidateQueries({ queryKey: ['summary'] })
    await queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
  }

  return (
    <div className="flex flex-wrap gap-3">
      {data.map(goal => {
        return (
          <OutlineButton
            key={goal.id}
            onClick={() => handleCompleteGoal(goal.id)}
            disabled={goal.completionCount >= goal.desiredWeeklyFrequency}
          >
            <Plus className="size-4 text-zinc-600" />
            {goal.title}
          </OutlineButton>
        )
      })}
    </div>
  )
}

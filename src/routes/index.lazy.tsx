import { createLazyFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { IconRocket } from '@tabler/icons-react'
import { useBearStore } from '@/store'
import { useQuery } from '@tanstack/react-query'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const bears = useBearStore((state) => state.bears)
  const increase = useBearStore((state) => state.increase)

  const { data: hello } = useQuery({
    queryKey: ['hello'],
    queryFn: async () => {
      return "React Query is active!"
    }
  })

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-4 max-w-xl mx-auto"
    >
      <h3 className="text-3xl font-bold tracking-tight">Welcome to Hermes</h3>
      <p className="text-muted-foreground">
        This is a full-stack scaffold featuring Vite, React, TanStack Router, TanStack Query, Better Auth, and more.
      </p>
      
      <div className="flex gap-4 items-center">
        <Button onClick={() => increase(1)}>
          <IconRocket className="mr-2 h-4 w-4" />
          Click Me: {bears}
        </Button>
      </div>

      <div className="p-4 bg-muted rounded-md text-sm">
        <p><strong>Query Data:</strong> {hello}</p>
        <p><strong>Mode:</strong> {import.meta.env.MODE}</p>
      </div>

    </motion.div>
  )
}

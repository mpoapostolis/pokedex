import { Link } from 'react-router'
import { Button } from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-white/10">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-zinc-400">
        This route wandered off into the tall grass.
      </p>
      <Button variant="primary" asChild className="mt-5">
        <Link to="/" viewTransition>
          Back to discovery
        </Link>
      </Button>
    </div>
  )
}

import { cn } from '@/lib/utils'

type Status =
  | 'pending' | 'confirmed' | 'seen' | 'cancelled'
  | 'active' | 'treated' | 'admitted' | 'discharged' | 'deceased'
  | 'draft' | 'final'
  | 'partial' | 'paid'
  | 'rejected'
  | 'synced' | 'conflict'

const STATUS_STYLES: Record<Status, string> = {
  pending:   'bg-yellow-100 text-yellow-800 border border-yellow-200',
  confirmed: 'bg-green-100 text-green-800 border border-green-200',
  seen:      'bg-blue-100 text-blue-800 border border-blue-200',
  cancelled: 'bg-gray-100 text-gray-600 border border-gray-200',
  active:    'bg-red-100 text-red-800 border border-red-200',
  treated:   'bg-green-100 text-green-800 border border-green-200',
  admitted:  'bg-purple-100 text-purple-800 border border-purple-200',
  discharged:'bg-gray-100 text-gray-700 border border-gray-200',
  deceased:  'bg-gray-800 text-white',
  draft:     'bg-yellow-100 text-yellow-800 border border-yellow-200',
  final:     'bg-green-100 text-green-800 border border-green-200',
  partial:   'bg-orange-100 text-orange-800 border border-orange-200',
  paid:      'bg-green-100 text-green-800 border border-green-200',
  rejected:  'bg-red-100 text-red-800 border border-red-200',
  synced:    'bg-green-50 text-green-700',
  conflict:  'bg-red-50 text-red-700',
}

interface StatusBadgeProps {
  status: Status | string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = STATUS_STYLES[status as Status] ?? 'bg-gray-100 text-gray-700'
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
        styles,
        className
      )}
    >
      {status}
    </span>
  )
}

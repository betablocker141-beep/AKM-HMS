/**
 * WhatsApp quick-send button.
 * Opens the wa.me link in a new tab — receptionist just taps Send in WhatsApp.
 */
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WAButtonProps {
  href: string
  label?: string
  size?: 'sm' | 'md'
  className?: string
}

export function WAButton({ href, label = 'Send WhatsApp', size = 'md', className }: WAButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20b558] text-white font-medium rounded-lg transition-colors',
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
        className
      )}
    >
      <MessageCircle className={cn(size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
      {label}
    </a>
  )
}

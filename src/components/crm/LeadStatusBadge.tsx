import { Badge } from "@/components/ui/badge"
import { LeadStatus } from "@/lib/supabase"

interface LeadStatusBadgeProps {
  status: LeadStatus
  className?: string
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const getStatusConfig = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return {
          variant: 'secondary' as const,
          className: 'bg-info text-info-foreground hover:bg-info/80',
          label: 'New'
        }
      case 'Contacted':
        return {
          variant: 'secondary' as const, 
          className: 'bg-warning text-warning-foreground hover:bg-warning/80',
          label: 'Contacted'
        }
      case 'In Progress':
        return {
          variant: 'secondary' as const,
          className: 'bg-primary text-primary-foreground hover:bg-primary/80',
          label: 'In Progress'
        }
      case 'Won':
        return {
          variant: 'secondary' as const,
          className: 'bg-success text-success-foreground hover:bg-success/80',
          label: 'Won'
        }
      case 'Lost':
        return {
          variant: 'destructive' as const,
          className: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
          label: 'Lost'
        }
      default:
        return {
          variant: 'secondary' as const,
          className: '',
          label: status
        }
    }
  }

  const config = getStatusConfig(status)
  
  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${className}`}
    >
      {config.label}
    </Badge>
  )
}
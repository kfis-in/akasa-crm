import { CRMLayout } from '@/components/crm/CRMLayout'
import { AdminPanel } from '@/components/AdminPanel'

export default function Admin() {
  return (
    <CRMLayout>
      <div className="flex-1 space-y-4 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Admin Panel</h2>
            <p className="text-muted-foreground mt-2">
              Manage users, roles, and system settings
            </p>
          </div>
        </div>

        <AdminPanel />
      </div>
    </CRMLayout>
  )
}
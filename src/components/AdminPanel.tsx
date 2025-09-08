import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useUserRole } from '@/hooks/useUserRole'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Shield, Users, UserCheck } from 'lucide-react'

interface UserWithRole {
  id: string
  email: string
  role: 'admin' | 'manager' | 'user'
  created_at: string
}

export function AdminPanel() {
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedRole, setSelectedRole] = useState<'admin' | 'manager' | 'user' | ''>('')
  const { isAdmin } = useUserRole()
  const { toast } = useToast()

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
    }
  }, [isAdmin])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          created_at
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get user emails from auth.users (this requires service role, so we'll use a simpler approach)
      const usersWithRoles = data?.map(userRole => ({
        id: userRole.user_id,
        email: `user-${userRole.user_id.slice(0, 8)}`, // Simplified - in real app you'd fetch actual emails
        role: userRole.role as 'admin' | 'manager' | 'user',
        created_at: userRole.created_at
      })) || []

      setUsers(usersWithRoles)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserRole = async () => {
    if (!selectedUserId || !selectedRole) {
      toast({
        title: 'Error',
        description: 'Please select a user and role',
        variant: 'destructive'
      })
      return
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: selectedRole as 'admin' | 'manager' | 'user' })
        .eq('user_id', selectedUserId)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'User role updated successfully'
      })

      fetchUsers()
      setSelectedUserId('')
      setSelectedRole('')
    } catch (error) {
      console.error('Error updating user role:', error)
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive'
      })
    }
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Admin Access Required</h3>
            <p className="text-muted-foreground">
              You need admin privileges to access this panel.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Manage user roles and permissions for your CRM system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-select">Select User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.email} - {user.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-select">Assign Role</Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'admin' | 'manager' | 'user')}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={updateUserRole} className="w-full md:w-auto">
            <UserCheck className="mr-2 h-4 w-4" />
            Update Role
          </Button>

          <div className="border rounded-lg">
            <div className="p-4 border-b bg-muted/50">
              <h4 className="font-semibold">Current Users</h4>
            </div>
            <div className="divide-y">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Loading users...
                </div>
              ) : users.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No users found
                </div>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={
                      user.role === 'admin' ? 'default' :
                      user.role === 'manager' ? 'secondary' : 'outline'
                    }>
                      {user.role}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
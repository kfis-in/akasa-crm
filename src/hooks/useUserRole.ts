import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export type UserRole = 'admin' | 'manager' | 'user' | null

export function useUserRole() {
  const [role, setRole] = useState<UserRole>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null)
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.rpc('get_user_role', {
          _user_id: user.id
        })

        if (error) {
          console.error('Error fetching user role:', error)
          setRole('user') // Default to user role
        } else {
          setRole(data as UserRole)
        }
      } catch (err) {
        console.error('Error fetching user role:', err)
        setRole('user') // Default to user role
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserRole()
  }, [user])

  const isAdmin = role === 'admin'
  const isManager = role === 'manager' || role === 'admin'
  const isUser = role !== null

  return {
    role,
    isLoading,
    isAdmin,
    isManager,
    isUser
  }
}
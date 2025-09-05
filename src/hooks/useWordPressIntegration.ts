import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import type { Lead } from '@/lib/supabase'

interface WordPressConfig {
  siteUrl: string
  username: string
  applicationPassword: string
  webhookSecret: string
}

interface WordPressPost {
  title: string
  content: string
  status: 'draft' | 'publish'
  categories?: number[]
  tags?: string[]
  meta?: Record<string, any>
}

export function useWordPressIntegration() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const getConfig = useCallback((): WordPressConfig | null => {
    try {
      const stored = localStorage.getItem('wordpressConfig')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }, [])

  const syncLeadToWordPress = useCallback(async (lead: Lead, action: 'create' | 'update' | 'won') => {
    const config = getConfig()
    if (!config || !config.siteUrl || !config.username || !config.applicationPassword) {
      toast({
        title: "WordPress Not Configured",
        description: "Please configure WordPress integration in Settings",
        variant: "destructive"
      })
      return false
    }

    setIsLoading(true)
    
    try {
      const auth = btoa(`${config.username}:${config.applicationPassword}`)
      const baseUrl = config.siteUrl.replace(/\/$/, '')

      if (action === 'won') {
        // Create a testimonial/case study post for won leads
        const post: WordPressPost = {
          title: `Success Story: ${lead.name}`,
          content: `
            <h2>Client Success Story</h2>
            <p><strong>Client:</strong> ${lead.name}</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            <p><strong>Phone:</strong> ${lead.phone}</p>
            <p><strong>Status:</strong> ${lead.status}</p>
            <p><strong>Assigned to:</strong> ${lead.assigned_to}</p>
            <p><strong>Lead Converted:</strong> ${new Date(lead.updated_at).toLocaleDateString()}</p>
            
            <hr>
            
            <p>This lead was successfully converted through our CRM system. 
            Contact us to learn how we can help you achieve similar results!</p>
          `,
          status: 'draft',
          categories: [1], // Uncategorized
          tags: ['crm', 'success-story', 'lead-conversion'],
          meta: {
            crm_lead_id: lead.id,
            lead_source: 'crm_integration',
            conversion_date: lead.updated_at
          }
        }

        const response = await fetch(`${baseUrl}/wp-json/wp/v2/posts`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(post)
        })

        if (!response.ok) throw new Error(`Failed to create post: ${response.status}`)
        
        const createdPost = await response.json()
        
        toast({
          title: "WordPress Post Created",
          description: `Success story post created for ${lead.name} (ID: ${createdPost.id})`
        })
      } else {
        // Update custom fields for create/update actions
        const userId = await findOrCreateWordPressUser(lead, config)
        
        if (userId) {
          // Update user meta with lead information
          await fetch(`${baseUrl}/wp-json/wp/v2/users/${userId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              meta: {
                crm_lead_id: lead.id,
                crm_lead_status: lead.status,
                crm_assigned_to: lead.assigned_to,
                crm_last_updated: lead.updated_at,
                crm_phone: lead.phone
              }
            })
          })
        }

        toast({
          title: "WordPress Synced",
          description: `Lead ${action === 'create' ? 'created' : 'updated'} in WordPress`
        })
      }

      return true
    } catch (error) {
      console.error('WordPress sync error:', error)
      toast({
        title: "WordPress Sync Failed",
        description: `Failed to ${action} lead in WordPress`,
        variant: "destructive"
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [getConfig, toast])

  const findOrCreateWordPressUser = async (lead: Lead, config: WordPressConfig) => {
    try {
      const auth = btoa(`${config.username}:${config.applicationPassword}`)
      const baseUrl = config.siteUrl.replace(/\/$/, '')

      // First, try to find existing user by email
      const searchResponse = await fetch(`${baseUrl}/wp-json/wp/v2/users?search=${encodeURIComponent(lead.email)}`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      })

      if (searchResponse.ok) {
        const users = await searchResponse.json()
        if (users.length > 0) {
          return users[0].id
        }
      }

      // If user doesn't exist, create a new subscriber
      const userResponse = await fetch(`${baseUrl}/wp-json/wp/v2/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: lead.email.split('@')[0] + '_' + Date.now(),
          email: lead.email,
          name: lead.name,
          roles: ['subscriber'],
          meta: {
            first_name: lead.name.split(' ')[0] || '',
            last_name: lead.name.split(' ').slice(1).join(' ') || '',
            crm_lead_id: lead.id,
            crm_lead_status: lead.status,
            crm_phone: lead.phone
          }
        })
      })

      if (userResponse.ok) {
        const newUser = await userResponse.json()
        return newUser.id
      }
    } catch (error) {
      console.error('Error finding/creating WordPress user:', error)
    }
    
    return null
  }

  const sendToWordPressWebhook = useCallback(async (lead: Lead, eventType: string) => {
    try {
      // Send webhook notification
      await fetch('https://llkgrbmxpzdpqvazpxqv.supabase.co/functions/v1/webhook-handler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhook_url: `${getConfig()?.siteUrl}/wp-json/crm/v1/webhook`,
          event_type: eventType,
          data: {
            lead: lead,
            timestamp: new Date().toISOString(),
            source: 'crm_integration'
          }
        })
      })
    } catch (error) {
      console.error('WordPress webhook error:', error)
    }
  }, [getConfig])

  return {
    syncLeadToWordPress,
    sendToWordPressWebhook,
    isLoading,
    isConfigured: !!getConfig()
  }
}
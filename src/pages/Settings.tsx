import { useState } from 'react'
import { CRMLayout } from '@/components/crm/CRMLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useGoogleSheets } from '@/hooks/useGoogleSheets'
import { useRealTimeLeads } from '@/hooks/useRealTimeLeads'
import { WordPressIntegration } from '@/components/crm/WordPressIntegration'
import { Settings as SettingsIcon, Bell, Shield, Database, Users, Mail, Cloud, Save } from 'lucide-react'

export default function Settings() {
  const [webhookUrl, setWebhookUrl] = useState('')
  const { toast } = useToast()
  const { backupToSheets, isLoading } = useGoogleSheets()
  const { leads } = useRealTimeLeads()
  const [settings, setSettings] = useState({
    // User Settings
    companyName: 'Lead CRM',
    userEmail: 'admin@leadcrm.com',
    displayName: 'Admin User',
    
    // Notification Settings
    emailNotifications: true,
    leadAssignmentNotifications: true,
    dailyReports: false,
    weeklyReports: true,
    
    // System Settings
    autoAssignLeads: false,
    leadInactivityDays: 30,
    maxLeadsPerUser: 100,
    
    // Team Members
    teamMembers: [
      'John Doe',
      'Sarah Smith', 
      'Mike Johnson',
      'Emily Brown',
      'David Wilson'
    ]
  })

  const [newTeamMember, setNewTeamMember] = useState('')

  const handleSaveSettings = () => {
    // In a real app, this would save to your backend
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully."
    })
  }

  const handleAddTeamMember = () => {
    if (!newTeamMember.trim()) return
    
    if (settings.teamMembers.includes(newTeamMember.trim())) {
      toast({
        title: "Team Member Exists",
        description: "This team member already exists.",
        variant: "destructive"
      })
      return
    }

    setSettings(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, newTeamMember.trim()]
    }))
    setNewTeamMember('')
    
    toast({
      title: "Team Member Added",
      description: `${newTeamMember} has been added to the team.`
    })
  }

  const handleRemoveTeamMember = (member: string) => {
    setSettings(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(m => m !== member)
    }))
    
    toast({
      title: "Team Member Removed",
      description: `${member} has been removed from the team.`
    })
  }

  const handleSaveWebhook = () => {
    localStorage.setItem('googleSheetsWebhook', webhookUrl)
    toast({
      title: "Settings Saved",
      description: "Google Sheets webhook URL has been saved successfully.",
    })
  }

  const handleBackupNow = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error", 
        description: "Please configure your Google Sheets webhook URL first.",
        variant: "destructive",
      })
      return
    }
    await backupToSheets(leads, webhookUrl)
  }

  return (
    <CRMLayout>
      <div className="min-h-screen bg-gradient-subtle">
        <div className="p-6 space-y-8">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="p-3 rounded-xl bg-gradient-primary text-white shadow-glow">
              <SettingsIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">Settings</h1>
              <p className="text-muted-foreground">Configure your real-time CRM with Google Sheets integration</p>
            </div>
          </div>
          
          {/* API Integration */}
          <Card className="backdrop-blur-md bg-card/80 shadow-glass border-0 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Database className="h-5 w-5 text-primary" />
                API Integration
              </CardTitle>
              <CardDescription>
                Use these REST API endpoints to integrate with external systems.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-glass border border-primary/20">
                  <h4 className="font-semibold text-foreground mb-2">Base URL</h4>
                  <code className="text-sm bg-muted/50 px-2 py-1 rounded">
                    https://llkgrbmxpzdpqvazpxqv.supabase.co/functions/v1/leads-api
                  </code>
                </div>

                <div className="grid gap-4">
                  <div className="p-4 border border-primary/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-500">GET</Badge>
                      <span className="font-medium">Get All Leads</span>
                    </div>
                    <code className="text-sm text-muted-foreground">GET /</code>
                    <p className="text-sm text-muted-foreground mt-1">Returns all leads with real-time data</p>
                  </div>

                  <div className="p-4 border border-primary/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-500">POST</Badge>
                      <span className="font-medium">Create Lead</span>
                    </div>
                    <code className="text-sm text-muted-foreground">POST /</code>
                    <p className="text-sm text-muted-foreground mt-1">Create a new lead with name, email, phone</p>
                  </div>

                  <div className="p-4 border border-primary/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-orange-500">PUT</Badge>
                      <span className="font-medium">Update Lead</span>
                    </div>
                    <code className="text-sm text-muted-foreground">PUT /?id=lead_id</code>
                    <p className="text-sm text-muted-foreground mt-1">Update lead information</p>
                  </div>

                  <div className="p-4 border border-primary/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-red-500">DELETE</Badge>
                      <span className="font-medium">Delete Lead</span>
                    </div>
                    <code className="text-sm text-muted-foreground">DELETE /?id=lead_id</code>
                    <p className="text-sm text-muted-foreground mt-1">Delete a lead by ID</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Webhook Configuration */}
          <Card className="backdrop-blur-md bg-card/80 shadow-glass border-0 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Mail className="h-5 w-5 text-primary" />
                Webhook Configuration
              </CardTitle>
              <CardDescription>
                Configure webhooks to receive real-time notifications when leads are created or updated.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="webhook-endpoint" className="text-foreground font-medium">Webhook Endpoint URL</Label>
                <Input 
                  id="webhook-endpoint"
                  placeholder="https://your-app.com/webhook/endpoint"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="backdrop-blur-sm bg-background/80 border-primary/20"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the URL where you want to receive webhook notifications
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-glass border border-primary/20">
                <h4 className="font-semibold text-foreground mb-2">Webhook Handler URL</h4>
                <code className="text-sm bg-muted/50 px-2 py-1 rounded">
                  https://llkgrbmxpzdpqvazpxqv.supabase.co/functions/v1/webhook-handler
                </code>
                <p className="text-sm text-muted-foreground mt-2">
                  Use this URL to trigger webhooks programmatically
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Webhook Payload Example</h4>
                <div className="p-3 bg-muted/20 rounded-lg">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
{`{
  "event": "lead_created",
  "timestamp": "2024-01-01T12:00:00Z",
  "data": {
    "id": "lead_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "status": "New",
    "assigned_to": "Sales Team"
  },
  "source": "CRM System"
}`}
                  </pre>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleSaveWebhook}
                  className="flex-1 shadow-glow bg-gradient-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Webhook URL
                </Button>
                <Button 
                  onClick={() => {
                    if (!webhookUrl) {
                      toast({
                        title: "Error",
                        description: "Please enter a webhook URL first",
                        variant: "destructive"
                      })
                      return
                    }
                    // Test webhook
                    fetch('https://llkgrbmxpzdpqvazpxqv.supabase.co/functions/v1/webhook-handler', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        webhook_url: webhookUrl,
                        event_type: 'test_webhook',
                        data: { message: 'Test webhook from CRM Settings' }
                      })
                    }).then(() => {
                      toast({
                        title: "Test Sent",
                        description: "Test webhook has been sent to your endpoint"
                      })
                    }).catch(() => {
                      toast({
                        title: "Error",
                        description: "Failed to send test webhook",
                        variant: "destructive"
                      })
                    })
                  }}
                  variant="outline"
                  className="backdrop-blur-sm bg-background/80"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Test Webhook
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* WordPress Integration */}
          <WordPressIntegration />

          {/* Google Sheets Integration */}
          <Card className="backdrop-blur-md bg-card/80 shadow-glass border-0 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Cloud className="h-5 w-5 text-primary" />
                Google Sheets Real-time Backup
              </CardTitle>
              <CardDescription>
                Connect your CRM to Google Sheets for automatic real-time data synchronization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="webhook-url" className="text-foreground font-medium">Zapier Webhook URL</Label>
                <Textarea 
                  id="webhook-url"
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="backdrop-blur-sm bg-background/80 border-primary/20"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Create a Zapier webhook that connects to Google Sheets for real-time data backup.
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleSaveWebhook}
                  className="flex-1 shadow-glow bg-gradient-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
                <Button 
                  onClick={handleBackupNow}
                  disabled={isLoading || !webhookUrl}
                  variant="outline"
                  className="backdrop-blur-sm bg-background/80"
                >
                  <Database className="h-4 w-4 mr-2" />
                  {isLoading ? 'Syncing...' : `Sync ${leads.length} Leads`}
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-gradient-glass border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                  <div>
                    <h4 className="font-semibold text-foreground">Real-time Sync Active</h4>
                    <p className="text-sm text-muted-foreground">
                      Purple theme enabled • Data automatically backed up • {leads.length} leads ready
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CRMLayout>
  )
}
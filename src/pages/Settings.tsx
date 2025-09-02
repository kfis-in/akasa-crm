import { CRMLayout } from '@/components/crm/CRMLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette,
  Mail,
  Users,
  Save,
  Trash2
} from 'lucide-react'
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'

export default function Settings() {
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

  return (
    <CRMLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <SettingsIcon className="h-8 w-8 text-primary" />
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your CRM system configuration
            </p>
          </div>
          <Button onClick={handleSaveSettings} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Company Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="userEmail">Admin Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={settings.userEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, userEmail: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={settings.displayName}
                  onChange={(e) => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive general email notifications
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="leadAssignmentNotifications">Lead Assignments</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when leads are assigned
                  </p>
                </div>
                <Switch
                  id="leadAssignmentNotifications"
                  checked={settings.leadAssignmentNotifications}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, leadAssignmentNotifications: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dailyReports">Daily Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive daily performance reports
                  </p>
                </div>
                <Switch
                  id="dailyReports"
                  checked={settings.dailyReports}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, dailyReports: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyReports">Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly performance summaries
                  </p>
                </div>
                <Switch
                  id="weeklyReports"
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, weeklyReports: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoAssignLeads">Auto-assign Leads</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically assign new leads to team members
                  </p>
                </div>
                <Switch
                  id="autoAssignLeads"
                  checked={settings.autoAssignLeads}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, autoAssignLeads: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="leadInactivityDays">Lead Inactivity Days</Label>
                <Input
                  id="leadInactivityDays"
                  type="number"
                  value={settings.leadInactivityDays}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    leadInactivityDays: parseInt(e.target.value) || 30 
                  }))}
                />
                <p className="text-sm text-muted-foreground">
                  Mark leads as inactive after this many days
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxLeadsPerUser">Max Leads per User</Label>
                <Input
                  id="maxLeadsPerUser"
                  type="number"
                  value={settings.maxLeadsPerUser}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    maxLeadsPerUser: parseInt(e.target.value) || 100 
                  }))}
                />
                <p className="text-sm text-muted-foreground">
                  Maximum number of leads per team member
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Team Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add team member name"
                  value={newTeamMember}
                  onChange={(e) => setNewTeamMember(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTeamMember()}
                />
                <Button onClick={handleAddTeamMember} size="sm">
                  Add
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Current Team Members</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {settings.teamMembers.map((member) => (
                    <div key={member} className="flex items-center justify-between p-2 border rounded-lg">
                      <span>{member}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTeamMember(member)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {settings.teamMembers.length} team members
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Database className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <div className="font-semibold">Database Status</div>
                <Badge variant="secondary" className="mt-1">Connected</Badge>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <Mail className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <div className="font-semibold">Email Service</div>
                <Badge variant="secondary" className="mt-1">Active</Badge>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <Palette className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <div className="font-semibold">Version</div>
                <Badge variant="secondary" className="mt-1">v1.0.0</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CRMLayout>
  )
}
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Globe, Key, Save, Link, CheckCircle, AlertCircle } from 'lucide-react'

interface WordPressConfig {
  siteUrl: string
  username: string
  applicationPassword: string
  webhookSecret: string
}

export function WordPressIntegration() {
  const { toast } = useToast()
  const [config, setConfig] = useState<WordPressConfig>({
    siteUrl: '',
    username: '',
    applicationPassword: '',
    webhookSecret: ''
  })
  const [isConnected, setIsConnected] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)

  const handleConfigChange = (field: keyof WordPressConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  const testConnection = async () => {
    if (!config.siteUrl || !config.username || !config.applicationPassword) {
      toast({
        title: "Missing Configuration",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setIsTestingConnection(true)
    
    try {
      // Test WordPress REST API connection
      const auth = btoa(`${config.username}:${config.applicationPassword}`)
      const response = await fetch(`${config.siteUrl.replace(/\/$/, '')}/wp-json/wp/v2/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setIsConnected(true)
        toast({
          title: "Connection Successful",
          description: "Successfully connected to WordPress site"
        })
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      setIsConnected(false)
      toast({
        title: "Connection Failed",
        description: "Could not connect to WordPress. Check your credentials.",
        variant: "destructive"
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const saveConfiguration = () => {
    localStorage.setItem('wordpressConfig', JSON.stringify(config))
    toast({
      title: "Configuration Saved",
      description: "WordPress integration settings saved successfully"
    })
  }

  const createWebhookEndpoint = async () => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please test and establish connection first",
        variant: "destructive"
      })
      return
    }

    // Send WordPress webhook configuration to our CRM
    try {
      const webhookUrl = `${config.siteUrl.replace(/\/$/, '')}/wp-json/crm/v1/webhook`
      
      const response = await fetch('https://llkgrbmxpzdpqvazpxqv.supabase.co/functions/v1/webhook-handler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhook_url: webhookUrl,
          event_type: 'wordpress_integration_setup',
          data: {
            wordpress_site: config.siteUrl,
            integration_type: 'bidirectional',
            webhook_secret: config.webhookSecret
          }
        })
      })

      if (response.ok) {
        toast({
          title: "Webhook Created",
          description: "WordPress webhook endpoint has been configured"
        })
      }
    } catch (error) {
      toast({
        title: "Webhook Setup Failed",
        description: "Could not configure WordPress webhook",
        variant: "destructive"
      })
    }
  }

  return (
    <Card className="backdrop-blur-md bg-card/80 shadow-glass border-0 animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Globe className="h-5 w-5 text-primary" />
          WordPress Integration
          {isConnected && <Badge className="bg-green-500 ml-2">Connected</Badge>}
        </CardTitle>
        <CardDescription>
          Connect your WordPress site to automatically sync leads from contact forms and create posts for new leads.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="wp-site-url" className="text-foreground font-medium">
              WordPress Site URL *
            </Label>
            <Input 
              id="wp-site-url"
              placeholder="https://yoursite.com"
              value={config.siteUrl}
              onChange={(e) => handleConfigChange('siteUrl', e.target.value)}
              className="backdrop-blur-sm bg-background/80 border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wp-username" className="text-foreground font-medium">
              Username *
            </Label>
            <Input 
              id="wp-username"
              placeholder="WordPress admin username"
              value={config.username}
              onChange={(e) => handleConfigChange('username', e.target.value)}
              className="backdrop-blur-sm bg-background/80 border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wp-app-password" className="text-foreground font-medium">
              Application Password *
            </Label>
            <Input 
              id="wp-app-password"
              type="password"
              placeholder="WordPress application password"
              value={config.applicationPassword}
              onChange={(e) => handleConfigChange('applicationPassword', e.target.value)}
              className="backdrop-blur-sm bg-background/80 border-primary/20"
            />
            <p className="text-xs text-muted-foreground">
              Generate this in WordPress Admin → Users → Profile → Application Passwords
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wp-webhook-secret" className="text-foreground font-medium">
              Webhook Secret (Optional)
            </Label>
            <Input 
              id="wp-webhook-secret"
              placeholder="Secure webhook secret key"
              value={config.webhookSecret}
              onChange={(e) => handleConfigChange('webhookSecret', e.target.value)}
              className="backdrop-blur-sm bg-background/80 border-primary/20"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-glass border border-primary/20">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            Integration Features
          </h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Automatically capture Contact Form 7 submissions as leads</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Sync lead status changes back to WordPress custom fields</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Create WordPress posts for won leads (testimonials/case studies)</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span>Requires WordPress REST API to be enabled</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-glass border border-primary/20">
          <h4 className="font-semibold text-foreground mb-2">WordPress Webhook URL</h4>
          <code className="text-sm bg-muted/50 px-2 py-1 rounded">
            https://llkgrbmxpzdpqvazpxqv.supabase.co/functions/v1/leads-api
          </code>
          <p className="text-sm text-muted-foreground mt-2">
            Add this URL to your WordPress contact forms to send leads directly to CRM
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={testConnection}
            disabled={isTestingConnection}
            variant="outline"
            className="backdrop-blur-sm bg-background/80"
          >
            <Link className="h-4 w-4 mr-2" />
            {isTestingConnection ? 'Testing...' : 'Test Connection'}
          </Button>
          
          <Button 
            onClick={saveConfiguration}
            className="flex-1 shadow-glow bg-gradient-primary"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>

          <Button
            onClick={createWebhookEndpoint}
            disabled={!isConnected}
            variant="outline"
            className="backdrop-blur-sm bg-background/80"
          >
            <Globe className="h-4 w-4 mr-2" />
            Setup Webhook
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
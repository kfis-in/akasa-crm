import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Globe, Key, Save, Link, CheckCircle, AlertCircle, Settings, ShoppingCart, Users, FileText, Zap } from 'lucide-react'

interface WordPressConfig {
  siteUrl: string
  username: string
  applicationPassword: string
  webhookSecret: string
  integrationType: 'one-way' | 'bidirectional' | 'webhook-only'
  formPlugins: string[]
  syncOptions: {
    createPosts: boolean
    updateUsers: boolean
    syncComments: boolean
    wooCommerceSync: boolean
    membershipSync: boolean
  }
  customPostTypes: string[]
  webhookEvents: string[]
}

export function WordPressIntegration() {
  const { toast } = useToast()
  const [config, setConfig] = useState<WordPressConfig>({
    siteUrl: '',
    username: '',
    applicationPassword: '',
    webhookSecret: '',
    integrationType: 'bidirectional',
    formPlugins: ['contact-form-7'],
    syncOptions: {
      createPosts: true,
      updateUsers: true,
      syncComments: false,
      wooCommerceSync: false,
      membershipSync: false
    },
    customPostTypes: ['testimonial'],
    webhookEvents: ['form_submission', 'user_registration', 'post_published']
  })
  const [isConnected, setIsConnected] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)

  const handleConfigChange = (field: keyof WordPressConfig, value: string | string[] | boolean | object) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  const handleSyncOptionChange = (option: keyof WordPressConfig['syncOptions'], checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      syncOptions: { ...prev.syncOptions, [option]: checked }
    }))
  }

  const formPluginOptions = [
    { id: 'contact-form-7', name: 'Contact Form 7', description: 'Most popular WordPress contact form plugin' },
    { id: 'gravity-forms', name: 'Gravity Forms', description: 'Advanced form builder with conditional logic' },
    { id: 'wpforms', name: 'WPForms', description: 'Drag & drop WordPress form builder' },
    { id: 'ninja-forms', name: 'Ninja Forms', description: 'User-friendly drag-and-drop form builder' },
    { id: 'formidable-forms', name: 'Formidable Forms', description: 'Advanced forms with calculations and views' },
    { id: 'elementor-forms', name: 'Elementor Pro Forms', description: 'Forms created with Elementor page builder' },
    { id: 'caldera-forms', name: 'Caldera Forms', description: 'Responsive drag & drop form builder' }
  ]

  const integrationTypes = [
    { id: 'one-way', name: 'One-way (WP → CRM)', description: 'WordPress sends data to CRM only' },
    { id: 'bidirectional', name: 'Bidirectional Sync', description: 'Two-way sync between WordPress and CRM' },
    { id: 'webhook-only', name: 'Webhook Only', description: 'Webhook notifications without direct sync' }
  ]

  const webhookEventOptions = [
    { id: 'form_submission', name: 'Form Submissions', description: 'New contact form submissions' },
    { id: 'user_registration', name: 'User Registration', description: 'New user account registrations' },
    { id: 'post_published', name: 'Post Published', description: 'New posts or pages published' },
    { id: 'comment_posted', name: 'Comment Posted', description: 'New comments on posts' },
    { id: 'woocommerce_order', name: 'WooCommerce Orders', description: 'New WooCommerce orders' },
    { id: 'membership_signup', name: 'Membership Signup', description: 'New membership registrations' },
    { id: 'event_registration', name: 'Event Registration', description: 'Event booking registrations' }
  ]

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
          Connect your WordPress site with multiple form plugins, sync types, and webhook integrations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="connection" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="forms">Form Plugins</TabsTrigger>
            <TabsTrigger value="sync">Sync Options</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-4">
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
                <Label htmlFor="integration-type" className="text-foreground font-medium">
                  Integration Type
                </Label>
                <Select value={config.integrationType} onValueChange={(value) => handleConfigChange('integrationType', value as any)}>
                  <SelectTrigger className="backdrop-blur-sm bg-background/80 border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {integrationTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wp-webhook-secret" className="text-foreground font-medium">
                  Webhook Secret (Recommended)
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
          </TabsContent>

          <TabsContent value="forms" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-foreground font-medium mb-3 block">
                  Select Form Plugins to Integrate
                </Label>
                <div className="grid gap-3">
                  {formPluginOptions.map((plugin) => (
                    <div key={plugin.id} className="flex items-start space-x-3 p-3 rounded-lg border border-primary/20">
                      <Checkbox
                        id={plugin.id}
                        checked={config.formPlugins.includes(plugin.id)}
                        onCheckedChange={(checked) => {
                          const updatedPlugins = checked
                            ? [...config.formPlugins, plugin.id]
                            : config.formPlugins.filter(p => p !== plugin.id)
                          handleConfigChange('formPlugins', updatedPlugins)
                        }}
                      />
                      <div className="flex-1">
                        <Label htmlFor={plugin.id} className="font-medium cursor-pointer">
                          {plugin.name}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">{plugin.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sync" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-foreground font-medium mb-3 block">
                  Synchronization Options
                </Label>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-primary" />
                      <div>
                        <Label className="font-medium">Create Success Story Posts</Label>
                        <p className="text-xs text-muted-foreground">Automatically create blog posts for won leads</p>
                      </div>
                    </div>
                    <Checkbox
                      checked={config.syncOptions.createPosts}
                      onCheckedChange={(checked) => handleSyncOptionChange('createPosts', checked as boolean)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-primary" />
                      <div>
                        <Label className="font-medium">Update WordPress Users</Label>
                        <p className="text-xs text-muted-foreground">Sync lead data to WordPress user profiles</p>
                      </div>
                    </div>
                    <Checkbox
                      checked={config.syncOptions.updateUsers}
                      onCheckedChange={(checked) => handleSyncOptionChange('updateUsers', checked as boolean)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-4 w-4 text-primary" />
                      <div>
                        <Label className="font-medium">WooCommerce Integration</Label>
                        <p className="text-xs text-muted-foreground">Sync WooCommerce customers and orders</p>
                      </div>
                    </div>
                    <Checkbox
                      checked={config.syncOptions.wooCommerceSync}
                      onCheckedChange={(checked) => handleSyncOptionChange('wooCommerceSync', checked as boolean)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3">
                      <Key className="h-4 w-4 text-primary" />
                      <div>
                        <Label className="font-medium">Membership Sync</Label>
                        <p className="text-xs text-muted-foreground">Integrate with membership plugins</p>
                      </div>
                    </div>
                    <Checkbox
                      checked={config.syncOptions.membershipSync}
                      onCheckedChange={(checked) => handleSyncOptionChange('membershipSync', checked as boolean)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-foreground font-medium mb-3 block">
                  Webhook Event Types
                </Label>
                <div className="grid gap-3">
                  {webhookEventOptions.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg border border-primary/20">
                      <Checkbox
                        id={event.id}
                        checked={config.webhookEvents.includes(event.id)}
                        onCheckedChange={(checked) => {
                          const updatedEvents = checked
                            ? [...config.webhookEvents, event.id]
                            : config.webhookEvents.filter(e => e !== event.id)
                          handleConfigChange('webhookEvents', updatedEvents)
                        }}
                      />
                      <div className="flex-1">
                        <Label htmlFor={event.id} className="font-medium cursor-pointer">
                          {event.name}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-xl bg-gradient-glass border border-primary/20">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Active Integration Features
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              {config.formPlugins.length > 0 && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{config.formPlugins.length} form plugin(s) connected</span>
                </div>
              )}
              {config.syncOptions.createPosts && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Success story posts enabled</span>
                </div>
              )}
              {config.syncOptions.wooCommerceSync && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>WooCommerce integration active</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{config.integrationType} sync mode</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-glass border border-primary/20">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              Requirements
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span>WordPress REST API enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span>Application passwords configured</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span>Selected form plugins installed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-glass border border-primary/20">
            <h4 className="font-semibold text-foreground mb-2">CRM Webhook Endpoint</h4>
            <code className="text-sm bg-muted/50 px-2 py-1 rounded block">
              https://llkgrbmxpzdpqvazpxqv.supabase.co/functions/v1/leads-api
            </code>
            <p className="text-sm text-muted-foreground mt-2">
              Add this URL to your WordPress forms to send leads directly to CRM
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-glass border border-primary/20">
            <h4 className="font-semibold text-foreground mb-2">WordPress Plugin Code</h4>
            <div className="bg-muted/20 p-3 rounded text-xs font-mono">
              <div className="text-muted-foreground mb-2">// Add to your theme's functions.php:</div>
              <pre className="whitespace-pre-wrap text-foreground">
{`add_action('wpcf7_mail_sent', 'send_to_crm');
function send_to_crm($contact_form) {
    $submission = WPCF7_Submission::get_instance();
    $data = $submission->get_posted_data();
    
    wp_remote_post('${config.siteUrl}/wp-json/crm/v1/webhook', [
        'body' => json_encode([
            'name' => $data['your-name'],
            'email' => $data['your-email'], 
            'phone' => $data['your-phone'],
            'source' => 'contact-form-7'
        ]),
        'headers' => ['Content-Type' => 'application/json']
    ]);
}`}
              </pre>
            </div>
          </div>
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
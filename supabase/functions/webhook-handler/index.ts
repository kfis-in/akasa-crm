import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Authorization header required' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user from JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid or expired token' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const method = req.method;

    console.log(`Webhook Request: ${method} ${url.pathname} for user ${user.id}`);

    if (method === 'POST') {
      const body = await req.json();
      const { webhook_url, data, event_type = 'lead_created' } = body;

      if (!webhook_url) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'webhook_url is required' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Prepare webhook payload
      const webhookPayload = {
        event: event_type,
        timestamp: new Date().toISOString(),
        data: data,
        source: 'CRM System',
        user_id: user.id
      };

      console.log('Sending webhook to:', webhook_url);
      console.log('Payload:', webhookPayload);

      // Send webhook with background task
      try {
        const response = await fetch(webhook_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'CRM-Webhook/1.0'
          },
          body: JSON.stringify(webhookPayload),
        });

        console.log(`Webhook response: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          console.error(`Webhook failed: ${response.status} ${response.statusText}`);
        }

        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Webhook delivered successfully',
          event_type,
          timestamp: new Date().toISOString(),
          status: response.status
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (webhookError) {
        console.error('Webhook delivery failed:', webhookError);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Failed to deliver webhook',
          details: webhookError.message
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Handle webhook test endpoint
    if (method === 'GET' && url.pathname.includes('/test')) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Webhook endpoint is working',
        timestamp: new Date().toISOString(),
        server: 'Supabase Edge Function',
        user: user.email
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: false, 
      error: `Method ${method} not supported` 
    }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook Error:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
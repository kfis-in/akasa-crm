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
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const url = new URL(req.url);
    const method = req.method;

    console.log(`Webhook Request: ${method} ${url.pathname}`);

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
        source: 'CRM System'
      };

      console.log('Sending webhook to:', webhook_url);
      console.log('Payload:', webhookPayload);

      // Send webhook with background task
      EdgeRuntime.waitUntil(
        (async () => {
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
            
            // Log webhook attempt (you could store this in a table if needed)
            if (!response.ok) {
              console.error(`Webhook failed: ${response.status} ${response.statusText}`);
            }
          } catch (error) {
            console.error('Webhook delivery failed:', error);
          }
        })()
      );

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Webhook queued for delivery',
        event_type,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle webhook test endpoint
    if (method === 'GET' && url.pathname.includes('/test')) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Webhook endpoint is working',
        timestamp: new Date().toISOString(),
        server: 'Supabase Edge Function'
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
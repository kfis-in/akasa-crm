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

    console.log(`API Request: ${method} ${url.pathname}`);

    switch (method) {
      case 'GET': {
        // Get all leads or specific lead
        const leadId = url.searchParams.get('id');
        
        if (leadId) {
          const { data, error } = await supabase
            .from('leads')
            .select('*')
            .eq('id', leadId)
            .single();

          if (error) throw error;

          return new Response(JSON.stringify({ success: true, data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;

          return new Response(JSON.stringify({ success: true, data, count: data.length }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      case 'POST': {
        // Create new lead
        const body = await req.json();
        const { name, email, phone, status = 'New', assigned_to = 'Unassigned' } = body;

        if (!name || !email || !phone) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Missing required fields: name, email, phone' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data, error } = await supabase
          .from('leads')
          .insert([{ name, email, phone, status, assigned_to }])
          .select()
          .single();

        if (error) throw error;

        console.log('Lead created:', data);

        return new Response(JSON.stringify({ success: true, data }), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'PUT': {
        // Update lead
        const leadId = url.searchParams.get('id');
        if (!leadId) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Lead ID is required' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const body = await req.json();
        const { data, error } = await supabase
          .from('leads')
          .update(body)
          .eq('id', leadId)
          .select()
          .single();

        if (error) throw error;

        console.log('Lead updated:', data);

        return new Response(JSON.stringify({ success: true, data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'DELETE': {
        // Delete lead
        const leadId = url.searchParams.get('id');
        if (!leadId) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Lead ID is required' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error } = await supabase
          .from('leads')
          .delete()
          .eq('id', leadId);

        if (error) throw error;

        console.log('Lead deleted:', leadId);

        return new Response(JSON.stringify({ success: true, message: 'Lead deleted successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ 
          success: false, 
          error: `Method ${method} not allowed` 
        }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

  } catch (error) {
    console.error('API Error:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
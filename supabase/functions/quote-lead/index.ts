import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
function deriveChannel(input) {
  const gclid = (input.gclid || "").trim();
  const utmSource = (input.utm_source || "").trim().toLowerCase();
  const utmMedium = (input.utm_medium || "").trim().toLowerCase();
  const referrer = (input.referrer || "").trim().toLowerCase();
  if (gclid) return "Google Ads";
  if (utmSource.includes("google") && utmMedium === "cpc") return "Google Ads";
  if (utmSource) return utmSource.charAt(0).toUpperCase() + utmSource.slice(1);
  if (referrer.includes("google")) return "Google Organic";
  if (referrer.includes("bing")) return "Bing Organic";
  if (referrer) return "Referral";
  return "Direct";
}
Deno.serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const input = await req.json();
    if (!input.email || !input.email.trim()) {
      return new Response(JSON.stringify({
        error: "Email required"
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
    // Insert lead
    const lead = {
      email: input.email,
      first_name: input.first_name || null,
      last_name: input.last_name || null,
      company: input.company || null,
      phone: input.phone || null,
      country: input.country || null,
      city: input.city || null,
      postcode: input.postcode || null,
      form_id: input.form_id || null,
      source_channel: deriveChannel(input),
      gclid: input.gclid || null,
      utm_source: input.utm_source || null,
      utm_medium: input.utm_medium || null,
      utm_campaign: input.utm_campaign || null,
      landing_page: input.landing_page || null,
      page_path: input.page_path || null,
      referrer: input.referrer || null,
      quote_session_id: input.quote_session_id || null,
      submitted_at: input.timestamp || new Date().toISOString(),
      website: input.website || null
    };
    const { data: leadData, error: leadError } = await supabase.from("leads").insert(lead).select("id").single();
    if (leadError) {
      return new Response(JSON.stringify({
        error: leadError.message
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    // Insert products if any
    const products = Array.isArray(input.products) ? input.products : [];
    if (products.length > 0 && leadData?.id) {
      const rows = products.map((p)=>({
          lead_id: leadData.id,
          product_name: p.product_name || null,
          sku: p.sku || null,
          variant: p.variant || null,
          quantity: p.quantity || 1,
          price: p.price || null
        }));
      const { error: prodError } = await supabase.from("products").insert(rows);
      if (prodError) {
        console.error("Products insert error:", prodError.message);
      }
    }
    return new Response(JSON.stringify({
      status: "ok",
      lead_id: leadData.id
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error"
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});

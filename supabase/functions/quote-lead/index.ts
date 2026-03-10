const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

// Deprecated: Supabase lead insertion now handled exclusively by n8n webhook
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  return new Response(
    JSON.stringify({ status: "deprecated", message: "Use n8n webhook" }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});

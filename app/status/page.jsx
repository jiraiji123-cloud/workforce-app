// Configuration Variables (Same credentials)
const SUPABASE_URL = "https://kwpzufzapwkiznazepgi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3cHp1ZnphcHdraXpuYXplcGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTQ0MDAsImV4cCI6MjA5NjE3MDQwMH0._nzF-YNNbbN9MLvx8t_vghy3gDMwnAu6j2j5oCS4tT8";

export default async function StatusPage() {
  // Fetch workforce details from the employees table
  const response = await fetch(`${SUPABASE_URL}/rest/v1/employees?select=*`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
    cache: 'no-store'
  });
  
  const workforce = await response.json() || [];
  
  // Calculate a quick summary statistic (Total headcount)
  const totalEmployees = Array.isArray(workforce) ? workforce.length : 0;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>📊 Company Dashboard Status</h1>
      <p style={{ color: '#666' }}>This is a separate, branched sub-page running at <code>/status</code></p>
      
      <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />

      <div style={{ background: '#f0f7ff', padding: '20px', borderRadius: '8px', border: '1px solid #cce3ff', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#004494' }}>System Metrics</h2>
        <p style={{ fontSize: '18px', margin: '0' }}>
          Total Active Workforce Count: <strong>{totalEmployees}</strong>
        </p>
      </div>

      <a href="/" style={{ inlineBlock: 'true', color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' }}>
        ← Return to Main Entry System
      </a>
    </div>
  );
}

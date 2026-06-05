import { revalidatePath } from 'next/cache';

const SUPABASE_URL = "https://kwpzufzapwkiznazepgi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3cHp1ZnphcHdraXpuYXplcGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTQ0MDAsImV4cCI6MjA5NjE3MDQwMH0._nzF-YNNbbN9MLvx8t_vghy3gDMwnAu6j2j5oCS4tT8";

// Backend Action: Runs on the server when the form is submitted
async function handleAddEmployee(formData) {
  'use server';
  
  const empName = formData.get('employeeName');
  const empRole = formData.get('employeeRole');
  const empEmail = formData.get('employeeEmail');

  if (!empName || !empRole || !empEmail) return;

  // Post new record payload to Supabase REST API
  await fetch(`${SUPABASE_URL}/rest/v1/employees`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: empName,
      role: empRole,
      email: empEmail
    }),
  });

  // Dynamically refresh the homepage data cache
  revalidatePath('/');
}

// Frontend Renderer: Loads data and builds the HTML layout
export default async function Home() {
  // Fetch current database records on page load
  const response = await fetch(`${SUPABASE_URL}/rest/v1/employees?select=*`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
    cache: 'no-store'
  });
  
  const workforce = await response.json() || [];

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Workforce Entry System</h1>
      
      {/* Entry Form */}
      <form action={handleAddEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px', background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
        <h3>Add New Employee Details</h3>
        
        <label>Full Name:</label>
        <input type="text" name="employeeName" placeholder="John Doe" required style={{ padding: '8px' }} />
        
        <label>Designation / Role:</label>
        <input type="text" name="employeeRole" placeholder="Software Engineer" required style={{ padding: '8px' }} />
        
        <label>Email Address:</label>
        <input type="email" name="employeeEmail" placeholder="john@company.com" required style={{ padding: '8px' }} />
        
        <button type="submit" style={{ padding: '10px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Save Employee Record
        </button>
      </form>

      {/* Directory Table */}
      <h3>Current Employee Directory</h3>
      {(!Array.isArray(workforce)) ? (
        <pre style={{ background: '#fee', color: 'red', padding: '15px' }}>{JSON.stringify(workforce, null, 2)}</pre>
      ) : workforce.length === 0 ? (
        <p style={{ color: '#666' }}>No records found in the database system.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ background: '#eee', textAlign: 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Role</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {workforce.map((emp) => (
              <tr key={emp.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{emp.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{emp.role}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{emp.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

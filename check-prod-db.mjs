import postgres from 'postgres';

const sql = postgres("postgresql://supabase_admin:ejkjgx3e38u59cydlzilh07o9d9ulxnpt9aupri3gl29zvw3wtn09npu3gsj4jmt@trolley.proxy.rlwy.net:11915/postgres");

async function check() {
  console.log("Checking production database...\n");
  
  // Check announcements for this experience
  const announcements = await sql`
    SELECT id, title, status, experience_id, created_at 
    FROM announcements 
    WHERE experience_id = 'exp_mxsm0hjfmbapwd'
    ORDER BY created_at DESC
    LIMIT 5
  `;
  console.log(`Announcements for exp_mxsm0hjfmbapwd: ${announcements.length}`);
  announcements.forEach(a => console.log(`  - ${a.title} (${a.status})`));
  
  // Check all experience IDs with announcements
  const experiences = await sql`
    SELECT experience_id, COUNT(*) as count 
    FROM announcements 
    GROUP BY experience_id 
    ORDER BY count DESC
    LIMIT 10
  `;
  console.log("\nExperiences with announcements:");
  experiences.forEach(e => console.log(`  - ${e.experience_id}: ${e.count} announcements`));
  
  await sql.end();
}

check().catch(console.error);

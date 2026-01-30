import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminUserId = process.env.ADMIN_USER_ID

if (!url || !serviceKey) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
if (!adminUserId) throw new Error('Missing ADMIN_USER_ID')

const supabase = createClient(url, serviceKey)

async function main() {
  const templates = [
    {
      owner_id: adminUserId,
      channel: 'sms',
      title: 'Quick intro (SMS)',
      body: "Hi {{first_name}}, this is {{agent_name}}. Saw you requested info—what coverage are you shopping for today?",
    },
    {
      owner_id: adminUserId,
      channel: 'email',
      title: 'Intro + next steps (Email)',
      body: "Subject: Quick question about your coverage\n\nHi {{first_name}},\n\nThanks for reaching out. What type of coverage are you looking for (auto/home/life/health)?\n\nIf it's easier, reply with your best call time today.\n\n— {{agent_name}}",
    },
  ]

  const { error: tplErr } = await supabase.from('templates').insert(templates)
  if (tplErr) throw tplErr

  const { error: leadErr } = await supabase.from('leads').insert([
    {
      owner_id: adminUserId,
      first_name: 'Jamie',
      last_name: 'Sample',
      email: 'jamie@example.com',
      phone: '555-555-5555',
      status: 'New',
      next_follow_up_date: new Date().toISOString().slice(0, 10),
      notes: 'Imported sample lead',
    },
  ])
  if (leadErr) throw leadErr

  console.log('Seed complete')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

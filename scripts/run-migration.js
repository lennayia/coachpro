import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read Supabase credentials from environment
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Read migration file
const migrationPath = join(__dirname, '../supabase/migrations/add_coach_profile_fields.sql');
const sql = readFileSync(migrationPath, 'utf8');

// Execute migration
console.log('Running migration: add_coach_profile_fields.sql');

// Split by semicolons and execute each statement
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s && !s.startsWith('--'));

async function runMigration() {
  for (const statement of statements) {
    if (!statement) continue;

    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement });

      if (error) {
        console.error('Error executing statement:', statement.substring(0, 100));
        console.error(error);
      } else {
        console.log('✓ Executed:', statement.substring(0, 60) + '...');
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  }

  console.log('Migration complete!');
}

runMigration();

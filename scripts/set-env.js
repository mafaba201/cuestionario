const fs = require('fs');
const path = require('path');

const mode = process.argv[2] || 'development';

function updateEnvFile(fileName) {
  const envFile = path.join(__dirname, '..', 'src', 'environments', fileName);

  if (!fs.existsSync(envFile)) {
    console.error(`ERROR: Archivo ${fileName} no encontrado`);
    process.exit(1);
  }

  let content = fs.readFileSync(envFile, 'utf8');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(`ERROR: Variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY no definidas`);
    console.error(`Ejemplo:`);
    console.error(`  $env:SUPABASE_URL="https://tu-proyecto.supabase.co"`);
    console.error(`  $env:SUPABASE_ANON_KEY="tu-key"`);
    console.error(`  npm start`);
    process.exit(1);
  }

  content = content.replace(/supabaseUrl:\s*'[^']*'/, `supabaseUrl: '${supabaseUrl}'`);
  content = content.replace(/supabaseAnonKey:\s*'[^']*'/, `supabaseAnonKey: '${supabaseAnonKey}'`);

  fs.writeFileSync(envFile, content);
  console.log(`Actualizado ${fileName} - Modo: ${mode}`);
}

updateEnvFile('environment.ts');

console.log(`set-env.js completado`);
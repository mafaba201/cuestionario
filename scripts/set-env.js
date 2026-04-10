const fs = require('fs');
const path = require('path');

const defaultUrl = '';
const defaultKey = '';

function updateEnvFile(fileName) {
  const envFile = path.join(__dirname, '..', 'src', 'environments', fileName);

  if (!fs.existsSync(envFile)) {
    console.log(`Archivo ${fileName} no encontrado, omitiendo`);
    return;
  }

  let content = fs.readFileSync(envFile, 'utf8');

  const supabaseUrl = process.env.SUPABASE_URL || process.env['SUPABASE_URL'];
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env['SUPABASE_ANON_KEY'];

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log(`AVISO: Variables de entorno no encontradas. Usando valores por defecto para ${fileName}`);
    content = content.replace(/__SUPABASE_URL__/g, defaultUrl);
    content = content.replace(/__SUPABASE_ANON_KEY__/g, defaultKey);
  } else {
    content = content.replace(/__SUPABASE_URL__/g, supabaseUrl);
    content = content.replace(/__SUPABASE_ANON_KEY__/g, supabaseAnonKey);
  }

  fs.writeFileSync(envFile, content);
  console.log(`Variables aplicadas en ${fileName}`);
}

updateEnvFile('environment.ts');
updateEnvFile('environment.prod.ts');

console.log('Build environment listo');
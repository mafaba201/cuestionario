import "@supabase/functions-js/edge-runtime.d.ts"

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface Contacto {
  nombre: string
  apellidos: string
  email: string
}

Deno.serve(async (req) => {
  console.log('Request recibido:', req.method)
  console.log('Content-Type:', req.headers.get('content-type'))
  console.log('Headers completos:', Object.fromEntries(req.headers.entries()))
  
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
      }
    })
  }

  const contentType = req.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    return new Response(
        JSON.stringify({ error: 'Content-Type inválido' }),
        { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    )
  }
  
  try {
    const contacto: Contacto = await req.json()
    console.log('Datos recibidos:', contacto)

    if (!contacto.email || !contacto.nombre) {
    return new Response(
      JSON.stringify({ error: 'Faltan datos requeridos' }),
      { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    )
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    console.log('RESEND_API_KEY configurada:', !!resendApiKey)
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY no configurada en secrets')
      return new Response(
        JSON.stringify({ error: 'Error de configuración: RESEND_API_KEY no encontrada' }),
        { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      )
    }

    const nombreCompleto = `${contacto.nombre} ${contacto.apellidos}`
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">¡Gracias por contactarnos!</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9; border-radius: 10px; margin-top: 20px;">
          <p style="font-size: 18px;">Hola <strong>${nombreCompleto}</strong>,</p>
          
          <p>Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <p style="margin: 0;"><strong>Detalles de tu contacto:</strong></p>
            <p style="margin: 5px 0 0 0;">Nombre: ${nombreCompleto}</p>
            <p style="margin: 5px 0 0 0;">Email: ${contacto.email}</p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
          <p>Este es un correo automático de confirmación. Por favor, no respondas a este mensaje.</p>
        </div>
      </body>
      </html>
    `

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'contacto@bostonanddrucker.com',
        to: contacto.email,
        subject: 'Confirmación de contacto',
        html: emailHtml
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Error de Resend - Status:', response.status)
      console.error('Error de Resend - Body:', errorData)
      return new Response(
        JSON.stringify({ error: 'Error al enviar email', details: errorData }),
        { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      )
    }

    const result = await response.json()
    console.log('Email enviado exitosamente:', result)

    return new Response(
      JSON.stringify({ success: true, message: 'Email de confirmación enviado' }),
      { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    )
  }
})
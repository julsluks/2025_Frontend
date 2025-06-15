const http = require('http');
const url = require('url');
const nodemailer = require('nodemailer');

// Simulated in-memory store
let emailMap = {};

// -----------------------------------------------------------------------------
// CORS Headers - Para permitir peticiones desde el frontend
// -----------------------------------------------------------------------------
function addCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// -----------------------------------------------------------------------------
// sendResponse
// -----------------------------------------------------------------------------
function sendResponse(res, statusCode, data, contentType = 'application/json') {
    // Añadir cabeceras CORS
    addCorsHeaders(res);
    res.writeHead(statusCode, { 'Content-Type': contentType });
    res.end(JSON.stringify(data));
}

// -----------------------------------------------------------------------------
// handleOptions - Para manejar peticiones OPTIONS (preflight)
// -----------------------------------------------------------------------------
function handleOptions(res) {
    addCorsHeaders(res);
    res.writeHead(204);
    res.end();
}

// -----------------------------------------------------------------------------
// Email configuration - Para enviar correos reales
// -----------------------------------------------------------------------------
// Configura el transporte de correo electrónico
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'tu-correo@gmail.com',
        pass: process.env.EMAIL_PASS || 'tu-contraseña-app'
    }
});

// -----------------------------------------------------------------------------
// sendVerificationEmail - Envía el correo con el código
// -----------------------------------------------------------------------------
async function sendVerificationEmail(email, code) {
    try {
        // Configura el contenido del correo
        const mailOptions = {
            from: `"Servicio de Verificación" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Tu código de verificación',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px;">
                    <h2 style="color: #4a6cf7;">Código de Verificación</h2>
                    <p>Gracias por registrarte. Utiliza el siguiente código para verificar tu cuenta:</p>
                    <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 4px;">
                        ${code}
                    </div>
                    <p>Este código expirará en 5 minutos.</p>
                    <p>Si no solicitaste este código, puedes ignorar este correo electrónico.</p>
                </div>
            `
        };

        // Envía el correo
        const info = await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a ${email}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return false;
    }
}

// -----------------------------------------------------------------------------
// handleSendEmail
// -----------------------------------------------------------------------------
async function handleSendEmail(req, res, query) {
    const email = query.email;
    if (!email || !email.includes('@')) { // toy check
        return sendResponse(res, 400, { error: 'Invalid email address' });
    }

    // Simple cooldown logic (30 seconds)
    const now = Date.now();
    const lastSent = emailMap[email]?.sentAt || 0;
    if ((now - lastSent) < 30 * 1000) {
        return sendResponse(res, 429, { error: 'Please wait 30 seconds before resending' });
    }

    // generate a 6-digit code & cleanup after 5 min
    const code = Math.floor(Math.random() * (1e6 - 1)).toString().padStart(6, '0');
    emailMap[email] = { code: code.toString(), sentAt: now };
    setTimeout(() => {
        console.log(`Removing code after 5 min: email=${email}`);
        delete emailMap[email]
    }, 5 * 60 * 1000);

    console.log(`Code for email=${email}: ${code}`);
    
    // Intenta enviar el correo
    try {
        await sendVerificationEmail(email, code);
        sendResponse(res, 200, {});
    } catch (error) {
        console.error("Error sending email:", error);
        
        // Respondemos con éxito de todas formas para que el flujo continúe
        // En un entorno de producción, podrías querer devolver un error
        sendResponse(res, 200, {});
    }
}

// -----------------------------------------------------------------------------
// handleValidateEmailCode
// -----------------------------------------------------------------------------
function handleValidateEmailCode(req, res, body) {
    try {
        const { email, code } = body;
        if (!email || !code) {
            return sendResponse(res, 400, { error: 'Email and code are required' });
        }
        console.log(emailMap)
        const isValid = (emailMap[email]?.code?.toString() || null) === code.toString();

        console.log(`Validating Code: code=${code}, email=${email}: ${isValid ? 'valid' : 'invalid'}`);
        if (!isValid) {
            return sendResponse(res, 400, { error: 'Invalid code or email' });
        }

        delete emailMap[email];
        return sendResponse(res, 200, {
            user_id: Math.ceil(1e5 + Math.random() * 1e8)
        });
    } catch (error) {
        return sendResponse(res, 400, { error: 'Invalid parameters' });
    }
}

// -----------------------------------------------------------------------------
// handleGetProducts
// -----------------------------------------------------------------------------
function handleGetProducts(req, res) {
    console.log(`Sending products`)
    sendResponse(res, 200, {
        monthly: {
            price: "9.99",
            currency: "USD",
            trial_days: 3
        },
        year: {
            price: "87.99",
            currency: "USD",
            trial_days: 7
        }
    });
}

// -----------------------------------------------------------------------------
// handleStartTrial
// -----------------------------------------------------------------------------
function handleStartTrial(req, res, body) {
    if (!body.user_id) {
        return sendResponse(res, 400, { error: 'User ID is required' });
    }

    console.log(`User user_id=${body.user_id} started trial!`)
    return sendResponse(res, 200, {});
}


// -----------------------------------------------------------------------------
// API_HANDLERS
// NOTE: this is public so we can show the API as soon as the server starts
// -----------------------------------------------------------------------------
const API_HANDLERS = {
    '/api/send-email': handleSendEmail,
    '/api/validate-email': handleValidateEmailCode,
    '/api/products': handleGetProducts,
    '/api/start-trial': handleStartTrial
}

// -----------------------------------------------------------------------------
// handleRequest
// -----------------------------------------------------------------------------
function handleRequest(req, res, path, data) {
    return (API_HANDLERS[path]
        ? API_HANDLERS[path](req, res, data)
        : sendResponse(res, 404, { error: 'Not found' })
    );
}

// -----------------------------------------------------------------------------
// handlePostRequest
// -----------------------------------------------------------------------------
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;
    
    // Manejar peticiones OPTIONS para CORS
    if (method === 'OPTIONS') {
        return handleOptions(res);
    }

    let rawBody = '';
    req.on('data', chunk => {
        rawBody += chunk.toString();
    });

    req.on('end', () => {
        try {
            const body = rawBody ? JSON.parse(rawBody) : {};
            return handleRequest(req, res, path, method === 'GET' ? query : body);
        } catch (error) {
            console.error("Error processing request:", error);
            return sendResponse(res, 400, { error: 'Invalid request body' });
        }
    });
});

const PORT = Number.parseInt(process.env.PORT || 3000);
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Exposed REST APIs:`)
    for (const path of Object.keys(API_HANDLERS)) {
        console.log(`- ${path}`);
    }
});

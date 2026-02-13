const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { type, data } = req.body;

    // Validate required environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
        console.error('Missing environment variables');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    // Configure Transporter for handling any SMTP service
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Construct Email Content based on form type
    let subject = 'Nuevo Mensaje desde Web SelectDriver';
    let htmlContent = '<h1>Nuevo Mensaje</h1>';

    if (type === 'companies') {
        subject = `[EMPRESA] Solicitud de: ${data.companyName}`;
        htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #1E40AF;">Nueva Solicitud de Empresa</h2>
                <hr>
                <p><strong>Empresa:</strong> ${data.companyName}</p>
                <p><strong>Contacto:</strong> ${data.contactName}</p>
                <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                <p><strong>Teléfono:</strong> ${data.phone}</p>
                <p><strong>Necesidad:</strong> ${data.need}</p>
                <p><strong>Mensaje:</strong></p>
                <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #F97316;">
                    ${data.message}
                </blockquote>
            </div>
        `;
    } else if (type === 'drivers') {
        subject = `[CONDUCTOR] Evaluación de: ${data.fullName}`;
        htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #F97316;">Nueva Evaluación de Conductor</h2>
                <hr>
                <p><strong>Nombre:</strong> ${data.fullName}</p>
                <p><strong>País:</strong> ${data.country}</p>
                <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                <p><strong>Teléfono:</strong> ${data.phone}</p>
                <p><strong>Experiencia:</strong> ${data.experience}</p>
                <p><strong>Resumen:</strong></p>
                <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #1E40AF;">
                    ${data.summary}
                </blockquote>
            </div>
        `;
    } else if (type === 'contact') {
        subject = `[CONTACTO] Mensaje de: ${data.fullName}`;
        htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #333;">Consulta General</h2>
                <hr>
                <p><strong>Nombre:</strong> ${data.fullName}</p>
                <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                <p><strong>Asunto:</strong> ${data.subject}</p>
                <p><strong>Mensaje:</strong></p>
                <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #666;">
                    ${data.message}
                </blockquote>
            </div>
        `;
    }

    try {
        await transporter.sendMail({
            from: `"SelectDriver Web" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            subject: subject,
            html: htmlContent
        });

        res.status(200).json({ success: true, message: 'Email enviado correctamente' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error al enviar el email' });
    }
};

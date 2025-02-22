/**
 * @function generateHtmlTemplate
 * This function generates an HTML email template with the provided message.
 *
 * Author: Ricardo Medina
 * Date: 20 de febrero de 2025
 *
 * @param {string} message - The message to be included in the email template.
 * @returns {string} - The generated HTML email template.
 */

const generateHtmlTemplate = (message: string, title: string): string => {

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Newsletter de Nuestra Empresa</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #e1decf; padding: 0 15px;">
                <tr>
                    <td align="center" style="padding: 2px 0;">
                        <img src="https://www.logo.wine/a/logo/Software_AG/Software_AG-Logo.wine.svg" alt="Logo de la Empresa" style="max-width: 200px; height: auto;">
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 20px; text-align: center;">
                        <img src="https://media.licdn.com/dms/image/v2/D5603AQH46rOgHD4V5w/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1691774414734?e=1745452800&v=beta&t=ongugcDh1ZtH7nK6A_T7mJfvVgcuj6luFv_Zp3vCajE" alt="Imagen Principal" style="width: 20%; max-width: 600px; height: auto; border-radius: 8px;">
                    </td>
                </tr>
                <tr>
                    <td style="padding: 30px 20px; background-color: #6a6b36; border-radius: 8px;">
                        <h1 style="color: #e1decf; margin-top: 0; font-size: 24px;">${title}</h1>
                        <p style="color: #fdcf08; line-height: 1.6; font-size: 16px;">
                            ${message}
                        </p>
                        <!--NOTE: el link debera ser el de mi pagina-->
                        <a href="#" style="display: inline-block; padding: 12px 24px; background-color: #52769a; color: #fbf8ea; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">Read More</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 30px 20px; text-align: center; border-top: 1px solid #eeeeee;">
                        <p style="color: #666666; margin-bottom: 15px;">My social networks:</p>
                        <a href="#" style="display: inline-block; margin: 0 5px;"><img src="https://1000marcas.net/wp-content/uploads/2019/11/Instagram-Logo-2016.png" alt="Instagram" style="width: 44px; height: 44px; object-fit: contain;"></a>
                        <a href="#" style="display: inline-block; margin: 0 5px;"><img src="https://seekvectors.com/files/download/linkedin%20round%20icon.png" alt="LinkedIn" style="width: 44px; height: 44px; object-fit: contain;"></a>
                        <p style="color: #999999; font-size: 12px; margin-top: 20px;">
                            © 2024 Richard Dev. All rights reserved.<br>
                            You are receiving this email because you subscribed to our newsletter.
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
}

export { generateHtmlTemplate };
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

const generateHtmlTemplateForBlog = (message: string, title: string, reason: string): string => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5ece5; color: #000000;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="background-color: #f5ece5;">
                <tr>
                    <td align="center">
                        <table width="700" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 0 10px;">
                            <tr>
                                <td align="center" style="padding: 20px 0;">
                                    <img src="https://www.logo.wine/a/logo/Software_AG/Software_AG-Logo.wine.svg" alt="Logo" style="max-width: 150px; height: auto;">
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 20px;">
                                    <h1 style="font-size: 28px; color: #cba17d;">${title}</h1>
                                    <p style="font-size: 16px; line-height: 1.6;">${message}</p>
                                    <a href="#" style="display: inline-block; padding: 12px 24px; background-color: #cba17d; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">Read More on Our Blog</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 20px; background-color: rgb(24, 24, 24); border-radius: 8px;">
                                    <h2 style="font-size: 24px; color: #cba17d;">Recent Posts</h2>
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td width="50%" style="padding: 10px;">
                                                <a href="#" style="text-decoration: none; color: inherit;">
                                                    <img src="https://images.unsplash.com/photo-1739993655680-4b7050ed2896?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Post Title 1" style="width: 100%; border-radius: 8px; object-fit: cover;">
                                                    <h3 style="font-size: 18px; margin: 30px 0; color: #ffffff;">Post Title 1</h3>
                                                </a>
                                            </td>
                                            <td width="50%" style="padding: 10px;">
                                                <a href="#" style="text-decoration: none; color: inherit;">
                                                    <img src="https://images.unsplash.com/photo-1739993655680-4b7050ed2896?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Post Title 2" style="width: 100%; border-radius: 8px; object-fit: cover;">
                                                    <h3 style="font-size: 18px; margin: 30px 0; color: #ffffff;">Post Title 2</h3>
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="50%" style="padding: 10px;">
                                                <a href="#" style="text-decoration: none; color: inherit;">
                                                    <img src="https://images.unsplash.com/photo-1739993655680-4b7050ed2896?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Post Title 3" style="width: 100%; border-radius: 8px; object-fit: cover;">
                                                    <h3 style="font-size: 18px; margin: 30px 0; color: #ffffff;">Post Title 3</h3>
                                                </a>
                                            </td>
                                            <td width="50%" style="padding: 10px;">
                                                <a href="#" style="text-decoration: none; color: inherit;">
                                                    <img src="https://images.unsplash.com/photo-1739993655680-4b7050ed2896?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Post Title 4" style="width: 100%; border-radius: 8px; object-fit: cover;">
                                                    <h3 style="font-size: 18px; margin: 30px 0; color: #ffffff;">Post Title 4</h3>
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                                    <p style="font-size: 14px; color: #666666;">Follow me on:</p>
                                    <div style="text-align: center;">
                                        <a href="#"><img src="https://1000marcas.net/wp-content/uploads/2019/11/Instagram-Logo-2016.png" alt="Instagram" style="width: 44px; height: 44px; margin: 0 5px; object-fit: contain;"></a>
                                        <a href="#"><img src="https://seekvectors.com/files/download/linkedin%20round%20icon.png" alt="LinkedIn" style="width: 44px; height: 44px; margin: 0 5px; object-fit: contain;"></a>
                                        <a href="#"><img src="https://www.logo.wine/a/logo/Software_AG/Software_AG-Logo.wine.svg" alt="Blog" style="width: 44px; height: 44px; margin: 0 5px; object-fit: contain;"></a>
                                    </div>
                                    <p style="font-size: 14px; color: #666666;">© 2024 Richard Dev. All rights reserved.<br>${reason}</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
}

export { generateHtmlTemplate, generateHtmlTemplateForBlog};
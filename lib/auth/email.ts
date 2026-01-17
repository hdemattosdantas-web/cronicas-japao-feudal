import { Theme } from "next-auth"
import { SendVerificationRequestParams } from "next-auth/providers/email"

export async function sendVerificationRequest(params: SendVerificationRequestParams) {
  const { identifier, url, provider, theme } = params
  const { host } = new URL(url)

  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: provider.from,
      to: identifier,
      subject: `🏯 Entre no mundo de Crônicas do Japão Feudal`,
      html: html({ url, host, theme }),
      text: text({ url, host }),
    }),
  })

  if (!result.ok) {
    throw new Error("Failed to send verification email")
  }
}

function html(params: { url: string; host: string; theme: Theme }) {
  const { url, host, theme } = params

  const escapedHost = host.replace(/\./g, "&#8203;.")

  const brandColor = theme.brandColor || "#8b4513"
  const buttonText = theme.buttonText || "#fff"

  const color = {
    background: "#fef7e6",
    text: "#2c1810",
    mainBackground: "#ffffff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText,
  }

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        <strong>🏯 Crônicas do Japão Feudal</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}">
              <a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">
                Entrar no Mundo Feudal
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Se você não solicitou este email, pode ignorá-lo com segurança.
      </td>
    </tr>
  </table>
</body>
`
}

function text({ url, host }: { url: string; host: string }) {
  return `Entre no mundo de Crônicas do Japão Feudal\n\n${url}\n\n`
}
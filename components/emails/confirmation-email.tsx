interface ConfirmationEmailProps {
  contributorName: string
  profileUsername: string
  confirmUrl: string
}

export function ConfirmationEmail({ contributorName, profileUsername, confirmUrl }: ConfirmationEmailProps) {
  return (
    <html>
      <head>
        <style>
          {`
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: 600;
              color: #000;
              margin-bottom: 10px;
            }
            .content {
              background: #f9f9f9;
              border-radius: 8px;
              padding: 30px;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              background: #000;
              color: #fff;
              text-decoration: none;
              padding: 14px 28px;
              border-radius: 6px;
              font-weight: 500;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 14px;
              margin-top: 30px;
            }
            .link {
              color: #0066cc;
              word-break: break-all;
            }
          `}
        </style>
      </head>
      <body>
        <div className="header">
          <div className="logo">Nomee</div>
        </div>

        <div className="content">
          <h2 style={{ marginTop: 0 }}>Hi {contributorName}!</h2>

          <p>Thanks for sharing your perspective about {profileUsername}.</p>

          <p>To confirm and publish your contribution to their Nomee, please click the button below:</p>

          <div style={{ textAlign: "center" }}>
            <a href={confirmUrl} className="button">
              Confirm Your Perspective
            </a>
          </div>

          <p style={{ fontSize: "14px", color: "#666" }}>
            Or copy and paste this link into your browser:
            <br />
            <a href={confirmUrl} className="link">
              {confirmUrl}
            </a>
          </p>

          <p style={{ fontSize: "14px", color: "#666", marginTop: "30px", marginBottom: 0 }}>
            This link will expire in 7 days.
          </p>
        </div>

        <div className="footer">
          <p>
            This email was sent because someone used this email address to submit a perspective on Nomee.
            <br />
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      </body>
    </html>
  )
}

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');
const FROM_EMAIL = 'Williston Investments <noreply@willistonboard.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://willistonboard.com';

const getHtmlTemplate = (title: string, bodyContent: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            background-color: #04091A;
            color: #E2E8F0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #0B132B;
            border: 1px solid rgba(201, 168, 76, 0.15);
            border-radius: 12px;
            overflow: hidden;
            margin-top: 40px;
            margin-bottom: 40px;
          }
          .header {
            background-color: #04091A;
            padding: 30px;
            text-align: center;
            border-bottom: 1px solid rgba(201, 168, 76, 0.15);
          }
          .logo {
            color: #C9A84C;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
            margin: 0;
          }
          .logo-sub {
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: #94A3B8;
            margin-top: 4px;
          }
          .content {
            padding: 40px 30px;
            line-height: 1.6;
          }
          .h1 {
            color: #FFFFFF;
            font-size: 22px;
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .p {
            color: #94A3B8;
            font-size: 14px;
            margin-bottom: 20px;
          }
          .highlight-box {
            background-color: rgba(201, 168, 76, 0.05);
            border: 1px dashed #C9A84C;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .highlight-value {
            color: #C9A84C;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 1px;
          }
          .highlight-label {
            color: #94A3B8;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-top: 6px;
          }
          .button-container {
            text-align: center;
            margin-top: 30px;
          }
          .button {
            background-color: #C9A84C;
            color: #04091A;
            text-decoration: none;
            padding: 12px 30px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 8px;
            display: inline-block;
          }
          .footer {
            background-color: #04091A;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid rgba(201, 168, 76, 0.1);
            font-size: 11px;
            color: #64748B;
          }
          .footer a {
            color: #C9A84C;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">WILLISTON</div>
            <div class="logo-sub">Board of Realtors & Investments</div>
          </div>
          <div class="content">
            ${bodyContent}
          </div>
          <div class="footer">
            &copy; 2026 Williston Board of Realtors & Investments. All rights reserved.<br>
            Secure, asset-backed investments. Visit <a href="https://willistonboard.com">willistonboard.com</a>
          </div>
        </div>
      </body>
    </html>
  `;
};

// 1. Welcome Email
export async function sendWelcomeEmail(name: string, email: string, referralCode: string) {
  const bodyContent = `
    <h1 class="h1">Welcome, ${name}!</h1>
    <p class="p">Thank you for opening an account with Williston Board of Realtors & Investments. We are thrilled to partner with you on your wealth-building journey.</p>
    <p class="p">Your unique referral code is ready. Share it with friends and family to earn a 5% commission on their active investment cycles.</p>
    <div class="highlight-box">
      <div class="highlight-value">${referralCode}</div>
      <div class="highlight-label">Your Referral Code</div>
    </div>
    <div class="button-container">
      <a href="${APP_URL}/login" class="button">Go to Dashboard</a>
    </div>
  `;
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to Williston Investments',
      html: getHtmlTemplate('Welcome to Williston Investments', bodyContent),
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

// 2. Deposit Pending
export async function sendDepositPendingEmail(name: string, email: string, amount: number, method: string) {
  const bodyContent = `
    <h1 class="h1">Deposit Received — Pending Confirmation</h1>
    <p class="p">Hello ${name},</p>
    <p class="p">We have received your deposit request. Our operations team is currently reviewing your payment reference and receipt proof details.</p>
    <div class="highlight-box">
      <div class="highlight-value">$${amount.toLocaleString()}</div>
      <div class="highlight-label">Deposit Amount (${method})</div>
    </div>
    <p class="p">Deposits are typically confirmed within 1 to 6 hours. Once verified, your wallet balance will automatically update, and you will receive a confirmation email.</p>
  `;
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Deposit of $${amount.toLocaleString()} Received — Pending Confirmation`,
      html: getHtmlTemplate('Deposit Pending Confirmation', bodyContent),
    });
  } catch (error) {
    console.error('Failed to send deposit pending email:', error);
  }
}

// 3. Deposit Confirmed
export async function sendDepositConfirmedEmail(name: string, email: string, amount: number, newBalance: number) {
  const bodyContent = `
    <h1 class="h1">✅ Deposit Confirmed</h1>
    <p class="p">Hello ${name},</p>
    <p class="p">Great news! Your deposit has been successfully verified and credited to your wallet.</p>
    <div class="highlight-box">
      <div class="highlight-value">$${amount.toLocaleString()}</div>
      <div class="highlight-label">Credited Amount</div>
    </div>
    <p class="p">Your new wallet balance is: <strong>$${newBalance.toLocaleString()}</strong>.</p>
    <div class="button-container">
      <a href="${APP_URL}/dashboard" class="button">Invest Now</a>
    </div>
  `;
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `✅ Deposit Confirmed — $${amount.toLocaleString()} Credited`,
      html: getHtmlTemplate('Deposit Confirmed', bodyContent),
    });
  } catch (error) {
    console.error('Failed to send deposit confirmed email:', error);
  }
}

// 4. Withdrawal Approved
export async function sendWithdrawalApprovedEmail(name: string, email: string, amount: number, method: string) {
  const bodyContent = `
    <h1 class="h1">💸 Withdrawal Approved</h1>
    <p class="p">Hello ${name},</p>
    <p class="p">Your withdrawal request has been approved and processed by our finance team.</p>
    <div class="highlight-box">
      <div class="highlight-value">$${amount.toLocaleString()}</div>
      <div class="highlight-label">Payout Amount</div>
    </div>
    <p class="p">Funds are being transferred to your registered <strong>${method}</strong> account. Depending on your provider, please allow 1 to 24 hours for the transaction to reflect.</p>
  `;
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `💸 Withdrawal of $${amount.toLocaleString()} Approved`,
      html: getHtmlTemplate('Withdrawal Approved', bodyContent),
    });
  } catch (error) {
    console.error('Failed to send withdrawal approved email:', error);
  }
}

// 5. Investment Matured
export async function sendInvestmentMaturedEmail(name: string, email: string, planName: string, principal: number, profit: number, total: number) {
  const bodyContent = `
    <h1 class="h1">🎉 Your Investment Has Matured!</h1>
    <p class="p">Hello ${name},</p>
    <p class="p">Your <strong>${planName}</strong> cycle has reached maturity. Your principal and profits have been successfully credited back to your primary wallet balance.</p>
    <div class="highlight-box">
      <div class="highlight-value">$${total.toLocaleString()}</div>
      <div class="highlight-label">Total Returned (Principal: $${principal.toLocaleString()} + Profit: $${profit.toLocaleString()})</div>
    </div>
    <p class="p">You can withdraw these funds or roll them over into a new plan to continue compounding your yields.</p>
    <div class="button-container">
      <a href="${APP_URL}/dashboard" class="button">Reinvest Now</a>
    </div>
  `;
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `🎉 Your Investment Has Matured!`,
      html: getHtmlTemplate('Investment Matured', bodyContent),
    });
  } catch (error) {
    console.error('Failed to send investment matured email:', error);
  }
}

// 6. KYC Approved
export async function sendKYCApprovedEmail(name: string, email: string) {
  const bodyContent = `
    <h1 class="h1">✅ Identity Verified — KYC Approved</h1>
    <p class="p">Hello ${name},</p>
    <p class="p">We are happy to inform you that your identity documents have been approved. Your account limits have been unlocked, and you now have unrestricted access to all platforms operations.</p>
    <div class="button-container">
      <a href="${APP_URL}/dashboard" class="button">Explore Dashboard</a>
    </div>
  `;
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '✅ Identity Verified — KYC Approved',
      html: getHtmlTemplate('KYC Approved', bodyContent),
    });
  } catch (error) {
    console.error('Failed to send KYC approved email:', error);
  }
}

// 7. Referral Commission
export async function sendReferralCommissionEmail(name: string, email: string, commission: number, referredName: string) {
  const bodyContent = `
    <h1 class="h1">💰 Referral Commission Earned!</h1>
    <p class="p">Hello ${name},</p>
    <p class="p">Congratulations! You have received a referral commission payout because <strong>${referredName}</strong> completed an active investment cycle.</p>
    <div class="highlight-box">
      <div class="highlight-value">$${commission.toLocaleString()}</div>
      <div class="highlight-label">Commission Credited</div>
    </div>
    <p class="p">These funds have been instantly credited to your wallet balance. Keep sharing your code to earn more!</p>
  `;
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `💰 You Earned $${commission.toLocaleString()} Commission!`,
      html: getHtmlTemplate('Referral Commission Earned', bodyContent),
    });
  } catch (error) {
    console.error('Failed to send referral commission email:', error);
  }
}

import { Resend } from 'resend';
import { supabaseAdmin } from './supabase-admin';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');
const FROM_EMAIL = 'Williston Investments <noreply@williston-board-of-realtors.vercel.app>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://williston-board-of-realtors.vercel.app';

// Helper to check user notification preferences before sending email
async function isEmailEnabled(email: string, type: string): Promise<boolean> {
  try {
    const { data: u, error: fetchErr } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (fetchErr || !u) {
      console.log(`[Email Helper] User not found for email ${email}, default to sending.`);
      return true;
    }

    const { data: { user }, error: authErr } = await supabaseAdmin.auth.admin.getUserById(u.id);
    if (authErr || !user) {
      console.log(`[Email Helper] Auth user not found for id ${u.id}, default to sending.`);
      return true;
    }

    const settings = user.user_metadata?.notification_settings;
    if (!settings) {
      if (type === 'announcement') return false;
      return true;
    }

    const emailSettings = settings.email || {};
    if (type === 'deposit') return emailSettings.deposit !== false;
    if (type === 'withdrawal') return emailSettings.withdrawal !== false;
    if (type === 'payout') return emailSettings.payout !== false;
    if (type === 'investment') return emailSettings.investment !== false;
    if (type === 'announcement') return emailSettings.announcement === true;

    return true;
  } catch (err) {
    console.error('[Email Helper] Error checking email preferences:', err);
    return true;
  }
}

// Base HTML Wrapper
function emailWrapper(content: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width">
    </head>
    <body style="margin:0;padding:0;background:#04091A;font-family:Arial,sans-serif">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 20px">
            <table width="600" cellpadding="0" cellspacing="0"
              style="background:#0A1628;border:1px solid rgba(201,168,76,0.2)">
              
              <!-- Header -->
              <tr>
                <td style="padding:32px 40px;border-bottom:1px solid rgba(255,255,255,0.07)">
                  <p style="margin:0;font-size:22px;font-weight:700;color:#C9A84C;
                    letter-spacing:2px">WILLISTON</p>
                  <p style="margin:4px 0 0;font-size:11px;color:#8A9BB5;
                    letter-spacing:2px;text-transform:uppercase">
                    Board of Realtors & Investments</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding:40px">
                  ${content}
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.07);
                  background:rgba(255,255,255,0.02)">
                  <p style="margin:0;font-size:12px;color:#8A9BB5;line-height:1.8">
                    Williston Board of Realtors & Investments<br>
                    1847 Westheimer Road, Suite 300, Houston, TX 77098<br>
                    <a href="mailto:willistonboardofrealtors@gmail.com"
                      style="color:#C9A84C">willistonboardofrealtors@gmail.com</a> · 
                    <a href="https://t.me/willistonboardofrealtors"
                      style="color:#C9A84C">Telegram</a>
                  </p>
                  <p style="margin:12px 0 0;font-size:11px;color:#8A9BB5">
                    Investment involves risk. Returns are targeted but not guaranteed.
                  </p>
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

// EMAIL 1 — WELCOME EMAIL
export async function sendWelcomeEmail({ name, email, referralCode }: { name: string; email: string; referralCode: string }) {
  try {
    const htmlContent = `
      <h1 style="color:#FFFFFF;font-size:22px;margin-top:0;margin-bottom:20px;font-weight:600">Welcome aboard, ${name}!</h1>
      <p style="color:#8A9BB5;font-size:14px;line-height:1.6;margin-bottom:20px">Your investor account is ready. We are excited to have you join our premier real estate investment community.</p>
      <div style="background:rgba(201,168,76,0.05);border:1px dashed #C9A84C;border-radius:8px;padding:20px;text-align:center;margin:30px 0">
        <div style="color:#C9A84C;font-size:24px;font-weight:bold;letter-spacing:1px">${referralCode}</div>
        <div style="color:#8A9BB5;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-top:6px">Your Referral Partner Code</div>
      </div>
      <p style="color:#FFFFFF;font-size:14px;font-weight:600;margin-top:20px;margin-bottom:12px">Quick Start Steps:</p>
      <ol style="color:#8A9BB5;font-size:14px;line-height:1.8;margin-bottom:30px;padding-left:20px">
        <li><strong>Verify KYC:</strong> Complete your identity checks to secure your account.</li>
        <li><strong>Deposit:</strong> Fund your wallet using Paystack, Flutterwave, Bank Transfer, or Crypto.</li>
        <li><strong>Invest:</strong> Choose an asset-backed real estate plan.</li>
        <li><strong>Earn:</strong> Receive regular yield distributions directly to your wallet.</li>
      </ol>
      <div style="text-align:center;margin-top:30px;margin-bottom:10px">
        <a href="${APP_URL}/dashboard" style="background-color:#C9A84C;color:#04091A;text-decoration:none;padding:12px 24px;font-size:14px;font-weight:bold;border-radius:8px;display:inline-block;margin-right:12px">Go to Dashboard</a>
        <a href="${APP_URL}/#invest" style="background-color:transparent;color:#C9A84C;border:1px solid #C9A84C;text-decoration:none;padding:11px 23px;font-size:14px;font-weight:bold;border-radius:8px;display:inline-block">View Investment Plans</a>
      </div>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to Williston Investments 🏠',
      html: emailWrapper(htmlContent)
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

// EMAIL 2 — DEPOSIT SUBMITTED
export async function sendDepositSubmittedEmail({ name, email, amount, method, reference }: { name: string; email: string; amount: number | string; method: string; reference: string }) {
  try {
    if (!(await isEmailEnabled(email, 'deposit'))) {
      console.log(`[Email Skip] Deposit submitted email disabled for ${email}`);
      return;
    }

    const htmlContent = `
      <h1 style="color:#FFFFFF;font-size:22px;margin-top:0;margin-bottom:20px;font-weight:600">Deposit Received — Pending Verification</h1>
      <p style="color:#8A9BB5;font-size:14px;line-height:1.6;margin-bottom:20px">Hello ${name}, we have received your deposit request. Our operations team is currently reviewing your payment reference and receipt proof.</p>
      <div style="background:rgba(201,168,76,0.05);border:1px dashed #C9A84C;border-radius:8px;padding:20px;text-align:center;margin:30px 0">
        <div style="color:#C9A84C;font-size:28px;font-weight:bold;letter-spacing:1px">₦${amount}</div>
        <div style="color:#8A9BB5;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-top:6px">Deposit Amount</div>
      </div>
      <table width="100%" style="color:#8A9BB5;font-size:14px;margin-bottom:30px;border-collapse:collapse">
        <tr style="border-bottom:1px solid rgba(255,255,255,0.07)">
          <td style="padding:10px 0">Payment Method</td>
          <td style="text-align:right;color:#FFFFFF;font-weight:600">${method}</td>
        </tr>
        <tr>
          <td style="padding:10px 0">Reference</td>
          <td style="text-align:right;color:#FFFFFF;font-weight:600">${reference}</td>
        </tr>
      </table>
      <p style="color:#8A9BB5;font-size:14px;line-height:1.6;margin-bottom:20px">Our team will verify the payment within 15-60 minutes. You will receive another email automatically when confirmed.</p>
      <p style="color:#8A9BB5;font-size:12px;margin-top:30px">If you have any questions, feel free to contact us at <a href="mailto:willistonboardofrealtors@gmail.com" style="color:#C9A84C">willistonboardofrealtors@gmail.com</a>.</p>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Deposit Received — Pending Verification',
      html: emailWrapper(htmlContent)
    });
  } catch (error) {
    console.error('Failed to send deposit submitted email:', error);
  }
}

// EMAIL 3 — DEPOSIT CONFIRMED
export async function sendDepositConfirmedEmail({ name, email, amount, newBalance }: { name: string; email: string; amount: number | string; newBalance: number | string }) {
  try {
    if (!(await isEmailEnabled(email, 'deposit'))) {
      console.log(`[Email Skip] Deposit confirmed email disabled for ${email}`);
      return;
    }

    const htmlContent = `
      <div style="text-align:center;margin-bottom:20px">
        <span style="font-size:48px;color:#10B981">✓</span>
      </div>
      <h1 style="color:#FFFFFF;font-size:22px;margin-top:0;margin-bottom:20px;font-weight:600;text-align:center">Deposit Confirmed</h1>
      <p style="color:#8A9BB5;font-size:14px;line-height:1.6;margin-bottom:20px;text-align:center">Hello ${name}, great news! Your deposit has been verified and successfully credited.</p>
      <div style="background:rgba(201,168,76,0.05);border:1px dashed #C9A84C;border-radius:8px;padding:20px;text-align:center;margin:30px 0">
        <div style="color:#C9A84C;font-size:28px;font-weight:bold;letter-spacing:1px">₦${amount}</div>
        <div style="color:#8A9BB5;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-top:6px">Added to Your Wallet</div>
      </div>
      <p style="color:#8A9BB5;font-size:14px;line-height:1.6;margin-bottom:30px;text-align:center">Your new wallet balance is: <strong style="color:#FFFFFF">₦${newBalance}</strong>.</p>
      <div style="text-align:center;margin-top:30px">
        <a href="${APP_URL}/dashboard" style="background-color:#C9A84C;color:#04091A;text-decoration:none;padding:12px 30px;font-size:14px;font-weight:bold;border-radius:8px;display:inline-block">Start Investing Now →</a>
      </div>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `✅ ₦${amount} Deposit Confirmed`,
      html: emailWrapper(htmlContent)
    });
  } catch (error) {
    console.error('Failed to send deposit confirmed email:', error);
  }
}

// EMAIL 4 — INVESTMENT ACTIVATED
export async function sendInvestmentEmail({ name, email, plan, amount, roi, endDate, monthlyReturn }: { name: string; email: string; plan: string; amount: number | string; roi: number | string; endDate: string; monthlyReturn: number | string }) {
  try {
    if (!(await isEmailEnabled(email, 'investment'))) {
      console.log(`[Email Skip] Investment activated email disabled for ${email}`);
      return;
    }

    const htmlContent = `
      <h1 style="color:#FFFFFF;font-size:22px;margin-top:0;margin-bottom:20px;font-weight:600">💼 ${plan} Investment Activated</h1>
      <p style="color:#8A9BB5;font-size:14px;line-height:1.6;margin-bottom:20px">Hello ${name}, your investment plan is now active and earning yields. Here is your portfolio summary:</p>
      <table width="100%" style="color:#8A9BB5;font-size:14px;margin-bottom:30px;border-collapse:collapse">
        <tr style="border-bottom:1px solid rgba(255,255,255,0.07)">
          <td style="padding:12px 0">Plan Name</td>
          <td style="text-align:right;color:#FFFFFF;font-weight:600">${plan}</td>
        </tr>
        <tr style="border-bottom:1px solid rgba(255,255,255,0.07)">
          <td style="padding:12px 0">Principal Amount</td>
          <td style="text-align:right;color:#C9A84C;font-weight:700">₦${amount}</td>
        </tr>
        <tr style="border-bottom:1px solid rgba(255,255,255,0.07)">
          <td style="padding:12px 0">Target ROI</td>
          <td style="text-align:right;color:#FFFFFF;font-weight:600">${roi}%</td>
        </tr>
        <tr style="border-bottom:1px solid rgba(255,255,255,0.07)">
          <td style="padding:12px 0">Monthly Return</td>
          <td style="text-align:right;color:#10B981;font-weight:600">₦${monthlyReturn}</td>
        </tr>
        <tr>
          <td style="padding:12px 0">Maturity Date</td>
          <td style="text-align:right;color:#FFFFFF;font-weight:600">${endDate}</td>
        </tr>
      </table>
      <div style="text-align:center;margin-top:30px">
        <a href="${APP_URL}/dashboard" style="background-color:#C9A84C;color:#04091A;text-decoration:none;padding:12px 30px;font-size:14px;font-weight:bold;border-radius:8px;display:inline-block">Track Your Investment →</a>
      </div>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `💼 ${plan} Investment Activated`,
      html: emailWrapper(htmlContent)
    });
  } catch (error) {
    console.error('Failed to send investment email:', error);
  }
}

// EMAIL 5 — MONTHLY RETURN PAID
export async function sendReturnEmail({ name, email, amount, plan, walletBalance }: { name: string; email: string; amount: number | string; plan: string; walletBalance: number | string }) {
  try {
    if (!(await isEmailEnabled(email, 'payout'))) {
      console.log(`[Email Skip] Return paid email disabled for ${email}`);
      return;
    }

    const htmlContent = `
      <h1 style="color:#FFFFFF;font-size:22px;margin-top:0;margin-bottom:20px;font-weight:600">Monthly Return Credited 💰</h1>
      <p style="color:#8A9BB5;font-size:14px;line-height:1.6;margin-bottom:20px">Hello ${name}, great news! Your monthly investment distribution has been paid.</p>
      <div style="background:rgba(201,168,76,0.05);border:1px dashed #C9A84C;border-radius:8px;padding:24px;text-align:center;margin:30px 0">
        <p style="color:#8A9BB5;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px">Amount Credited</p>
        <div style="color:#C9A84C;font-size:40px;font-weight:bold">₦${amount}</div>
        <p style="color:#8A9BB5;font-size:13px;margin:8px 0 0">From your ${plan}</p>
      </div>
      <p style="color:#8A9BB5;font-size:14px;line-height:1.6;margin-bottom:30px;text-align:center">Your new wallet balance is: <strong style="color:#FFFFFF">₦${walletBalance}</strong>.</p>
      <div style="text-align:center;margin-top:30px;margin-bottom:10px">
        <a href="${APP_URL}/withdraw" style="background-color:#C9A84C;color:#04091A;text-decoration:none;padding:12px 24px;font-size:14px;font-weight:bold;border-radius:8px;display:inline-block;margin-right:12px">Withdraw</a>
        <a href="${APP_URL}/#invest" style="background-color:transparent;color:#C9A84C;border:1px solid #C9A84C;text-decoration:none;padding:11px 23px;font-size:14px;font-weight:bold;border-radius:8px;display:inline-block">Reinvest</a>
      </div>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `💰 ₦${amount} Return Credited to Your Wallet`,
      html: emailWrapper(htmlContent)
    });
  } catch (error) {
    console.error('Failed to send return email:', error);
  }
}

// EMAIL 6 — INVESTMENT MATURED
export async function sendMaturedEmail({ name, email, plan, principal, profit, total }: { name: string; email: string; plan: string; principal: number | string; profit: number | string; total: number | string }) {
  try {
    if (!(await isEmailEnabled(email, 'investment'))) {
      console.log(`[Email Skip] Investment matured email disabled for ${email}`);
      return;
    }

    const htmlContent = `
      <h1 style="color:#FFFFFF;font-size:22px;margin-top:0;margin-bottom:20px;font-weight:600">🎉 Your Investment Has Matured!</h1>
      <p style="color:#8A9BB5;font-size:14px;line-height:1.6;margin-bottom:20px">Hello ${name}, congratulations! Your ${plan} cycle has reached full maturity. Your principal and total profits have been successfully credited back to your wallet.</p>
      <table width="100%" style="color:#8A9BB5;font-size:14px;margin-bottom:30px;border-collapse:collapse">
        <tr style="border-bottom:1px solid rgba(255,255,255,0.07)">
          <td style="padding:12px 0">Principal Returned</td>
          <td style="text-align:right;color:#FFFFFF;font-weight:600">₦${principal}</td>
        </tr>
        <tr style="border-bottom:1px solid rgba(255,255,255,0.07)">
          <td style="padding:12px 0">Total Profit Earned</td>
          <td style="text-align:right;color:#10B981;font-weight:600">₦${profit}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;font-weight:700">Total Credited</td>
          <td style="text-align:right;color:#C9A84C;font-weight:700;font-size:16px">₦${total}</td>
        </tr>
      </table>
      <p style="color:#8A9BB5;font-size:14px;line-height:1.6;margin-bottom:30px;text-align:center">Ready to reinvest these funds and continue compounding your returns?</p>
      <div style="text-align:center;margin-top:30px">
        <a href="${APP_URL}/dashboard" style="background-color:#C9A84C;color:#04091A;text-decoration:none;padding:12px 30px;font-size:14px;font-weight:bold;border-radius:8px;display:inline-block">Reinvest Now →</a>
      </div>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '🎉 Your Investment Has Matured!',
      html: emailWrapper(htmlContent)
    });
  } catch (error) {
    console.error('Failed to send matured email:', error);
  }
}

// EMAIL 7 — WITHDRAWAL APPROVED
export async function sendWithdrawalEmail({ name, email, amount, method }: { name: string; email: string; amount: number | string; method: string }) {
  try {
    if (!(await isEmailEnabled(email, 'withdrawal'))) {
      console.log(`[Email Skip] Withdrawal email disabled for ${email}`);
      return;
    }

    const htmlContent = `
      <h1 style="color:#FFFFFF;font-size:22px;margin-top:0;margin-bottom:20px;font-weight:600">💸 Withdrawal Approved</h1>
      <p style="color:#8A9BB5;font-size:14px;line-height:1.6;margin-bottom:20px">Hello ${name}, your withdrawal request has been approved and processed by our finance team.</p>
      <div style="background:rgba(201,168,76,0.05);border:1px dashed #C9A84C;border-radius:8px;padding:20px;text-align:center;margin:30px 0">
        <div style="color:#C9A84C;font-size:28px;font-weight:bold;letter-spacing:1px">₦${amount}</div>
        <div style="color:#8A9BB5;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-top:6px">Payout Amount (${method})</div>
      </div>
      <p style="color:#8A9BB5;font-size:14px;line-height:1.6;margin-bottom:30px">Funds are being transferred. Depending on your provider, please allow 1 to 24 hours for the transaction to reflect in your account.</p>
      <p style="color:#8A9BB5;font-size:12px;margin-top:30px">If you have any questions, contact us at <a href="mailto:willistonboardofrealtors@gmail.com" style="color:#C9A84C">willistonboardofrealtors@gmail.com</a>.</p>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `💸 ₦${amount} Withdrawal Approved`,
      html: emailWrapper(htmlContent)
    });
  } catch (error) {
    console.error('Failed to send withdrawal email:', error);
  }
}

// EMAIL 8 — REFERRAL COMMISSION
export async function sendReferralEmail({ name, email, commission, referredName }: { name: string; email: string; commission: number | string; referredName: string }) {
  try {
    if (!(await isEmailEnabled(email, 'payout'))) {
      console.log(`[Email Skip] Referral email disabled for ${email}`);
      return;
    }

    const htmlContent = `
      <h1 style="color:#FFFFFF;font-size:22px;margin-top:0;margin-bottom:20px;font-weight:600">Referral Commission Earned!</h1>
      <p style="color:#8A9BB5;font-size:14px;line-height:1.6;margin-bottom:20px">Hello ${name}, congratulations! An investor you referred has completed an active cycle.</p>
      <table width="100%" style="color:#8A9BB5;font-size:14px;margin-bottom:30px;border-collapse:collapse">
        <tr style="border-bottom:1px solid rgba(255,255,255,0.07)">
          <td style="padding:10px 0">Referred Member</td>
          <td style="text-align:right;color:#FFFFFF;font-weight:600">${referredName}</td>
        </tr>
        <tr>
          <td style="padding:10px 0">Commission Credited</td>
          <td style="text-align:right;color:#C9A84C;font-weight:700">₦${commission}</td>
        </tr>
      </table>
      <p style="color:#8A9BB5;font-size:14px;line-height:1.6;margin-bottom:30px;text-align:center">The commission has been instantly added to your wallet balance. Keep sharing your partner code to continue earning!</p>
      <div style="text-align:center;margin-top:30px">
        <a href="${APP_URL}/dashboard" style="background-color:#C9A84C;color:#04091A;text-decoration:none;padding:12px 30px;font-size:14px;font-weight:bold;border-radius:8px;display:inline-block">Go to Dashboard →</a>
      </div>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `🤑 You Earned ₦${commission} Commission!`,
      html: emailWrapper(htmlContent)
    });
  } catch (error) {
    console.error('Failed to send referral email:', error);
  }
}

// System Emails - KYC Approved
export async function sendKYCApprovedEmail(name: string, email: string) {
  try {
    const htmlContent = `
      <h1 style="color:#FFFFFF;font-size:22px;margin-top:0;margin-bottom:20px;font-weight:600">✅ Identity Verified — KYC Approved</h1>
      <p style="color:#8A9BB5;font-size:14px;line-height:1.6;margin-bottom:20px">Hello ${name}, we are happy to inform you that your identity verification audit has been completed successfully.</p>
      <p style="color:#8A9BB5;font-size:14px;line-height:1.6;margin-bottom:30px">All account limitations have been lifted, and you now have full access to deposit, investment packages, and cashouts.</p>
      <div style="text-align:center;margin-top:30px">
        <a href="${APP_URL}/dashboard" style="background-color:#C9A84C;color:#04091A;text-decoration:none;padding:12px 30px;font-size:14px;font-weight:bold;border-radius:8px;display:inline-block">Explore Dashboard →</a>
      </div>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '✅ Identity Verified — KYC Approved',
      html: emailWrapper(htmlContent)
    });
  } catch (error) {
    console.error('Failed to send KYC email:', error);
  }
}

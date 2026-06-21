import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, user, amount, method, plan, reference, adminUrl } = body;

    let text = message;

    if (user && amount !== undefined) {
      const formattedAmount = typeof amount === 'number' ? amount.toLocaleString() : amount;
      const displayMethod = method || 'OPay Transfer';
      const displayPlan = plan || 'Investment Deposit';
      const displayRef = reference || 'Pending';
      const displayUrl = adminUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://williston-board-of-realtors.vercel.app'}/admin`;

      text = `💰 NEW DEPOSIT ALERT\n\n` +
             `User: ${user}\n` +
             `Amount: ₦${formattedAmount}\n` +
             `Method: ${displayMethod}\n` +
             `Plan: ${displayPlan}\n` +
             `Reference: ${displayRef}\n\n` +
             `Go to admin panel to confirm:\n` +
             `${displayUrl}`;
    }

    // WhatsApp Cloud API Configuration
    const whatsappToken = process.env.WHATSAPP_API_TOKEN;
    const whatsappPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const adminWhatsapp = process.env.ADMIN_WHATSAPP_NUMBER || '+2349167455410';

    // Telegram Bot Configuration
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.ADMIN_TELEGRAM_CHAT_ID;

    const hasTelegram = telegramToken && telegramChatId && telegramToken !== 'your_telegram_bot_token' && telegramChatId !== 'your_telegram_chat_id';
    const hasWhatsapp = whatsappToken && whatsappPhoneId;

    if (!hasTelegram && !hasWhatsapp) {
      console.warn('Neither Telegram bot nor WhatsApp API is configured.');
      return NextResponse.json({ ok: false, message: 'No notification credentials configured' }, { status: 200 });
    }

    let whatsappSent = false;
    let whatsappError = '';

    if (hasWhatsapp) {
      try {
        const cleanPhone = adminWhatsapp.replace(/[\s\-\+]/g, '');
        const waRes = await fetch(
          `https://graph.facebook.com/v19.0/${whatsappPhoneId}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${whatsappToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to: cleanPhone,
              type: 'text',
              text: {
                preview_url: false,
                body: text,
              },
            }),
          }
        );

        if (waRes.ok) {
          whatsappSent = true;
          console.log(`WhatsApp notification sent successfully to ${cleanPhone}`);
        } else {
          const waErrText = await waRes.text();
          console.error('WhatsApp API response error:', waErrText);
          whatsappError = waErrText;
        }
      } catch (err: any) {
        console.error('Error sending WhatsApp message:', err);
        whatsappError = err.message || 'Unknown error';
      }
    }

    let telegramSent = false;
    let telegramError = '';

    if (hasTelegram) {
      try {
        const hasHtml = /<\/?[a-z][\s\S]*>/i.test(text);
        const payload: any = {
          chat_id: telegramChatId,
          text: text,
        };
        if (hasHtml) {
          payload.parse_mode = 'HTML';
        }

        const tgRes = await fetch(
          `https://api.telegram.org/bot${telegramToken}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );

        if (tgRes.ok) {
          telegramSent = true;
          console.log('Telegram notification sent successfully.');
        } else {
          const tgErrText = await tgRes.text();
          console.error('Telegram Bot sendMessage failed:', tgErrText);
          telegramError = tgErrText;
        }
      } catch (err: any) {
        console.error('Error sending Telegram message:', err);
        telegramError = err.message || 'Unknown error';
      }
    }

    if (whatsappSent || telegramSent) {
      return NextResponse.json({
        ok: true,
        notifications: {
          whatsapp: whatsappSent ? 'sent' : whatsappToken ? `failed: ${whatsappError}` : 'not configured',
          telegram: telegramSent ? 'sent' : telegramToken ? `failed: ${telegramError}` : 'not configured',
        }
      });
    }

    return NextResponse.json({
      ok: false,
      error: 'All configured notification channels failed to deliver.',
      details: { whatsappError, telegramError }
    }, { status: 502 });

  } catch (err: any) {
    console.error('Notify Admin API Error:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}


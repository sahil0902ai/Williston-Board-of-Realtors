import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAdminRequest } from '@/lib/auth-helper';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const isAuthorized = await isAdminRequest(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from('cms_content')
      .select('key, content');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const settings: { [key: string]: string } = {};
    data?.forEach((item: any) => {
      settings[item.key] = item.content;
    });

    return NextResponse.json({
      success: true,
      settings: {
        bank_name: settings['bank_name'] || process.env.BANK_NAME || 'OPay',
        bank_account_number: settings['bank_account_number'] || process.env.BANK_ACCOUNT_NUMBER || '9167455410',
        bank_account_name: settings['bank_account_name'] || process.env.BANK_ACCOUNT_NAME || 'Chukwuebuka Irenaus Onyegere',
        bank_whatsapp: settings['bank_whatsapp'] || process.env.BANK_WHATSAPP || '+2349167455410',
        bank_ussd: settings['bank_ussd'] || '*955#',
        payment_btc_address: settings['payment_btc_address'] || 'YOUR_BTC_WALLET_ADDRESS',
        payment_usdt_address: settings['payment_usdt_address'] || 'YOUR_USDT_TRC20_ADDRESS',
        payment_eth_address: settings['payment_eth_address'] || 'YOUR_ETH_ADDRESS',
        exchange_rate_usd_ngn: parseFloat(settings['exchange_rate_usd_ngn'] || '1600'),
      }
    });
  } catch (error: any) {
    console.error('Admin Settings GET Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAuthorized = await isAdminRequest(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Settings object is required' }, { status: 400 });
    }

    const promises = Object.keys(settings).map(async (key) => {
      const value = String(settings[key]);
      return supabaseAdmin
        .from('cms_content')
        .upsert(
          { key, content: value, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );
    });

    const results = await Promise.all(promises);
    const errors = results.filter(r => r.error).map(r => r.error?.message);

    if (errors.length > 0) {
      return NextResponse.json({ error: 'Failed to save some settings', details: errors }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error: any) {
    console.error('Admin Settings POST Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

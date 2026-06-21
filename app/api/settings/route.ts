import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('cms_content')
      .select('key, content');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Convert list to key-value object
    const settings: { [key: string]: string } = {};
    data?.forEach((item: any) => {
      settings[item.key] = item.content;
    });

    return NextResponse.json({
      success: true,
      settings: {
        btc_address: settings['payment_btc_address'] || 'YOUR_BTC_WALLET_ADDRESS',
        usdt_address: settings['payment_usdt_address'] || 'YOUR_USDT_TRC20_ADDRESS',
        eth_address: settings['payment_eth_address'] || 'YOUR_ETH_ADDRESS',
        bank_name: settings['bank_name'] || process.env.BANK_NAME || 'OPay',
        account_number: settings['bank_account_number'] || process.env.BANK_ACCOUNT_NUMBER || '9167455410',
        account_name: settings['bank_account_name'] || process.env.BANK_ACCOUNT_NAME || 'Chukwuebuka Irenaus Onyegere',
        bank_whatsapp: settings['bank_whatsapp'] || process.env.BANK_WHATSAPP || '+2349167455410',
        bank_ussd: settings['bank_ussd'] || '*955#',
        opay_number: settings['payment_opay_number'] || settings['bank_account_number'] || process.env.BANK_ACCOUNT_NUMBER || '9167455410',
        opay_name: settings['payment_opay_name'] || settings['bank_account_name'] || process.env.BANK_ACCOUNT_NAME || 'Chukwuebuka Irenaus Onyegere',
        exchange_rate_usd_ngn: parseFloat(settings['exchange_rate_usd_ngn'] || '1600'),
      }
    });
  } catch (error: any) {
    console.error('Public Settings API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

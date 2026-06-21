import { NextResponse } from 'next/server';
import { createReservedAccount } from '@/lib/monnify';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user already has an account
    const { data: existing } = await supabaseAdmin
      .from('monnify_accounts')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        success: true,
        accounts: existing.account_details,
      });
    }

    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('full_name, email, phone')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const reservedAccount = await createReservedAccount({
      userId,
      userName: user.full_name || 'Investor',
      userEmail: user.email || '',
      userPhone: user.phone || '',
    });

    // Save the account details
    const { error: insertError } = await supabaseAdmin
      .from('monnify_accounts')
      .insert({
        user_id: userId,
        account_reference: reservedAccount.accountReference,
        account_details: reservedAccount.accounts,
      });

    if (insertError) {
      throw new Error(`Failed to save virtual account details: ${insertError.message}`);
    }

    return NextResponse.json({
      success: true,
      accounts: reservedAccount.accounts,
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

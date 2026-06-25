import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-helper';
import { sendDepositSubmittedEmail } from '@/lib/emails';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const rawAmount = formData.get('amount');
    const method = formData.get('method');
    const reference = formData.get('reference');
    const proof = formData.get('proof') as File | null;
    const planName = formData.get('planName') || 'Investment Deposit';

    if (!rawAmount || !method) {
      return NextResponse.json({ error: 'Amount and method are required' }, { status: 400 });
    }

    const amount = parseFloat(rawAmount as string);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid deposit amount' }, { status: 400 });
    }

    if (amount < 500) {
      return NextResponse.json({ error: 'Minimum deposit amount is ₦500' }, { status: 400 });
    }

    let proofUrl = null;
    let fileHash = null;

    if (proof) {
      const timestamp = Date.now();
      const filename = proof.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const uniqueFilename = `${timestamp}-${filename}`;

      const arrayBuffer = await proof.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Generate file hash
      fileHash = crypto
        .createHash('md5')
        .update(buffer)
        .digest('hex');

      // Check if this exact file was used before
      const { data: existing } = await supabaseAdmin
        .from('deposits')
        .select('id')
        .eq('proof_hash', fileHash)
        .limit(1)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: 'This payment proof has already been submitted. If you believe this is an error, contact support.' },
          { status: 400 }
        );
      }

      // Try Supabase Storage first in 'deposit-proofs' bucket
      try {
        const { data, error } = await supabaseAdmin.storage
          .from('deposit-proofs')
          .upload(`receipts/${uniqueFilename}`, buffer, {
            contentType: proof.type,
            upsert: true
          });

        if (!error && data) {
          const { data: urlData } = supabaseAdmin.storage
            .from('deposit-proofs')
            .getPublicUrl(`receipts/${uniqueFilename}`);
          
          if (urlData?.publicUrl) {
            proofUrl = urlData.publicUrl;
          }
        }
      } catch (sbError) {
        console.warn('Supabase storage upload failed, falling back to local storage:', sbError);
      }

      // Fallback: Local filesystem (public/uploads)
      if (!proofUrl) {
        try {
          const uploadDir = path.join(process.cwd(), 'public', 'uploads');
          
          // Ensure the directory exists
          await fs.mkdir(uploadDir, { recursive: true });
          
          const filePath = path.join(uploadDir, uniqueFilename);
          await fs.writeFile(filePath, buffer);
          proofUrl = `/uploads/${uniqueFilename}`;
        } catch (fsError: any) {
          console.error('Local upload failed as well:', fsError);
          return NextResponse.json({ error: `Upload failed: ${fsError.message}` }, { status: 500 });
        }
      }
    }

    // Fetch user details for email template
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('full_name, email, created_at')
      .eq('id', user.id)
      .single();

    const fullName = profile?.full_name || 'Investor';
    const email = profile?.email || '';

    // --- FLAG SUSPICIOUS PATTERNS ---
    let isFlagged = false;
    let flaggedReasons = [];

    // 1. Same user submits 3+ deposits in 1 hour
    const oneHourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
    const { data: recentDeposits } = await supabaseAdmin
      .from('deposits')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', oneHourAgo);

    if (recentDeposits && recentDeposits.length >= 2) {
      isFlagged = true;
      flaggedReasons.push('User submitted 3+ deposits in 1 hour');
    }

    // 2. Amount doesn't match common amounts (₦50,000 increments)
    if (amount % 50000 !== 0) {
      isFlagged = true;
      flaggedReasons.push(`Suspicious amount: ₦${amount.toLocaleString()} is not a ₦50,000 increment`);
    }

    // 3. New account (<1 hour) tries large deposit (>₦500,000)
    if (profile?.created_at) {
      const accountAgeMs = Date.now() - new Date(profile.created_at).getTime();
      const accountAgeHours = accountAgeMs / (3600 * 1000);
      if (accountAgeHours < 1 && amount > 500000) {
        isFlagged = true;
        flaggedReasons.push('New account (under 1 hour old) attempted deposit over ₦500,000');
      }
    }

    // 4. Multiple deposits with same reference number
    if (reference) {
      const { data: duplicateRef } = await supabaseAdmin
        .from('deposits')
        .select('id')
        .eq('bank_reference', reference as string)
        .limit(1)
        .maybeSingle();

      if (duplicateRef) {
        isFlagged = true;
        flaggedReasons.push(`Duplicate bank reference number used: ${reference}`);
      }
    }

    // Create Deposit Record
    const { data: deposit, error: dbError } = await supabaseAdmin
      .from('deposits')
      .insert({
        user_id: user.id,
        amount,
        method: method as string,
        bank_reference: (reference as string) || null,
        proof_url: proofUrl,
        status: 'pending',
        proof_hash: fileHash,
        is_flagged: isFlagged,
        flagged_reason: isFlagged ? flaggedReasons.join(' | ') : null
      })
      .select('*')
      .single();

    if (dbError || !deposit) {
      return NextResponse.json({ error: `Failed to create deposit: ${dbError?.message}` }, { status: 500 });
    }

    const refNumber = `DEP-${deposit.id.substring(0, 8).toUpperCase()}`;

    // Log Pending Transaction
    await supabaseAdmin.from('transactions').insert({
      user_id: user.id,
      type: 'deposit',
      amount: amount,
      method: method as string,
      reference: refNumber,
      proof_url: proofUrl,
      status: 'pending',
      description: `Pending deposit request via ${method}`,
    });

    // Send User Notification
    await supabaseAdmin.from('notifications').insert({
      user_id: user.id,
      title: 'Deposit Received — Verification Pending',
      message: `Your deposit request of ₦${amount.toLocaleString()} via ${method} has been received. Reference: ${refNumber}. We are verifying details.`,
      type: 'info',
      is_read: false,
    });

    if (email) {
      await sendDepositSubmittedEmail({
        name: fullName,
        email,
        amount,
        method: method as string,
        reference: refNumber
      });
    }

    // Trigger Telegram Notification to Admin
    try {
      const host = request.headers.get('host') || 'localhost:3000';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const origin = `${protocol}://${host}`;
      await fetch(`${origin}/api/notify-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: `${fullName} (${email})`,
          amount: amount,
          method: method === 'OPay Bank Transfer' ? 'OPay Transfer' : (method as string),
          plan: planName as string,
          reference: refNumber,
          adminUrl: `${origin}/admin`
        })
      });
    } catch (tgError) {
      console.error('Failed to trigger notify-admin bot:', tgError);
    }

    return NextResponse.json({
      success: true,
      depositId: deposit.id,
      referenceNumber: refNumber,
      message: 'Deposit request submitted successfully',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create Deposit Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

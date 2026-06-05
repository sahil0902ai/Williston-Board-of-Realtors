import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-helper';
import { sendDepositPendingEmail } from '@/lib/email';
import { promises as fs } from 'fs';
import path from 'path';

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

    if (!rawAmount || !method) {
      return NextResponse.json({ error: 'Amount and method are required' }, { status: 400 });
    }

    const amount = parseFloat(rawAmount as string);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid deposit amount' }, { status: 400 });
    }

    if (amount < 500) {
      return NextResponse.json({ error: 'Minimum deposit amount is $500' }, { status: 400 });
    }

    let proofUrl = null;

    if (proof) {
      const timestamp = Date.now();
      const filename = proof.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const uniqueFilename = `${timestamp}-${filename}`;

      const arrayBuffer = await proof.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

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
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    const fullName = profile?.full_name || 'Investor';
    const email = profile?.email || '';

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
      message: `Your deposit request of $${amount.toLocaleString()} via ${method} has been received. Reference: ${refNumber}. We are verifying details.`,
      type: 'info',
      is_read: false,
    });

    // Send Deposit Pending Email
    if (email) {
      await sendDepositPendingEmail(fullName, email, amount, method as string);
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

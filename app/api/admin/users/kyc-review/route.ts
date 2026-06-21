import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAdminRequest, getAuthenticatedUser } from '@/lib/auth-helper';
import { sendKYCApprovedEmail } from '@/lib/emails';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const isAuthorized = await isAdminRequest(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const body = await request.json();
    const { userId, decision, reason } = body;

    if (!userId || !decision) {
      return NextResponse.json({ error: 'User ID and decision (approved/rejected) are required' }, { status: 400 });
    }

    if (decision !== 'approved' && decision !== 'rejected') {
      return NextResponse.json({ error: 'Decision must be approved or rejected' }, { status: 400 });
    }

    let adminId = null;
    const user = await getAuthenticatedUser(request);
    adminId = user?.id || null;

    // 1. Fetch user profile
    const { data: userProfile, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('full_name, email')
      .eq('id', userId)
      .single();

    if (fetchError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // 2. Update KYC status in users table
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .update({
        kyc_status: decision,
        kyc_reviewed_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (dbError) {
      return NextResponse.json({ error: `Database update failed: ${dbError.message}` }, { status: 500 });
    }

    // 3. Send Notification to User
    const notes = reason || (decision === 'approved' ? 'KYC documents successfully verified' : 'Submitted documents are invalid or blurry');

    await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      title: decision === 'approved' ? 'KYC Approved! ✅' : 'KYC Rejected ❌',
      message: decision === 'approved'
        ? 'Congratulations! Your identity verification (KYC) has been approved. Full account features are unlocked.'
        : `Your identity verification (KYC) was rejected. Reason: ${notes}. Please re-submit valid documents.`,
      type: decision === 'approved' ? 'success' : 'error',
      is_read: false,
    });

    // 4. Send email if approved
    if (decision === 'approved') {
      await sendKYCApprovedEmail(userProfile.full_name, userProfile.email);
    }

    // 5. Log admin action
    await supabaseAdmin.from('admin_logs').insert({
      admin_id: adminId,
      action: `REVIEW_USER_KYC_${decision.toUpperCase()}`,
      target_table: 'users',
      target_id: userId,
      details: { decision, reason: notes },
      ip_address: ip,
    });

    return NextResponse.json({
      success: true,
      message: `KYC status successfully updated to ${decision}`,
    }, { status: 200 });

  } catch (error: any) {
    console.error('KYC Review API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

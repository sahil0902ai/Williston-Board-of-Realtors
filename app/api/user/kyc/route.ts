import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-helper';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const idDocument = formData.get('idDocument') as File | null;
    const selfie = formData.get('selfie') as File | null;

    if (!idDocument || !selfie) {
      return NextResponse.json({ error: 'Both identity document and selfie are required' }, { status: 400 });
    }

    const timestamp = Date.now();
    
    // 1. Upload ID Document to Supabase Storage
    const idArrayBuffer = await idDocument.arrayBuffer();
    const idBuffer = Buffer.from(idArrayBuffer);
    const idFilename = idDocument.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const idPath = `kyc/${user.id}/id-${timestamp}-${idFilename}`;

    const { error: idUploadError } = await supabaseAdmin.storage
      .from('kyc-documents')
      .upload(idPath, idBuffer, {
        contentType: idDocument.type,
        upsert: true,
      });

    if (idUploadError) {
      return NextResponse.json({ error: `ID document upload failed: ${idUploadError.message}` }, { status: 500 });
    }

    // 2. Upload Selfie to Supabase Storage
    const selfieArrayBuffer = await selfie.arrayBuffer();
    const selfieBuffer = Buffer.from(selfieArrayBuffer);
    const selfieFilename = selfie.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const selfiePath = `kyc/${user.id}/selfie-${timestamp}-${selfieFilename}`;

    const { error: selfieUploadError } = await supabaseAdmin.storage
      .from('kyc-documents')
      .upload(selfiePath, selfieBuffer, {
        contentType: selfie.type,
        upsert: true,
      });

    if (selfieUploadError) {
      // Clean up the uploaded ID document if selfie upload fails
      await supabaseAdmin.storage.from('kyc-documents').remove([idPath]);
      return NextResponse.json({ error: `Selfie upload failed: ${selfieUploadError.message}` }, { status: 500 });
    }

    // 3. Resolve Public URLs (or paths)
    const { data: idUrlData } = supabaseAdmin.storage.from('kyc-documents').getPublicUrl(idPath);
    const { data: selfieUrlData } = supabaseAdmin.storage.from('kyc-documents').getPublicUrl(selfiePath);

    const kycIdUrl = idUrlData.publicUrl;
    const kycSelfieUrl = selfieUrlData.publicUrl;

    // 4. Update Users Profile Table
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .update({
        kyc_status: 'submitted',
        kyc_id_url: kycIdUrl,
        kyc_selfie_url: kycSelfieUrl,
        kyc_submitted_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (dbError) {
      return NextResponse.json({ error: `Database update failed: ${dbError.message}` }, { status: 500 });
    }

    // 5. Send Notification
    await supabaseAdmin.from('notifications').insert({
      user_id: user.id,
      title: 'KYC Verification Submitted',
      message: 'Your identity verification documents have been received and are pending staff review.',
      type: 'info',
      is_read: false,
    });

    return NextResponse.json({
      success: true,
      kycStatus: 'submitted',
      message: 'KYC documents uploaded successfully',
    }, { status: 200 });

  } catch (error: any) {
    console.error('KYC Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

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
    const avatarFile = formData.get('avatar') as File | null;

    if (!avatarFile) {
      return NextResponse.json({ error: 'Avatar file is required' }, { status: 400 });
    }

    const timestamp = Date.now();
    const arrayBuffer = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Clean file name to prevent encoding issues
    const filename = avatarFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const avatarPath = `avatars/${user.id}/${timestamp}_${filename}`;

    // Upload to existing kyc-documents bucket
    const { error: uploadError } = await supabaseAdmin.storage
      .from('kyc-documents')
      .upload(avatarPath, buffer, {
        contentType: avatarFile.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('kyc-documents')
      .getPublicUrl(avatarPath);

    const avatarUrl = urlData.publicUrl;

    // Update users profile in db
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id);

    if (dbError) {
      return NextResponse.json({ error: `Database update failed: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      avatarUrl,
      message: 'Avatar uploaded successfully',
    }, { status: 200 });

  } catch (error: any) {
    console.error('Avatar Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAdminRequest } from '@/lib/auth-helper';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Authenticate admin
    const isAdmin = await isAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const timestamp = Date.now();
    const filename = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const uniqueFilename = `${timestamp}-${filename}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Try Supabase Storage first in 'properties' bucket
    try {
      const { data, error } = await supabaseAdmin.storage
        .from('properties')
        .upload(uniqueFilename, buffer, {
          contentType: file.type,
          upsert: true
        });

      if (!error && data) {
        const { data: urlData } = supabaseAdmin.storage
          .from('properties')
          .getPublicUrl(uniqueFilename);
        
        if (urlData?.publicUrl) {
          return NextResponse.json({ 
            success: true, 
            imageUrl: urlData.publicUrl,
            source: 'supabase'
          });
        }
      }
    } catch (sbError) {
      console.warn('Supabase storage upload failed, falling back to local storage:', sbError);
    }

    // Fallback: Local filesystem (public/uploads)
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Ensure the directory exists
      await fs.mkdir(uploadDir, { recursive: true });
      
      const filePath = path.join(uploadDir, uniqueFilename);
      await fs.writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        imageUrl: `/uploads/${uniqueFilename}`,
        source: 'local'
      });
    } catch (fsError: any) {
      console.error('Local upload failed as well:', fsError);
      return NextResponse.json({ error: `Upload failed: ${fsError.message}` }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Image Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

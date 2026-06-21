import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-helper';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: logs, error } = await supabaseAdmin
      .from('fraud_logs')
      .select('event_type, ip_address, details, created_at')
      .eq('user_id', user.id)
      .in('event_type', ['successful_login', 'failed_login', 'failed_2fa_verification'])
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Formatter helpers
    const formattedLogs = (logs || []).map((log: any) => {
      const dateObj = new Date(log.created_at);
      
      // Format Date: YYYY-MM-DD
      const date = dateObj.toISOString().split('T')[0];
      
      // Format Time: HH:MM AM/PM
      const time = dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      // Parse user agent/device representation
      let device = 'Web Browser';
      const rawUserAgent = log.details?.device || '';
      if (rawUserAgent) {
        if (rawUserAgent.includes('Macintosh')) {
          device = 'Mac';
          if (rawUserAgent.includes('Chrome')) device = 'Chrome/Mac';
          else if (rawUserAgent.includes('Safari')) device = 'Safari/Mac';
          else if (rawUserAgent.includes('Firefox')) device = 'Firefox/Mac';
        } else if (rawUserAgent.includes('Windows')) {
          device = 'Windows';
          if (rawUserAgent.includes('Chrome')) device = 'Chrome/Windows';
          else if (rawUserAgent.includes('Firefox')) device = 'Firefox/Windows';
          else if (rawUserAgent.includes('Edg')) device = 'Edge/Windows';
        } else if (rawUserAgent.includes('Android')) {
          device = 'Android Phone';
        } else if (rawUserAgent.includes('iPhone') || rawUserAgent.includes('iPad')) {
          device = 'iOS Device';
        } else {
          // Fallback parsing
          const match = rawUserAgent.match(/\(([^)]+)\)/);
          if (match && match[1]) {
            device = match[1].split(';')[0];
          }
        }
      }

      return {
        date,
        time,
        ipAddress: log.ip_address || 'Unknown',
        device,
        status: log.event_type === 'successful_login' ? 'Success' : 'Failed',
      };
    });

    return NextResponse.json(formattedLogs, { status: 200 });

  } catch (error: any) {
    console.error('GET Login History Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

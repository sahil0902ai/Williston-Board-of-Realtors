import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getAuthenticatedUser(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ynvgmpasrogjdpjpiqie.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mockAnonKey';

  // 1. Check Authorization Bearer Header
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const tempClient = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return [];
        },
      },
    });
    const { data: { user }, error } = await tempClient.auth.getUser(token);
    if (!error && user) {
      return user;
    }
  }

  // 2. Check cookie session state via supabase SSR client
  try {
    const cookieStore = await cookies();
    const supabaseServer = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore if called in context where cookies can't be modified (e.g. Server Component)
            }
          },
        },
      }
    );
    const { data: { user } } = await supabaseServer.auth.getUser();
    return user;
  } catch (err) {
    console.error('Error getting cookie-based authenticated user:', err);
    return null;
  }
}

export async function isAdminRequest(request: Request) {
  // 1. Check Admin Secret Key
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  const adminSecret = process.env.ADMIN_SECRET_KEY || 'williston_admin_secret_2025';
  
  if (authHeader === `Bearer ${adminSecret}`) {
    return true;
  }

  // 2. Check Session & Admin email prefix
  const user = await getAuthenticatedUser(request);
  if (user && (
    user.email === 'admin@williston.com' || 
    user.email === 'willistonadmin@gmail.com' || 
    user.email?.startsWith('admin@') ||
    user.email === 'willistonadmin@williston.com'
  )) {
    return true;
  }

  return false;
}

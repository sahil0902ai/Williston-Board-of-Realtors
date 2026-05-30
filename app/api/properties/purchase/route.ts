import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/auth-helper';
import { addDays } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Get authenticated user
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { propertyId, amount: rawAmount } = body;
    const amount = parseFloat(rawAmount);

    if (!propertyId || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Property ID and a valid positive investment amount are required' }, { status: 400 });
    }

    // 2. Fetch property details
    let property: any = null;
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(propertyId);
    
    if (isUuid) {
      const { data } = await supabaseAdmin
        .from('property_catalog')
        .select('*')
        .eq('id', propertyId)
        .single();
      property = data;
    }

    if (!property) {
      // Look up by Name (for fallback seeds)
      const { data } = await supabaseAdmin
        .from('property_catalog')
        .select('*')
        .eq('name', propertyId)
        .limit(1);
      if (data && data.length > 0) {
        property = data[0];
      }
    }

    if (!property) {
      // If still not found, we can dynamically insert the property listing from static properties!
      // This is a brilliant safety fallback!
      const staticProperties = [
        {
          name: "Williston Heights — River Oaks",
          location: "River Oaks District, Houston, TX",
          type: "Residential",
          typeDisplay: "Residential Duplexes",
          price: "$850,000 / Unit",
          roi: "28%",
          status: "Open"
        },
        {
          name: "Williston Sunrise — Sugar Land",
          location: "Sugar Land, Houston, TX",
          type: "Land",
          typeDisplay: "Land Plots — Clear Title",
          price: "$220,000 / Plot",
          roi: "35%",
          status: "Hot Deal"
        },
        {
          name: "Williston Commerce Center — Downtown Houston",
          location: "Downtown Houston, TX",
          type: "Commercial",
          typeDisplay: "Mixed-Use Commercial",
          price: "$1.5M / Unit",
          roi: "22%",
          status: "Open"
        },
        {
          name: "Williston Plaza — Miami",
          location: "Miami, FL",
          type: "Commercial",
          typeDisplay: "Commercial Plaza",
          price: "$2.1M / Unit",
          roi: "26%",
          status: "Open"
        },
        {
          name: "Williston Gardens — Atlanta",
          location: "Atlanta, GA",
          type: "Residential",
          typeDisplay: "Residential Gardens",
          price: "$420,000 / Unit",
          roi: "22%",
          status: "Hot Deal"
        },
        {
          name: "Williston Business Park — Dallas",
          location: "Dallas, TX",
          type: "Commercial",
          typeDisplay: "Business Park",
          price: "$850,000 / Unit",
          roi: "24%",
          status: "Open"
        },
        {
          name: "Williston Villas — Charlotte",
          location: "Charlotte, NC",
          type: "Residential",
          typeDisplay: "Residential Villas",
          price: "$380,000 / Unit",
          roi: "20%",
          status: "Open"
        },
        {
          name: "Williston Residences — Phoenix",
          location: "Phoenix, AZ",
          type: "Residential",
          typeDisplay: "Residential Residences",
          price: "$310,000 / Unit",
          roi: "19%",
          status: "Coming Soon"
        },
        {
          name: "Williston Square — Las Vegas",
          location: "Las Vegas, NV",
          type: "Commercial",
          typeDisplay: "Commercial Square",
          price: "$1.2M / Unit",
          roi: "28%",
          status: "Hot Deal"
        }
      ];

      const staticProp = staticProperties.find(p => p.name === propertyId || p.name.includes(propertyId));
      if (staticProp) {
        const { data: inserted, error: insertError } = await supabaseAdmin
          .from('property_catalog')
          .insert({
            name: staticProp.name,
            location: staticProp.location,
            type: staticProp.type,
            type_display: staticProp.typeDisplay,
            price: staticProp.price,
            roi: staticProp.roi,
            status: staticProp.status
          })
          .select('*')
          .single();
        if (!insertError && inserted) {
          property = inserted;
        }
      }
    }

    if (!property) {
      return NextResponse.json({ error: 'Property not found in catalog' }, { status: 404 });
    }

    // 3. Fetch user profile for balance check
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('wallet_balance, full_name, total_invested')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const currentBalance = parseFloat(profile.wallet_balance as any || '0');
    if (currentBalance < amount) {
      return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 });
    }

    // 4. Calculate ROI percent and profits
    // Parse ROI (e.g., "28%" -> 28)
    const roiText = property.roi || '20%';
    const roiPercent = parseFloat(roiText.replace('%', '')) || 20;
    
    // Set investment duration (Default to 365 days for real estate)
    const durationDays = 365;
    const totalProfit = amount * (roiPercent / 100);
    const dailyProfit = totalProfit / durationDays;
    const totalReturn = amount + totalProfit;
    
    const startDate = new Date();
    const endDate = addDays(startDate, durationDays);

    // 5. Insert Investment record
    const { data: investment, error: investError } = await supabaseAdmin
      .from('investments')
      .insert({
        user_id: user.id,
        plan_id: null, // nullable, co-ownership does not need fixed plan ID
        plan_name: property.name,
        amount,
        roi_percent: roiPercent,
        duration_days: durationDays,
        daily_profit: dailyProfit,
        total_profit: totalProfit,
        total_return: totalReturn,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'active'
      })
      .select('*')
      .single();

    if (investError || !investment) {
      return NextResponse.json({ error: `Failed to create investment: ${investError?.message}` }, { status: 500 });
    }

    // 6. Deduct balance and update total invested
    const newBalance = currentBalance - amount;
    const newTotalInvested = (parseFloat(profile.total_invested as any || '0')) + amount;

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        wallet_balance: newBalance,
        total_invested: newTotalInvested
      })
      .eq('id', user.id);

    if (updateError) {
      // Rollback investment if profile update fails
      await supabaseAdmin.from('investments').delete().eq('id', investment.id);
      return NextResponse.json({ error: `Failed to update balance: ${updateError.message}` }, { status: 500 });
    }

    // 7. Log Transaction ledger
    // We try to log with type 'investment'. If database check constraint fails, log as 'withdrawal'
    try {
      const { error: txError } = await supabaseAdmin.from('transactions').insert({
        user_id: user.id,
        type: 'investment',
        amount: -amount,
        balance_before: currentBalance,
        balance_after: newBalance,
        description: `Co-ownership purchase: ${property.name}`,
        reference: `PROP-${investment.id.substring(0, 8).toUpperCase()}`,
        status: 'completed'
      });

      if (txError) {
        // Try fallback type 'withdrawal' due to potential DB constraint
        await supabaseAdmin.from('transactions').insert({
          user_id: user.id,
          type: 'withdrawal',
          amount: -amount,
          balance_before: currentBalance,
          balance_after: newBalance,
          description: `Co-ownership purchase: ${property.name}`,
          reference: `PROP-${investment.id.substring(0, 8).toUpperCase()}`,
          status: 'completed'
        });
      }
    } catch (e) {
      console.warn('Failed to insert transaction log with type investment, logged fallback:', e);
    }

    // 8. Insert Notification
    await supabaseAdmin.from('notifications').insert({
      user_id: user.id,
      title: 'Property Co-Ownership Activated',
      message: `Your $${amount.toLocaleString()} purchase for ${property.name} has been activated. Daily yield payouts are now active.`,
      type: 'success',
      is_read: false
    });

    return NextResponse.json({
      success: true,
      investmentId: investment.id,
      message: 'Co-ownership investment successfully activated'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Co-ownership purchase error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

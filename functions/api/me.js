export async function onRequestGet(context) {
  const { request, env } = context;

  try {

    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return Response.json({
        success: false,
        message: "Email is required."
      });
    }

    const user = await env.DB.prepare(`
      SELECT
        id,
        first_name,
        last_name,
        username,
        email,
        phone,
        plan,
        payment_status,
        daily_earning,
        balance,
        referral_balance,
        affiliate_balance,
        task_balance,
        total_referrals,
        social_platform,
social_link,
        
        created_at,
        activated_at
      FROM users
      WHERE email = ?
    `)
    .bind(email.trim().toLowerCase())
    .first();

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found."
      });
    }

    return Response.json({
      success: true,
      user: user
    });

  } catch (err) {

    return Response.json({
      success: false,
      message: "Server error.",
      error: err.message
    });

  }
}

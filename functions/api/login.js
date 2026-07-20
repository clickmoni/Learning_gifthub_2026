export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({
        success: false,
        message: "Email and password are required."
      });
    }

    const user = await env.DB.prepare(`
      SELECT *
      FROM users
      WHERE email = ?
    `)
    .bind(email.trim().toLowerCase())
    .first();

    if (!user) {
      return Response.json({
        success: false,
        message: "Account not found."
      });
    }

    if (user.password !== password) {
      return Response.json({
        success: false,
        message: "Incorrect password."
      });
    }

    return Response.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        plan: user.plan,
        task_balance: user.task_balance,
affiliate_balance: user.affiliate_balance,
        
        total_referrals: user.total_referrals,
        role: user.role,
        created_at: user.created_at
      }
    });

  } catch (err) {

    return Response.json({
      success: false,
      message: "Server error.",
      error: err.message
    });

  }
                           }

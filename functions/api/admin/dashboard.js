export async function onRequestGet(context) {
  const { env } = context;

  try {

    const users = await env.DB.prepare(
      "SELECT COUNT(*) AS total FROM users"
    ).first();

    const activePlans = await env.DB.prepare(
      "SELECT COUNT(*) AS total FROM users WHERE payment_status='paid'"
    ).first();

    const pendingWithdrawals = await env.DB.prepare(
      "SELECT COUNT(*) AS total FROM withdrawals WHERE status='pending'"
    ).first();

    const revenue = await env.DB.prepare(
      "SELECT COALESCE(SUM(plan_amount),0) AS total FROM users WHERE payment_status='paid'"
    ).first();

    return Response.json({
      success: true,
      totalUsers: users.total,
      activePlans: activePlans.total,
      pendingWithdrawals: pendingWithdrawals.total,
      totalRevenue: revenue.total
    });

  } catch (err) {

    return Response.json({
      success: false,
      message: err.message
    });

  }
      }

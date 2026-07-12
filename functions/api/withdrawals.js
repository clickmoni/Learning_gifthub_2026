export async function onRequestGet(context) {
  const { env } = context;

  try {
    const { results } = await env.DB.prepare(`
      SELECT
    withdrawals.id,
    users.email,
    withdrawals.amount,
    withdrawals.bank_name,
    withdrawals.account_name,
    withdrawals.account_number,
    withdrawals.status,
    withdrawals.created_at
FROM withdrawals
LEFT JOIN users
ON withdrawals.user_id = users.id
ORDER BY withdrawals.created_at DESC
        
    `).all();

    return Response.json({
      success: true,
      withdrawals: results
    });

  } catch (err) {
    return Response.json({
      success: false,
      message: err.message
    });
  }
}

export async function onRequestGet(context) {
  const { env } = context;

  try {
    const { results } = await env.DB.prepare(`
      SELECT
        id,
        email,
        amount,
        bank_name,
        account_name,
        account_number,
        status,
        created_at
      FROM withdrawals
      ORDER BY created_at DESC
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

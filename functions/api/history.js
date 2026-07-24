export async function onRequestGet(context) {

  const { request, env } = context;

  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return Response.json({
      success: false,
      message: "Email is required."
    });
  }

  const user = await env.DB.prepare(
    "SELECT id FROM users WHERE email=?"
  )
  .bind(email.trim().toLowerCase())
  .first();

  if (!user) {
    return Response.json({
      success: false,
      message: "User not found."
    });
  }

  const history = await env.DB.prepare(`
    SELECT
      amount,
      type,
      status,
      created_at
    FROM withdrawals
    WHERE user_id=?
    ORDER BY id DESC
  `)
  .bind(user.id)
  .all();

  return Response.json({
    success: true,
    history: history.results
  });

      }

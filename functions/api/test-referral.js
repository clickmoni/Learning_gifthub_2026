export async function onRequestGet(context) {
  const { request, env } = context;

  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  const user = await env.DB.prepare(`
    SELECT referral_code
    FROM users
    WHERE email = ?
  `)
  .bind(email)
  .first();

  if (!user) {
    return Response.json({
      success: false,
      message: "User not found"
    });
  }

  return Response.json({
    success: true,
    referral_code: user.referral_code,
    referral_link:
      "https://learning-gifthub-2026.pages.dev/signup.html?ref=" +
      user.referral_code
  });
    }

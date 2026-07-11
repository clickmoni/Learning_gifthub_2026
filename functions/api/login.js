export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { email, password } = await request.json();

    const user = await env.DB.prepare(
      `SELECT * FROM users
       WHERE email = ?`
    )
    .bind(email)
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
        user: {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            plan: user.plan,
            balance: user.balance
        }
    });

  } catch (err) {

    return Response.json({
        success:false,
        message:err.message
    });

  }
}

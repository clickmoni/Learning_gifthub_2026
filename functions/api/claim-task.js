export async function onRequestPost(context) {
  const { request, env } = context;

  try {

    const { email } = await request.json();

    if (!email) {
      return Response.json({
        success: false,
        message: "Email is required."
      });
    }

    const user = await env.DB.prepare(`
      SELECT
        id,
        plan,
        payment_status,
        daily_earning,
        balance,
        task_balance,
        last_claim
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

    if (user.payment_status !== "paid") {
      return Response.json({
        success: false,
        message: "Activate a plan first."
      });
    }

    const today = new Date().toISOString().slice(0,10);

    if (
      user.last_claim &&
      user.last_claim.slice(0,10) === today
    ) {
      return Response.json({
        success: false,
        message: "You have already claimed today."
      });
    }

    const newTaskBalance =
      Number(user.task_balance || 0) +
      Number(user.daily_earning || 0);

    const newTotalBalance =
      Number(user.balance || 0) +
      Number(user.daily_earning || 0);

    await env.DB.prepare(`
      UPDATE users
      SET
        task_balance = ?,
        balance = ?,
        last_claim = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    .bind(
      newTaskBalance,
      newTotalBalance,
      user.id
    )
    .run();

    return Response.json({
      success: true,
      message: "Task claimed successfully.",
      task_balance: newTaskBalance,
      balance: newTotalBalance
    });

  } catch (err) {

    return Response.json({
      success: false,
      message: err.message
    });

  }

        }

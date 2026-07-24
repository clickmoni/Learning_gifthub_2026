export async function onRequestPost(context) {

  const { request, env } = context;

  try {

    const {
      id,
      plan,
      task_balance,
      affiliate_balance
    } = await request.json();

    if (!id) {
      return Response.json({
        success: false,
        message: "User ID is required."
      });
    }

    const dailyMap = {
      starter: 100,
      bronze: 400,
      silver: 800,
      gold: 1500
    };

    const daily_earning =
      dailyMap[(plan || "").toLowerCase()] || 0;

    await env.DB.prepare(`
      UPDATE users
      SET
        plan = ?,
        task_balance = ?,
        affiliate_balance = ?,
        daily_earning = ?
      WHERE id = ?
    `)
    .bind(
      plan,
      Number(task_balance),
      Number(affiliate_balance),
      daily_earning,
      id
    )
    .run();

    return Response.json({
      success: true,
      message: "User updated successfully."
    });

  } catch (err) {

    return Response.json({
      success: false,
      message: err.message
    });

  }

      }

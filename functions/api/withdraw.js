export async function onRequestPost(context) {

  const { request, env } = context;

  try {

    const {
      email,
      amount,
      bank_name,
      account_name,
      account_number,
      type
    } = await request.json();

    if (!email || !amount || !bank_name || !account_name || !account_number || !type) {
      return Response.json({
        success: false,
        message: "All fields are required."
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
        message: "User not found."
      });
    }

    const withdrawAmount = Number(amount);

    if (type === "task") {

      const today = new Date().getDate();

      if (today !== 15 && today !== 30) {
        return Response.json({
          success: false,
          message: "Task withdrawals are only allowed on the 15th and 30th."
        });
      }

      let minimum = 9000;

      switch ((user.plan || "").toLowerCase()) {

        case "starter":
          minimum = 9000;
          break;

        case "bronze":
          minimum = 17000;
          break;

        case "silver":
          minimum = 27000;
          break;

        case "gold":
          minimum = 55000;
          break;
      }

      if (withdrawAmount < minimum) {
        return Response.json({
          success: false,
          message: `Minimum withdrawal is ₦${minimum.toLocaleString()}`
        });
      }

      if (withdrawAmount > Number(user.task_balance || 0)) {
        return Response.json({
          success: false,
          message: "Insufficient task balance."
        });
      }

      await env.DB.prepare(`
        UPDATE users
        SET task_balance = task_balance - ?
        WHERE id = ?
      `)
      .bind(withdrawAmount, user.id)
      .run();

    } else {

      if (withdrawAmount < 1000) {
        return Response.json({
          success: false,
          message: "Minimum affiliate withdrawal is ₦1,000."
        });
      }

      if (withdrawAmount > Number(user.affiliate_balance || 0)) {
        return Response.json({
          success: false,
          message: "Insufficient affiliate balance."
        });
      }

      await env.DB.prepare(`
        UPDATE users
        SET affiliate_balance = affiliate_balance - ?
        WHERE id = ?
      `)
      .bind(withdrawAmount, user.id)
      .run();

    }

    await env.DB.prepare(`
      UPDATE users
      SET
        bank_name=?,
        account_name=?,
        account_number=?
      WHERE id=?
    `)
    .bind(
      bank_name,
      account_name,
      account_number,
      user.id
    )
    .run();

    await env.DB.prepare(`
      INSERT INTO withdrawals
      (
        user_id,
        amount,
        type,
        status,
        created_at
      )
      VALUES
      (
        ?, ?, ?, 'pending', CURRENT_TIMESTAMP
      )
    `)
    .bind(
      user.id,
      withdrawAmount,
      type
    )
    .run();

    return Response.json({
      success: true,
      message: "Withdrawal submitted successfully."
    });

  } catch (err) {

    return Response.json({
      success: false,
      message: err.message
    });

  }

  }

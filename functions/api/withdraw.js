export async function onRequestPost(context) {

  const { request, env } = context;

  try {

    const body = await request.json();

    const {
      email,
      amount,
      bank_name,
      account_name,
      account_number,
      type
    } = body;

    if (
      !email ||
      !amount ||
      !bank_name ||
      !account_name ||
      !account_number ||
      !type
    ) {
      return Response.json({
        success: false,
        message: "All fields are required."
      });
    }

    // Get user
    const user = await env.DB.prepare(`
      SELECT id
      FROM users
      WHERE email = ?
    `)
    .bind(email)
    .first();

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found."
      });
    }

    // Save bank details
    await env.DB.prepare(`
      UPDATE users
      SET
        bank_name = ?,
        account_name = ?,
        account_number = ?
      WHERE id = ?
    `)
    .bind(
      bank_name,
      account_name,
      account_number,
      user.id
    )
    .run();

    // Create withdrawal
    await env.DB.prepare(`
      INSERT INTO withdrawals (
        user_id,
        amount,
        type,
        status,
        created_at
      )
      VALUES (
        ?, ?, ?, 'pending', CURRENT_TIMESTAMP
      )
    `)
    .bind(
      user.id,
      amount,
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

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      username,
      email,
      phone,
      password,
      affiliate
    } = body;

    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !phone ||
      !password
    ) {
      return Response.json({
        success: false,
        message: "All required fields are required."
      });
    }

    const exists = await env.DB.prepare(
      `SELECT id FROM users
       WHERE username = ?
       OR email = ?
       OR phone = ?`
    )
      .bind(username, email, phone)
      .first();

    if (exists) {
      return Response.json({
        success: false,
        message: "Username, email or phone already exists."
      });
    }

    await env.DB.prepare(
      `INSERT INTO users(
        first_name,
        last_name,
        username,
        email,
        phone,
        password,
        affiliate
      )
      VALUES(?,?,?,?,?,?,?)`
    )
      .bind(
        firstName,
        lastName,
        username,
        email,
        phone,
        password,
        affiliate || ""
      )
      .run();

    return Response.json({
      success: true,
      message: "Registration successful."
    });

  } catch (err) {

    return Response.json({
      success: false,
      message: err.message
    });

  }
  }

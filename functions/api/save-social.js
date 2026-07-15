export async function onRequestPost(context) {

  const { request, env } = context;

  try {

    const {
      email,
      platform,
      link
    } = await request.json();

    if (!email || !platform || !link) {

      return Response.json({
        success: false,
        message: "All fields are required."
      });

    }

    await env.DB.prepare(`
      UPDATE users
      SET
        social_platform = ?,
        social_link = ?
      WHERE email = ?
    `)
    .bind(
      platform,
      link,
      email.trim().toLowerCase()
    )
    .run();

    return Response.json({
      success: true,
      message: "Social media link saved successfully."
    });

  } catch (err) {

    return Response.json({
      success: false,
      message: err.message
    });

  }

}

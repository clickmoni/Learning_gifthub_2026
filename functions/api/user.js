export async function onRequestGet(context) {

    const { request, env } = context;

    try {

        const url = new URL(request.url);
        const email = url.searchParams.get("email");

        if (!email) {
            return Response.json({
                success: false,
                message: "Email is required."
            });
        }

        const user = await env.DB.prepare(`
            SELECT
                id,
                first_name,
                last_name,
                email,
                plan,
                task_balance,
                affiliate_balance,
                payment_status
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

        return Response.json({
            success: true,
            user
        });

    } catch (err) {

        return Response.json({
            success: false,
            message: err.message
        });

    }

          }

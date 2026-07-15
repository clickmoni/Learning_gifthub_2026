export async function onRequestPost(context) {

    const { request, env } = context;

    try {

        const { email } = await request.json();

        const user = await env.DB.prepare(
            `SELECT plan,last_task_claim,task_balance
             FROM users
             WHERE email=?`
        ).bind(email).first();

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found."
            });
        }

        const today = new Date().toISOString().split("T")[0];

        if (user.last_task_claim === today) {
            return Response.json({
                success: false,
                message: "You have already claimed today's task."
            });
        }

        const plans = {
            Starter: 100,
            Basic: 200,
            Bronze: 400,
            Silver: 800,
            Gold: 1500,
            Platinum: 2500
        };

        const amount = plans[user.plan] || 0;

        if (amount === 0) {
            return Response.json({
                success: false,
                message: "Activate a plan first."
            });
        }

        await env.DB.prepare(
            `UPDATE users
             SET task_balance = task_balance + ?,
                 last_task_claim = ?
             WHERE email=?`
        )
        .bind(amount, today, email)
        .run();

        return Response.json({
            success: true,
            amount
        });

    } catch (err) {

        return Response.json({
            success: false,
            message: err.message
        });

    }

          }

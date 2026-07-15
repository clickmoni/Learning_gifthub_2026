export async function onRequestGet(context) {

    const { env } = context;

    try {

        const users = await env.DB.prepare(`
            SELECT
                id,
                first_name,
                last_name,
                username,
                email,
                phone,
                plan,
                payment_status,
                task_balance,
                affiliate_balance,
                total_referrals,
                created_at
            FROM users
            ORDER BY id DESC
        `).all();

        return Response.json({
            success: true,
            users: users.results
        });

    } catch (err) {

        return Response.json({
            success: false,
            message: err.message
        });

    }

}

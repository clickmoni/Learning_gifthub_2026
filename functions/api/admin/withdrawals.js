export async function onRequestGet(context) {

    const { env } = context;

    try {

        const withdrawals = await env.DB.prepare(`
            SELECT
                w.id,
                w.amount,
                w.status,
                w.created_at,

                u.first_name,
                u.last_name,
                u.email,
                u.plan,
                u.bank_name,
                u.account_number,
                u.social_platform,
                u.social_link

            FROM withdrawals w

            LEFT JOIN users u
            ON w.user_id = u.id

            ORDER BY w.id DESC
        `).all();

        return Response.json({
            success: true,
            withdrawals: withdrawals.results
        });

    } catch (err) {

        return Response.json({
            success: false,
            message: err.message
        });

    }

}

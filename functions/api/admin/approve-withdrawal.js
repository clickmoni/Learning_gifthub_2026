 export async function onRequestPost(context) {

    const { request, env } = context;

    try {

        const { id } = await request.json();

        const withdrawal = await env.DB.prepare(`
            SELECT *
            FROM withdrawals
            WHERE id = ?
        `)
        .bind(id)
        .first();

        if (!withdrawal) {
            return Response.json({
                success: false,
                message: "Withdrawal not found."
            });
        }

        await env.DB.prepare(`
            UPDATE withdrawals
            SET status = 'approved'
            WHERE id = ?
        `)
        .bind(id)
        .run();

        return Response.json({
            success: true,
            message: "Withdrawal approved successfully."
        });

    } catch (err) {

        return Response.json({
            success: false,
            message: err.message
        });

    }

    }

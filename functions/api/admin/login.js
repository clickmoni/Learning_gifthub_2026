export async function onRequestPost(context) {

    const { request } = context;

    try {

        const { password } = await request.json();

        // Your admin password
        const ADMIN_PASSWORD = "@Mgbogo123";

        if (password !== ADMIN_PASSWORD) {

            return Response.json({
                success: false,
                message: "Incorrect admin password."
            });

        }

        return Response.json({
            success: true,
            message: "Login successful."
        });

    } catch (err) {

        return Response.json({
            success: false,
            message: err.message
        });

    }

}

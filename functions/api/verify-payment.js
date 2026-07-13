export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { reference } = await request.json();

    if (!reference) {
      return Response.json({
        success: false,
        message: "Payment reference is required."
      });
    }

    const response = await fetch(
      "https://api.paystack.co/transaction/verify/" + reference,
      {
        headers: {
          Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const result = await response.json();

    if (!result.status || result.data.status !== "success") {
      return Response.json({
        success: false,
        message: "Payment verification failed."
      });
    }

    return Response.json({
      success: true,
      payment: result.data
    });

  } catch (err) {
    return Response.json({
      success: false,
      message: err.message
    });
  }
        }

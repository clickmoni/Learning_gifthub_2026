export async function onRequestGet(context) {
  const PAYSTACK_SECRET_KEY = context.env.PAYSTACK_SECRET_KEY;

  if (!PAYSTACK_SECRET_KEY) {
    return new Response(
      JSON.stringify({
        status: false,
        message: "PAYSTACK_SECRET_KEY is missing."
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        status: 500
      }
    );
  }

  try {
    const response = await fetch(
      "https://api.paystack.co/transaction",
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({
        status: false,
        message: err.message
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        status: 500
      }
    );
  }
}

export async function onRequestPost(context) {

  const { request, env } = context;

  try {

    const { reference, email, plan } = await request.json();

    if (!reference || !email || !plan) {

      return Response.json({
        success: false,
        message: "Reference, email and plan are required."
      });

    }
    // Verify payment with Paystack
const verifyResponse = await fetch(
  "https://api.paystack.co/transaction/verify/" + reference,
  {
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`
    }
  }
);

const verifyData = await verifyResponse.json();

if (
  !verifyData.status ||
  verifyData.data.status !== "success"
) {
  return Response.json({
    success: false,
    message: "Payment verification failed."
  });
  }
    // Get user
const user = await env.DB.prepare(`
  SELECT *
  FROM users
  WHERE email = ?
`)
.bind(email.trim().toLowerCase())
.first();

if (!user) {
  return Response.json({
    success: false,
    message: "User not found."
  });
}

// Get selected plan
const selectedPlan = await env.DB.prepare(`
  SELECT *
  FROM plans
  WHERE name = ?
`)
.bind(plan)
.first();

if (!selectedPlan) {
  return Response.json({
    success: false,
    message: "Plan not found."
  });
  }

  } catch (err) {

    return Response.json({
      success: false,
      message: err.message
    });

  }

}

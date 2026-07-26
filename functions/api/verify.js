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
// Activate user's plan
await env.DB.prepare(`
  UPDATE users
  SET
    plan = ?,
    payment_status = 'paid',
    payment_reference = ?,
    plan_amount = ?,
    daily_earning = ?,
    activated_at = CURRENT_TIMESTAMP
  WHERE email = ?
`)
.bind(
  selectedPlan.name,
  reference,
  selectedPlan.price,
  selectedPlan.daily_income,
  email.trim().toLowerCase()
)
.run();
// Save transaction
await env.DB.prepare(`
  INSERT INTO transactions (
    email,
    reference,
    type,
    plan,
    amount,
    status
  )
  VALUES (?, ?, ?, ?, ?, ?)
`)
.bind(
  email.trim().toLowerCase(),
  reference,
  "activation",
  selectedPlan.name,
  selectedPlan.price,
  "success"
)
.run();
// Give referral commission
if (user.referred_by) {

  let referralBonus = 0;

  switch ((selectedPlan.name || "").toLowerCase()) {

    case "starter":
      referralBonus = 200;
      break;

    case "basic":
      referralBonus = 300;
      break;

    case "bronze":
      referralBonus = 1000;
      break;

    case "silver":
      referralBonus = 1500;
      break;

    case "gold":
      referralBonus = 3000;
      break;

    case "platinum":
      referralBonus = 5000;
      break;

  }

  await env.DB.prepare(`
    UPDATE users
    SET
      affiliate_balance = COALESCE(affiliate_balance,0) + ?,
      total_referrals = COALESCE(total_referrals,0) + 1
    WHERE referral_code = ?
  `)
  .bind(
    referralBonus,
    user.referred_by
  )
  .run();

  }
return Response.json({
  success: true,
  message: "Plan activated successfully.",
  plan: selectedPlan.name,
  amount: selectedPlan.price,
  daily_income: selectedPlan.daily_income
});
}

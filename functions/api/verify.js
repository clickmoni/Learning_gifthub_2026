export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();

    const {
      reference,
      email,
      plan
    } = body;

    if (!reference || !email || !plan) {
      return Response.json({
        success: false,
        message: "Reference, email and plan are required."
      });
    }

    // Prevent duplicate activation
    const existing = await env.DB.prepare(`
      SELECT id
      FROM transactions
      WHERE reference = ?
    `)
      .bind(reference)
      .first();

    if (existing) {
      return Response.json({
        success: false,
        message: "This payment has already been processed."
      });
    }

    // Verify payment with Paystack
    const verify = await fetch(
      "https://api.paystack.co/transaction/verify/" + reference,
      {
        headers: {
          Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const payment = await verify.json();

    if (
      !payment.status ||
      payment.data.status !== "success"
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
      .bind(email)
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
          }    // Update user's plan
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
        email
      )
      .run();
    // Give referral bonus
const user = await env.DB.prepare(`
SELECT referred_by, plan
FROM users
WHERE email=?
`)
.bind(email)
.first();

if (user?.referred_by) {

  const bonus = {
    Starter: 200,
    Basic: 300,
    Bronze: 1000,
    Silver: 1500,
    Gold: 3000,
    Platinum: 5000
  }[user.plan] || 0;

  if (bonus > 0) {

    await env.DB.prepare(`
    UPDATE users
    SET affiliate_balance =
        COALESCE(affiliate_balance,0) + ?
    WHERE referral_code = ?
    `)
    .bind(bonus, user.referred_by)
    .run();

  }

      }

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
        email,
        reference,
        "activation",
        selectedPlan.name,
        selectedPlan.price,
        "success"
      )
      .run();

    

        }    return Response.json({
      success: true,
      message: "Plan activated successfully.",
      plan: selectedPlan.name,
      amount: selectedPlan.price,
      daily_income: selectedPlan.daily_income
    });

  } catch (err) {

    console.error(err);

    return Response.json({
      success: false,
      message: err.message || "Internal server error."
    });

  }
  }

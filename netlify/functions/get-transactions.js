exports.handler = async function(event, context) {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

  if (!PAYSTACK_SECRET_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Secret key not set in Netlify" })
    };
  }

  const res = await fetch('https://api.paystack.co/transaction?perPage=100', {
    headers: { 'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}` }
  });

  const data = await res.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};

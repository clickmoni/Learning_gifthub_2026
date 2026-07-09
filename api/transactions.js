export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.paystack.co/transaction?perPage=100', {
      headers: { 
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    res.status(200).json(data);
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
      }

const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());

const SECRET = 'ABCOwners_2026_Webhook_Secure';

app.get('/', (req, res) => {
  res.send('ABCOWNERS Webhook Live ✅');
});

app.post('/razorpay-webhook', (req, res) => {
  const sig = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest('hex');
  
  if (sig !== expected) return res.status(400).send('Invalid signature');
  
  if (req.body.event === 'payment.captured') {
    const p = req.body.payload.payment.entity;
    const amount = p.amount / 100;
    const commission = (amount * 0.18).toFixed(2);
    const owner = (amount * 0.82).toFixed(2);
    console.log(`Payment: ${p.id} | Total: ₹${amount} | Commission: ₹${commission} | Owner: ₹${owner}`);
  }
  
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('ABCOWNERS Server Running'));

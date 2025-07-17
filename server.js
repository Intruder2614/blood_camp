require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());



// Load Firebase Admin credentials
const serviceAccount = require('/etc/secrets/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const data = req.body;

    // ✅ Server-side validation
    if (!data.firstName || !data.lastName || !data.email || !data.phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (data.age < 18 || data.age > 65) {
      return res.status(400).json({ error: 'Age must be between 18 and 65' });
    }

    if (data.weight < 50) {
      return res.status(400).json({ error: 'Minimum weight is 50 kg' });
    }

    // Save to Firestore
    await db.collection('bloodDonationRegistrations').add({
      ...data,
      registrationDate: new Date().toISOString()
    });

    return res.status(200).json({ message: 'Registration successful!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

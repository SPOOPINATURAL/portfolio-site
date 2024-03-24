const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/submit', async (req, res) => {
  try {
    const { email, message, name } = req.body;

    // Your Cloudflare API credentials
    const authEmail = 'spoopimail@gmail.com';
    const authKey = '2074e6d48b3fcc628a9cd978fecf9ac13a48d';

    // Zone ID of your domain
    const zoneId = 'aa800545df8868e536bdff8e3eaeb7cc';

    // Create DNS record using Cloudflare API
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': authEmail,
        'X-Auth-Key': authKey,
      },
      body: JSON.stringify({
        type: 'TXT',
        name: `contact.${req.hostname}`, // Change to your desired subdomain
        content: `From: ${name}\nEmail: ${email}\nMessage: ${message}`,
      }),
    });

    const data = await response.json();
    console.log(data);

    res.status(200).json({ success: true, message: 'Form submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while processing your request.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

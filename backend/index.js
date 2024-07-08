const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// IPFS or Pinata Configuration
const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

app.post('/upload-metadata', async (req, res) => {
    const { metadata } = req.body;
    try {
        const response = await axios.post(`https://api.pinata.cloud/pinning/pinJSONToIPFS`, metadata, {
            headers: {
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

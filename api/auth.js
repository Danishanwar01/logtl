const crypto = require('crypto');

module.exports = (req, res) => {
    const authData = req.query;
    const hash = authData.hash;
    const BOT_TOKEN = process.env.BOT_TOKEN; 

    if (!hash || !BOT_TOKEN) {
        return res.status(400).send('Missing data or token');
    }

    // 1. Data sort aur string banana
    const dataCheckArr = [];
    Object.keys(authData)
        .filter(key => key !== 'hash')
        .sort()
        .forEach(key => dataCheckArr.push(`${key}=${authData[key]}`));
    
    const dataCheckString = dataCheckArr.join('\n');

    // 2. Hash Verify karna
    const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();
    const hmac = crypto.createHmac('sha256', secretKey)
                       .update(dataCheckString)
                       .digest('hex');

    if (hmac === hash) {
        // Success: User details show karo ya database mein save karo
        res.send(`
            <h1>Login Successful!</h1>
            <p>Hello, ${authData.first_name} (ID: ${authData.id})</p>
            <script>setTimeout(() => { window.location.href = '/'; }, 3000);</script>
        `);
    } else {
        res.status(403).send('<h1>Verification Failed!</h1><p>Data is tampered.</p>');
    }
};
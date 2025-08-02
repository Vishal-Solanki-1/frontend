const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  console.log('Feedback received:', req.body);
  res.status(200).json({ message: 'Feedback received successfully' });
});

module.exports = router;

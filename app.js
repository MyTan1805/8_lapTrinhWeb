const express = require('express');
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/admin/products_Management.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
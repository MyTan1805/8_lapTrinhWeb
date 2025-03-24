const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');

// Import danh sách mỹ phẩm
const dsMyPhamModule = require('./dsMyPham');
let CosmeticsList = dsMyPhamModule.dsMyPham;

// Middleware
app.use(express.static('public')); // Remove trailing slash
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

const uploadDir = path.join(__dirname, 'public/images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// routes
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, 'public/page/admin/products_Management.html');
  console.log("Resolved file path:", filePath);

  if (fs.existsSync(filePath)) {
    console.log("File exists, sending file...");
    res.sendFile(filePath);
  } else {
    console.error("File does not exist at path:", filePath);
    res.status(404).send("File not found");
  }
});

app.get("/add_product", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/page/admin/add_product.html'));
});

app.get("/edit_product", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/page/admin/edit_product.html'));
});

app.get("/product_detail", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/page/user/product_detail.html'));
});

//data
app.get("/dishes", (req, res) => {
  res.json(CosmeticsList);
});

app.get("/dishes/:id", (req, res) => {
  const { id } = req.params;
  const product = CosmeticsList.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
  }
  res.json(product);
});

// add

// update

// delete

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
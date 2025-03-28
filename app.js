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
app.use(express.static('public')); 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());
const uploadDir = path.join(__dirname, 'public/images/products');
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

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/page/user/index.html'));
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

app.get("/products", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/page/user/products.html'));
});

//data - display
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

// Add product
app.post('/dishes', (req, res) => {
  const { ten, moTa, loai, thuongHieu, noiSanXuat, soLuong, gia } = req.body;
  const file = req.files['product-image'];

  if (!ten || !moTa || !loai || !thuongHieu || !noiSanXuat || !soLuong || !gia || !file) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
  }

  const lastProduct = CosmeticsList[CosmeticsList.length - 1];
  const newId = lastProduct ? `SP${(parseInt(lastProduct.id.replace('SP', '')) + 1).toString().padStart(3, '0')}` : 'SP001';

  const fileName = `${newId}_${file.name}`;
  const filePath = path.join(__dirname, 'public/images/products', fileName);

  file.mv(filePath, (err) => {
    if (err) {
      console.error('Lỗi khi lưu hình ảnh:', err);
      return res.status(500).json({ message: 'Lỗi khi lưu hình ảnh!' });
    }

    const newProduct = {
      id: newId,
      ten,
      moTa,
      loai,
      thuongHieu,
      noiSanXuat,
      hinhAnh: fileName,
      inventory: {
        quantity: parseInt(soLuong),
        price: parseInt(gia)
      },
      ratings: []
    };

    CosmeticsList.push(newProduct);
    res.json({ message: 'Thêm sản phẩm thành công!', product: newProduct });
  });
});
// update
app.put('/dishes/:id', (req, res) => {
  const { id } = req.params;
  const { ten, moTa, loai, thuongHieu, noiSanXuat, soLuong, gia } = req.body;
  const file = req.files ? req.files['product-image'] : null;

  const productIndex = CosmeticsList.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
  }

  if (!ten || !moTa || !loai || !thuongHieu || !noiSanXuat || !soLuong || !gia) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
  }

  const product = CosmeticsList[productIndex];
  let fileName = product.hinhAnh; 

  if (file) {
    fileName = `${id}_${file.name}`;
    const filePath = path.join(__dirname, 'public/images/products', fileName);
    file.mv(filePath, (err) => {
      if (err) {
        console.error('Lỗi khi lưu hình ảnh:', err);
        return res.status(500).json({ message: 'Lỗi khi lưu hình ảnh!' });
      }
    });
  }

  CosmeticsList[productIndex] = {
    ...product,
    ten,
    moTa,
    loai,
    thuongHieu,
    noiSanXuat,
    hinhAnh: fileName,
    inventory: {
      quantity: parseInt(soLuong),
      price: parseInt(gia)
    }
  };

  res.json({ message: 'Cập nhật sản phẩm thành công!', product: CosmeticsList[productIndex] });
});

// delete
app.delete('/dishes/:id', (req, res) => {
  const { id } = req.params;
  const index = CosmeticsList.findIndex(p => p.id === id);

  if (index === -1) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
  }

  const deletedProduct = CosmeticsList.splice(index, 1);
  res.json({ message: "Xóa thành công!", product: deletedProduct[0] });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'dsMyPham';
const collectionName = 'myPham';
let db, cosmeticsCollection;

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

// Hàm kết nối DB
async function connectDB() {
    try {
        await client.connect();
        console.log('Kết nối thành công đến MongoDB server');
        db = client.db(dbName);
        cosmeticsCollection = db.collection(collectionName);
        await cosmeticsCollection.createIndex({ id: 1 }, { unique: true, sparse: true });
        console.log(`Sử dụng database: ${dbName}`);
        console.log(`Sử dụng collection: ${collectionName}`);
        return true;
    } catch (err) {
        console.error('Kết nối đến MongoDB thất bại', err);
        throw err;
    }
}

// Hàm tạo ID tự động dựa trên mã danh mục
async function generateNextProductId(categoryCode) {
    if (!cosmeticsCollection) {
        throw new Error("Database collection is not available.");
    }
    if (!categoryCode || typeof categoryCode !== 'string' || categoryCode.length !== 4) {
        throw new Error("Invalid category code provided for ID generation.");
    }

    const lastProduct = await cosmeticsCollection
        .find({ id: { $regex: `^${categoryCode}` } })
        .sort({ id: -1 })
        .limit(1)
        .project({ id: 1 })
        .toArray();

    let nextSequence = 1;
    if (lastProduct.length > 0 && lastProduct[0].id) {
        const lastSequence = parseInt(lastProduct[0].id.slice(4), 10);
        if (!isNaN(lastSequence)) {
            nextSequence = lastSequence + 1;
        }
    }

    const formattedSequence = nextSequence.toString().padStart(4, '0');
    const newId = `${categoryCode}${formattedSequence}`;
    return newId;
}

// Routes cho các trang HTML tĩnh
app.get("/", (req, res) => {
    const filePath = path.join(__dirname, 'public/page/admin/products_Management.html');
    console.log("Resolved file path:", filePath);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        console.error("File không tồn tại tại:", filePath);
        res.status(404).send("File not found");
    }
});
app.get("/index", (req, res) => { res.sendFile(path.join(__dirname, 'public/page/user/index.html')); });
app.get("/add_product", (req, res) => { res.sendFile(path.join(__dirname, 'public/page/admin/add_product.html')); });
app.get("/edit_product", (req, res) => { res.sendFile(path.join(__dirname, 'public/page/admin/edit_product.html')); });
app.get("/product_detail", (req, res) => { res.sendFile(path.join(__dirname, 'public/page/user/product_detail.html')); });
app.get("/products", (req, res) => { res.sendFile(path.join(__dirname, 'public/page/user/products.html')); });

// --- API Routes ---

// Route để tạo ID tự động
app.get("/api/generate-id/:categoryCode", async (req, res) => {
    if (!cosmeticsCollection) {
        return res.status(503).json({ message: "Dịch vụ chưa sẵn sàng, đang kết nối DB..." });
    }
    const { categoryCode } = req.params;

    if (!categoryCode || categoryCode.length !== 4) {
        return res.status(400).json({ message: "Mã danh mục không hợp lệ." });
    }

    try {
        const nextId = await generateNextProductId(categoryCode.toUpperCase());
        res.json({ nextId });
    } catch (err) {
        console.error(`Lỗi khi tạo ID cho danh mục ${categoryCode}:`, err);
        res.status(500).json({ message: err.message || "Lỗi máy chủ khi tạo ID sản phẩm." });
    }
});

const categoryMap = {
    SERU: "Serum",
    KCNG: "Kem Chống Nắng",
    SRMT: "Sữa Rửa Mặt",
    TONR: "Toner",
    KDUG: "Kem Dưỡng",
    TCHT: "Tinh Chất",
    TTBC: "Tẩy Tế Bào Chết",
    XKOG: "Xịt Khoáng",
    TTRG: "Tẩy Trang",
    KDMT: "Kem Dưỡng Mắt",
    MNNG: "Mặt Nạ Ngủ",
    GDUG: "Gel Dưỡng",
    BDDA: "Bộ Dưỡng Da",
    MANA: "Mặt Nạ",
    STAM: "Sữa Tắm",
    DDUG: "Dầu Dưỡng",
    TDAU: "Tinh Dầu",
    GMUN: "Gel Trị Mụn",
    KLOT: "Kem Lót"
};

// Hàm chuyển đổi mã danh mục sang tên đầy đủ
function getCategoryName(code) {
    return categoryMap[code] || code;
}

// Lấy tất cả sản phẩm
app.get("/dishes", async (req, res) => {
    if (!cosmeticsCollection) {
        return res.status(503).json({ message: "Dịch vụ chưa sẵn sàng, đang kết nối DB..." });
    }
    try {
        const products = await cosmeticsCollection.find({}).toArray();
        const updatedProducts = products.map(product => ({
            ...product,
            loai: getCategoryName(product.loai)
        }));
        res.json(updatedProducts);
    } catch (err) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", err);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách sản phẩm!" });
    }
});

// Lấy một sản phẩm theo 'id'
app.get("/dishes/:id", async (req, res) => {
    if (!cosmeticsCollection) {
        return res.status(503).json({ message: "Dịch vụ chưa sẵn sàng, đang kết nối DB..." });
    }
    const { id } = req.params;
    try {
        const product = await cosmeticsCollection.findOne({ id: id });
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
        }
        res.json(product);
    } catch (err) {
        console.error(`Lỗi khi lấy sản phẩm ${id}:`, err);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy thông tin sản phẩm!" });
    }
});

// Thêm sản phẩm mới
app.post('/dishes', async (req, res) => {
    const { ten, moTa, loai, thuongHieu, noiSanXuat, soLuong, gia, dacTinh } = req.body;
    const file = req.files?.['product-image'];

    if (!ten || !moTa || !loai || !thuongHieu || !noiSanXuat || !soLuong || !gia || !file) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    if (typeof loai !== 'string' || loai.length !== 4) {
        return res.status(400).json({ message: 'Mã danh mục không hợp lệ.' });
    }

    try {
        const newId = await generateNextProductId(loai.toUpperCase());
        const fileName = `${newId}_${file.name}`;
        const filePath = path.join(__dirname, 'public/images/products', fileName);

        file.mv(filePath, async (err) => {
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
                dacTinh: JSON.parse(dacTinh || '{}'),
                ratings: []
            };

            try {
                await cosmeticsCollection.insertOne(newProduct);
                res.json({ message: 'Thêm sản phẩm thành công!', product: newProduct });
            } catch (err) {
                console.error('Lỗi khi thêm sản phẩm:', err);
                if (err.code === 11000) {
                    fs.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) console.error(`Lỗi khi xóa file ảnh ${fileName}:`, unlinkErr);
                    });
                    return res.status(409).json({ message: `Lỗi: ID sản phẩm '${newId}' đã tồn tại. Vui lòng thử lại.` });
                }
                res.status(500).json({ message: 'Lỗi máy chủ khi thêm sản phẩm!' });
            }
        });
    } catch (err) {
        console.error('Lỗi khi thêm sản phẩm:', err);
        res.status(500).json({ message: 'Lỗi máy chủ khi thêm sản phẩm!' });
    }
});

// Cập nhật sản phẩm theo 'id'
app.put('/dishes/:id', async (req, res) => {
    if (!cosmeticsCollection) {
        return res.status(503).json({ message: "Dịch vụ chưa sẵn sàng, đang kết nối DB..." });
    }
    const { id } = req.params;
    const { ten, moTa, loai, thuongHieu, origin, quantity, price, dacTinh } = req.body;
    const file = req.files ? req.files['product-image'] : null;

    if (!ten || !moTa || !loai || !thuongHieu || !origin || !quantity || !price) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin (Tên, Mô tả, Loại, Thương hiệu, Xuất xứ, Số lượng, Giá)!' });
    }

    try {
        const existingProduct = await cosmeticsCollection.findOne({ id: id });
        if (!existingProduct) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
        }

        let newImagePath = existingProduct.hinhAnh;
        let filePathToDelete = null;
        let newFilePath = null;

        if (file) {
            const oldFileName = existingProduct.hinhAnh.split('/').pop();
            filePathToDelete = path.join(uploadDir, oldFileName);
            const newFileName = `${id}_${file.name}`;
            newFilePath = path.join(uploadDir, newFileName);
            newImagePath = `/images/products/${newFileName}`;

            await new Promise((resolve, reject) => {
                file.mv(newFilePath, (err) => {
                    if (err) {
                        console.error('Lỗi khi lưu hình ảnh mới:', err);
                        reject(new Error('Lỗi khi lưu hình ảnh mới'));
                    } else {
                        resolve();
                    }
                });
            });
        }

        const updateFields = {
            ten: ten,
            moTa: moTa,
            loai: loai,
            thuongHieu: thuongHieu,
            hinhAnh: newImagePath,
            'inventory.origin': origin,
            'inventory.quantity': parseInt(quantity),
            'inventory.price': parseInt(price),
            'dacTinh': dacTinh,
            updatedAt: new Date()
        };

        const result = await cosmeticsCollection.findOneAndUpdate(
            { id: id },
            { $set: updateFields },
            { returnDocument: 'after' }
        );

        if (!result) {
            if (newFilePath && fs.existsSync(newFilePath)) {
                fs.unlink(newFilePath, (unlinkErr) => {
                    if (unlinkErr) console.error("Lỗi khi xóa file ảnh mới sau khi cập nhật DB thất bại:", unlinkErr);
                });
            }
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật (sau khi lưu file nếu có)!' });
        }

        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
            fs.unlink(filePathToDelete, (err) => {
                if (err) console.error("Lỗi khi xóa file ảnh cũ:", err);
                else console.log("Đã xóa file ảnh cũ:", filePathToDelete);
            });
        }

        res.json({ message: 'Cập nhật sản phẩm thành công!', product: result });
    } catch (err) {
        console.error(`Lỗi khi cập nhật sản phẩm ${id}:`, err);
        if (err.message && err.message.includes('Lỗi khi lưu hình ảnh mới')) {
            return res.status(500).json({ message: 'Lỗi khi lưu hình ảnh cập nhật!' });
        }
        res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật sản phẩm!' });
    }
});

// Xóa sản phẩm theo 'id'
app.delete('/dishes/:id', async (req, res) => {
    if (!cosmeticsCollection) {
        return res.status(503).json({ message: "Dịch vụ chưa sẵn sàng, đang kết nối DB..." });
    }
    const { id } = req.params;
    try {
        const productToDelete = await cosmeticsCollection.findOne({ id: id });

        if (!productToDelete) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
        }

        const result = await cosmeticsCollection.deleteOne({ id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm để xóa (sau khi kiểm tra)!" });
        }

        try {
            const imageFileName = productToDelete.hinhAnh.split('/').pop();
            const imagePath = path.join(uploadDir, imageFileName);
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error(`Lỗi khi xóa file hình ảnh ${imageFileName}:`, err);
                    } else {
                        console.log(`Đã xóa file hình ảnh: ${imageFileName}`);
                    }
                });
            } else {
                console.warn(`File hình ảnh không tồn tại để xóa: ${imagePath}`);
            }
        } catch (fileErr) {
            console.error(`Lỗi khi xử lý xóa file ảnh cho ${id}:`, fileErr);
        }

        res.json({ message: "Xóa thành công!", product: productToDelete });
    } catch (err) {
        console.error(`Lỗi khi xóa sản phẩm ${id}:`, err);
        res.status(500).json({ message: "Lỗi máy chủ khi xóa sản phẩm!" });
    }
});

// Khởi động server
connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Ứng dụng đang chạy tại http://localhost:${port}`);
            console.log(`Truy cập trang quản trị: http://localhost:${port}/`);
            console.log(`Truy cập trang người dùng: http://localhost:${port}/index`);
        });
    })
    .catch(err => {
        console.error("Không thể khởi động server do lỗi kết nối DB.");
        process.exit(1);
    });

process.on('SIGINT', async () => {
    console.log("Đang đóng kết nối MongoDB...");
    if (client && typeof client.close === 'function') {
        await client.close();
        console.log("Đã đóng kết nối MongoDB.");
    } else {
        console.log("Client MongoDB chưa được khởi tạo hoặc không có phương thức close.");
    }
    process.exit(0);
});
const express = require('express');
const path = require('path');
const app = express();
const port = 3001;
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
    const filePath = path.join(__dirname, 'public/page/index.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        console.error("File không tồn tại tại:", filePath);
        res.status(404).send("File not found");
    }
});
app.get("/products_Management", (req, res) => { res.sendFile(path.join(__dirname, 'public/page/products_Management.html')); });
app.get("/add_product", (req, res) => { res.sendFile(path.join(__dirname, 'public/page/add_product.html')); });
app.get("/edit_product", (req, res) => { res.sendFile(path.join(__dirname, 'public/page/edit_product.html')); });
app.get("/edit_many_product", (req, res) => { res.sendFile(path.join(__dirname, 'public/page/edit_many_product.html')); });
app.get("/product_detail", (req, res) => { res.sendFile(path.join(__dirname, 'public/page/product_detail.html')); });
app.get("/products", (req, res) => { res.sendFile(path.join(__dirname, 'public/page/products.html')); });

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
        product.loai = getCategoryName(product.loai);
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

    const quantity = parseInt(soLuong);
    const price = parseInt(gia);
    if (isNaN(quantity) || quantity < 0 || isNaN(price) || price < 0) {
        return res.status(400).json({ message: 'Số lượng và giá phải là số không âm!' });
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
                    quantity: quantity,
                    price: price
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

// Thêm nhiều sản phẩm từ file JSON
app.post('/dishes/bulk', async (req, res) => {
    if (!cosmeticsCollection) {
        return res.status(503).json({ message: "Dịch vụ chưa sẵn sàng, đang kết nối DB..." });
    }

    try {
        const { products } = req.body;
        const imageFiles = req.files ? req.files['image-files'] : [];

        if (!products) {
            return res.status(400).json({ message: 'Vui lòng cung cấp danh sách sản phẩm.' });
        }

        let parsedProducts;
        try {
            parsedProducts = JSON.parse(products);
            if (!Array.isArray(parsedProducts)) {
                return res.status(400).json({ message: 'Dữ liệu sản phẩm phải là một mảng.' });
            }
        } catch (error) {
            return res.status(400).json({ message: 'Dữ liệu JSON không hợp lệ.' });
        }

        const createdProducts = [];
        const errors = [];
        const productsToInsert = [];

        for (const product of parsedProducts) {
            const { ten, moTa, loai, thuongHieu, noiSanXuat, soLuong, gia, hinhAnh, dacTinh } = product;

            // Kiểm tra các trường bắt buộc
            const missingFields = [];
            if (!ten) missingFields.push('ten');
            if (!moTa) missingFields.push('moTa');
            if (!loai) missingFields.push('loai');
            if (!thuongHieu) missingFields.push('thuongHieu');
            if (!noiSanXuat) missingFields.push('noiSanXuat');
            if (soLuong === undefined || soLuong === null) missingFields.push('soLuong');
            if (gia === undefined || gia === null) missingFields.push('gia');
            if (!hinhAnh) missingFields.push('hinhAnh');

            if (missingFields.length > 0) {
                errors.push({ product: ten || 'Không xác định', message: `Thiếu các trường: ${missingFields.join(', ')}.` });
                continue;
            }

            // Kiểm tra định dạng danh mục
            if (typeof loai !== 'string' || loai.length !== 4) {
                errors.push({ product: ten, message: 'Mã danh mục không hợp lệ.' });
                continue;
            }

            // Kiểm tra kiểu dữ liệu và giá trị của soLuong và gia
            const quantity = parseInt(soLuong);
            const price = parseInt(gia);
            if (isNaN(quantity) || quantity < 0) {
                errors.push({ product: ten, message: `Số lượng (${soLuong}) phải là số không âm.` });
                continue;
            }
            if (isNaN(price) || price < 0) {
                errors.push({ product: ten, message: `Giá (${gia}) phải là số không âm.` });
                continue;
            }

            try {
                const newId = await generateNextProductId(loai.toUpperCase());
                const imageFile = Array.isArray(imageFiles) 
                    ? imageFiles.find(f => f.name === hinhAnh)
                    : (imageFiles && imageFiles.name === hinhAnh ? imageFiles : null);
                if (!imageFile) {
                    errors.push({ product: ten, message: `Không tìm thấy file ảnh '${hinhAnh}'.` });
                    continue;
                }

                const fileName = `${newId}_${imageFile.name}`;
                const filePath = path.join(uploadDir, fileName);
                await imageFile.mv(filePath);

                const newProduct = {
                    id: newId,
                    ten,
                    moTa,
                    loai,
                    thuongHieu,
                    noiSanXuat,
                    hinhAnh: fileName,
                    inventory: {
                        quantity: quantity,
                        price: price
                    },
                    dacTinh: dacTinh || {},
                    ratings: []
                };

                productsToInsert.push(newProduct);
                createdProducts.push(newProduct);
            } catch (err) {
                console.error(`Lỗi khi xử lý sản phẩm ${ten}:`, err);
                errors.push({ product: ten, message: err.message || 'Lỗi khi xử lý sản phẩm.' });
            }
        }

        if (productsToInsert.length > 0) {
            try {
                await cosmeticsCollection.insertMany(productsToInsert, { ordered: false });
            } catch (err) {
                console.error('Lỗi khi thêm nhiều sản phẩm:', err);
                for (const product of productsToInsert) {
                    const filePath = path.join(uploadDir, product.hinhAnh);
                    if (fs.existsSync(filePath)) {
                        fs.unlink(filePath, (unlinkErr) => {
                            if (unlinkErr) console.error(`Lỗi khi xóa file ảnh ${product.hinhAnh}:`, unlinkErr);
                        });
                    }
                }
                return res.status(500).json({ message: 'Lỗi khi lưu sản phẩm vào database.', errors });
            }
        }

        if (createdProducts.length === 0 && errors.length > 0) {
            return res.status(400).json({ message: 'Không thể tạo bất kỳ sản phẩm nào.', errors });
        }

        res.json({
            message: `Đã tạo thành công ${createdProducts.length} sản phẩm.`,
            createdProducts,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (err) {
        console.error('Lỗi khi tạo nhiều sản phẩm:', err);
        res.status(500).json({ message: 'Lỗi máy chủ khi tạo nhiều sản phẩm.' });
    }
});

// Cập nhật nhiều sản phẩm 
app.put('/dishes/bulk-update', async (req, res) => {
    console.log('--- Nhận yêu cầu PUT /dishes/bulk-update ---');
    if (!cosmeticsCollection) {
        return res.status(503).json({ message: "Dịch vụ chưa sẵn sàng, đang kết nối DB..." });
    }

    try {
        const { updates } = req.body;

        if (!updates || !Array.isArray(updates) || updates.length === 0) {
            console.log("-> Yêu cầu thất bại: Dữ liệu 'updates' không hợp lệ hoặc rỗng.");
            return res.status(400).json({ message: "Dữ liệu 'updates' không hợp lệ hoặc bị rỗng." });
        }

        const validationErrors = [];
        const validUpdates = [];

        for (let i = 0; i < updates.length; i++) {
            const update = updates[i];
            const { id, inventory } = update;
            const currentErrors = [];

            if (!id || typeof id !== 'string' || id.length !== 8) {
                currentErrors.push(`ID không hợp lệ`);
            }
            if (!inventory || typeof inventory !== 'object') {
                currentErrors.push(`Thiếu thông tin inventory`);
            } else {
                const price = inventory.price;
                const quantity = inventory.quantity;
                if (price === undefined || price === null || typeof price !== 'number' || price < 0) {
                    currentErrors.push(`Giá không hợp lệ (${price})`);
                }
                if (quantity === undefined || quantity === null || !Number.isInteger(quantity) || quantity < 0) {
                    currentErrors.push(`Số lượng không hợp lệ (${quantity})`);
                }
            }

            if (currentErrors.length > 0) {
                validationErrors.push({ index: i, id: id || 'N/A', errors: currentErrors.join(', ') });
            } else {
                validUpdates.push({ // Chỉ lấy dữ liệu cần thiết
                    id: id,
                    price: inventory.price,
                    quantity: inventory.quantity
                });
            }
        }

        if (validationErrors.length > 0) {
            console.warn("Lỗi validation dữ liệu bulk update:", validationErrors);
            return res.status(400).json({
                message: `Dữ liệu đầu vào không hợp lệ. ${validationErrors.length}/${updates.length} mục có lỗi.`,
                errors: validationErrors // Gửi chi tiết lỗi về client
            });
        }

        if (validUpdates.length === 0) { // Trường hợp này không nên xảy ra nếu validationErrors rỗng, nhưng để chắc chắn
             console.log("-> Không có dữ liệu cập nhật hợp lệ nào sau validation.");
             return res.status(400).json({ message: "Không có dữ liệu cập nhật hợp lệ nào được cung cấp." });
        }

        console.log(`Chuẩn bị cập nhật ${validUpdates.length} sản phẩm.`);

        const bulkOperations = validUpdates.map(update => ({
            updateOne: {
                filter: { id: update.id },
                update: {
                    $set: {
                        "inventory.price": update.price,
                        "inventory.quantity": update.quantity,
                        "updatedAt": new Date()
                    }
                }
            }
        }));

        const bulkResult = await cosmeticsCollection.bulkWrite(bulkOperations, { ordered: false });
        console.log("Kết quả bulkWrite:", {
            matchedCount: bulkResult.matchedCount,
            modifiedCount: bulkResult.modifiedCount,
            upsertedCount: bulkResult.upsertedCount,
            writeErrors: bulkResult.writeErrors?.length || 0 // Chỉ đếm số lỗi ghi
        });
         if (bulkResult.writeErrors?.length > 0) {
            console.error("Lỗi MongoDB bulkWrite chi tiết:", bulkResult.getWriteErrors());
        }


        const matchedCount = bulkResult.matchedCount || 0;
        const modifiedCount = bulkResult.modifiedCount || 0;

        let message = `Đã xử lý ${validUpdates.length} yêu cầu. `;
        let statusCode = 200;

        if (modifiedCount > 0) {
             message += `Cập nhật thành công ${modifiedCount} sản phẩm. `;
        }
        const notFoundCount = validUpdates.length - matchedCount;
        if (notFoundCount > 0) {
             message += `${notFoundCount} ID không được tìm thấy. `;
             if (modifiedCount === 0) { // Nếu không sửa được gì và có ID không tìm thấy
                 statusCode = notFoundCount === validUpdates.length ? 404 : 207; // 404 nếu tất cả đều không tìm thấy, 207 nếu một phần
                 if (statusCode === 404) message = `Không tìm thấy bất kỳ sản phẩm nào với các ID đã cung cấp.`;
             } else {
                 statusCode = 207; // Multi-Status nếu có cả thành công và không tìm thấy
             }
        }

        if (bulkResult.writeErrors?.length > 0) {
             // Nếu có lỗi ghi DB khác (ngoài lỗi không tìm thấy đã xử lý)
             statusCode = 500; // Lỗi server
             message = `Đã xảy ra lỗi trong quá trình cập nhật database (${bulkResult.writeErrors.length} lỗi). Vui lòng thử lại sau.`;
         }

        console.log(`-> Phản hồi: Status ${statusCode}, Message: ${message}`);
        res.status(statusCode).json({ message, matchedCount, modifiedCount });

    } catch (err) {
        console.error("!!! Lỗi nghiêm trọng khi xử lý PUT /dishes/bulk-update:", err);
        res.status(500).json({ message: "Lỗi máy chủ khi cập nhật hàng loạt: " + err.message });
    }
});

// Cập nhật sản phẩm theo 'id'
app.put('/dishes/:id', async (req, res) => {
    if (!cosmeticsCollection) {
        return res.status(503).json({ message: "Dịch vụ chưa sẵn sàng, đang kết nối DB..." });
    }
    const { id } = req.params;

    const { ten, moTa, loai, thuongHieu, noiSanXuat, soLuong, gia } = req.body;
    const file = req.files ? req.files['product-image'] : null;

    // Kiểm tra các trường bắt buộc
    if (!ten || !moTa || !loai || !thuongHieu || !noiSanXuat || !soLuong || !gia) {
        return res.status(400).json({ 
            message: 'Vui lòng điền đầy đủ thông tin (Tên, Mô tả, Loại, Thương hiệu, Xuất xứ, Số lượng, Giá)!' 
        });
    }

    // Kiểm tra định dạng mã danh mục
    if (typeof loai !== 'string' || loai.length !== 4) {
        return res.status(400).json({ message: 'Mã danh mục không hợp lệ (phải là chuỗi 4 ký tự)!' });
    }

    // Kiểm tra số lượng và giá
    const quantity = parseInt(soLuong);
    const price = parseInt(gia);
    if (isNaN(quantity) || quantity < 0 || isNaN(price) || price < 0) {
        return res.status(400).json({ message: 'Số lượng và giá phải là số không âm!' });
    }

    try {
        const existingProduct = await cosmeticsCollection.findOne({ id: id });
        if (!existingProduct) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
        }

        let newImagePath = existingProduct.hinhAnh;
        let filePathToDelete = null;
        let newFilePath = null;

        // Xử lý upload ảnh mới nếu có
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
            ten,
            moTa,
            loai: loai.toUpperCase(),
            thuongHieu,
            noiSanXuat,
            hinhAnh: newImagePath,
            inventory: {
                quantity,
                price
            },
            updatedAt: new Date()
        };

        const result = await cosmeticsCollection.findOneAndUpdate(
            { id: id },
            { $set: updateFields },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            if (newFilePath && fs.existsSync(newFilePath)) {
                fs.unlink(newFilePath, (unlinkErr) => {
                    if (unlinkErr) console.error("Lỗi khi xóa file ảnh mới sau khi cập nhật DB thất bại:", unlinkErr);
                });
            }
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật!' });
        }

        // Xóa ảnh cũ nếu có
        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
            fs.unlink(filePathToDelete, (err) => {
                if (err) {
                    console.error("Lỗi khi xóa file ảnh cũ:", err);
                } else {
                    console.log("Đã xóa file ảnh cũ:", filePathToDelete);
                }
            });
        }

        res.json({ message: 'Cập nhật sản phẩm thành công!', product: result.value });

    } catch (err) {
        console.error(`Lỗi khi cập nhật sản phẩm ${id}:`, err);
        if (err.message.includes('Lỗi khi lưu hình ảnh mới')) {
            return res.status(500).json({ message: 'Lỗi khi lưu hình ảnh cập nhật!' });
        }
        res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật sản phẩm!' });
    }
});

// Xóa nhiều sản phẩm
app.delete('/dishes/bulk', async (req, res) => {
    if (!cosmeticsCollection) {
        return res.status(503).json({ message: "Dịch vụ chưa sẵn sàng, đang kết nối DB..." });
    }

    try {
        const { ids } = req.body;

        // 1. Validate input IDs
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Danh sách ID không hợp lệ hoặc rỗng!" });
        }

        // Filter out any potentially invalid/empty IDs and ensure they are strings
        const validIds = ids.map(id => String(id).trim()).filter(id => id.length === 8); // Basic format check

        if (validIds.length === 0) {
             return res.status(400).json({ message: "Không có ID hợp lệ nào được cung cấp." });
        }

        console.log("Nhận được yêu cầu xóa các ID:", validIds);

        // 2. Find all products matching the valid IDs to get their image filenames
        const productsToDelete = await cosmeticsCollection.find(
            { id: { $in: validIds } },
            { projection: { _id: 0, id: 1, hinhAnh: 1 } } // Project only needed fields
        ).toArray();

        const foundIds = productsToDelete.map(p => p.id);
        const notFoundIds = validIds.filter(id => !foundIds.includes(id));

        if (productsToDelete.length === 0) {
            console.log("Không tìm thấy sản phẩm nào với các ID đã cho.");
            return res.status(404).json({ message: "Không tìm thấy sản phẩm nào để xóa với các ID đã cung cấp." });
        }

        console.log("Sản phẩm tìm thấy để xóa:", foundIds);
        if (notFoundIds.length > 0) {
            console.warn("Không tìm thấy các ID sau:", notFoundIds);
        }

        // 3. Delete the documents from the database
        const deleteResult = await cosmeticsCollection.deleteMany({ id: { $in: foundIds } }); // Use foundIds to ensure we only delete what we found
        console.log("Kết quả xóa DB:", deleteResult);

        if (deleteResult.deletedCount === 0) {
            // Should not happen if productsToDelete had items, but safety check
             console.error("Lỗi: Đã tìm thấy sản phẩm nhưng không thể xóa khỏi DB.");
            return res.status(500).json({ message: "Lỗi máy chủ: Không thể xóa sản phẩm khỏi database sau khi tìm thấy." });
        }

         if (deleteResult.deletedCount < foundIds.length) {
             console.warn(`Chỉ xóa được ${deleteResult.deletedCount}/${foundIds.length} sản phẩm tìm thấy.`);
             // This might indicate a race condition or other issue, but we proceed with file deletion for those deleted.
         }


        // 4. Attempt to delete associated image files for successfully found products
        console.log("Đang xóa các file ảnh liên quan...");
        productsToDelete.forEach(product => {
            if (product.hinhAnh) {
                const imagePath = path.join(uploadDir, product.hinhAnh);
                if (fs.existsSync(imagePath)) {
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error(`Lỗi khi xóa file hình ảnh ${product.hinhAnh} cho ID ${product.id}:`, err);
                            // Log error but continue
                        } else {
                            console.log(`Đã xóa file hình ảnh: ${product.hinhAnh} (ID: ${product.id})`);
                        }
                    });
                } else {
                    console.warn(`File hình ảnh không tồn tại để xóa: ${imagePath} (ID: ${product.id})`);
                }
            } else {
                console.warn(`Sản phẩm ID ${product.id} không có thông tin hinhAnh.`);
            }
        });

        // 5. Construct response message
        let message = `Đã xóa thành công ${deleteResult.deletedCount} sản phẩm.`;
        if (notFoundIds.length > 0) {
            message += ` Không tìm thấy các ID: ${notFoundIds.join(', ')}.`;
        }
        res.status(200).json({ message: message, deletedCount: deleteResult.deletedCount, notFoundIds: notFoundIds.length > 0 ? notFoundIds : undefined });

    } catch (err) {
        console.error("Lỗi nghiêm trọng khi xóa nhiều sản phẩm:", err);
        res.status(500).json({ message: "Lỗi máy chủ khi xóa nhiều sản phẩm: " + err.message });
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
            const imageFileName = productToDelete.hinhAnh;
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
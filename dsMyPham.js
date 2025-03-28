let dsMyPham =[
    {
        "id": "SP001",
        "ten": "Serum Dưỡng Trắng Da",
        "hinhAnh": "IMG01.jpg",
        "loai": "Serum",
        "thuongHieu": "Cocoon",
        "moTa": "Serum dưỡng trắng da từ thiên nhiên, giúp làm sáng và đều màu da.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 100,
            "price": 350000
        },
        "keyIngredient": "Niacinamide", 
        "ratings": [
            {
                "user": "user123",
                "rating": 4,
                "comment": "Tốt, dùng thích lắm, da sáng hơn sau 2 tuần."
            },
            {
                "user": "user456",
                "rating": 5,
                "comment": "Rất đáng tiền, hiệu quả rõ rệt."
            },
            {
                "user": "user789",
                "rating": 3,
                "comment": "Cũng được, nhưng hơi dính."
            }
        ]
    },
    {
        "id": "SP002",
        "ten": "Kem Chống Nắng Dưỡng Da",
        "hinhAnh": "IMG02.jpg",
        "loai": "Kem Chống Nắng",
        "thuongHieu": "Anessa",
        "moTa": "Kem chống nắng SPF 50+, bảo vệ da khỏi tia UV.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 50,
            "price": 420000
        },
        "spf": "SPF 50+",
        "ratings": [
            {
                "user": "user234",
                "rating": 5,
                "comment": "Chống nắng tốt, không bị nhờn."
            }
        ]
    },
    {
        "id": "SP003",
        "ten": "Sữa rửa mặt dịu nhẹ",
        "hinhAnh": "IMG03.jpg",
        "loai": "Sữa Rửa Mặt",
        "thuongHieu": "Senka",
        "moTa": "Sữa rửa mặt tạo bọt nhẹ nhàng, làm sạch sâu mà không gây khô da.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 75,
            "price": 180000
        },
        "suitableFor": "Mọi loại da",
        "ratings": [
            {
                "user": "user345",
                "rating": 4,
                "comment": "Rửa sạch, da mềm mịn."
            },
            {
                "user": "user567",
                "rating": 5,
                "comment": "Thích lắm, không khô da."
            },
            {
                "user": "user890",
                "rating": 3,
                "comment": "Tạm được, mùi hơi nồng."
            },
            {
                "user": "user901",
                "rating": 4,
                "comment": "Dùng ổn, giá hợp lý."
            },
            {
                "user": "user112",
                "rating": 5,
                "comment": "Rất thích, sẽ mua lại."
            }
        ]
    },
    {
        "id": "SP004",
        "ten": "Toner Cấp Ẩm",
        "hinhAnh": "IMG04.jpg",
        "loai": "Toner",
        "thuongHieu": "Hada Labo",
        "moTa": "Toner cấp ẩm, giúp cân bằng độ pH và làm dịu da.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 90,
            "price": 250000
        },
        "skinBenefit": "Hydration",
        "ratings": [
            {
                "user": "user223",
                "rating": 4,
                "comment": "Cấp ẩm tốt, da mềm hơn."
            },
            {
                "user": "user334",
                "rating": 5,
                "comment": "Rất thích, dùng hàng ngày."
            }
        ]
    },
    {
        "id": "SP005",
        "ten": "Kem Dưỡng Ban Đêm",
        "hinhAnh": "IMG05.jpg",
        "loai": "Kem Dưỡng",
        "thuongHieu": "Innisfree",
        "moTa": "Kem dưỡng sâu, giúp da mịn màng và đàn hồi hơn.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 60,
            "price": 380000
        },
        "usageTime": "Night",
        "ratings": [
            {
                "user": "user445",
                "rating": 5,
                "comment": "Da mịn hẳn sau 1 tháng dùng."
            },
            {
                "user": "user556",
                "rating": 4,
                "comment": "Tốt, nhưng thấm hơi chậm."
            },
            {
                "user": "user667",
                "rating": 5,
                "comment": "Rất đáng mua, da căng bóng."
            },
            {
                "user": "user778",
                "rating": 3,
                "comment": "Bình thường, không thấy khác biệt nhiều."
            }
        ]
    },
    {
        "id": "SP007",
        "ten": "Tinh Chất Trị Mụn",
        "hinhAnh": "IMG07.jpg",
        "loai": "Tinh Chất",
        "thuongHieu": "Some By Mi",
        "moTa": "Tinh chất giúp giảm viêm và làm dịu da hiệu quả.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 80,
            "price": 320000
        },
        "keyIngredient": "Tea Tree Oil",
        "ratings": [
            {
                "user": "user889",
                "rating": 4,
                "comment": "Mụn giảm sưng nhanh, thích lắm."
            }
        ]
    },
    {
        "id": "SP008",
        "ten": "Kem Tẩy Tế Bào Chết",
        "hinhAnh": "IMG08.pjg.webp",
        "loai": "Tẩy Tế Bào Chết",
        "thuongHieu": "St.Ives",
        "moTa": "Giúp loại bỏ tế bào chết, giúp da sáng hơn.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 85,
            "price": 200000
        },
        "exfoliationType": "Physical",
        "ratings": [
            {
                "user": "user990",
                "rating": 5,
                "comment": "Da sáng và mịn hơn sau khi dùng."
            },
            {
                "user": "user101",
                "rating": 4,
                "comment": "Tốt, nhưng hơi khô da."
            },
            {
                "user": "user202",
                "rating": 3,
                "comment": "Cũng được, không đặc biệt."
            }
        ]
    },
    {
        "id": "SP009",
        "ten": "Xịt Khoáng Dưỡng Da",
        "hinhAnh": "IMG09.jpg",
        "loai": "Xịt Khoáng",
        "thuongHieu": "Evoluderm",
        "moTa": "Xịt khoáng giúp cấp ẩm tức thì, làm dịu da.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 110,
            "price": 150000
        },
        "skinBenefit": "Hydration and Soothing",
        "ratings": [
            {
                "user": "user303",
                "rating": 5,
                "comment": "Rất tiện, dùng mọi lúc mọi nơi."
            },
            {
                "user": "user404",
                "rating": 4,
                "comment": "Cấp ẩm tốt, nhưng hơi nhanh hết."
            }
        ]
    },
    {
        "id": "SP010",
        "ten": "Serum Vitamin C",
        "hinhAnh": "IMG10.jpg",
        "loai": "Serum",
        "thuongHieu": "Melano CC",
        "moTa": "Serum vitamin C giúp làm sáng da và giảm thâm nám.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 70,
            "price": 400000
        },
        "keyIngredient": "Vitamin C",
        "ratings": [
            {
                "user": "user505",
                "rating": 5,
                "comment": "Da sáng rõ, thâm mờ đi nhiều."
            },
            {
                "user": "user606",
                "rating": 4,
                "comment": "Hiệu quả, nhưng hơi châm chích lúc đầu."
            },
            {
                "user": "user707",
                "rating": 5,
                "comment": "Rất thích, sẽ mua lại."
            },
            {
                "user": "user808",
                "rating": 4,
                "comment": "Tốt, nhưng giá hơi cao."
            }
        ]
    },
    {
        "id": "SP011",
        "ten": "Nước Tẩy Trang Micellar",
        "hinhAnh": "IMG11.jpg",
        "loai": "Tẩy Trang",
        "thuongHieu": "Bioderma",
        "moTa": "Nước tẩy trang dịu nhẹ, phù hợp với mọi loại da.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 90,
            "price": 270000
        },
        "formulaType": "Micellar Water",
        "ratings": [
            {
                "user": "user909",
                "rating": 5,
                "comment": "Tẩy trang sạch, không kích ứng."
            }
        ]
    },
    {
        "id": "SP012",
        "ten": "Kem Dưỡng Mắt",
        "hinhAnh": "IMG12.webp",
        "loai": "Kem Dưỡng Mắt",
        "thuongHieu": "Laneige",
        "moTa": "Kem dưỡng mắt giúp giảm quầng thâm và bọng mắt.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 40,
            "price": 450000
        },
        "skinConcern": "Dark Circles and Puffiness",
        "ratings": [
            {
                "user": "user010",
                "rating": 4,
                "comment": "Quầng thâm giảm, nhưng bọng mắt chưa cải thiện nhiều."
            },
            {
                "user": "user111",
                "rating": 3,
                "comment": "Tạm được, giá hơi cao."
            }
        ]
    },
    {
        "id": "SP013",
        "ten": "Serum Dưỡng Ẩm Hyaluronic Acid",
        "hinhAnh": "IMG13.jpg",
        "loai": "Serum",
        "thuongHieu": "L'Oréal",
        "moTa": "Serum cấp ẩm giúp da luôn căng bóng và mịn màng.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 100,
            "price": 380000
        },
        "keyIngredient": "Hyaluronic Acid",
        "ratings": [
            {
                "user": "user212",
                "rating": 5,
                "comment": "Da căng mịn, rất thích."
            },
            {
                "user": "user313",
                "rating": 4,
                "comment": "Cấp ẩm tốt, nhưng hơi dính."
            },
            {
                "user": "user414",
                "rating": 5,
                "comment": "Rất đáng tiền, da mềm mịn."
            }
        ]
    },
    {
        "id": "SP014",
        "ten": "Kem Dưỡng Trắng Da",
        "hinhAnh": "IMG14.jpg",
        "loai": "Kem Dưỡng",
        "thuongHieu": "Olay",
        "moTa": "Kem dưỡng trắng da giúp da sáng hơn sau một thời gian sử dụng.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 65,
            "price": 420000
        },
        "usageTime": "Day",
        "ratings": [
            {
                "user": "user515",
                "rating": 4,
                "comment": "Da sáng hơn, nhưng cần dùng lâu dài."
            }
        ]
    },
    {
        "id": "SP015",
        "ten": "Mặt Nạ Ngủ Dưỡng Ẩm",
        "hinhAnh": "IMG15.pjg.webp",
        "loai": "Mặt Nạ Ngủ",
        "thuongHieu": "Laneige",
        "moTa": "Mặt nạ ngủ giúp dưỡng ẩm sâu cho da suốt đêm.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 75,
            "price": 370000
        },
        "usageTime": "Night",
        "ratings": [
            {
                "user": "user616",
                "rating": 5,
                "comment": "Da mềm mịn, sáng rõ sau khi dùng."
            },
            {
                "user": "user717",
                "rating": 4,
                "comment": "Tốt, nhưng hơi dính khi ngủ."
            },
            {
                "user": "user818",
                "rating": 5,
                "comment": "Rất thích, da căng bóng."
            }
        ]
    },
    {
        "id": "SP016",
        "ten": "Serum Chống Lão Hóa",
        "hinhAnh": "IMG16.pjg.jpg",
        "loai": "Serum",
        "thuongHieu": "Estee Lauder",
        "moTa": "Serum chống lão hóa giúp da căng mịn và giảm nếp nhăn.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 45,
            "price": 1200000
        },
        "keyIngredient": "Retinol",
        "ratings": [
            {
                "user": "user919",
                "rating": 5,
                "comment": "Da căng mịn, nếp nhăn giảm rõ."
            },
            {
                "user": "user020",
                "rating": 4,
                "comment": "Hiệu quả, nhưng giá cao."
            }
        ]
    },
    {
        "id": "SP017",
        "ten": "Nước Hoa Hồng Se Khít Lỗ Chân Lông",
        "hinhAnh": "IMG17.pjg.jpg",
        "loai": "Toner",
        "thuongHieu": "Thayers",
        "moTa": "Nước hoa hồng giúp thu nhỏ lỗ chân lông và cân bằng da.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 80,
            "price": 290000
        },
        "skinBenefit": "Pore-Tightening",
        "ratings": [
            {
                "user": "user121",
                "rating": 4,
                "comment": "Lỗ chân lông nhỏ hơn, da mịn."
            },
            {
                "user": "user222",
                "rating": 5,
                "comment": "Rất thích, mùi dễ chịu."
            },
            {
                "user": "user323",
                "rating": 3,
                "comment": "Tạm được, không thấy khác biệt nhiều."
            }
        ]
    },
    {
        "id": "SP018",
        "ten": "Gel Dưỡng Ẩm Lô Hội",
        "hinhAnh": "IMG18.pjg.jpg",
        "loai": "Gel Dưỡng",
        "thuongHieu": "Nature Republic",
        "moTa": "Gel lô hội giúp cấp ẩm tức thì và làm dịu da.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 120,
            "price": 180000
        },
        "keyIngredient": "Aloe Vera",
        "ratings": [
            {
                "user": "user424",
                "rating": 5,
                "comment": "Dịu da, cấp ẩm tốt."
            }
        ]
    },
    {
        "id": "SP019",
        "ten": "Serum Trị Nám",
        "hinhAnh": "IMG19.pjg.webp",
        "loai": "Serum",
        "thuongHieu": "Obagi",
        "moTa": "Serum trị nám giúp làm mờ vết thâm và tăng độ sáng cho da.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 50,
            "price": 980000
        },
        "keyIngredient": "Hydroquinone",
        "ratings": [
            {
                "user": "user525",
                "rating": 5,
                "comment": "Thâm mờ đi nhiều, da sáng hơn."
            },
            {
                "user": "user626",
                "rating": 4,
                "comment": "Hiệu quả, nhưng cần kiên trì."
            },
            {
                "user": "user727",
                "rating": 5,
                "comment": "Rất đáng tiền, hiệu quả rõ rệt."
            }
        ]
    },
    {
        "id": "SP020",
        "ten": "Bộ Dưỡng Da 5 Món",
        "hinhAnh": "IMG20.pjg.jpg",
        "loai": "Bộ Dưỡng Da",
        "thuongHieu": "The Face Shop",
        "moTa": "Bộ dưỡng da gồm toner, serum, kem dưỡng, mặt nạ và kem mắt.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 30,
            "price": 1300000
        },
        "kitComponents": ["Toner", "Serum", "Kem Dưỡng", "Mặt Nạ", "Kem Mắt"],
        "ratings": [
            {
                "user": "user828",
                "rating": 5,
                "comment": "Bộ sản phẩm đầy đủ, rất tiện lợi."
            },
            {
                "user": "user929",
                "rating": 4,
                "comment": "Tốt, nhưng giá hơi cao."
            }
        ]
    },
    {
        "id": "SP021",
        "ten": "Mặt Nạ Than Hoạt Tính",
        "hinhAnh": "IMG41.jpg",
        "loai": "Mặt Nạ",
        "thuongHieu": "The Body Shop",
        "moTa": "Mặt nạ giúp loại bỏ độc tố và làm sạch sâu lỗ chân lông.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 50,
            "price": 320000
        },
        "maskType": "Detox",
        "ratings": [
            {
                "user": "user030",
                "rating": 4,
                "comment": "Làm sạch tốt, da mịn hơn."
            },
            {
                "user": "user131",
                "rating": 5,
                "comment": "Rất thích, da sạch sâu."
            },
            {
                "user": "user232",
                "rating": 3,
                "comment": "Tạm được, hơi khô da."
            }
        ]
    },
    {
        "id": "SP022",
        "ten": "Sữa Tắm Dưỡng Ẩm",
        "hinhAnh": "IMG42.jpg",
        "loai": "Sữa Tắm",
        "thuongHieu": "Dove",
        "moTa": "Sữa tắm giúp da mềm mịn và cung cấp độ ẩm tự nhiên.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 90,
            "price": 180000
        },
        "skinBenefit": "Hydration",
        "ratings": [
            {
                "user": "user333",
                "rating": 5,
                "comment": "Da mềm mịn, mùi thơm dễ chịu."
            }
        ]
    },
    {
        "id": "SP023",
        "ten": "Serum Ngăn Ngừa Mụn",
        "hinhAnh": "IMG43.jpg",
        "loai": "Serum",
        "thuongHieu": "La Roche-Posay",
        "moTa": "Serum giúp giảm viêm, ngăn ngừa và điều trị mụn hiệu quả.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 60,
            "price": 500000
        },
        "keyIngredient": "Salicylic Acid",
        "ratings": [
            {
                "user": "user434",
                "rating": 5,
                "comment": "Mụn giảm rõ, da đỡ dầu."
            },
            {
                "user": "user535",
                "rating": 4,
                "comment": "Tốt, nhưng hơi khô da."
            },
            {
                "user": "user636",
                "rating": 5,
                "comment": "Rất hiệu quả, đáng mua."
            }
        ]
    },
    {
        "id": "SP024",
        "ten": "Dầu Dưỡng Da Argan",
        "hinhAnh": "IMG44.jpg",
        "loai": "Dầu Dưỡng",
        "thuongHieu": "OGX",
        "moTa": "Dầu dưỡng giúp da mịn màng, giảm nếp nhăn và khô ráp.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 45,
            "price": 450000
        },
        "keyIngredient": "Argan Oil",
        "ratings": [
            {
                "user": "user737",
                "rating": 4,
                "comment": "Da mịn, nhưng hơi nhờn."
            },
            {
                "user": "user838",
                "rating": 5,
                "comment": "Rất thích, da mềm mịn."
            }
        ]
    },
    {
        "id": "SP025",
        "ten": "Tinh Dầu Tràm Trà",
        "hinhAnh": "IMG45.jpg",
        "loai": "Tinh Dầu",
        "thuongHieu": "The Body Shop",
        "moTa": "Tinh dầu tràm trà hỗ trợ trị mụn và làm dịu da.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 70,
            "price": 220000
        },
        "usage": "Topical Application",
        "ratings": [
            {
                "user": "user939",
                "rating": 5,
                "comment": "Trị mụn tốt, rất hiệu quả."
            },
            {
                "user": "user040",
                "rating": 4,
                "comment": "Tốt, nhưng mùi hơi mạnh."
            },
            {
                "user": "user141",
                "rating": 5,
                "comment": "Rất thích, mụn giảm nhanh."
            }
        ]
    },
    {
        "id": "SP026",
        "ten": "Kem Dưỡng Ẩm Da Tay",
        "hinhAnh": "IMG46.jpg",
        "loai": "Kem Dưỡng",
        "thuongHieu": "Vaseline",
        "moTa": "Kem dưỡng giúp tay mềm mại và không bị khô nứt.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 100,
            "price": 120000
        },
        "usageTime": "Anytime",
        "ratings": [
            {
                "user": "user242",
                "rating": 5,
                "comment": "Tay mềm mịn, không khô nữa."
            }
        ]
    },
    {
        "id": "SP027",
        "ten": "Mặt Nạ Nghệ",
        "hinhAnh": "IMG47.jpg",
        "loai": "Mặt Nạ",
        "thuongHieu": "Kiehl’s",
        "moTa": "Mặt nạ giúp giảm thâm, sáng da và ngăn ngừa mụn.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 80,
            "price": 480000
        },
        "maskType": "Brightening",
        "ratings": [
            {
                "user": "user343",
                "rating": 5,
                "comment": "Da sáng hơn, thâm giảm rõ."
            },
            {
                "user": "user444",
                "rating": 4,
                "comment": "Tốt, nhưng giá hơi cao."
            },
            {
                "user": "user545",
                "rating": 5,
                "comment": "Rất thích, da mịn màng."
            }
        ]
    },
    {
        "id": "SP028",
        "ten": "Bọt Rửa Mặt Vitamin C",
        "hinhAnh": "IMG48.jpg",
        "loai": "Sữa Rửa Mặt",
        "thuongHieu": "Some By Mi",
        "moTa": "Bọt rửa mặt chứa vitamin C giúp da sáng và tươi trẻ hơn.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 75,
            "price": 210000
        },
        "suitableFor": "Da dầu và da hỗn hợp",
        "ratings": [
            {
                "user": "user646",
                "rating": 4,
                "comment": "Da sáng hơn, nhưng hơi khô."
            },
            {
                "user": "user747",
                "rating": 5,
                "comment": "Rất thích, da sạch và sáng."
            }
        ]
    },
    {
        "id": "SP029",
        "ten": "Kem Dưỡng Chống Lão Hóa",
        "hinhAnh": "IMG49.jpg",
        "loai": "Kem Dưỡng",
        "thuongHieu": "SK-II",
        "moTa": "Kem dưỡng chống lão hóa, giúp da căng bóng và trẻ trung.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 35,
            "price": 2300000
        },
        "usageTime": "Night",
        "ratings": [
            {
                "user": "user848",
                "rating": 5,
                "comment": "Da căng bóng, rất đáng tiền."
            },
            {
                "user": "user949",
                "rating": 4,
                "comment": "Hiệu quả, nhưng giá cao."
            },
            {
                "user": "user050",
                "rating": 5,
                "comment": "Rất thích, da trẻ trung hơn."
            }
        ]
    },
    {
        "id": "SP030",
        "ten": "Tẩy Trang Dầu Olive",
        "hinhAnh": "IMG50.jpg",
        "loai": "Tẩy Trang",
        "thuongHieu": "DHC",
        "moTa": "Dầu tẩy trang dịu nhẹ, làm sạch lớp trang điểm hoàn hảo.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 65,
            "price": 350000
        },
        "formulaType": "Oil-Based",
        "ratings": [
            {
                "user": "user151",
                "rating": 5,
                "comment": "Tẩy trang sạch, không kích ứng."
            }
        ]
    },
    {
        "id": "SP031",
        "ten": "Kem Lót Dưỡng Ẩm",
        "hinhAnh": "IMG51.jpg",
        "loai": "Kem Lót",
        "thuongHieu": "MAC",
        "moTa": "Kem lót giúp giữ lớp trang điểm lâu trôi và cấp ẩm.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 40,
            "price": 650000
        },
        "finish": "Dewy",
        "ratings": [
            {
                "user": "user252",
                "rating": 4,
                "comment": "Lớp trang điểm đẹp, nhưng giá cao."
            },
            {
                "user": "user353",
                "rating": 5,
                "comment": "Rất thích, da mịn và đều màu."
            }
        ]
    },
    {
        "id": "SP032",
        "ten": "Gel Trị Thâm Mụn",
        "hinhAnh": "IMG52.jpg",
        "loai": "Gel Trị Mụn",
        "thuongHieu": "Acnes",
        "moTa": "Gel trị mụn giúp giảm sưng viêm, ngăn ngừa thâm mụn hiệu quả.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 95,
            "price": 170000
        },
        "keyIngredient": "Benzoyl Peroxide",
        "ratings": [
            {
                "user": "user454",
                "rating": 4,
                "comment": "Mụn giảm sưng, thâm cũng mờ."
            },
            {
                "user": "user555",
                "rating": 5,
                "comment": "Rất hiệu quả, giá rẻ."
            },
            {
                "user": "user656",
                "rating": 3,
                "comment": "Tạm được, hơi khô da."
            }
        ]
    },
    {
        "id": "SP033",
        "ten": "Xịt Khoáng Tảo Biển",
        "hinhAnh": "IMG53.jpg",
        "loai": "Xịt Khoáng",
        "thuongHieu": "Vichy",
        "moTa": "Xịt khoáng giúp cấp ẩm và làm dịu da tức thì.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 85,
            "price": 230000
        },
        "skinBenefit": "Hydration and Soothing",
        "ratings": [
            {
                "user": "user757",
                "rating": 5,
                "comment": "Cấp ẩm tốt, rất tiện lợi."
            },
            {
                "user": "user858",
                "rating": 4,
                "comment": "Tốt, nhưng hơi nhanh hết."
            }
        ]
    },
    {
        "id": "SP034",
        "ten": "Kem Chống Nắng Kiềm Dầu",
        "hinhAnh": "IMG54.jpg",
        "loai": "Kem Chống Nắng",
        "thuongHieu": "Biore",
        "moTa": "Kem chống nắng giúp kiềm dầu và bảo vệ da khỏi tia UV.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 120,
            "price": 190000
        },
        "spf": "SPF 50",
        "ratings": [
            {
                "user": "user959",
                "rating": 5,
                "comment": "Kiềm dầu tốt, không bị bóng nhờn."
            },
            {
                "user": "user060",
                "rating": 4,
                "comment": "Tốt, nhưng cần thoa lại sau vài giờ."
            },
            {
                "user": "user161",
                "rating": 5,
                "comment": "Rất thích, bảo vệ da tốt."
            }
        ]
    },
    {
        "id": "SP035",
        "ten": "Nước Tẩy Trang Trà Xanh",
        "hinhAnh": "IMG55.jpg",
        "loai": "Tẩy Trang",
        "thuongHieu": "Cocoon",
        "moTa": "Nước tẩy trang chiết xuất trà xanh giúp làm sạch da nhẹ nhàng, giảm dầu nhờn và kháng khuẩn.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 80,
            "price": 190000
        },
        "formulaType": "Micellar Water",
        "ratings": [
            {
                "user": "user262",
                "rating": 5,
                "comment": "Tẩy trang sạch, da không bị khô."
            }
        ]
    },
    {
        "id": "SP3636",
        "ten": "Sữa Rửa Mặt Nghệ Hạt Mơ",
        "hinhAnh": "IMG56.jpg",
        "loai": "Sữa Rửa Mặt",
        "thuongHieu": "Thorakao",
        "moTa": "Sữa rửa mặt chiết xuất từ nghệ và hạt mơ giúp làm sạch sâu, giảm mụn và sáng da.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 100,
            "price": 120000
        },
        "suitableFor": "Da dầu và da mụn",
        "ratings": [
            {
                "user": "user363",
                "rating": 4,
                "comment": "Rửa sạch, giảm mụn tốt."
            },
            {
                "user": "user464",
                "rating": 5,
                "comment": "Rất thích, da sáng hơn."
            },
            {
                "user": "user565",
                "rating": 3,
                "comment": "Tạm được, hơi khô da."
            }
        ]
    },
    {
        "id": "SP377",
        "ten": "Kem Dưỡng Da Mật Ong",
        "hinhAnh": "IMG57.jpg",
        "loai": "Kem Dưỡng",
        "thuongHieu": "Cocoon",
        "moTa": "Kem dưỡng da mật ong giúp cấp ẩm, làm mềm và bảo vệ da khỏi tác động môi trường.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 60,
            "price": 280000
        },
        "usageTime": "Anytime",
        "ratings": [
            {
                "user": "user666",
                "rating": 5,
                "comment": "Da mềm mịn, rất thích."
            },
            {
                "user": "user767",
                "rating": 4,
                "comment": "Tốt, nhưng thấm hơi chậm."
            }
        ]
    },
    {
        "id": "SP3838",
        "ten": "Mặt Nạ Ngủ Trà Xanh",
        "hinhAnh": "IMG58.jpg",
        "loai": "Mặt Nạ Ngủ",
        "thuongHieu": "Innisfree",
        "moTa": "Mặt nạ ngủ chiết xuất trà xanh giúp tái tạo da, cung cấp độ ẩm suốt đêm.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 70,
            "price": 300000
        },
        "usageTime": "Night",
        "ratings": [
            {
                "user": "user868",
                "rating": 5,
                "comment": "Da mềm mịn, rất thích."
            },
            {
                "user": "user969",
                "rating": 4,
                "comment": "Tốt, nhưng hơi dính."
            },
            {
                "user": "user070",
                "rating": 5,
                "comment": "Rất đáng mua, da căng bóng."
            }
        ]
    },
    {
        "id": "SP3939",
        "ten": "Toner Hoa Hồng",
        "hinhAnh": "IMG59.jpg",
        "loai": "Toner",
        "thuongHieu": "Caryophy",
        "moTa": "Nước cân bằng hoa hồng giúp cấp ẩm, làm dịu da và se khít lỗ chân lông.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 90,
            "price": 250000
        },
        "skinBenefit": "Pore-Tightening",
        "ratings": [
            {
                "user": "user171",
                "rating": 5,
                "comment": "Rất thích, da mịn và lỗ chân lông nhỏ hơn."
            },
            {
                "user": "user272",
                "rating": 4,
                "comment": "Tốt, nhưng mùi hơi nồng."
            }
        ]
    },
    {
        "id": "SP4040",
        "ten": "Serum Dưỡng Ẩm Hyaluronic",
        "hinhAnh": "IMG60.jpg",
        "loai": "Serum",
        "thuongHieu": "Hada Labo",
        "moTa": "Serum dưỡng ẩm chứa Hyaluronic Acid giúp cấp nước, duy trì độ ẩm cho da căng mịn.",
        "inventory": {
            "origin": "Việt Nam",
            "quantity": 85,
            "price": 320000
        },
        "keyIngredient": "Hyaluronic Acid",
        "ratings": [
            {
                "user": "user373",
                "rating": 5,
                "comment": "Da căng mịn, rất thích."
            },
            {
                "user": "user474",
                "rating": 4,
                "comment": "Cấp ẩm tốt, nhưng hơi dính."
            },
            {
                "user": "user575",
                "rating": 5,
                "comment": "Rất đáng mua, da mềm mịn."
            }
        ]
    }
]

module.exports = { dsMyPham };
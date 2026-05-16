// Bài 1: Tình huống Automation: Bạn cần kiểm tra xem tính năng Giảm giá (Discount) trên trang Shopee hoạt động có đúng logic toán học không.

// Dữ liệu đầu vào:

// Giá gốc (Lấy từ UI - String): " 1.000.000 đ "
// Phần trăm giảm (Lấy từ DB - Number): 20 (tức là 20%)
// Giá sau giảm (Lấy từ UI - String): " 800.000 đ "
// Yêu cầu: Viết code để:

// Làm sạch và chuyển đổi Giá gốc về Number.
// Tính toán giá mong đợi: Giá gốc * (100 - 20) / 100.

let originalPrice = " 1.000.000 đ ";
let discountPercent = 20;
let discountedPrice = " 800.000 đ ";

// Làm sạch và chuyển đổi Giá gốc về Number
let originalPriceCleaned = originalPrice.replace('.', '').replace('.', '').replace(' đ', '').trim();
 originalPrice = parseFloat(originalPriceCleaned);

// Tính toán giá mong đợi
let expectedPrice = originalPrice * (100 - discountPercent) / 100;
console.log("Giá sau giảm mong đợi là:", expectedPrice);



// Bài 2: Hóa đơn: Bạn đang viết script test cho trang thương mại điện tử. Bạn lấy được thông tin đơn hàng từ giao diện web, nhưng dữ liệu trả về rất “bẩn” (lẫn lộn chữ, số, ký tự lạ, khoảng trắng).

// Nhiệm vụ của bạn là làm sạch chúng, tính toán tổng tiền, và in ra một cái Hóa đơn (Receipt) chuẩn chỉnh.
// Dữ liệu đầu vào
// let tenSanPham = "   macbook pro m3   ";
// let giaGoc = "Price: 30,000,000 vnđ";
// let soLuong = "Sl: 2 máy";
// let maGiamGia = "DISCOUNT CODE: 10% OFF";
// Bạn phải viết code xử lý để khi chạy console.log, màn hình hiện ra y hệt như sau:
// HÓA ĐƠN THANH TOÁN - ID: #0002
// Sản phẩm: MACBOOK PRO M3
// Đơn giá: 30000000
// Số lượng: 2
// Tổng tiền (Gốc): 60000000
// Giảm giá: 10%
// THÀNH TIỀN: 54.000.000 VNĐ

let tenSanPham = "   macbook pro m3   ";
let giaGoc = "Price: 30,000,000 vnđ";
let soLuong = "Sl: 2 máy";
let maGiamGia = "DISCOUNT CODE: 10% OFF";
// Làm sạch data
tenSanPhamCleaned = tenSanPham.trim().toUpperCase()
giaGocCleaned =parseInt( giaGoc.replace(",","").replace(",","").replace("Price:","").replace("vnđ","").trim());
soLuongCleaned = parseInt(soLuong.replace("Sl:","").replace("máy","").trim())
giamGiaCleaned = parseInt(maGiamGia.replace("DISCOUNT CODE:","").replace("OFF","").replace("%","").trim())
// Tính tổng tiền sau khi giảm giá
tongTien = soLuongCleaned * giaGocCleaned
thanhTien = tongTien - giamGiaCleaned*tongTien/100
console.log(`Sản phẩm: ${tenSanPhamCleaned}`+ '\n' +`Đơn giá: ${giaGocCleaned}` + '\n' +`Số lượng: ${soLuongCleaned}` + '\n' +`Tổng tiền (Gốc): ${tongTien}` + '\n' +`Giảm giá: ${giamGiaCleaned}%` + '\n' + `THÀNH TIỀN: ${thanhTien} VNĐ`)


let slug = " Playwright Basic First test"
let slugCleaned = slug.trim().replaceAll(" ","-").toLowerCase()
console.log(slugCleaned)

let text = "  sale   "
let amount = 9.5
let amountCleaned = amount.toFixed(2).padStart(6,"0")
console.log(amountCleaned);

let price = 54000000
let priceCleaned = price.toLocaleString('vi-VN', 
    { style: 'currency', currency: 'VND' })
console.log(priceCleaned);


let userAge = 20;
let passwordInput = "Neko1234";
let isTermAccepted  = true;
let isPasswordValid = passwordInput.length == 8;
let isAgeValid = userAge >= 18;
let isSubmitButtonEnabled = isPasswordValid && isAgeValid && isTermAccepted;
console.log("Submit button enabled:", isSubmitButtonEnabled);


let retries = 2;
let firstLog = retries;
retries++;
++retries;
let secondLog = retries;
retries--;
let canRetry = retries > 3
console.log("First log:", firstLog);
console.log("Second log:", secondLog);
console.log("Can retry:", canRetry);

let rawAge = "  25 tuổi ";
let rawIsVip = true;
let rawTicketPrice = "   500.000d"
// Làm sạch và ép kiểu
let rawAgeFinal = Number(rawAge.replace("tuổi","").trim());
let rawTicketPriceFinal = Number(rawTicketPrice.replace(".","").replace("d","").trim());

// kiểm tra điều kiện: Nếu KH > 18 tuổi và là thành viên VIP -> giảm 30%
let isDiscounted = rawAgeFinal > 18 && rawIsVip == true;
let discountedPriceFinal = rawTicketPriceFinal * 0.7
discountedPriceFinal = discountedPriceFinal.toLocaleString('vi-VN', 
    { style: 'currency', currency: 'VND' });

console.log("Giá vé sau khi giảm:", discountedPriceFinal);

let loginStatus = "locked";
if(loginStatus === "success"){
    console.log("Test pass: login thành công");
}else if(loginStatus === 'locked'){
    console.log("Tài khoản bị khoá");
}else{
    console.log("Test failed: thất bại");
}

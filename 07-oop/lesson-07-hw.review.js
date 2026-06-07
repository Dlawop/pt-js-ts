// ============================================================
// FILE REVIEW - HW07 OOP - Dlawop
// Kết quả chạy: code CHẠY ĐƯỢC, không lỗi runtime.
// Tổng quan: Bài 1 nắm được OOP cơ bản nhưng findByName/filterByCategory/
//            getAvailableProducts bị lỗi logic (trả 1 object thay vì mảng).
//            Bài 2 có nhiều lỗi nghiêm trọng: addItem báo lỗi trùng tên
//            thay vì gộp quantity, applyCoupon không xử lý, checkout sai số.
// ============================================================

// ### Bài 1: Quản lý danh sách sản phẩm

class ProductStore {
  // Đúng: Dùng private field #products.
  #products = [];
  // Góp ý: Field productIdList không dùng đến -> nên xóa cho gọn.
  productIdList = [];

  addProduct(product) {
    // Đúng: Dùng .some() check trùng ID -> gọn.
    // Đúng: Validate đủ 5 điều kiện, message rõ ràng.
    // Góp ý: Nên viết message tiếng Việt cho đồng nhất với message thành công
    //        và với đề bài (đang dùng tiếng Anh: "Duplicated ID", "Name should not be blank"...).
    if (this.#products.some((p) => p.id === product.id)) {
      return {
        success: false,
        message: "Duplicated ID",
      };
    } else if (product.name.trim() === "") {
      return {
        success: false,
        message: "Name should not be blank",
      };
    } else if (product.category.trim() === "") {
      return {
        success: false,
        message: "Category should not be blank",
      };
      // Đúng: price <= 0 -> chặn được cả 0 và âm.
    } else if (product.price <= 0) {
      return {
        success: false,
        message: "Price should greater than 0",
      };
    } else if (typeof product.inStock !== "boolean") {
      return {
        success: false,
        message: "inStock should be boolean",
      };
    } else {
      // Đúng: Lưu nguyên object, không toLowerCase -> giữ format gốc. Tốt!
      this.#products.push(product);
      return {
        success: true,
        message: "Thêm sản phẩm thành công",
      };
    }
  }

  // SAI: Dùng vòng for và return ngay phần tử ĐẦU TIÊN tìm thấy.
  //      Kết quả: chỉ trả về 1 OBJECT, không phải MẢNG.
  //      Nếu có 2 sản phẩm cùng chứa keyword (vd "air" khớp cả MacBook Air
  //      và AirPods Pro) -> chỉ nhận được cái đầu tiên.
  //      Đề yêu cầu trả về DANH SÁCH (mảng) các sản phẩm khớp.
  // Gợi ý sửa: dùng .filter() thay vì for:
  //   findByName(keyword) {
  //     const word = keyword.trim().toLowerCase();
  //     return this.#products.filter((product) => {
  //       return product.name.trim().toLowerCase().includes(word);
  //     });
  //   }
  findByName(keyword) {
    for (let product of this.#products) {
      let name = product.name.trim().toLowerCase();
      if (name.includes(keyword.trim().toLowerCase())) {
        return product;
      }
    }
  }

  // SAI (giống findByName): Dùng for và return ngay phần tử đầu tiên.
  //      Kết quả: trả về 1 OBJECT thay vì MẢNG các sản phẩm cùng category.
  //      Nếu có 2 sản phẩm category "phone" -> chỉ nhận được 1.
  // Gợi ý sửa: dùng .filter():
  //   filterByCategory(category) {
  //     const cat = category.trim().toLowerCase();
  //     return this.#products.filter((product) => {
  //       return product.category.trim().toLowerCase() === cat;
  //     });
  //   }
  filterByCategory(category) {
    for (let product of this.#products) {
      if (
        category.trim().toLowerCase() === product.category.trim().toLowerCase()
      ) {
        return product;
      }
    }
  }

  // SAI (giống 2 method trên): Chỉ trả về 1 sản phẩm còn hàng đầu tiên,
  //      không phải DANH SÁCH tất cả sản phẩm còn hàng.
  // Gợi ý sửa: dùng .filter():
  //   getAvailableProducts() {
  //     return this.#products.filter((product) => product.inStock === true);
  //   }
  getAvailableProducts() {
    for (let product of this.#products) {
      if (product.inStock === true) {
        return product;
      }
    }
  }

  // Đúng: Duyệt tất cả sản phẩm còn hàng, cộng dồn giá. Trả về tổng.
  //       Đây là method DUY NHẤT trong 4 method dùng vòng for đúng cách,
  //       vì nó cần TÍNH TỔNG (duyệt hết), không phải tìm 1 phần tử.
  getTotalInventoryValue() {
    let totalInventory = 0;
    for (let product of this.#products) {
      if (product.inStock === true) {
        totalInventory += product.price;
      }
    }
    return totalInventory;
  }
}

// Đúng: Kế thừa + super() đúng. getDiscountInfo trả object đủ 4 field.
// ===== CLASS KẾ THỪA =====
class DiscountProductStore extends ProductStore {
  constructor(discountRate) {
    super();
    this.discountRate = discountRate;
  }

  // Đúng: Gọi super.getTotalInventoryValue() rồi áp discount.
  getTotalInventoryValue() {
    const originalTotal = super.getTotalInventoryValue();
    return originalTotal * (1 - this.discountRate);
  }

  // Đúng: Trả object đủ 4 trường, số liệu khớp 100% với đề.
  getDiscountInfo() {
    const originalTotal = super.getTotalInventoryValue();
    const discountAmount = originalTotal * this.discountRate;
    const finalTotal = originalTotal - discountAmount;
    return {
      originalTotal,
      discountRate: this.discountRate,
      discountAmount,
      finalTotal,
    };
  }
}

let product = {
  id: "p01",
  name: "Duplicate",
  category: "phone",
  price: 1000,
  inStock: true,
};

// DATA TEST BÀI 1
const store = new DiscountProductStore(0.1);

console.log(
  store.addProduct({
    id: "p01",
    name: "  iPhone 15 Pro  ",
    category: "phone",
    price: 29990000,
    inStock: true,
  }),
);

console.log(
  store.addProduct({
    id: "p02",
    name: "MacBook Air",
    category: "laptop",
    price: 24990000,
    inStock: true,
  }),
);

console.log(
  store.addProduct({
    id: "p03",
    name: "AirPods Pro",
    category: "audio",
    price: 5990000,
    inStock: false,
  }),
);

console.log(
  store.addProduct({
    id: "p01",
    name: "Duplicate",
    category: "phone",
    price: 1000,
    inStock: true,
  }),
);

console.log("findByName('iphone'):", store.findByName("iphone"));
console.log("filterByCategory(' PHONE '):", store.filterByCategory(" PHONE "));
console.log("getAvailableProducts():", store.getAvailableProducts());
console.log("getDiscountInfo():", store.getDiscountInfo());

// ============================================================
// TỔNG HỢP REVIEW — BÀI 1
// ============================================================
// Kết quả: Cần sửa — addProduct và getDiscountInfo đúng, nhưng
//          3 method tìm kiếm/lọc trả sai kiểu dữ liệu.
//
// Điểm tốt:
//   - addProduct validate đầy đủ, dùng .some() gọn.
//   - GIỮ NGUYÊN dữ liệu khi lưu (không toLowerCase) -> tốt.
//   - getDiscountInfo số liệu khớp 100% (54980000, 49482000).
//   - Kế thừa + super dùng đúng.
//
// Cần sửa:
//   1. findByName, filterByCategory, getAvailableProducts:
//      dùng for + return sớm -> chỉ trả 1 object, không phải MẢNG.
//      Phải đổi sang .filter() để trả về danh sách đầy đủ.
//   2. Field productIdList không dùng -> xóa.
//   3. Message validate nên đồng nhất tiếng Việt.
// ============================================================

// ### Bài 2: Giỏ hàng có mã giảm giá

class Cart {
  #items = [];

  addItem(item) {
    // SAI (nghiêm trọng): Khi tìm thấy item trùng tên, code trả về LỖI
    //      "Duplicated name" thay vì CỘNG DỒN quantity.
    //      Đề yêu cầu: nếu tên trùng -> tăng quantity, không báo lỗi.
    //      Hậu quả: "  trà SỮA trân châu  " bị từ chối, giỏ chỉ có 2 món
    //      thay vì gộp thành quantity=3.
    // Gợi ý sửa: nếu tìm thấy item trùng tên -> cộng quantity rồi return success.
    //   addItem(item) {
    //     let name = item.name.trim().toLowerCase();
    //
    //     if (name === "") {
    //       return { success: false, message: "Tên không được rỗng" };
    //     }
    //     if (item.price <= 0) {
    //       return { success: false, message: "Giá phải lớn hơn 0" };
    //     }
    //     if (item.quantity <= 0) {
    //       return { success: false, message: "Số lượng phải lớn hơn 0" };
    //     }
    //
    //     // tìm item cùng tên (đã chuẩn hóa)
    //     let existItem = this.#items.find(function (p) {
    //       return p.name.trim().toLowerCase() === name;
    //     });
    //
    //     if (existItem) {
    //       // đã có -> cộng dồn quantity
    //       existItem.quantity = existItem.quantity + item.quantity;
    //     } else {
    //       // chưa có -> thêm mới, lưu name đã trim
    //       this.#items.push({
    //         name: item.name.trim(),
    //         price: item.price,
    //         quantity: item.quantity
    //       });
    //     }
    //
    //     return { success: true, message: "Thêm vào giỏ hàng thành công" };
    //   }
    if (
      this.#items.some(
        (p) => p.name.trim().toLowerCase() === item.name.trim().toLowerCase(),
      )
    ) {
      return {
        success: false,
        message: "Duplicated name",
      };
    } else if (item.name.trim() === "") {
      return {
        success: false,
        message: "Name should not be blank",
      };
    } else if (item.price <= 0) {
      return {
        success: false,
        message: "Price should be greater than 0",
      };
    } else if (item.quantity <= 0) {
      return {
        success: false,
        message: "Quantity should be greater than 0",
      };
    } else {
      this.#items.push(item);
      return {
        success: true,
        message: "Thêm vào giỏ hàng thành công",
      };
    }
  }

  // Góp ý: removeItem không chuẩn hóa tên (trim + toLowerCase) khi so sánh,
  //        nên "Trà sữa" và "trà sữa" bị coi là khác nhau.
  //        Nên thêm .trim().toLowerCase() cho cả 2 phía khi filter.
  removeItem(name) {
    const newNames = this.#items.filter((item) => item.name !== name);
    return newNames;
  }

  // Đúng: Tính subtotal = tổng (price * quantity). Logic đúng.
  getSubtotal() {
    let subtotal = 0;
    for (const item of this.#items) {
      subtotal += item.price * item.quantity;
    }
    return subtotal;
  }

  // SAI (nhiều vấn đề):
  //   1. Không .trim() code -> " vip30 " không khớp "SALE10"/"SALE20".
  //   2. Gán this.subtotal = this.subtotal * discountPerCent/100
  //      -> vừa SAI ý nghĩa (subtotal là tổng GỐC, không nên sửa),
  //      vừa ghi đè method getSubtotal() bằng 1 con số.
  //   3. Không trim code, không toUpperCase -> " sale10 " không khớp.
  // Gợi ý sửa: lưu % giảm giá vào 1 biến riêng, không đụng vào subtotal.
  //   applyCoupon(code) {
  //     const newCode = code.trim().toUpperCase();
  //
  //     if (newCode === "SALE10") {
  //       this.discountPercent = 10;
  //       return true;
  //     } else if (newCode === "SALE20") {
  //       this.discountPercent = 20;
  //       return true;
  //     } else {
  //       this.discountPercent = 0;
  //       return false;
  //     }
  //   }
  applyCoupon(code) {
    let discountPerCent;
    if (code === "SALE10") {
      discountPerCent = 10;
      this.subtotal = (this.subtotal * discountPerCent) / 100;
      return true;
    } else if (code === "SALE20") {
      discountPerCent = 20;
      this.subtotal = (this.subtotal * discountPerCent) / 100;
      return true;
    } else {
      return false;
    }
  }

  // SAI (nhiều vấn đề):
  //   1. discount: this.applyCoupon() gọi KHÔNG tham số -> luôn false.
  //   2. total: hardcode = 0.
  //   3. Không có biến lưu % giảm giá để tính discount.
  // Gợi ý sửa: cần 1 biến this.discountPercent (set từ applyCoupon),
  //            checkout đọc biến đó để tính discount và total.
  //   checkout() {
  //     const subtotal = this.getSubtotal();
  //     const discount = subtotal * this.discountPercent / 100;
  //     const total = subtotal - discount;
  //     return {
  //       items: this.#items,
  //       subtotal: subtotal,
  //       discount: discount,
  //       total: total
  //     };
  //   }
  checkout() {
    return {
      items: this.#items,
      subtotal: this.getSubtotal(),
      discount: this.applyCoupon(),
      total: 0,
    };
  }
}

class VipCart extends Cart {
  constructor(memberName) {
    super();
    this.memberName = memberName;
  }

  // SAI:
  //   1. Không .trim() code -> " vip30 " có dấu cách, không khớp "SALE10"/"SALE20".
  //   2. Không return -> function trả về undefined.
  //   3. Set this.discountPercent = 0.3 (tỷ lệ) khác với cách Cart dùng (%).
  // Gợi ý sửa: nhất quán với cách sửa của Cart (dùng số %).
  //   applyCoupon(code) {
  //     const newCode = code.trim().toUpperCase();
  //
  //     if (newCode === "VIP30") {
  //       this.discountPercent = 30;
  //       return true;
  //     }
  //
  //     // không phải vip30 -> thử sale10/sale20 bên class cha
  //     return super.applyCoupon(code);
  //   }
  applyCoupon(code) {
    super.applyCoupon(code);
    if (code !== "SALE10" && code !== "SALE20") {
      code = "VIP30";
      this.discountPercent = 0.3;
    }
  }

  // SAI: Gọi super.checkout() 2 lần (dòng 335 và 337).
  //      Dòng 335 gọi super.checkout() rồi bỏ kết quả -> vô ích.
  // Gợi ý sửa:
  //   checkout() {
  //     const result = super.checkout();
  //     return {
  //       ...result,
  //       memberName: this.memberName,
  //       cartType: "VIP"
  //     };
  //   }
  checkout() {
    super.checkout();
    return {
      ...super.checkout(),
      memberName: this.memberName,
      cartType: "VIP",
    };
  }
}

// DATA TEST BÀI 2
const cart = new VipCart("Neko");

console.log(
  cart.addItem({
    name: "Trà sữa trân châu",
    price: 30000,
    quantity: 2,
  }),
);

console.log(
  cart.addItem({
    name: "  trà SỮA trân châu  ",
    price: 30000,
    quantity: 1,
  }),
);

console.log(
  cart.addItem({
    name: "Trà đào",
    price: 25000,
    quantity: 1,
  }),
);

console.log(cart.applyCoupon(" vip30 "));
console.log(cart.checkout());

// ============================================================
// TỔNG HỢP REVIEW — BÀI 2
// ============================================================
// Kết quả: Cần sửa NHIỀU — output sai hoàn toàn so với đề.
//
// Điểm tốt:
//   - getSubtotal tính toán đúng công thức.
//   - Biết dùng extends + super().
//   - Có làm đủ các method theo yêu cầu.
//
// Cần sửa (theo thứ tự ưu tiên):
//   1. addItem: trùng tên -> GỘP quantity, KHÔNG báo lỗi.
//      Đây là lỗi quan trọng nhất, cần sửa trước.
//   2. applyCoupon (Cart): cần .trim() + .toUpperCase() code,
//      lưu % giảm giá vào biến riêng, không ghi đè this.subtotal.
//   3. applyCoupon (VipCart): thêm .trim(), thêm return true/false,
//      kiểm tra "VIP30" trước, không phải thì gọi super.
//   4. checkout: tính discount = subtotal * discountPercent / 100,
//      total = subtotal - discount, không hardcode 0.
//   5. removeItem: thêm .trim().toLowerCase() khi so sánh tên.
//
// Tổng kết: Bài 1 nắm được OOP cơ bản nhưng cần sửa logic filter.
//           Bài 2 có ý tưởng nhưng triển khai bị sai ở hầu hết method.
//           Tập trung sửa addItem (gộp quantity) trước, rồi đến
//           applyCoupon (trim code + lưu %), cuối cùng là checkout.
// ============================================================

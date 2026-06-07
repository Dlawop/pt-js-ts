// ### Bài 1: Quản lý danh sách sản phẩm

// Tạo class cha `ProductStore` với private field `#products = []`.

// Yêu cầu class `ProductStore`:

// - Method `addProduct(product)`:
//   - Không thêm nếu `id` bị trùng.
//   - Không thêm nếu `name` rỗng sau khi `trim()`.
//   - Không thêm nếu `category` rỗng sau khi `trim()`.
//   - `price` phải lớn hơn 0.
//   - `inStock` phải là kiểu boolean.
//   - Nếu không hợp lệ, trả về:

// ```javascript
// {
//     success: false,
//     message: "Lý do lỗi"
// }
// ```

// - Nếu hợp lệ, trả về:

// ```javascript
// {
//     success: true,
//     message: "Thêm sản phẩm thành công"
// }
// ```

class ProductStore {
  #products = [];
  productIdList = [];

  addProduct(product) {
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
      this.#products.push(product);
      return {
        success: true,
        message: "Thêm sản phẩm thành công",
      };
    }
  }

  findByName(keyword) {
    for (let product of this.#products) {
      let name = product.name.trim().toLowerCase();
      if (name.includes(keyword.trim().toLowerCase())) {
        return product;
      }
    }
  }
  filterByCategory(category) {
    for (let product of this.#products) {
      if (
        category.trim().toLowerCase() === product.category.trim().toLowerCase()
      ) {
        return product;
      }
    }
  }

  getAvailableProducts() {
    for (let product of this.#products) {
      if (product.inStock === true) {
        return product;
      }
    }
  }

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

// Tạo class con `DiscountProductStore extends ProductStore`:

// - Constructor nhận `discountRate`, ví dụ `0.1` nghĩa là giảm 10%.
// - Override method `getTotalInventoryValue()`:
//   - Gọi `super.getTotalInventoryValue()` để lấy tổng gốc.
//   - Trả về tổng sau giảm giá.
// - Thêm method `getDiscountInfo()`:
//   - Trả về object gồm `originalTotal`, `discountRate`, `discountAmount`, `finalTotal`.
class DiscountProductStore extends ProductStore {
  constructor(discountRate) {
    super();
    this.discountRate = discountRate;
  }

  getTotalInventoryValue() {
    const originalTotal = super.getTotalInventoryValue();
    return originalTotal * (1 - this.discountRate);
  }

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

// Bài test mẫu:

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

// Kết quả mong đợi:

// - `addProduct()` hợp lệ trả `{ success: true, message: "Thêm sản phẩm thành công" }`
// - `addProduct()` trùng `id` trả `{ success: false, message: "Id sản phẩm đã tồn tại" }`
// - `findByName('iphone')` trả object `iPhone 15 Pro`
// - `filterByCategory(' PHONE ')` trả danh sách có category `phone`
// - `getAvailableProducts()` trả 2 sản phẩm còn hàng
// - `getDiscountInfo()` trả:

// ```javascript
// {
//     originalTotal: 54980000,
//     discountRate: 0.1,
//     discountAmount: 5498000,
//     finalTotal: 49482000
// }
// ```

// ### Bài 2: Giỏ hàng có mã giảm giá

// Tạo class cha `Cart` với private field `#items = []`.

// Yêu cầu class `Cart`:

// - Method `addItem(item)`:
//   - Nếu item cùng tên đã tồn tại, tăng `quantity`.
//   - Tên so sánh không phân biệt hoa thường và bỏ khoảng trắng thừa.
//   - `name` không được rỗng sau khi `trim()`.
//   - `price` và `quantity` phải lớn hơn 0.
//   - Nếu không hợp lệ, trả về:
class Cart {
  #items = [];
  addItem(item) {
    if (
      this.#items.some(
        (p) => p.name.trim().toLowerCase() === item.name.trim().toLowerCase(),
      )
    ) {
      //  item.quantity+=p.quantity;
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

  // - Method `removeItem(name)`:
  //   - Xóa item theo tên.
  // - Method `getSubtotal()`:
  //   - Tính tổng tiền trước giảm giá.
  // - Method `applyCoupon(code)`:
  //   - Nhận mã như `"SALE10"` hoặc `"SALE20"`.
  //   - Nếu mã hợp lệ, giảm 10% hoặc 20%.
  //   - Nếu mã không hợp lệ, không giảm.
  //   - Trả về `true` nếu áp dụng được mã, ngược lại trả về `false`.
  // - Method `checkout()`:
  //   - Trả về object gồm `items`, `subtotal`, `discount`, `total`.
  removeItem(name) {
    const newNames = this.#items.filter((item) => item.name !== name);
    return newNames;
  }
  getSubtotal() {
    let subtotal = 0;
    for (const item of this.#items) {
      subtotal += item.price * item.quantity;
    }
    return subtotal;
  }

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
  checkout() {
    return {
      items: this.#items,
      subtotal: this.getSubtotal(),
      discount: this.applyCoupon(),
      total: 0,
    };
  }
}

// Tạo class con `VipCart extends Cart`:

// - Constructor nhận `memberName`.
// - Override `applyCoupon(code)`:
//   - Gọi `super.applyCoupon(code)` trước.
//   - Nếu coupon thường không hợp lệ, chấp nhận thêm mã `"VIP30"` để giảm 30%.
// - Override `checkout()`:
//   - Gọi `super.checkout()` để lấy hóa đơn gốc.
//   - Thêm `memberName` và `cartType: "VIP"` vào object kết quả.

class VipCart extends Cart {
  constructor(memberName) {
    super();
    this.memberName = memberName;
  }
  applyCoupon(code) {
    super.applyCoupon(code);
    if (code !== "SALE10" && code !== "SALE20") {
      code = "VIP30";
      this.discountPercent = 0.3;
    }
  }
  checkout() {
    super.checkout();
    return {
      ...super.checkout(),
      memberName: this.memberName,
      cartType: "VIP",
    };
  }
}
// Bài test mẫu:

// ```javascript
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
// ```

// Kết quả mong đợi:

// - `addItem()` hợp lệ trả `{ success: true, message: "Thêm vào giỏ hàng thành công" }`
// - `addItem()` nếu `name` rỗng hoặc `price/quantity <= 0` trả `{ success: false, message: "Lý do lỗi" }`
// - `applyCoupon(' vip30 ')` trả `true`
// - `checkout()` trả:

// ```javascript
// {
//     items: [
//         { name: 'Trà sữa trân châu', price: 30000, quantity: 3 },
//         { name: 'Trà đào', price: 25000, quantity: 1 }
//     ],
//     subtotal: 115000,
//     discount: 34500,
//     total: 80500,
//     memberName: 'Neko',
//     cartType: 'VIP'
// }
// ```

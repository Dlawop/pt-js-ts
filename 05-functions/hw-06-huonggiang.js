//bài tập
//viét 1 hàm taoBoDem(tenNut) trả về 1 object với 2 method
// - click() - tắng số lần click lên 1 và in ra "tên nút số click clicks"
// - reset () - đặt lại click  - 0 và in a "tên nút reset"

// ví dụ kết quả mong muốn
// const nutLogin = taoBoDem("Login Button");
// nutLogin.click() -> login button: 1 clicks
// nutLogin.click() -> login button: 2 clicks
//nutLogin.reset()
// nutLogin.click() -> login button: 1 clicks

function taoBoDem(tenNut) {
  let count = 0;
  return {
    click() {
      count++;
      console.log(`${tenNut}: ${count} clicks`);
    },
    reset() {
      count = 0;
      console.log("reset Xong");
    },
  };
}

let nutLogin = taoBoDem();
nutLogin.click();
nutLogin.click();
nutLogin.reset();
nutLogin.click();
nutLogin.click();

// ## Bài 2: Chuẩn hóa dữ liệu test case import từ spreadsheet

// ### Bối cảnh thực tế

// Khi import test case từ Excel hoặc Google Sheet, dữ liệu thường lộn xộn:

// - có dòng thừa khoảng trắng
// - priority lúc là số, lúc là chuỗi
// - status viết sai chính tả
// - cùng một test case id xuất hiện 2 lần
// ### Đề bài
// Viết hàm:
// ### Bộ data test dùng để làm bài

const testCaseConfig = {
  minPriority: 1,
  maxPriority: 5,
};

const rawRows = [
  [" TC_LOGIN_001 ", "login", "1", " smoke ", "active"],
  ["TC_LOGIN_001", "login", "2", "regression", "active"],
  ["TC_SEARCH_002", "search", "0", "smoke", "active"],
  ["TC_CART_003", "", "3", "checkout", "inactive"],
  ["TC_PAY_004", "payment", "2", " critical ", "ACTIVE"],
  ["TC_ORDER_005", "order", "5", "sanity", "inactive"],
  ["TC_ORDER_006", " order ", "4", " SANITY ", "active"],
  ["LOGIN_007", "login", "2", "smoke", "active"],
  ["TC_USER_008", "user", "6", "regression", "active"],
  ["TC_API_009", "api", "3", "api", "disabled"],
  ["TC_API_010", "api", "2", " api ", "active"],
  ["TC_API_010", "api", "2", " api ", "active"],
  ["TC_REPORT_011", "report", "1", " nightly ", "INACTIVE"],
  [" TC_EMPTY_012 ", "   ", "2", "misc", "active"],
];

function chuanHoaDanhSachTest(rawRows, config) {
  // Khi làm với bộ data test này
  // - `rawRows` nhận mảng `rawRows` ở trên
  // - `config` nhận `testCaseConfig`
  // - Ví dụ gọi hàm: `chuanHoaDanhSachTest(rawRows, testCaseConfig)`
  // ### Quy ước dữ liệu
  // Mỗi dòng có cấu trúc
  // ```javascript
  // [id, module, priority, tag, status]
  // ### Yêu cầu
  // 1. Dùng array destructuring để bóc từng cột.
  let { minPriority, maxPriority } = config;
  let validCases = [];
  let invalidCases = [];
  let duplicateIds = [];
  let idList = [];
  // 2. Chuẩn hóa:
  //    - `id` -> trim, uppercase
  //    - `module` -> trim, lowercase
  //    - `priority` -> đổi sang number
  //    - `tag` -> trim, lowercase
  //    - `status` -> trim, lowercase
  for (let rawRow of rawRows) {
    let [id, module, priority, tag, status] = rawRow;
    id = id.trim().toUpperCase();
    module = module.trim().toLowerCase();
    priority = parseInt(priority);
    tag = tag.trim().toLowerCase();
    status = status.trim().toLowerCase();
    let testCaseData = {
      id: id,
      module: module,
      priority: priority,
      tag: tag,
      status: status,
    };

    // 3. Test case hợp lệ khi:
    //    - `id` bắt đầu bằng `TC_`
    //    - `module` không rỗng
    //    - `priority` nằm trong `1` đến `5`
    //    - `status` chỉ là `active` hoặc `inactive`
    //    - không bị trùng `id`
    const isIdValid = id.startsWith("TC_");
    const isModuleValid = module !== "";
    const isPriorityValid = priority >= minPriority && priority <= maxPriority;
    const isStatusValid = status === "active" || status === "inactive";
    const isDuplicate = idList.includes(id);

    if (isDuplicate) {
      duplicateIds.push(id);
      invalidCases.push(testCaseData);
    } else if (isIdValid && isModuleValid && isPriorityValid && isStatusValid) {
      validCases.push(testCaseData);
      idList.push(id);
    } else {
      invalidCases.push(testCaseData);
      idList.push(id);
    }
  }

  // 4. Khi gọi `chuanHoaDanhSachTest(rawRows, testCaseConfig)`, hàm phải `return` object có dạng:

  return {
    validCases: validCases,
    invalidCases: invalidCases,
    duplicateIds: duplicateIds,
    summary: {
      total: rawRows.length,
      valid: validCases.length,
      invalid: invalidCases.length,
      duplicateIds: duplicateIds.length,
    },
  };
}
let testCases = chuanHoaDanhSachTest(rawRows, testCaseConfig);
console.log(testCases);

// ### Điều bắt buộc

// 1. Dùng `for` để duyệt `rawRows`.
// 2. Không dùng `map`, `filter`, `find` cho phần duyệt chính của bài này.
// 3. Không được sửa trực tiếp `rawRows`.
//    Nghĩa là không gán ngược vào từng dòng cũ trong mảng này, mà chỉ đọc dữ liệu cũ rồi tạo object mới để đưa vào kết quả trả về.

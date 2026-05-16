// "
// ## Bài 1: Refactor hàm `taoPayloadDangNhap()`

// ### Bối cảnh thực tế

// Form đăng nhập ngoài đời thường rất bẩn:

// - người dùng gõ thừa khoảng trắng
// - role viết hoa viết thường lung tung
// - checkbox `remember me` lúc thì là `true`, lúc là `""yes""`, lúc là `""on""`
// - dev truyền object input vào nhiều nơi, chỉ cần sửa trực tiếp nhầm một lần là bug dây chuyền

// ### Đề bài
// Viết hàm:
// ### Bộ data test dùng để làm bài
const loginOptions = {
  defaultRole: "guest",
  allowedRoles: ["admin", "tester", "viewer", "guest"],
  minPasswordLength: 8,
};

const loginTestData = [
  {
    name: "Case 1 - Hợp lệ cơ bản",
    formInput: {
      username: "  Neko_Admin  ",
      password: "  12345678  ",
      role: " tester ",
      rememberMe: "yes",
      device: "  chrome-win11  ",
    },
  },
  {
    name: "Case 2 - Role rỗng, phải dùng defaultRole",
    formInput: {
      username: "  guest_user  ",
      password: "  abcdefgh  ",
      role: "   ",
      rememberMe: "no",
      device: " firefox ",
    },
  },
  {
    name: "Case 3 - Username rỗng",
    formInput: {
      username: "    ",
      password: "12345678",
      role: "tester",
      rememberMe: "yes",
      device: "chrome",
    },
  },
  {
    name: "Case 4 - Username có khoảng trắng ở giữa",
    formInput: {
      username: "neko admin",
      password: "12345678",
      role: "tester",
      rememberMe: "yes",
      device: "chrome",
    },
  },
  {
    name: "Case 5 - Password quá ngắn",
    formInput: {
      username: "valid_user",
      password: "123",
      role: "tester",
      rememberMe: true,
      device: "chrome",
    },
  },
  {
    name: "Case 6 - Role không hợp lệ",
    formInput: {
      username: "valid_user",
      password: "12345678",
      role: "manager",
      rememberMe: "on",
      device: "chrome",
    },
  },
  {
    name: "Case 7 - rememberMe là boolean true",
    formInput: {
      username: "admin01",
      password: "abcdefgh",
      role: "admin",
      rememberMe: true,
      device: "edge",
    },
  },
  {
    name: "Case 8 - rememberMe là chuỗi lạ",
    formInput: {
      username: "viewer01",
      password: "abcdefgh",
      role: "viewer",
      rememberMe: "maybe",
      device: "safari",
    },
  },
];
function taoPayloadDangNhap(formInput, loginOptions) {
  // 1. Dùng object destructuring để lấy dữ liệu từ formInput
  let formInputCopy = { ...formInput };
  let {
    username,
    password,
    role ,
    rememberMe,
    device ,
  } = formInputCopy;
  // 2. Dùng object destructuring + default value để lấy dữ liệu từ options
  let loginOptionsCopy = { ...loginOptions };
  const {
    defaultRole = "guest",
    allowedRoles = [],
    minPasswordLength = 8,
  } = loginOptionsCopy;

  // 3. Chuẩn hóa dữ liệu
  let usernameCleaned = username.trim().toLowerCase();
  let passwordCleaned = password.trim();
  let roleCleaned = role.trim().toLowerCase();
  let deviceCleaned = device.trim();
  // rememberMe: chuyển về boolean
  let rememberMeBoolean;
  let booleanValues = ["true", "yes", "on"];
  if (
    typeof rememberMe === "string" &&
    booleanValues.includes(rememberMe.trim().toLowerCase())
  ) {
    rememberMeBoolean = true;
  } else if (typeof rememberMe === "boolean") {
    rememberMeBoolean = rememberMe;
  } else {
    rememberMeBoolean = false;
  }

  // Nếu role rỗng thì dùng defaultRole
  if (!roleCleaned) {
    roleCleaned = defaultRole;
  }

  let isValid = true;
  // 4. Kiểm tra hợp lệ
  if (
    usernameCleaned === "" ||
    usernameCleaned.includes(" ") ||
    passwordCleaned.length < minPasswordLength ||
    !allowedRoles.includes(roleCleaned)
  ) {
    isValid = false;
  }

  // 5. Không được sửa trực tiếp formInput hoặc options
  // 6. Phải trả về object theo dạng:
  return {
    isValid: isValid,
    payload: {
      username: usernameCleaned,
      password: passwordCleaned,
      role: roleCleaned,
      rememberMe: rememberMeBoolean,
      device: deviceCleaned,
    },
    errors: [],
  };
}
console.log(taoPayloadDangNhap(loginTestData[0].formInput, loginOptions));

// ## Bài 2: Chuẩn hóa dữ liệu test case import từ spreadsheet

// ### Bối cảnh thực tế

// Khi import test case từ Excel hoặc Google Sheet, dữ liệu thường lộn xộn:

// - có dòng thừa khoảng trắng
// - priority lúc là số, lúc là chuỗi
// - status viết sai chính tả
// - cùng một test case id xuất hiện 2 lần

// ### Đề bài

// Viết hàm:
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
  // Khi làm với bộ data test này:
  // - `rawRows` nhận mảng `rawRows` ở trên
  // - `config` nhận `testCaseConfig`
  // - Ví dụ gọi hàm: `chuanHoaDanhSachTest(rawRows, testCaseConfig)`
  // ### Quy ước dữ liệu
  // Mỗi dòng có cấu trúc:
  // [id, module, priority, tag, status]
  // ### Yêu cầu
  // 1. Dùng array destructuring để bóc từng cột.
  let idList = [];
  let validCases = [];
  let invalidCases = [];
  let duplicateIds = [];
  for (let rawRow of rawRows) {
    let [id, module, priority, tag, status] = rawRow;
    // 2. Chuẩn hóa:
    //    - `id` -> trim, uppercase
    //    - `module` -> trim, lowercase
    //    - `priority` -> đổi sang number
    //    - `tag` -> trim, lowercase
    //    - `status` -> trim, lowercase
    let idCleaned = id.trim().toUpperCase();
    let moduleCleaned = module.trim().toLowerCase();
    let priorityCleaned = parseInt(priority);
    let tagCleaned = tag.trim().toLowerCase();
    let statusCleaned = status.trim().toLowerCase();
    let dataObject = {
      idCleaned,
      moduleCleaned,
      priorityCleaned,
      tagCleaned,
      statusCleaned,
    };
    // 3. Test case hợp lệ khi:
    //    - `id` bắt đầu bằng `TC_`
    //    - `module` không rỗng
    //    - `priority` nằm trong `1` đến `5`
    //    - `status` chỉ là `active` hoặc `inactive`
    //    - không bị trùng `id`
    let statuslist = ["active", "inactive"];
    if (
      idCleaned.startsWith("TC") &&
      moduleCleaned !== "" &&
      config.minPriority <= priorityCleaned &&
      priorityCleaned <= config.maxPriority &&
      statuslist.includes(statusCleaned) &&
      idList.includes(idCleaned) === false
    ) {
      validCases.push(dataObject);
    } else {
      invalidCases.push(dataObject);
    }
    if (idList.includes(idCleaned) === true) {
      duplicateIds.push(idCleaned);
    } else {
      idList.push(idCleaned);
    }
  }

  return {
    validCases: validCases,
    invalidCases: invalidCases,
    summary: {
      total: rawRows.length,
      valid: validCases.length,
      invalid: invalidCases.length,
      duplicateIds: duplicateIds,
    },
  };
}
chuanHoaDanhSachTest(rawRows, testCaseConfig);

// ## Bài 3: Merge config chạy test và bắt lỗi cấu hình

// ### Bối cảnh thực tế

// Dự án thường có nhiều lớp config:

// - `defaultConfig`
// - `envConfig`
// - `overrideConfig` do người chạy test truyền vào

// Bug rất hay gặp:

// - gộp sai thứ tự nên config bị ghi đè ngược
// - dùng spread với object rồi tưởng là sao chép sâu
// - timeout âm hoặc quá bé
// - CI mà vẫn bật `headed: true`
// - danh sách browser bị trùng tên

// ### Đề bài
// ### Bộ data test dùng để làm bài
const configCase1 = {
  defaultConfig: {
    env: "local",
    baseUrl: "http://localhost:3000",
    timeout: 30000,
    retries: 0,
    headed: true,
    browsers: ["chromium"],
    reporter: {
      type: "html",
      output: "reports/default",
    },
  },
  envConfig: {
    env: "staging",
    baseUrl: "https://staging.neko.dev",
    retries: 1,
    browsers: ["chromium", "firefox"],
  },
  overrideConfig: {
    timeout: 500,
    headed: true,
    browsers: [" Chromium ", "chromium", "webkit"],
    reporter: {
      type: "html",
      output: "reports/custom",
    },
  },
};

const configCase2 = {
  defaultConfig: {
    env: "ci",
    baseUrl: "https://ci.neko.dev",
    timeout: 10000,
    retries: 2,
    headed: true,
    browsers: ["chromium"],
    reporter: {
      type: "html",
      output: "reports/ci",
    },
  },
  envConfig: {},
  overrideConfig: {},
};

const configCase3 = {
  defaultConfig: {
    env: "staging",
    baseUrl: "ftp://bad-url",
    timeout: 2000,
    retries: 1,
    headed: false,
    browsers: ["firefox"],
    reporter: {
      type: "json",
      output: "reports/json",
    },
  },
  envConfig: {},
  overrideConfig: {},
};

const configCase4 = {
  defaultConfig: {
    env: "test",
    baseUrl: "https://prod.neko.dev",
    timeout: 5000,
    retries: 1,
    headed: false,
    browsers: ["webkit"],
    reporter: {
      type: "html",
      output: "reports/test",
    },
  },
  envConfig: {},
  overrideConfig: {},
};

const configCase5 = {
  defaultConfig: {
    env: "local",
    baseUrl: "http://localhost:3000",
    timeout: 30000,
    retries: -1,
    headed: false,
    browsers: [],
    reporter: {
      type: "",
      output: "",
    },
  },
  envConfig: {},
  overrideConfig: {},
};
function taoCauHinhCuoi(defaultConfig, envConfig, overrideConfig) {
  // 1. Dùng spread để merge config.
  // 2. Thứ tự merge phải là:
  // defaultConfig -> envConfig -> overrideConfig
  let cauHinhCuoi = {
    ...defaultConfig,
    ...envConfig,
    ...overrideConfig,
  };
  return cauHinhCuoi;
}
const finalConfig = taoCauHinhCuoi(
  configCase1.defaultConfig,
  configCase1.envConfig,
  configCase1.overrideConfig,
);
function kiemTraCauHinh(config) {
  let errors = [];
  let warnings = [];
  const { env, baseUrl, timeout, retries, headed, browsers, reporter } = config;
  // 3. Trong `kiemTraCauHinh(config)`, với mảng `browsers`:
  //    - dùng `map` để `trim` và đưa từng browser về lowercase
  //    - dùng `filter` để lấy ra browser bị trùng
  //    - dùng `find` để lấy browser trùng đầu tiên nếu có
  const browsersCleaned = browsers.map((name) => name.trim().toLowerCase());
  const duplicatedBrowser = browsersCleaned.filter(
    (item, index) => browsersCleaned.indexOf(item) !== index,
  );
  let duplicatedFirst;
  if (duplicatedBrowser) {
    duplicatedFirst = duplicatedBrowser.find((items) => items[0]);
  }
  // ### Luật kiểm tra
  // - `baseUrl` phải bắt đầu bằng `http://` hoặc `https://`
  // - `timeout` phải từ `1000` trở lên
  // - `retries` không được âm
  // - `browsers` không được rỗng
  // - không được có browser trùng sau khi đã `trim` và đưa về lowercase
  // - nếu `env === ""ci""` mà `headed === true` -> warning
  // - nếu `baseUrl` chứa `""prod""` nhưng `env !== ""production""` -> warning
  if (env === "ci" && headed === true) {
    warnings.push("mixmatch env and headed");
  }
  if (baseUrl.includes("prod") && env !== "production") {
    warnings.push("mixmatch env and url");
  }
  if (baseUrl !== "http://" || baseUrl !== "https://") {
    errors.push("incorrect baseUrl");
  }
  if (timeout < 1000) {
    errors.push("incorrect timeout");
  }
  if (retries < 0) {
    errors.push("incorrect retries");
  }
  if (browsers === "") {
    errors.push("No browser data");
  }
  if (duplicatedBrowser) {
    errors.push("duplicated Browser");
  }

  return {
    errors: errors,
    warnings: warnings,
  };
}
kiemTraCauHinh(finalConfig);

// ### Điều bắt buộc

// 1. Không được sửa trực tiếp bất kỳ config đầu vào nào.
// 2. Dùng object destructuring ít nhất 1 lần.
// 3. Dùng `map`, `filter`, `find` ở phần xử lý `browsers`."

// ## Bài 4: Phân tích kết quả chạy test có chạy lại

// ### Bối cảnh thực tế

// Đây là kiểu dữ liệu QA và automation gặp suốt:

// - một test có thể chạy nhiều lần
// - có test fail rồi pass ở lần chạy lại sau
// - có test duration âm do dữ liệu log lỗi
// - có kết quả trả về cho một test không tồn tại trong danh sách master

// ### Đề bài
// ### Bộ data test dùng để làm bài

const resultOptions = {
  slowThreshold: 2500,
};

const results = [
  {
    id: "TC_LOGIN_001",
    module: "login",
    statuses: ["fail", "pass"],
    durations: [1200, 800],
    owner: "an",
  },
  {
    id: "TC_SEARCH_002",
    module: "search",
    statuses: ["pass"],
    durations: [600],
    owner: "binh",
  },
  {
    id: "TC_CART_003",
    module: "cart",
    statuses: ["fail", "fail", "fail"],
    durations: [1500, 1700, 1600],
    owner: "",
  },
  {
    id: "TC_PAY_004",
    module: "payment",
    statuses: ["pass"],
    durations: [-50],
    owner: "chi",
  },
  {
    id: "TC_PROFILE_005",
    module: "profile",
    statuses: ["pass", "pass"],
    durations: [700, 650],
    owner: "duy",
  },
  {
    id: "",
    module: "report",
    statuses: ["pass"],
    durations: [300],
    owner: "ha",
  },
  {
    id: "TC_API_006",
    module: "api",
    statuses: ["fail", "unknown"],
    durations: [400, 500],
    owner: "linh",
  },
  {
    id: "TC_BILL_007",
    module: "billing",
    statuses: ["fail", "pass", "pass", "pass"],
    durations: [600, 700, 650, 620],
    owner: "minh",
  },
  {
    id: "TC_LOG_008",
    module: "log",
    statuses: ["skip"],
    durations: [100],
    owner: "nam",
  },
  {
    id: "TC_SYNC_009",
    module: "sync",
    statuses: ["fail", "pass"],
    durations: [1500],
    owner: "oanh",
  },
];
// Viết hàm:
function phanTichKetQuaChay(results, options) {
  let passed = 0;
  let failed = 0;
  let flaky = [];
  let slow = [];
  let invalid = [];
  for (let result of results) {
    let { id, module, statuses, durations, owner } = result;
    // 1. Tính cho mỗi test:
    let totalDuration = 0;
    for (let duration of durations) {
      // 4. Một test là invalid nếu:
      //    - thiếu `id`
      //    - `statuses.length !== durations.length`
      //    - có duration âm

      totalDuration += duration;
      if (!id || statuses.length !== durations.length || duration < 0) {
        invalid.push(id);
      }
    }
    // 2. Một test được xem là `flaky` nếu:
    //    - có ít nhất 1 lần `fail`
    //    - và lần cuối là `pass`
    let index = statuses.length - 1;
    let finalStatus = statuses[index];
    if (statuses.includes("fail") && finalStatus === "pass") {
      flaky.push(id);
    }
    // 3. Một test là `slow` nếu tổng duration lớn hơn `slowThreshold`
    if (totalDuration > options.slowThreshold) {
      slow.push(id);
    }
    if (statuses.includes("pass")) {
      passed = passed + 1;
    } else if (statuses.includes("fail")) {
      failed = failed + 1;
    }
  }
  return {
    analyzed: results,
    invalid: invalid,
    summary: {
      total: results.length,
      passed: passed,
      failed: failed,
      flaky: flaky.length,
      slow: slow.length,
      invalid: invalid.length,
    },
  };
}
phanTichKetQuaChay(results, resultOptions);
// ### Điều bắt buộc

// 1. Dùng destructuring khi đọc từng result object.
// 2. Không dùng biến global để cộng dồn phần tổng kết.
// 3. Giữ bài này trong 1 hàm chính `phanTichKetQuaChay(results, options)`."

// ## Bài 5: Lọc danh sách test cần chạy lại bằng `map`, `filter`, `find`

// ### Bối cảnh thực tế

// Sau một lượt chạy regression, team thường phải chốt rất nhanh:

// - test nào cần chạy lại
// - test nào thiếu owner để giao người xử lý
// - test fail mức độ ưu tiên cao đầu tiên là test nào
// - dữ liệu trả về có đang bị thừa khoảng trắng hoặc viết hoa viết thường lung tung không

// ### Đề bài

// Viết hàm:
const rawRuns = [
  {
    id: " tc_login_001 ",
    module: " login ",
    status: " FAIL ",
    owner: "an",
    priority: 1,
    enabled: true,
  },
  {
    id: "TC_SEARCH_002",
    module: "search",
    status: "pass",
    owner: "binh",
    priority: 2,
    enabled: true,
  },
  {
    id: " tc_cart_003 ",
    module: " cart ",
    status: " flaky ",
    owner: " chi ",
    priority: 1,
    enabled: true,
  },
  {
    id: "TC_PAY_004",
    module: "payment",
    status: "fail",
    owner: "",
    priority: 1,
    enabled: true,
  },
  {
    id: " TC_USER_005 ",
    module: " user ",
    status: " skip ",
    owner: "duy",
    priority: 3,
    enabled: true,
  },
  {
    id: "TC_REPORT_006",
    module: "report",
    status: "fail",
    owner: "ha",
    priority: 2,
    enabled: false,
  },
  {
    id: "",
    module: "api",
    status: "fail",
    owner: "linh",
    priority: 1,
    enabled: true,
  },
  {
    id: "TC_SYNC_007",
    module: " sync ",
    status: " FAIL ",
    owner: " minh ",
    priority: 2,
    enabled: true,
  },
  {
    id: "TC_BILL_008",
    module: "billing",
    status: "pass",
    owner: "",
    priority: 1,
    enabled: true,
  },
  {
    id: "TC_ORDER_009",
    module: " order ",
    status: " flaky ",
    owner: "nam",
    priority: 2,
    enabled: true,
  },
];
function locDanhSachChayLai(rawRuns) {
  // ### Yêu cầu
  // 1. Dùng `map` để tạo `normalizedRuns`.
  // 2. Trong từng phần tử của `normalizedRuns`, chuẩn hóa dữ liệu:
  //    - `id` -> trim, uppercase
  //    - `module` -> trim, lowercase
  //    - `status` -> trim, lowercase
  //    - `owner` -> trim
  //    - giữ nguyên `priority`, `enabled`
  let rawRun1 = {
    id: "TC_ORDER_009",
    module: " order ",
    status: " flaky ",
    owner: "nam",
    priority: 2,
    enabled: true,
  };
  function checkNormalizedData(rawRun) {
    let { id, module, status, owner, priority, enabled } = rawRun;
    id = id.trim().toUpperCase();
    module = module.trim().toLowerCase();
    status = status.trim().toLowerCase();
    owner = owner.trim();
    return {
      id,
      module,
      status,
      owner,
      priority,
      enabled,
    };
  }
  let normalizedRuns = rawRuns.map((rawRun) => checkNormalizedData(rawRun));
  // 3. Dùng `filter` để tạo `rerunList`. Một test cần chạy lại khi:
  //    - `enabled === true`
  //    - `id` không rỗng
  //    - `status` là `fail` hoặc `flaky`
  let rerunList = normalizedRuns.filter(
    (normalizedRun) =>
      normalizedRun.enabled === true &&
      normalizedRun.id !== "" &&
      (normalizedRun.status === "fail" || normalizedRun.status === "flaky"),
  );
  // 4. Dùng `filter` để tạo `missingOwnerList`. Chỉ lấy các test:
  //    - `enabled === true`
  //    - `id` không rỗng
  //    - `owner === """"`
  let missingOwnerList = normalizedRuns.filter(
    (normalizedRun) =>
      normalizedRun.enabled === true &&
      normalizedRun.id !== "" &&
      normalizedRun.owner === "",
  );
  // 5. Dùng `find` để tạo `firstCriticalCase`. Đây là test đầu tiên thỏa:
  //    - `enabled === true`
  //    - `id` không rỗng
  //    - `priority === 1`
  //    - `status === ""fail""`
  function checkCriticalCase(normalizedRun) {
    return (
      normalizedRun.enabled === true &&
      normalizedRun.id !== "" &&
      normalizedRun.priority === 1 &&
      normalizedRun.status === "fail"
    );
  }
  let firstCriticalCase = normalizedRuns.find(checkCriticalCase);
  if (!firstCriticalCase) {
    firstCriticalCase = null;
  }
  return {
    normalizedRuns: normalizedRuns,
    rerunList: rerunList,
    missingOwnerList: missingOwnerList,
    firstCriticalCase: firstCriticalCase,
  };
}
console.log(locDanhSachChayLai(rawRuns));

// ### Điều bắt buộc

// 1. Dùng object destructuring khi đọc từng phần tử bên trong `map`.
// 2. Giữ bài này trong 1 hàm chính `locDanhSachChayLai(rawRuns)`.
// 3. Không được sửa trực tiếp `rawRuns`.
// 4. Không dùng `for` cho phần xử lý chính của bài này.
// "

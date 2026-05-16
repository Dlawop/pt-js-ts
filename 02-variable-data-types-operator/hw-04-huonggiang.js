// Bài 1
// Tình huống: Bạn viết script test tự động kiểm tra API /users/1. Server trả về response, bạn cần kiểm tra toàn bộ dữ liệu: tìm field rỗng, kiểm tra kiểu dữ liệu sai.

// Dữ liệu đầu vào:

let apiResponse = {
  userId: 101,
  username: "neko_tester",
  email: null,
  isActive: "true", // Bug: phải là boolean, không phải string
  phone: "",
  role: "admin",
};

// Yêu cầu:

// Với mỗi key, kiểm tra:
// Giá trị có phải null hoặc "" (chuỗi rỗng) không? → In cảnh báo trường rỗng.
// Nếu key là "isActive", kiểm tra typeof có phải "boolean" không? → In cảnh báo sai kiểu.
// Đếm tổng số lỗi tìm được.
// Trong bài này, 1 lỗi = 1 lần vi phạm 1 quy tắc kiểm tra.

function checkAPIResponse(apiResponse) {
  let errorCount = 0;
  for (let key in apiResponse) {
    if (!apiResponse[key]) {
      console.log(`${key} is null data`);
      errorCount++;
    } else if (key === "isActive" && typeof apiResponse[key] !== "boolean") {
      console.log(`${key} is incorrect data type`);
      errorCount++;
    } else {
      console.log(`${key} is correct data`);
    }
  }
  return errorCount;
}

let checkedData = checkAPIResponse(apiResponse);
console.log(checkedData);

// "
// Bài 2
// Tình huống: Bạn có danh sách URL cần test. Một số URL bị rỗng (bỏ qua), một số trả về status bình thường, nhưng nếu gặp URL trả về lỗi 500 thì dừng ngay vì server đã sập, test tiếp vô nghĩa.

// Dữ liệu đầu vào:

let testUrls = [
  { url: "/api/users", status: 200 },
  { url: "", status: null },
  { url: "/api/products", status: 200 },
  { url: "/api/orders", status: 500 },
  { url: "/api/reviews", status: 200 },
];
// Yêu cầu:

// Nếu url rỗng ("""") → dùng continue bỏ qua, in cảnh báo “URL rỗng”.
// Nếu status === 500 → in lỗi nghiêm trọng, dùng break dừng ngay.
// Nếu bình thường → in kết quả PASS.
// Đếm tổng URL đã test được (không tính URL bị bỏ qua)."

function checkUrls(testUrls) {
  let passedCount = 0;
  for (let testUrl of testUrls) {
    console.log(testUrl.url);
    if (!testUrl.url) {
        console.log("Null Url");
      continue;
    } else if (testUrl.status === 500) {
      console.log("Critical issue!!!");
      break;
    } else {
      console.log(`Passed URL`);
      passedCount++;
    }
  }
  return passedCount;
}

let checkedUrls = checkUrls(testUrls);
console.log(checkedUrls);

const configmacDinhBaiTap = {
  baseUrl : "https://staging.neko.vn",
  timeout: 30000,
  headless: true,
  retries: 2
}

const configGhiDe= {
  timeout:10000,
  headless: false
};
const tagsMacDinh = ["   smoke   ", "   login  "];
const tagsThem = [" checkout   ", "   Smoke   ", "   regression   "];
const tocDoPhanHoi = [1200, 3400, 800, 1500];
const tenSuiteRaw = " Payment Flow   ";
// Yêu cầu:
// Viet ham taoCauHinhChayTest()
function taoCauHinhChayTest(){
  // Dung object spread để tạo configCuoi từ configMacDinhbaiTap và configGhiDe
  const configCuoi = {...configmacDinhBaiTap, ...configGhiDe}
  
  // Dùng Array spread để gộp tagsMacDinh và tagsThem thành 1 mảng mới
  const tagsArray = [...tagsMacDinh,...tagsThem]
  // Sau đó xử lý mảng mới bằng cách loại bỏ tag rỗng và chuyển về chữ thường
  const tagsArrayCleaned = []
  for (const tag of tagsArray){
    let tagLowerCase = tag.trim().toLowerCase()
    if(tagLowerCase && tagsArrayCleaned.includes(tagLowerCase)== false){
      tagsArrayCleaned.push(tagLowerCase)
    }else{
      continue;
    }
  }
  // Làm sạch tenSuiteRaw
  let suiteNameFinal = tenSuiteRaw.trim()
// Nếu tenSuiteRaw rỗng thì dùng default value = "unknown-suite"
  if(!suiteNameFinal){
    suiteNameFinal = "unknown-suite";
    
  }
  // Tìmnthowfi giản phản hồi lớn nhất dùng spread với Math.max
  let slowResponse = Math.max(...tocDoPhanHoi)
   console.log(slowResponse)
  return {
     suiteName: suiteNameFinal,
  config:configCuoi,
  tags: tagsArrayCleaned,
slowResponse: slowResponse
  }
}
console.log(taoCauHinhChayTest())



// Trả về object có dạng
// {
// suiteName = "Payment Flow",
// config:{
//   baseUrl:"https://staging.neko.vn",
//     timeout: 10000,
//       headless: false,
//         retries: 2
  
// },
//   tags: ["smoke","login","checkout","regression"],
// slowResponse: 3400
// }

const testRun = [
  [
    "login smoke test",
    { browser: "   chromium   ", env: "   staging   " },
    "   PASS   ",
  ],
  [
    "checkout payment",
    { browser: "   firefox   ", env: "   prod   " },
    "   FAIL   ",
  ],
  [
    "Search product",
    { browser: "   webkit   ", env: "   staging   " },
    "   PASS   ",
  ],
  ["   ", { browser: "   chromium   ", env: "   dev   " }, "   FAIL   "],
];

var totalInvalid = 0;
var passed = [];
var failed = [];
for (let i = 0; i < testRun.length; i++) {
  const [rawTestName, { browser, env }, rawStatus] = testRun[i];
  if (rawTestName.trim() == "") {
    totalInvalid = totalInvalid + 1;
    continue;
  } else if (rawStatus.trim() !== "PASS" && rawStatus.trim() !== "FAIL") {
    totalInvalid = totalInvalid + 1;
    continue;
  } else {
    let testCase = `${rawTestName.trim()} - ${browser.trim()} - ${env.trim()}}`;
    if (rawStatus.trim() === "PASS") {
      passed.push(testCase);
    } else {
      failed.push(testCase);
    }
  }
}
var totalValid = passed.length + failed.length;
const taoBaoCaoTestRun = {
  totalValid: totalValid,
  totalInvalid: totalInvalid,
  passed: passed,
  failed: failed,
};
console.log(taoBaoCaoTestRun);

const configmacDinhBaiTap = {
  baseUrl: "https://staging.neko.vn",
  timeout: 30000,
  headless: true,
  retries: 2,
};

const configGhiDe = {
  timeout: 10000,
  headless: false,
};
const tagsMacDinh = ["   smoke   ", "   login  "];
const tagsThem = [" checkout   ", "   Smoke   ", "   regression   "];
const tocDoPhanHoi = [1200, 3400, 800, 1500];
const tenSuiteRaw = " Payment Flow   ";
// Yêu cầu:
// Viet ham taoCauHinhChayTest()
function taoCauHinhChayTest() {
  // Dung object spread để tạo configCuoi từ configMacDinhbaiTap và configGhiDe
  const configCuoi = { ...configmacDinhBaiTap, ...configGhiDe };

  // Dùng Array spread để gộp tagsMacDinh và tagsThem thành 1 mảng mới
  const tagsArray = [...tagsMacDinh, ...tagsThem];
  // Sau đó xử lý mảng mới bằng cách loại bỏ tag rỗng và chuyển về chữ thường
  const tagsArrayCleaned = [];
  for (const tag of tagsArray) {
    let tagLowerCase = tag.trim().toLowerCase();
    if (tagLowerCase && tagsArrayCleaned.includes(tagLowerCase) == false) {
      tagsArrayCleaned.push(tagLowerCase);
    } else {
      continue;
    }
  }
  // Làm sạch tenSuiteRaw
  let suiteNameFinal = tenSuiteRaw.trim();
  // Nếu tenSuiteRaw rỗng thì dùng default value = "unknown-suite"
  if (!suiteNameFinal) {
    suiteNameFinal = "unknown-suite";
  }
  // Tìm thời gian phản hồi lớn nhất dùng spread với Math.max
  let slowResponse = Math.max(...tocDoPhanHoi);
  return {
    suiteName: suiteNameFinal,
    config: configCuoi,
    tags: tagsArrayCleaned,
    slowResponse: slowResponse,
  };
}
console.log(taoCauHinhChayTest());
let String = "1234567891234567891234567891234567892345678923456789023456789123456789123456789012345678901234567890123456789012345678901234567891234567890"
console.log(String.length);
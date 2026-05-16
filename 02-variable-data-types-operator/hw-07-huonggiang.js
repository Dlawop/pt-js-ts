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


const loginOptions = {
    defaultRole: "guest",
    allowedRoles: ["admin", "tester", "viewer", "guest"],
    minPasswordLength: 8
};

const loginTestData = [
    {
        name: "Case 1 - Hợp lệ cơ bản",
        formInput: {
            username: "  Neko_Admin  ",
            password: "  12345678  ",
            role: " tester ",
            rememberMe: "yes",
            device: "  chrome-win11  "
        }
    },
    {
        name: "Case 2 - Role rỗng, phải dùng defaultRole",
        formInput: {
            username: "  guest_user  ",
            password: "  abcdefgh  ",
            role: "   ",
            rememberMe: "no",
            device: " firefox "
        }
    },
    {
        name: "Case 3 - Username rỗng",
        formInput: {
            username: "    ",
            password: "12345678",
            role: "tester",
            rememberMe: "yes",
            device: "chrome"
        }
    },
    {
        name: "Case 4 - Username có khoảng trắng ở giữa",
        formInput: {
            username: "neko admin",
            password: "12345678",
            role: "tester",
            rememberMe: "yes",
            device: "chrome"
        }
    },
    {
        name: "Case 5 - Password quá ngắn",
        formInput: {
            username: "valid_user",
            password: "123",
            role: "tester",
            rememberMe: true,
            device: "chrome"
        }
    },
    {
        name: "Case 6 - Role không hợp lệ",
        formInput: {
            username: "valid_user",
            password: "12345678",
            role: "manager",
            rememberMe: "on",
            device: "chrome"
        }
    },
    {
        name: "Case 7 - rememberMe là boolean true",
        formInput: {
            username: "admin01",
            password: "abcdefgh",
            role: "admin",
            rememberMe: true,
            device: "edge"
        }
    },
    {
        name: "Case 8 - rememberMe là chuỗi lạ",
        formInput: {
            username: "viewer01",
            password: "abcdefgh",
            role: "viewer",
            rememberMe: "maybe",
            device: "safari"
        }
    }
];
function taoPayloadDangNhap(formInput, options){
  // Khi làm với bộ data test này:

// - `formInput` nhận `loginTestData[i].formInput`
// - `options` nhận `loginOptions`
// - Ví dụ gọi hàm: `taoPayloadDangNhap(loginTestData[0].formInput, loginOptions)`

// ### Yêu cầu

// 1. Dùng object destructuring để lấy dữ liệu từ `formInput`.
  let {
    username,
    password,
    role,
    rememberMe = false,
    device
  } = formInput;
  
  // 2. Dùng object destructuring + default value để lấy dữ liệu từ `options`.
//    - Nếu `options.defaultRole` không có thì biến `defaultRole` nhận `""guest""`.
//    - Nếu `options.minPasswordLength` không có thì biến `minPasswordLength` nhận `8`.
//    - `""guest""` và `8` lấy theo `loginOptions` đã cho ở đầu bài, không phải tự nghĩ thêm.
//    - `allowedRoles` lấy thẳng từ `options.allowedRoles`, không tự thêm giá trị khác.
//    - Trong bộ data test hiện tại, `options` đã có đủ field nên 2 giá trị mặc định này có thể không chạy; chúng được giữ lại để bám đúng YC2.
  
  const {
    defaultRole= "guest",
    allowedRoles,
    minPasswordLength= 8
  } = options;
  
  // 3. Chuẩn hóa dữ liệu:
//    - `username` -> trim, chuyển về lowercase
//    - `password` -> trim
//    - `role` -> trim, lowercase
//    - `device` -> trim
//    - `rememberMe` -> chuyển về boolean
  username = username.trim().toLowerCase();
  password = password.trim();
  role = role.trim().toLowerCase();
  device = device.trim();
  let rememberMeValidString = ["yes", "on"];
   let rememberMeInvalidString = ["maybe", "no"];
  if(typeof(rememberMe) !== "boolean" && rememberMeValidString.includes(rememberMe)){
    rememberMe = true;
  }
  if(typeof(rememberMe) !== "boolean" && rememberMeInvalidString.includes(rememberMe)){
    rememberMe = false;
  }
  const payload ={
    username,
    password,
    role,
    rememberMe,
    device
  };
  
  // 4. Kiểm tra hợp lệ:
//    - `username` không được rỗng
  let errors = [];
  if(username ===""){
    errors.push("Should enter the required username")
};
  //    - `username` không được chứa khoảng trắng ở giữa
  if(username.includes(" ") === true){
    errors.push("username should not include whitespace")
};
  //    - `password` phải dài ít nhất `minPasswordLength`
  if(password.length < minPasswordLength){
    errors.push(`Password should be at least ${minPasswordLength} character`)
};
  //    - `role` phải nằm trong `allowedRoles`
  if(allowedRoles.includes(role) === false){
    errors.push("Should enter the valid role")
};
  let isValid;
if(errors.length >0 ){
  isValid = false;
}else{
  isValid = true;
}
  // 6. Phải trả về object theo dạng:
return {
    isValid: isValid,
    payload: payload,
    errors: errors
}
}

for (let i = 0; i < loginTestData.length; i++){
  let formInput = loginTestData[i].formInput;
 let result = taoPayloadDangNhap(formInput, loginOptions);
//  console.log(result);
}








// 5. Không được sửa trực tiếp `formInput` hoặc `options`.

// ```
// "
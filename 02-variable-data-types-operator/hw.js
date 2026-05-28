function kiemTraMatKhau(matkhau){
  //gia lap Server kiem tra mat khau setTimeout 1.5s
    return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (matkhau==="Neko@123") {
        resolve("Dang nhap thanh cong, chao admin");
      } else {
        reject("Sai mat khau");
      }
    }, 1500);
  });
}
kiemTraMatKhau("Abc").then((message) => {
  console.log(message);
}).catch((error) => {
  console.log(error);
});

kiemTraMatKhau("Neko@123").then((message) => {
  console.log(message);
}).catch((error) => {
  console.log(error);
});
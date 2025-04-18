const { default: mongoose, model } = require("mongoose");
const {
  db: { host,port, name },
} = require("../config/config.mongdb");

console.log({host,port,name})
// const connectString = `mongodb://127.0.0.1:27017/product-management`


const connectString = `mongodb://${host}:${port}/${name}`;
const { countConnect } = require("../helpers/check.connect");
console.log("connectString",connectString)
class Database {
  constructor() {
    this.connect(); // Gọi phương thức connect khi khởi tạo đối tượng
  }

  // connect

  connect(type = "mongdb") {
    if (1 === 1) {
      // Luôn thực thi đoạn này vì điều kiện luôn đúng
      mongoose.set("debug", true); // Bật chế độ debug
      mongoose.set("debug", { color: true }); // Định dạng màu sắc log (cho terminal hỗ trợ)
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50, // Giới hạn tối đa 50 kết nối trong connection pool
      })
      .then((_) => console.log("Connect Success ")) 
      .catch((err) => console.log("Connect Error",err)); // Ghi lỗi nếu kết nối thất bại
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database(); // Nếu chưa có instance, tạo mới
    }
    return Database.instance; // Trả về instance
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;

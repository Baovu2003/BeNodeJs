// Đầu vào (fn): Hàm này nhận một hàm bất đồng bộ (fn) làm tham số.
//  Trong ví dụ trên, fn chính là accessControllers.signup.

// Trả về: Hàm này trả về một hàm mới (chính là hàm xử lý route) với ba tham số req, res, và next.

// Xử lý lỗi:
// Phần quan trọng là .catch(next) ở cuối. Vì fn (ở đây là accessControllers.signup)
//  là một hàm bất đồng bộ (trả về Promise), nếu có lỗi xảy ra hoặc Promise bị từ chối (rejected), 

// .catch(next) sẽ bắt lỗi và chuyển nó tới next().
// next() là một hàm trong Express dùng để chuyển điều khiển tới middleware tiếp theo, 
// ở đây nó sẽ chuyển lỗi đến middleware xử lý lỗi của ứng dụng.


const asyncHandler = fn =>{
    return (req,res,next) => {
        fn(req,res,next).catch(next);
    }
}
module.exports = {asyncHandler};
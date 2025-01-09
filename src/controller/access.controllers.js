class AccessController {

    signup = async(req, res, next) => { 
        
        try {
            console.log("Body:",req.body);
            return res.status(200).json({
                code:"success",
                metaData: {userId: 1}
            });
        } catch (error) {
         next(error);   
        }
     };
}

module.exports = new AccessController();
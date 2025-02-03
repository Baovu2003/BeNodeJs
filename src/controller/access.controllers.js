const AccessService = require("../services/access.services");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
class AccessController {


    handlerRefreshToken = async (req, res,next) => {

        // v1

        // console.log("logout in controller")
        // new SuccessResponse({
        //     message: "Get Token success",
        //     metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
        // }).send(res);

        // v2

        console.log("handlerRefreshToken in controller:")
        console.log("req.keyStore: ",req.keyStore,)
        console.log("---req.refreshToken: ", req.refreshToken,)
        console.log("---req.user: ",req.user)
        new SuccessResponse({
            message: "Get Token success",
            metadata: await AccessService.handlerRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore:req.keyStore
            }
                )
        }).send(res);
    }

    logout = async (req, res,next) => {
        console.log("logout in controller")
        new SuccessResponse({
            message: "Delete success",
            metadata: await AccessService.logout(req.keyStore)
        }).send(res);
    }

    login = async (req, res,next) => {
        new SuccessResponse({
            message: "Login Success",
            metadata: await AccessService.login(req.body)
        }).send(res);
    }


    signup = async (req, res, next) => {
        // try {
        console.log("Body:", req.body);

        new CREATED({
            message: "Register Success",
            metadata:  await AccessService.signUp(req.body),
            options:{
                limit:10
            }
        }).send(res);
        // return res.status(200).json({
        //     message:"Success",
        //     metaddata:''
        // })

        // } catch (error) {
        //  next(error);
        // }
    };
}

module.exports = new AccessController();

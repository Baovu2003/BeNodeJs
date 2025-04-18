'use strict'

const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.services')

const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: "authorization",
    REFRESHTOKEN: 'x-rtoken-id',
};

const createTokenPair = async ( payload, publicKey, privateKey ) => {
    console.log('Bên createTokenPair: ',{publicKey, privateKey})
    try {
        // accessToken
        const accessToken = await JWT.sign( payload, publicKey, {
            expiresIn: '2 days' //Có hiệu lực trong 2 ngày
        })

        const refreshToken = await JWT.sign( payload, privateKey, {
            expiresIn: '7 days' //Có hiệu lực trong 7 ngày
        })

        //
        JWT.verify( accessToken, publicKey, (err, decode) => {
            if(err){
                console.error(`error verify::`, err)
            }else{
                console.log(`decode verify::`, decode)
            }
        })
        console.log(`accessToken in authUntils.js :`, accessToken);
        console.log("refreshToken: ", refreshToken)
        return { accessToken, refreshToken}
    } catch (error) {
        console.error('Error creating token pair:', error);
    }
}

const authenticationV2 = asyncHandler(async (req, res,next) => {
    console.log("req.headers",req.headers)
    /*
        1 - Check userId missing ???
        2 - get access token
        3 - verify token
        4 - check user trong db co correct khong
        5 - check keyStore with this userId
        6 - return next
    */
        //1
        const userId = req.headers[HEADER.CLIENT_ID];
        console.log("userId in authUtils",userId)
        if(!userId)  throw new AuthFailureError("Unauthorized") ;

        //2
        const keyStore = await findByUserId({userId});
        console.log("KeyStore ", keyStore);
        if(!keyStore) throw new NotFoundError("Unauthorized") ;

        //3
        if(req.headers[HEADER.REFRESHTOKEN]){
            try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN];

                const decodeUser = JWT.verify(refreshToken,keyStore.privateKey);
                console.log(`decodeUser verify::`, decodeUser)
                if(userId !== decodeUser.userId) throw new AuthFailureError("Unauthorized");
                req.keyStore = keyStore;
                req.user = decodeUser;
                req.refreshToken =refreshToken;
                console.log({keyStore:keyStore,refreshToken:refreshToken,user:decodeUser})
                console.log("Dong 2: ",req.keyStore,"---req.refreshToken: ",
                            req.refreshToken,"---req.user: ",req.user)
                return next();
            } catch (error) {
                throw error
            }
        }
        const accessToken =  req.headers[HEADER.AUTHORIZATION]?.toString()?.replaceAll('Bearer ', '');
        console.log({accessToken})
        if(!accessToken) throw new AuthFailureError("Unauthorized") ;

        //4
        console.log("accessToken ", accessToken)
        console.log("KeyStore Public Key:", keyStore.publicKey);
        try {
            const decodeUser = JWT.verify(accessToken,keyStore.publicKey);
            console.log(`decodeUser verify::`, decodeUser)
            if(userId !== decodeUser.userId) throw new AuthFailureError("Unauthorized");
            req.keyStore = keyStore;
            return next();
        } catch (error) {
            throw error
        }

})

const verifyJWT = async (token,kerSecret) => {
    return await JWT.verify(token, kerSecret);
}

module.exports = {
    createTokenPair,verifyJWT,authenticationV2
}
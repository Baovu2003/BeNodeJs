'use strict'

const JWT = require('jsonwebtoken')

const createTokenPair = async ( payload, publicKey, privateKey ) => {
    console.log({publicKey, privateKey})
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
        console.log(`accessToken in authUntils.js :`, accessToken,"and refreshToken::", refreshToken)
        return { accessToken, refreshToken}
    } catch (error) {
        console.error('Error creating token pair:', error);
    }
}

module.exports = {
    createTokenPair
}
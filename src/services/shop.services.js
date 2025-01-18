'use strict'

const shopModel = require("../model/shop.model")

const findByEmail =async ({email, select= {
    email: 1,
    name: 1,
    password:1,
    status:1,
    roless: 1,

}}) =>{
    // Logic to find user by email
    return await shopModel.findOne({email: email}).select(select).lean()
}

module.exports ={
    findByEmail
}
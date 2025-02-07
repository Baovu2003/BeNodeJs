'use strict';

const _ = require('lodash');

const getInforData = ({fileds = [], object={}}) =>{
    return _.pick(object,fileds)
}


// Nếu ta đưa vào mảng [['name', 0], ['age', 0]], hàm Object.fromEntries
//  sẽ trả về đối tượng:
// { name: 0, age: 0 }
const unGetSelectData = (select = []) =>{
    return Object.fromEntries(select.map(el => [el,0]))
}
module.exports = {
    getInforData,unGetSelectData
}
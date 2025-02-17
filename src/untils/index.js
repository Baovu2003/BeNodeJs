'use strict';

const _ = require('lodash');
const {Types} = require('mongoose');

const convetToObjectId = id => new Types.ObjectId(id);
const getInforData = ({fileds = [], object={}}) =>{
    return _.pick(object,fileds)
}

const getSelectData = (select = []) =>{
    return Object.fromEntries(select.map(el => [el,1]))
}

// Nếu ta đưa vào mảng [['name', 0], ['age', 0]], hàm Object.fromEntries
//  sẽ trả về đối tượng:
// { name: 0, age: 0 }
const unGetSelectData = (select = []) =>{
    return Object.fromEntries(select.map(el => [el,0]))
}

const removeUndefineObj = obj =>{
    Object.keys(obj).forEach(k =>{
        if(obj[k] ==null){
            delete obj[k]
        }
    })
    console.log("removeUndefineObj",obj)
    return obj
}
const updateNestedObjectParser = obj =>{
    console.log("[1-OBJ luc dau]", obj)
    const final={}
    
    // Object.keys(obj||{}) lấy danh sách các khóa trong đối tượng 
    // obj (nếu obj là null hoặc undefined, ta sẽ lấy một đối tượng rỗng).
    Object.keys(obj||{}).forEach(k =>{
        console.log("[2-K",k)
        if(typeof obj[k] =="object" && !Array.isArray(obj[k])){
           const result=updateNestedObjectParser(obj[k])
           console.log("[3-result: ]", result)
            Object.keys(result||{}).forEach(a =>{
                console.log("[4-]",a)
                final[`${k}.${a}`] = result[a]
            })
        }else{
            final[k] = obj[k]
        }
    })
    console.log("[1-final: ]", final)
    return final;
}


module.exports = {
    getInforData,
    getSelectData,
    unGetSelectData,
    removeUndefineObj,
    updateNestedObjectParser,
    convetToObjectId
}
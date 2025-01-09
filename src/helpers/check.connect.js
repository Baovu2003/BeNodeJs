const { default: mongoose, model } = require("mongoose");

const os = require("os");
const process = require("process");

const _SECONDS = 5000;
const countConnect = () => {

    const numConnection = mongoose.connections.length
    console.log(`Number of connect: ${numConnection}`)

};


// check overloading

const checkOverloading =() => {
    setInterval(() =>{
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        const maxConnections = numCores * 5;

        // console.log(`Connection activity: ${numConnection}`)
        // console.log(`MaxConnections activity: ${maxConnections}`)

        // console.log(`Memory usage:${ memoryUsage/1024/1024} `)
        if(numConnection > maxConnections){
            console.log("Connected overloading")
            // notify.send(.........)
        }
    },_SECONDS);
}

module.exports = {
    countConnect,
    checkOverloading
}
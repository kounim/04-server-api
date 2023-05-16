const moment = require('moment');
const lib = {
    resData:(status, message, resData, data)=>{
        return {status, message, resData, data}
    },

    isEmpty(value){
        if(value==""||value==null||value==undefined||(value != null&&typeof value == "object" && !Object.keys(value).length)){
            return true;
        }else{
            return false;
        }
    },
    
};

module.exports=lib;
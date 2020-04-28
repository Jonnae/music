 module.exports = (date)=>{
   let fmt = 'yyyy-MM-dd hh:mm:ss'
   const o = {
     'M+': date.getMonth() + 1, //月
     'd+': date.getDate(),  //日
     'h+': date.getHours(), //小时
     'm+': date.getMinutes(),
     's+': date.getSeconds(),
   }
   //test方法仅仅检查是否能够匹配str，并且返回布尔值以表示是否成功。同样建立一个简单的测试函数：
   if(/(y+)/.test(fmt)){
    fmt = fmt.replace(RegExp.$1,date.getFullYear()) 
   }
   for(let k in o){
     if(new RegExp('('+ k + ')').test(fmt)){
       fmt = fmt.replace(RegExp.$1,o[k].toString().length == 1 ? '0' + o[k]:o[k])
     }
   }
     return fmt
 }

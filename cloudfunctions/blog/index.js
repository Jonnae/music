// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const TcbRouter = require('tcb-router')
const db = cloud.database()
const blogCollection = db.collection('blog')
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  app.router('list',async(ctx,next)=>{
    const keyword = event.keyword
    let w = {}
    if(keyword.trim() != ''){
      w = {
        content:db.RegExp({
          regexp: 'keyword',
          options: "i"
        })
      }
    }
    //分页查询，逆序排列
    let blogList = await blogCollection.where(w).skip(event.start).limit(event.count)
    .orderBy('creatTime','desc').get()
    .then( res=>{
        return res.data
    })
    ctx.body = blogList //返回前台
  })

  app.router('detail',async(ctx,next)=>{
    let blogId = event.blogId
    /*详情的查询*/
    let detail = await blogCollection.where({
      _id: blogId
    }).get().then(res=>{
      return res.data
    })
    /*评论的查询*/
    //因为查询上限是100，所以先查询当前总条数
    const countResult =await blogCollection.count()
    //因为countResult是个对象，所以需要.total取得number型总数
    const total = countResult.total
    let commentList = {
      data:[]
    }
    if(total > 0){
      //需要查几次，
      const batchTimes = Math.ceil(total/MAX_LIMIT) 
      //定义一个数组用来存放promise对象
      const tasks = []
      //根据次数查询数据库
      for(let i = 0;i < batchTimes; i++){
        let promise = db.collection('blog-comment').skip(i*MAX_LIMIT)
        .limit(MAX_LIMIT).where({
          blogId
        }).orderBy('creatTime','desc').get()
        tasks.push(promise)
      }
      if(tasks.length > 0){
        commentList = (await Promise.all(tasks)).reduce((acc,cur)=>{
          return {
            data:acc.data.concat(cur.data)
          }
        })
      }
    }
    ctx.body = {
      commentList,
      detail,
    }
  })

  app.router('bloghistory',async(ctx,next)=>{
    const wxContext = cloud.getWXContext()
    ctx.body = await blogCollection.where({
      _openid: wxContext.OPENID
    }).skip(event.start).limit(event.count)
    .orderBy('creatTime','desc').get()
    .then( res=>{
        return res.data
    })
  })
  
  return app.serve()
}
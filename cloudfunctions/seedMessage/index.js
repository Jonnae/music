// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const {OPENID} = cloud.getWXContext()
    const result = await cloud.openapi.subscribeMessage.send({
        touser: OPENID,
        page: `pages/blog-comment/blog-comment?blogId=${event.blogId}`,
        data: {
          thing2: {
            value: event.content
          },
          name4: {
            value: '本人'
          }
        },
        templateId: 'K3YCkjAaf7hcYmNKxL3KPKoVDo97wpRVOkl6yf6saeI'
      })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}
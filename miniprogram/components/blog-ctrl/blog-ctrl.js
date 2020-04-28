// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId:String,
    blog: Object
  },
  externalClasses:
  ['iconfont','icon-pinglun','icon-fenxiang'],

  /**
   * 组件的初始数据
   */
  data: {
    //当前登录组件是否显示
    loginShow:false,
    modelShow:false,
    content:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // onInput(event){
    //   this.setData({
    //     content: event.detail.value
    //   })
      
    // },
   
    onLoginSuccess(event){  
      userInfo = event.detail
      //授权则授权框消失 
      this.setData({
        loginShow:false,
      },(res)=>{
        this.setData({
          modelShow:true
        })
      })
     
    },
    onLoginFail(){
    wx.showModal({
      title: '请授权',
      content: '',
    })
    },
    goComment(){
      //判断用户是否授权
      wx.getSetting({
        complete: (res) => {
          if(res.authSetting['scope.userInfo']){
            wx.getUserInfo({
              success: (res) => {
                userInfo= res.userInfo
                //显示评论弹出层
                this.setData({
                  modelShow:true
                })
              },

            })
          }else{
            this.setData({
              loginShow:true
            })
          }
        },

      })
    },
    onSend(event){
      console.log(userInfo)
      //let formId = event.detail.formId
      let content = event.detail.value.content
      //插入数据库
      if(content.trim() == ''){
        wx.showModal({
          cancelColor: '#c43b63',
          title:'不能为空'
        })
        return
      }else{
        wx.showLoading({
          title: '评价中',
          mask:true
        })
       
        db.collection('blog-comment').add({
          data:{
            content,
            creatTime: db.serverDate(),
            blogId: this.properties.blogId,
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl
          }
        }).then(res=>{
       
        
          wx.hideLoading()
          wx.showToast({
            title: '评论成功!',
          })
          this.setData({
            value:'',
            modelShow:false,
          })
          //父元素刷新页面
          this.triggerEvent('reComment')
        })
      } 
      
    },
  }
})

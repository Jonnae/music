// pages/blog-edit/blog-edit.js
//最大字数限制
const MAX_WORDS_NUM = 140
// 最大图片数量
const MAX_IMG_NUM = 9
const db= wx.cloud.database()
//输入的文字内容
let content = ''
let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 评论字数
    wordNum:0,
    footerbottom:0,
    images:[],
    selectPhoto:true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 1.将图片存入云存储 得到fileId 云文件id
  // 2.将数据存入云数据库
  // 数据库将存入：内容，图片  fileId openID 昵称 头像 时间
  send(){
    //trim(),去掉前后空格
    if (content.trim() == ''){
      wx.showModal({
        title: '请输入内容',
        content: '',
      })
      return
    }
    wx.showLoading({
      title: '发布中...',
      mask: true,
    })
    let promiseArr = []
    let fileIds = []
    for(let i = 0,len = this.data.images.length;i < len; i++){
    let p = new Promise((resolve,reject)=>{
      let item = this.data.images[i]
      //正则表达式取得文件扩展名
      let suffix = /\.\w+$/.exec(item)[0]

      wx.cloud.uploadFile({
        cloudPath: 'blog/' + Date.now + '-' + Math.random() * 10000000 + suffix,
        filePath: item,
        success: res => {
          console.log(res.fileID)
          fileIds = fileIds.concat(res.fileID)
          resolve()
        },
        fail: err => {
          console.log(err)
          reject()
        }
      })
    })
      promiseArr.push(p)
  }
  //存入数据库
    Promise.all(promiseArr).then(res =>{
      db.collection('blog').add({
        data:{
          ...userInfo,
          content,
          img:fileIds,
          creatTime:db.serverDate(),
        }
      }).then(res=>{
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })
        //返回博客列表，刷新列表
        wx.navigateBack()
          const pages = getCurrentPages()
          console.log(pages)
          //取到上一个界面,-1 是当前页面, -2 就是你上一页的数据 你上上页的数据就是-3 了以此类推！
          const prevpage = pages[pages.length - 2]
          prevpage.onPullDownRefresh()
        
      })
    }).catch(res=>{
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
      })
    })
  },

  //预览图片
  onPreviewImage(event){
    wx.previewImage({
      urls: this.data.images,
      current:event.target.dataset.imgsrc,
    })
  },
  onDelImg(event){
    this.data.images.splice(event.target.dataset.index, 1)
    this.setData({
      images: this.data.images
    })
    if (this.data.images.length == MAX_IMG_NUM - 1){
      this.setData({
        selectPhoto: true,
      })
    }
  },
  onChooseImg(){
    //还能再选几张图片
    let max = MAX_IMG_NUM - this.data.images.length
    wx.chooseImage({
      //最多可以选择的图片张数
      count: max,
      //所选的图片的尺寸
      sizeType: ['original', 'compressed'],
      //选择图片的来源
      sourceType: ['album', 'camera'],
      //接口调用成功的回调函数
      success: (res) =>{
        console.log(res)
        this.setData({
          //考虑原先就有图片，所以得追加
          images: this.data.images.concat(res.tempFilePaths)
        })
        //选择完图片后判断还能再选几张图片
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max <= 0 ? false : true
        })
      },
    })
  },
  onLoad: function (options) {
    console.log(options)
    userInfo = options
  },
  onFocus(event){
    console.log(event)
    this.setData({
      footerbottom: event.detail.height
    })

  },
  onBlur(event){
    this.setData({
      footerbottom:0
    })
  },

  onInput(event) {
    // console.log(event.detail.value.length)
    let wordNum = event.detail.value.length
    if (wordNum >= MAX_WORDS_NUM){
      wordNum = `最大字数限制为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordNum
    })
    content = event.detail.value
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
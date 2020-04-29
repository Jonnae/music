// pages/blog/blog.js
let keyword = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //控制弹出层是否显示
    modelShow: false,
    //博客列表
    blogList: [],
  },
  //发布功能
  onPublic() {
    // this.setData({
    //   modelShow: true
    // })
    // 判断用户是否授权
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              // console.log(res)
              this.onLoginSuccess({
                detail: res.userInfo
              })
            }
          })
        } else {
          this.setData({
            modelShow: true
          })
        }
      }
    })
  },

  onLoginSuccess(event) {
    console.log(event)
    const detail = event.detail
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  onLoginFail() {
    wx.showModal({
      title: '请授权',
      content: '',
    })
  },
  goComment(event) {
    console.log(event)
    wx.navigateTo({
      url: `../../pages/blog-comment/blog-comment?blogId=${event.target.dataset.blogid}`,
    })
  },
  onSearch(event) {
    keyword = event.detail.keyword
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList()

  },
  //start = 0,es6语法,不传值就是0
  _loadBlogList(start = 0) {
    wx.showLoading({
      title: '加载中...',
    })
    // 调用名为 blog 的云函数，路由名为 list
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'blog',
      // 传递给云函数的参数
      data: {
        start,
        keyword,
        count: 10,
        $url: 'list', // 要调用的路由的路径，传入准确路径或者通配符*  
      }
    }).then(res => {
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
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
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    const blogObj = event.target.dataset.blog
    return {
      title: blogObj.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
      //imageUrl:
    }
  }
})
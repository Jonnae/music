// pages/profile-bloghistory/profile-bloghistory.js
const MAX_COUNT = 5
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList:[]
  },

  _getBlogHistoryList(){
    wx.cloud.callFunction({
      name:'blog',
      data:{
        $url:'bloghistory',
        start:this.data.blogList.length,
        count:MAX_COUNT
      }
    }).then(res=>{
      // console.log(res)
      this.setData({
        blogList:this.data.blogList.concat(res.result) 
      })
    })
  },

  //小程序端调用测试
  _getminipro(){
    db.collection('blog').skip(this.data.blogList.length)
    .limit(MAX_COUNT).orderBy('creatTime','desc').get()
    .then(res=>{
      // console.log(res)
      let _list = res.result
      for(let i=0;i<_list.length;i++){
        _list[i].creatTime = _list[i].creatTime.toString()
      }
      this.setData({
        blogList:this.data.blogList.concat(_list)
      })
    })
  },

  goComment(event){
    console.log(event)
    wx.navigateTo({
      url: `../../pages/blog-comment/blog-comment?blogId=${event.target.dataset.blogid}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  this._getBlogHistoryList()
  // this._getminipro()
   
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
    this._getBlogHistoryList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    const blogObj = event.target.dataset.blog
    return {
      title:blogObj.content,
      path:`/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
      //imageUrl:
    }
  }
})
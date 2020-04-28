//app.js
App({
  onLaunch: function () {
    this.checkUpdate()
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'test-7w3nh',
        traceUser: true,
      })
    }
    this.getOpenId()


    //全局属性
    this.globalData = {
      playingMusicId: -1,
      openid: -1
    }

  },
  setPlayMusicId(musicId) {
    this.globalData.playingMusicId = musicId
  },
  getPlayMusicId() {
    return this.globalData.playingMusicId
  },
  getOpenId() {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      const openid = res.result.openid
      this.globalData.openid = openid
      if (wx.getStorageSync(openid) == '') {
        wx.setStorageSync(openid, [])
      }
    })
  },
  //检测更新
  checkUpdate() {
    const updateManager = wx.getUpdateManager()
    //检测版本更新
    updateManager.onCheckForUpdate((res1) => {
      console.log("onCheckForUpdate.res:", res1) //{hasUpdate: false}
      if (res1.hasUpdate) {
        console.log("hasUpate")
        updateManager.onUpdateReady(() => {
          console.log("onUpdateReady")
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              console.log("success res:", res) //{errMsg:"showModal:ok",cancel:false,confirm:true}
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(function () {
          // 新版本下载失败
          console.log("onUpdateFailed")
        })

      }
    })
  }
})
// components/musiclist/musiclist.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist:{
      type:Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId:-1
  },
  pageLifetimes: {
      show() {//组件所在的页面被展示时执行
      this.setData({
        playingId: parseInt(app.getPlayMusicId())
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event){
      const ds = event.currentTarget.dataset
      const musicid = ds.musicid
      console.log(musicid)
      this.setData({
        playingId: musicid,
       
      })
     wx.navigateTo({
       url: `../../pages/player/player?musicId=${musicid}&&index=${ds.index}`,

     })
    }

  }
})

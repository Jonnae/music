// pages/player/player.js
let musiclist = [];
//当前播放歌曲的index
let nowPlayindex = 0;
//获取全局唯一背景音频管理器
const backgroundAudioManager =  wx.getBackgroundAudioManager()
const app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl : '',
    isPlaying: false, //false表示不播放，true表示正在播放
    isLyricShow:false,
    lyric:'',
    isSame:false, //是否为同一首歌曲
    nolyric: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    nowPlayindex = options.index
    musiclist= wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)
   
  },

  _loadMusicDetail(musicId){
    if (musicId == app.getPlayMusicId()){
      this.setData({
        isSame:true
      })
    }else{
      this.setData({
        isSame: false
      })
    }
    if (!this.data.isSame){
      backgroundAudioManager.stop()
    }
    
    let music = musiclist[nowPlayindex]
    console.log(music)
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl:music.al.picUrl,
      isPlaying: false
    })
    app.setPlayMusicId(musicId)//全局
    
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        $url: 'musicUrl',
        musicId: musicId
      }
    }).then(res=>{
      console.log(res)
      console.log(JSON.parse(res.result))
      const result = JSON.parse(res.result)
      if (result.data[0].url == null){
         wx.showToast({
           title: '无权限播放...',
         })
         return
      }
      if(!this.data.isSame){
        backgroundAudioManager.src = result.data[0].url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.al.name

        //保存播放历史
        this.sendHistory()
      }
 
      this.setData({
        isPlaying: true
      })
      wx.hideLoading()
      //加载歌词
      wx.cloud.callFunction({
        name:'music',
        data:{
          musicId,
          $url:'lyric',
        }
      }).then(res =>{
          console.log(res)
          let lyric = '暂无歌词'
          const lrc = JSON.parse(res.result).lrc
          if(JSON.parse(res.result).nolyric){
              this.setData({
              nolyric: true
              })
          }else{
              this.setData({
              nolyric: false
            })
       }
        console.log(this.data.nolyric)
         if (lrc){
            lyric = lrc.lyric
            this.setData({
             lyric,
           })
          }
      })
    })
  },
//判断是否播放
  tooglePlaying(){
    if(this.data.isPlaying){
      backgroundAudioManager.pause()
    }else{
      backgroundAudioManager.play()
    }

    this.setData({
      isPlaying:!this.data.isPlaying
    })
  },
//上一首
  onPrev(){
    nowPlayindex--
    if (nowPlayindex < 0){
      nowPlayindex = musiclist.length  - 1
    }
    this._loadMusicDetail(musiclist[nowPlayindex].id)
  },
//下一首
  onNext(){
    nowPlayindex++
    if (nowPlayindex === musiclist.length) {
      nowPlayindex = 0
    }
    this._loadMusicDetail(musiclist[nowPlayindex].id)
  },
  onChangeLyricShow(){
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })  
  },
  timeUpdate(event){
    this.selectComponent('.lyric').updata(event.detail.currentTime)///根据样式获取子组件对象方法
  },
  onPlay(){
    this.setData({
      isPlaying:true
    })
  },
  onPause(){
    this.setData({
      isPlaying: false
    })
  },




  //保存播放历史
  sendHistory(){
    //当前正在播放的歌曲
    const music = musiclist[nowPlayindex]
    const openid = app.globalData.openid
    const history = wx.getStorageSync(openid)
    
    let behave = false
    for(let i = 0;i < history.length;i++){
      if(history[i].id == music.id){
        behave = true
        break
      }
    }
    if(!behave){
      console.log(history)
      history.unshift(music)
      wx.setStorage({
        key: openid,
        data: history
      })
    }

  },
})
// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
//获取全局唯一背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
let currentSec = -1 //当前秒数
let duration = 0 //歌曲总时长，以秒为单位的总时长
let isMoving = false //当前进度条是否被脱拽,解决拖动和onTimeUpdate事件冲突的问题
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //布尔值的默认值是false
    isSame:Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime:{
      currentTime:"00:00",
      totalTime:"00:00"
    },
    movabledis:0,
    progress:0,

  },
  lifetimes:{
    ready(){
      
      if(this.properties.isSame && this.data.showTime.totalTime =='00:00'){
       this._setTime()
      }
      this._getMoveDis()
      this._bindBGMEvent()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _getMoveDis(){
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec((rect) => {
        console.log(rect)
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
        console.log(movableAreaWidth)
        console.log(movableViewWidth)
      })
      
    },

    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        console.log('onPlay')
        isMoving = false;
        this.triggerEvent('musicPlay')
      })

      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })

      backgroundAudioManager.onPause(() => {
        console.log('Pause')
        this.triggerEvent('musicPause')
       
      })

      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })

      backgroundAudioManager.onCanplay(() => {
        console.log('onCanplay')
        console.log(backgroundAudioManager.duration)
        if (typeof backgroundAudioManager.duration != 'undefined'){
            this._setTime()
        }else{
          setTimeout(() =>{
            this._setTime()
          },1000)
        }
       
      })

      backgroundAudioManager.onTimeUpdate(() => {
        //console.log('onTimeUpdate')
        if (!isMoving){
          const currentTime = backgroundAudioManager.currentTime
          const duration = backgroundAudioManager.duration
          if (currentTime.toString().split('.')[0] != currentSec) {
            //console.log(currentTime)
            const currentFormat = this._dateFormat(currentTime)
            this.setData({
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100,
              ['showTime.currentTime']: `${currentFormat.min}:${currentFormat.sec}`
            })
            currentSec = currentTime.toString().split('.')[0]
            //联动歌词
            this.triggerEvent('timeUpdata',{
              currentTime
            })
          }
        }
      })

      backgroundAudioManager.onEnded(() => {
        console.log("onEnded")
        this.triggerEvent('onEnded',)
      })

      backgroundAudioManager.onError((res) => {
        console.error(res.errMsg)
        console.error(res.errCode)
        wx.showToast({
          title: '错误:' + res.errCode,
        })
      })
    },
    _setTime(){
      duration = backgroundAudioManager.duration
      //console.log(duration)
      const durationFormat =this._dateFormat(duration)
      //console.log(durationFormat)
      //设置总时间
      this.setData({
        ['showTime.totalTime']: `${ durationFormat.min }:${ durationFormat.sec}`
        })
    },
    //格式化时间
    _dateFormat(sec){
      //分钟
      const min = Math.floor(sec / 60) 
      //秒
       sec = Math.floor(sec % 60 ) 
      return {
        'min':this._parse0(min),
        'sec':this._parse0(sec),
      } 
    },
    _parse0(sec){
      return sec < 10 ?  '0' + sec : sec
    },
    onchange(event){
      //console.log(event)
      //拖动
      if (event.detail.source == 'touch'){
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
        this.data.movableDis = event.detail.x
        isMoving = true
      }
    },
    onTouchEnd(){
        const currentTimeFormat = this._dateFormat(Math.floor(backgroundAudioManager.currentTime))
        this.setData({
          progress: this.data.progress,
          movableDis: this.data.movableDis,
          ['showTime.currentTime']: currentTimeFormat.min + ':' + currentTimeFormat.sec,
        })
        backgroundAudioManager.seek(duration * this.data.progress /100)
        isMoving = false
    },
  }
})

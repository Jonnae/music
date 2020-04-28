// components/lyric/lyric.js
let nowLyricHeight = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: { 
    isLyricShow:
      {
        type:Boolean,
        value:false
      },
    lyric:String,
    nolyric: Boolean,
  },
  
  observers:{
    'lyric,nolyric'(lrc, nolyric){  
      console.log(this.properties.nolyric)
      if (this.properties.nolyric){
        this.setData({
          lrcList:[
            {
              lrc:'暂无歌词',
              time: 0,
            }
          ],
          nowLyricIndex: -1,
        })
      }else{
        this._parseLyric(lrc)
      }
      //console.log(lrc)  
    }
  },
  lifetimes:{
    ready(){
      wx.getSystemInfo({
        success: (res) => {
          console.log(res)
          //计算1rpx的大小
          nowLyricHeight = res.screenWidth / 750 * 64
        },
      })
    },
    attached() {
      // 在组件实例进入页面节点树时执行
      console.log(this.properties.nolyric)
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],//歌词数组
    nowLyricIndex: 0,//当前歌词索引
    scrollTop: 0,//滚动条滚动高度
  },

  /**
   * 组件的方法列表
   */
  methods: {
    updata(currentTime){
      // console.log(currentTime)
      let lrcList = this.data.lrcList
      if (lrcList.length == 0){
        //没有歌词则直接return，下面的也不会进行了
        return
      }
      //当时长大于歌词时间时，直接跳到最后一行而且不高亮显示
      if (currentTime > lrcList[lrcList.length - 1].time){
        if (this.data.nowLyricIndex != -1){
          this.setData({
            nowLyricIndex: -1,//谁也不高亮选中
            scrollTop: lrcList.length * nowLyricHeight
          })
        }
      }
      for (let i = 0, len = lrcList.length; i < len;i++){
        if (currentTime <= lrcList[i].time){
          this.setData({
            nowLyricIndex: i - 1,
            scrollTop: (i - 1) * nowLyricHeight
          })
          break
        }  
      }
    },
    _parseLyric(sLyric) {
      let line = sLyric.split('\n')
      // console.log(line)
      let _lrcList = []//存歌词
      line.forEach(elem =>{
        let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)//时间
        if (time != null) {
          // console.log(time)
          let lrc = elem.split(time)[1]//歌词
          let timeReg = time[0].match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/)
          //再把时间转换成秒
          let timeToSec = parseInt(timeReg[1]) *60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          // console.log(timeToSec)
          _lrcList.push({
            lrc,
            time: timeToSec
          })
        }
      })
      //循环完成后把歌词显示到界面
     this.setData({
       lrcList: _lrcList
     })
      },
  }
})

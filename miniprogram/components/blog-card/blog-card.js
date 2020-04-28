// components/blog-card/blog-card.js
import formatTime from '../../utils/formatTime'
Component({
  /**
   * 组件的属性列表
   */
  observers:{
    ['blog.creatTime'](val){
      if(val){
        this.setData({
          _creatTime:formatTime(new Date(val))
        })
        
      }
    }
  },
  properties: {
    blog:Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    _creatTime:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPrev(event){
      const ds = event.target.dataset
      wx.previewImage({
        urls: ds.imgs,
        current:ds.imgsrc
      })
    }
  }
})

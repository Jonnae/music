// components/bottom-model/bottom-model.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modelShow:Boolean,
  },

  options:{
    // mulitipleSlots: true, 
    multipleSlots: true// 在组件的js代码里启用多slot支持
  },
  /**
   * 组件的初始数据
   */
  data: {

  },
 
  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.setData({
        modelShow: false
      })
    },
  }
})

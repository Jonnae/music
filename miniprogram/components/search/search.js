// components/search/search.js
let keyword  = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder:{
      type:String,
      value:'说点什么...'
    }
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
    onInput(event){
      keyword = event.detail.value
     // console.log(keyword)
    },
    onSearch(){
       this.triggerEvent('search',{keyword})
    },
  }
})

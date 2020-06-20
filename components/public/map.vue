<template>
  <!-- 地图公共组件 -->
  <div :id="id"
       :style="{width:width+'px',height:height+'px',margin:'34px auto'}"
       class="m-map" />
</template>

<script>
export default {
  props: {
    // 组件宽高
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 300
    },
    // 经纬度
    point: {
      type: Array,
      default () {
        return [116.46, 39.92]
      }
    }
  },
  data () {
    return {
      id: `map`,
      key: '0dbc0dfd7c775f2a927174493eab8220'
    }
  },
  watch: {
    point: function (val, old) {
      this.map.setCenter(val)
      this.marker.setPosition(val)
    }
  },
  // 为了拿到window对象，使用挂载钩子
  mounted () {
    let self = this
    // 挂载时生成一个动态ID
    self.id = `map${Math.random().toString().slice(4, 6)}`
    // 异步加载的回调函数
    // 配置地图控件
    //（详见高德地图组件文档）
    window.onMapLoaded = () => {
      // 实例化地图控件
      let map = new window.AMap.Map(self.id, {
        resizeEnable: true,
        zoom: 11,
        center: self.point
      })
      self.map = map
      // 为地图控件添加插件
      window.AMap.plugin('AMap.ToolBar', () => {
        // 添加工具栏
        let toolbar = new window.AMap.ToolBar()
        map.addControl(toolbar)
        // 添加地图标识
        let marker = new window.AMap.Marker({
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          position: self.point
        })
        self.marker = marker
        marker.setMap(map)
      })
    }
    const url = `https://webapi.amap.com/maps?v=1.4.10&key=${self.key}&callback=onMapLoaded`
    // 创建一个DOM容器，放入地图控件
    let jsapi = document.createElement('script')
    jsapi.charset = 'utf-8'
    jsapi.src = url
    document.head.appendChild(jsapi)
  },
}
</script>

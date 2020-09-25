<template>
  <!-- 地图公共组件 -->
  <div :id="id"
       :style="{width:width+'px',height:height+'px',margin:'34px auto'}"
       class="m-map"></div>
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
      this.map.setCenter(val) // 定位API
      this.marker.setPosition(val)
    }
  },
  // 为了拿到window对象，使用挂载钩子
  mounted () {
    let self = this
    // 挂载时生成一个动态ID
    self.id = `map${Math.random().toString().slice(4, 6)}`
    // 地图加载完成后配置地图控件（详见高德地图组件文档）
    // 本组件中使用地图控件实例
    window.onMapLoaded = () => {
      // 实例化地图控件(id,配置 对象)
      let map = new window.AMap.Map(self.id, {
        resizeEnable: true, // 可改变大小
        zoom: 11, // 伸缩比例
        center: self.point // 定位中心经纬度
      })
      // 地图控件实例添加至本组件(方便控制)
      self.map = map
      // 为地图控件添加插件，参数（插件名，配置函数）
      window.AMap.plugin('AMap.ToolBar', () => {
        // 添加工具栏
        let toolbar = new window.AMap.ToolBar()
        map.addControl(toolbar)
        // 添加地图标识
        let marker = new window.AMap.Marker({
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          position: self.point
        })
        // 地图标识实例添加至本组件(方便控制)
        self.marker = marker
        marker.setMap(map)
      })
    }

    // 通过外部脚本引入高德地图JS库
    let jsapi = document.createElement('script')
    jsapi.charset = 'utf-8'
    const url = `https://webapi.amap.com/maps?v=1.4.10&key=${self.key}&callback=onMapLoaded`
    jsapi.src = url
    document.head.appendChild(jsapi)
  },
}
</script>

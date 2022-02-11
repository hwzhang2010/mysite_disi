<template>
  <div class="root">
    <el-row :gutter="10">
      <el-col :span="6">
	    <el-radio-group v-model="type" @change="handleWaveBeamType" style="margin-top:15px;">
          <el-radio label="max">无约束</el-radio>
          <el-radio label="view">视场角</el-radio>
          <el-radio label="sway">侧摆角</el-radio>
        </el-radio-group>
	  </el-col>
      <el-col :span="5">
        视场角:
        <el-input-number v-model="viewAngle" :disabled="viewDisable" @change="handleViewAngleChange" :min="0" :max="90" :precision="2" :step="0.1" label="视场角"></el-input-number>
      </el-col>
      <el-col :span="5">
        侧摆角:
        <el-input-number v-model="swayAngle" :disabled="swayDisable" @change="handleSwayAngleChange" :min="0" :max="90" :precision="2" :step="0.1" label="侧摆角"></el-input-number>
      </el-col>
      <el-col :span="4">
        <el-date-picker
          v-model="datetime" @change="handleDateTimeChange"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择时间">
        </el-date-picker>
      </el-col>
      <el-col :span="4" style="text-align: right;">
        <el-input placeholder="请输入卫星ID" v-model="satelliteId" clearable>
          <el-button @click="handleSatelliteQuery" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
    </el-row>

    <div id="map"></div>

    <el-table :data="boundaryList" style="width: 100%">
      <el-table-column prop="epoch" label="时间"></el-table-column>
      <el-table-column prop="lng" label="经度(º)"></el-table-column>
      <el-table-column prop="lat" label="纬度(º)"></el-table-column>
    </el-table>
  
    <el-pagination
      class="pagination"
      background
      layout="total, sizes, prev, pager, next"
      :total="total"
      :page-sizes="[20, 50, 100, 200]"
      :page-size="pageSize"
      :current-page="currentPage"
      @size-change="handlePageSizeChange"
      @current-change="handlePageChange"
      @prev-click="handlePageChange"
      @next-click="handlePageChange"
    >
    </el-pagination> 

	 

  </div>
</template>

<script>
  import { formatDateTime } from '@/utils/common'
  //import { postSatellites } from '@/api/api_satellite'
  import { postSatelliteWaveBeamMax, postSatelliteWaveBeamView, postSatelliteWaveBeamSway, postWaveBeamByPage } from '@/api/api_wavebeam'

  export default {
    name: 'WaveBeam',
    data() {
      return {
          type: 'max',
          viewAngle: 0,
          swayAngle: 0,
          viewDisable: true,
          swayDisable: true,
          datetime: '',
          satelliteId: '',

          boundaryList: [],
          total: 0,
          pageSize: 20,
          currentPage: 1,

          map : null,
          layerGroup: null,
    
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        //初始化时间选择器
        let current = new Date()
		    const datetime = formatDateTime(current, 'yyyy-MM-dd HH:mm:ss')
        this.datetime = datetime

        this.map = L.map("map", {
          center: L.latLng(40.07, 116.25),
          zoom: 2,
          maxZoom:18
        })
        // 加载地图服务(高德)
        L.tileLayer(
          "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"
        ).addTo(this.map)

        this.layerGroup = L.layerGroup().addTo(this.map)

      },
      queryByPage() {
        const pageSize = this.pageSize
        const currentPage = this.currentPage
        postWaveBeamByPage({pageSize, currentPage}).then(response => {
          if (response.code === 200) {
            const page = response.respBody
            this.total = page.total
            this.currentPage = page.currentPage
            this.boundaryList = page.dataList
          }
		    })
      },
      drawWaveBeam(boundary) {
        this.layerGroup.clearLayers()

        let polygon = L.polygon(boundary, {
          color: '#48a',
          fillColor: '#48f',
          fillOpacity: 0.5
        }).addTo(this.layerGroup)
      },

      handleWaveBeamType() {
        if (this.type === 'max') {
          this.viewDisable = true
          this.swayDisable = true
        }
        if (this.type === 'view') {
          this.viewDisable = false
          this.swayDisable = true
        }
        if (this.type === 'sway') {
          this.viewDisable = false
          this.swayDisable = false
        }

      },
      handleViewAngleChange(value) {
        this.viewAngle = value
      },
      handleSwayAngleChange(value) {
        this.swayAngle = value
      },
      handleDateTimeChange(datetime) {
		this.datetime = datetime
      },
      handleSatelliteQuery() {
        const satelliteId = this.satelliteId
        const datetime = this.datetime

        if (this.type === 'max') {
          postSatelliteWaveBeamMax({satelliteId, datetime}).then(response => {
            if (response.code === 200) {
              // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
              this.$options.methods.queryByPage.bind(this)() 
             
              const boundaryList = response.respBody
              let boundary = boundaryList.map(item => {
                return { lat:item.lat, lng:item.lng }
              })
              this.$options.methods.drawWaveBeam.bind(this)(boundary) 

            } else {
              this.$message.error(response.message)
            }
          })
        }
        if (this.type === 'view') {
          const viewAngle = this.viewAngle
          postSatelliteWaveBeamView({satelliteId, datetime, viewAngle}).then(response => {
            if (response.code === 200) {
              // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
              this.$options.methods.queryByPage.bind(this)() 

              const boundaryList = response.respBody
              let boundary = boundaryList.map(item => {
                return { lat:item.lat, lng:item.lng }
              })
              this.$options.methods.drawWaveBeam.bind(this)(boundary) 
            } else {
              this.$message.error(response.message)
            }
          })
        }
        if (this.type === 'sway') {
          const viewAngle = this.viewAngle  
          const swayAngle = this.swayAngle
          postSatelliteWaveBeamSway({satelliteId, datetime, viewAngle, swayAngle}).then(response => {
            if (response.code === 200) {
              // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
              this.$options.methods.queryByPage.bind(this)() 

              const boundaryList = response.respBody
              let boundary = boundaryList.map(item => {
                return { lat:item.lat, lng:item.lng }
              })
              this.$options.methods.drawWaveBeam.bind(this)(boundary) 
            } else {
              this.$message.error(response.message)
            }
          })
        }
      },
      handlePageSizeChange(size) {
        this.pageSize = size
        // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
        this.$options.methods.queryByPage.bind(this)() 
      },
      handlePageChange(page) {
        this.currentPage = page
        // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
        this.$options.methods.queryByPage.bind(this)() 
      },

    }
  }
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  margin-right: 50px;
  float: right;
}

#map {
  margin-top: 10px;
  width: 100%;
  height: 100vh;
}
</style>
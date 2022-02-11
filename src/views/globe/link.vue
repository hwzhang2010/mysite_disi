<template>
  <div class="root">
	  <el-tabs v-model="activeLink" type="card">
      <el-tab-pane label="单覆盖" name="single">
         <el-row :gutter="10">
          <el-col :span="6">
            <el-date-picker
              v-model="single.start" @change="handleSingleStartChange"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择开始时间">
            </el-date-picker>
          </el-col>
          <el-col :span="6">
            时间长度:
            <el-input-number v-model="single.hours" @change="handleSingleHoursChange" :min="1" :max="144" label="时间长度"></el-input-number>
          </el-col>
          <el-col :span="6">
            最小仰角:
            <el-input-number v-model="single.minPitch" @change="handleSingleMinPitchChange" :min="0" :max="90" :precision="2" :step="0.1" label="最小仰角"></el-input-number>
          </el-col>
          <el-col :span="6" style="text-align: right;">
            <el-input placeholder="请输入卫星ID" v-model="single.satelliteid" clearable class="input-with-select">
              <el-button @click="handleSingleSatelliteQuery" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="6" style="margin-top:10px;">
            <el-select v-model="single.groundstationid" placeholder="请选择信关站">
              <el-option
                v-for="item in single.groundstations"
                :key="item.groundStationId"
                :label="item.groundStationText"
                :value="item.groundStationId">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6" style="margin-top:10px">
            覆盖次数:
            <el-input placeholder="覆盖次数:" v-model="single.count" style="width:180px">
              <el-button slot="append" icon="el-icon-refresh" @click="handleSingleCountClear"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6" style="margin-top:10px">
            覆盖时间:
            <el-input placeholder="总覆盖时间(分钟):" v-model="single.duration" style="width:180px">
              <el-button slot="append" icon="el-icon-refresh" @click="handleSingleDurationClear"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6" style="text-align: right;margin-top:10px;">
            <el-popover
              placement="right-start"
              width="840"
              trigger="click">
              <el-table :data="single.groundstationpass">
                <el-table-column width="150" prop="startTime" label="开始时间"></el-table-column>
                <el-table-column width="150" prop="endTime" label="结束时间"></el-table-column>
                <el-table-column width="120" prop="duration" label="持续时间(分钟)"></el-table-column>
                <el-table-column width="120" prop="aosAzimuth" label="进站方位角(º)"></el-table-column>
                <el-table-column width="120" prop="losAzimuth" label="出站方位角(º)"></el-table-column>
                <el-table-column width="120" prop="maxElevation" label="最大俯仰角(º)"></el-table-column>
              </el-table>
              <el-button slot="reference" @click="handleSingleGroundStationDetailQuery">覆盖详情</el-button>
            </el-popover>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="handleSingleGroundStationQuery">过站覆盖</el-button>
          </el-col>
        </el-row> 

        <el-table :data="singleLinkList" style="width: 100%">
          <el-table-column prop="epoch" label="时间"></el-table-column>
          <el-table-column prop="substar" label="星下点"></el-table-column>
          <el-table-column prop="subAngle" label="星下视角(°)"></el-table-column>
          <el-table-column prop="earthAngle" label="地心角(°)"></el-table-column>
          <el-table-column prop="coverArea" label="覆盖面积(km²)"></el-table-column>
        </el-table>
      
        <el-pagination
          class="pagination"
          background
          layout="total, sizes, prev, pager, next"
          :total="single.total"
          :page-sizes="[20, 50, 100, 200]"
          :page-size="single.pageSize"
          :current-page="single.currentPage"
          @size-change="handleSinglePageSizeChange"
          @current-change="handleSinglePageChange"
          @prev-click="handleSinglePageChange"
          @next-click="handleSinglePageChange"
        >
        </el-pagination>

      </el-tab-pane>
        
      <el-tab-pane label="多覆盖(站)" name="multi">
         <el-row :gutter="10">
          <el-col :span="6">
            <el-date-picker
              v-model="multi.start" @change="handleMultiStartChange"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择开始时间">
            </el-date-picker>
          </el-col>
          <el-col :span="6">
            时间长度:
            <el-input-number v-model="multi.hours" @change="handleMultiHoursChange" :min="1" :max="144" label="时间长度"></el-input-number>
          </el-col>
          <el-col :span="6">
            最小仰角:
            <el-input-number v-model="multi.minPitch" @change="handleMultiMinPitchChange" :min="0" :max="90" :precision="2" :step="0.1" label="最小仰角"></el-input-number>
          </el-col>
        </el-row>
        
        <el-row :gutter="10">
          <el-col :span="6" style="margin-top:10px">
            <el-select v-model="multi.satelliteid" placeholder="请选择卫星">
              <el-option
                v-for="item in multi.satellites"
                :key="item.satelliteId"
                :label="item.satelliteText"
                :value="item.satelliteId">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6" style="margin-top:10px">
            <el-button class="button-width" @click="dlgMultiGroundStationVisible = true">信关站选择</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button  @click="handleMultiSatelliteQuery">覆盖计算</el-button>
          </el-col>
          <el-col :span="6" style="margin-top:10px">
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="10" style="margin-top:10px">
            <v-chart :options="multiSatelliteCountOptions" ></v-chart>
          </el-col>
          <el-col :span="10" style="margin-top:10px">
            <v-chart :options="multiSatelliteDurationOptions" ></v-chart>
          </el-col>
        </el-row>    

      </el-tab-pane>

      <el-tab-pane label="多覆盖(星)" name="multi2">
         <el-row :gutter="10">
          <el-col :span="6">
            <el-date-picker
              v-model="multi.start" @change="handleMultiStartChange"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择开始时间">
            </el-date-picker>
          </el-col>
          <el-col :span="6">
            时间长度:
            <el-input-number v-model="multi.hours" @change="handleMultiHoursChange" :min="1" :max="144" label="时间长度"></el-input-number>
          </el-col>
          <el-col :span="6">
            最小仰角:
            <el-input-number v-model="multi.minPitch" @change="handleMultiMinPitchChange" :min="0" :max="90" :precision="2" :step="0.1" label="最小仰角"></el-input-number>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="6" style="margin-top:10px">
            <el-select v-model="multi.groundstationid" placeholder="请选择信关站">
              <el-option
                v-for="item in multi.groundstations"
                :key="item.groundStationId"
                :label="item.groundStationText"
                :value="item.groundStationId">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6" style="margin-top:10px">
            <el-button class="button-width" @click="dlgMultiSatelliteVisible = true">卫星选择</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="handleMultiGroundStationQuery">覆盖计算</el-button>
          </el-col>
          <el-col :span="6" style="margin-top:10px">
            <el-button type="text" :loading="true" v-show="multi.querying">计算中</el-button>
          </el-col>
        </el-row>   

        <el-table :data="multiLinkList" style="width: 100%">
          <el-table-column prop="satelliteId" label="卫星ID"></el-table-column>
          <el-table-column prop="count" label="覆盖次数"></el-table-column>
          <el-table-column prop="duration" label="覆盖总时间(分钟)"></el-table-column>
        </el-table>
      
        <el-pagination
          class="pagination"
          background
          layout="total, sizes, prev, pager, next"
          :total="multi.total"
          :page-sizes="[20, 50, 100, 200]"
          :page-size="multi.pageSize"
          :current-page="multi.currentPage"
          @size-change="handleMultiPageSizeChange"
          @current-change="handleMultiPageChange"
          @prev-click="handleMultiPageChange"
          @next-click="handleMultiPageChange"
        >
        </el-pagination>    

      </el-tab-pane>

      <el-dialog title="信关站选择" :visible.sync="dlgMultiGroundStationVisible">
        <el-form :model="multiGroundStation" ref="mulitGroundStation">
          <el-form-item label="" label-width="120px" prop="groundStationId">
            <el-transfer :titles="['可选信关站', '被选信关站']" v-model="multiGroundStation.selected" :data="multiGroundStation.groundstations"></el-transfer>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dlgMultiGroundStationVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="handleMultiGroundStation">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="卫星选择" :visible.sync="dlgMultiSatelliteVisible">
        <el-form :model="multiSatellite" ref="multisatellite">
          <el-form-item label="" label-width="120px" prop="satelliteId">
            <el-transfer :titles="['可选卫星', '被选卫星']" v-model="multiSatellite.selected" :data="multiSatellite.satellites"></el-transfer>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dlgMultiSatelliteVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="handleMultiSatellite">确 定</el-button>
        </div>
      </el-dialog>



      <el-tab-pane label="地域覆盖" name="region">
        <el-row :gutter="10">
          <el-col :span="8">
            经度:
            <el-input-number v-model="region.minLng" @change="handleRegionMinLngChange" :min="-180" :max="180" :precision="2" :step="1" label="最小经度"></el-input-number>
            -
            <el-input-number v-model="region.maxLng" @change="handleRegionMaxLngChange" :min="-180" :max="180" :precision="2" :step="1" label="最大经度"></el-input-number>
          </el-col>
          <el-col :span="8">
            纬度:
            <el-input-number v-model="region.minLat" @change="handleRegionMinLatChange" :min="-90" :max="90" :precision="2" :step="1" label="最小纬度"></el-input-number>
            -
            <el-input-number v-model="region.maxLat" @change="handleRegionMaxLatChange" :min="-90" :max="90" :precision="2" :step="1" label="最小纬度"></el-input-number>
          </el-col>
          <el-col :span="8" style="text-align: right;">
           <el-date-picker
              v-model="region.start" @change="handleRegionStartChange"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择开始时间">
            </el-date-picker>
            -
            <el-input-number v-model="region.hours" @change="handleRegionHoursChange" :min="1" :max="144" label="时间长度"></el-input-number>
          </el-col>
        </el-row>
        
        <el-row :gutter="10">
          <el-col :span="8" style="margin-top:10px">
            覆盖次数:
            <el-input placeholder="覆盖次数:" v-model="region.count" style="width:180px">
              <el-button slot="append" icon="el-icon-refresh" @click="handleRegionCountClear"></el-button>
            </el-input>
          </el-col>
          <el-col :span="8" style="margin-top:10px">
            覆盖时间:
            <el-input placeholder="总覆盖时间(分钟):" v-model="region.duration" style="width:180px">
              <el-button slot="append" icon="el-icon-refresh" @click="handleRegionDurationClear"></el-button>
            </el-input>
          </el-col>
          <el-col :span="2" style="margin-top:10px">
            <el-button type="text" :loading="true" v-show="region.querying">计算中</el-button>
          </el-col>
          <el-col :span="6" style="margin-top:10px;text-align: right;">
            <el-input placeholder="请输入卫星ID" v-model="region.satelliteid" clearable>
              <el-button @click="handleRegionQuery" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
        </el-row>

        <el-table :data="regionLinkList" style="width: 100%">
          <el-table-column prop="epoch" label="时间"></el-table-column>
          <el-table-column prop="ratio" label="覆盖网格比"></el-table-column>
        </el-table>
      
        <el-pagination
          class="pagination"
          background
          layout="total, sizes, prev, pager, next"
          :total="region.total"
          :page-sizes="[20, 50, 100, 200]"
          :page-size="region.pageSize"
          :current-page="region.currentPage"
          @size-change="handleRegionPageSizeChange"
          @current-change="handleRegionPageChange"
          @prev-click="handleRegionPageChange"
          @next-click="handleRegionPageChange"
        >
        </el-pagination> 
        
      </el-tab-pane>

    </el-tabs>

  </div>
</template>

<script>
  import { formatDateTime } from '@/utils/common'
  import { postSatellites } from '@/api/api_satellite'
  import { postGroundStations } from '@/api/api_groundstation'
  import { postGroundStationPasses, postAllGroundStationPasses } from '@/api/api_external'
  import { 
    postSingleLinkByPage, postSingleLink, postSingleLinkWithGroundStation, 
    postMultiLinkByPage, postMultiLink, postMultiLinkFinished, postMultiLinkWithGroundStation,
    postRegionTotalLink, postRegionLink, postRegionLinkByPage, postRegionLinkFinished } from '@/api/api_link'

  import ECharts from 'vue-echarts/components/ECharts'

  export default {
    name: 'Link',
    components: {
      'v-chart': ECharts
    },
    data() {
      return {
          activeLink: 'single',
          
          single: {
            groundstationid: '',
            groundstations: [],
            satelliteid: "",
            start: '',
            hours: 1,
            minPitch: 5,
            groundstationpass: [],
            count: 0,
            duration: 0,
            total: 0,
            pageSize: 20,
            currentPage: 1,
          },
          singleLinkList: [],

          multi: {
            groundstationid: '',
            groundstations: [],
            satelliteid: "",
            satellites: [],
            start: '',
            hours: 1,
            minPitch: 5,
            querying: false,
            total: 0,
            pageSize: 20,
            currentPage: 1,
          },
          multiLinkList: [],
          dlgMultiGroundStationVisible: false,
          multiGroundStation: {
            groundstations: [],
            selected: []
          },
          dlgMultiSatelliteVisible: false,
          multiSatellite: {
            satellites: [],
            selected: []
          },

          multiSatelliteCountOptions: {
            title: { text: '卫星覆盖信关站的次数' },
            tooltip: {},
            legend: { data:['覆盖次数'] },
            xAxis: { data: [] },
            yAxis: {},
            series: [{
              name: '覆盖次数',
              type: 'bar',
              data: []
            }]
          },
          multiSatelliteDurationOptions: {
            title: { text: '卫星覆盖信关站的时间' },
            tooltip: {},
            legend: { data:['覆盖时间'] },
            xAxis: { data: [] },
            yAxis: {},
            series: [{
              name: '覆盖时间',
              type: 'line',
              data: []
            }]
          },
          multiTimer: null,
        
          region: {
            satelliteid: "",
            start: '',
            hours: 1,
            minLng: -1,
            maxLng: 1,
            minLat: -1,
            maxLat: 1,
            count: 0,
            duration: 0,
            total: 0,
            pageSize: 20,
            currentPage: 1,
            querying: false, 
          },
          regionLinkList: [],
          regionTimer: null,



      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
		  //清除定时器
      clearInterval(this.multiTimer)             
	    this.multiTimer = null
      clearInterval(this.regionTimer)             
	    this.regionTimer = null
	  },
    methods: {
      init() {
        //初始化时间选择器
        let current = new Date()
				const start = formatDateTime(current, 'yyyy-MM-dd HH:mm:ss')
        this.single.start = start
        this.multi.start = start
        this.region.start = start

        //初始化卫星列表
        postSatellites({}).then(response => {
          if (response.code === 200) {
            const satellites = response.respBody
            this.multi.satellites = satellites
            if (satellites.length > 0) {
              this.multi.satelliteid = satellites[0].satelliteId
            }

            let options = []
            for(let i = 0, length = satellites.length; i < length; i++) {
					    options.push({
						    key: satellites[i].satelliteId,
						    label: satellites[i].satelliteText
					    })
				    }
            this.multiSatellite.satellites = options

          }
        })

        //初始化信关站列表
        postGroundStations({}).then(response => {
          if (response.code === 200) {
            const groundstations = response.respBody
            this.single.groundstations = groundstations
            this.multi.groundstations = groundstations
            if (groundstations.length > 0) {
              this.single.groundstationid = groundstations[0].groundStationId
              this.multi.groundstationid = groundstations[0].groundStationId
            }
            
            let options = []
            for(let i = 0, length = groundstations.length; i < length; i++) {
					      options.push({
						      key: groundstations[i].groundStationId,
						      label: groundstations[i].groundStationText
					      })
				      }
              this.multiGroundStation.groundstations = options

          }
        })
      },

      querySingleLinkByPage() {
        const pageSize = this.single.pageSize
        const currentPage = this.single.currentPage
        postSingleLinkByPage({pageSize, currentPage}).then(response => {
          if (response.code === 200) {
            const page = response.respBody
            this.single.total = page.total
            this.single.currentPage = page.currentPage
            this.singleLinkList = page.dataList
          }
		    })
      },
      queryMultiLinkByPage() {
        const pageSize = this.multi.pageSize
        const currentPage = this.multi.currentPage
        postMultiLinkByPage({pageSize, currentPage}).then(response => {
          if (response.code === 200) {
            const page = response.respBody
            this.multi.total = page.total
            this.multi.currentPage = page.currentPage
            this.multiLinkList = page.dataList
          }
		    })
      },
      queryRegionLinkByPage() {
        const pageSize = this.region.pageSize
        const currentPage = this.region.currentPage
        postRegionLinkByPage({pageSize, currentPage}).then(response => {
          if (response.code === 200) {
            const page = response.respBody
            this.region.total = page.total
            this.region.currentPage = page.currentPage
            this.regionLinkList = page.dataList
          }
		    })
      },
      
      handleSingleStartChange(datetime) {
				//console.log("datetime: ", datetime)
			  this.single.start = datetime
      },
      handleSingleHoursChange(value) {
        //console.log("hours:", value)
        this.single.hours = value
      },
      handleSingleMinPitchChange(value) {
        this.single.minPitch = value
      },

      handleSingleSatelliteQuery() {
        const satelliteId = this.single.satelliteid
        const start = this.single.start
        const hours = this.single.hours
        const minPitch = this.single.minPitch

        postSingleLink({ satelliteId, start, hours, minPitch }).then(response => {
          if (response.code === 200) {
            // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
            this.$options.methods.querySingleLinkByPage.bind(this)() 
          } else {
            this.$message.error(response.message)
          }
        })

      },
      handleSingleGroundStationDetailQuery() {
        const satelliteId = this.single.satelliteid
        const groundStationId = this.single.groundstationid
        const start = this.single.start
        const hours = this.single.hours
        postGroundStationPasses({satelliteId, groundStationId, start, hours}).then(response => {
          const result = response.respBody
          if (result === 'true') {
            postAllGroundStationPasses({ satelliteId, groundStationId, start, hours }).then(resp => {
              if (resp.code === 200) {
                this.single.groundstationpass = resp.respBody
              } else {
                this.$message.error(resp.message)
              }
            })
          } else {
            this.$message.error(response.message)
          }
        })

      },
      handleSingleGroundStationQuery() {
        const satelliteId = this.single.satelliteid
        const groundStationId = this.single.groundstationid
        const start = this.single.start
        const hours = this.single.hours
        const minPitch = this.single.minPitch

        postSingleLinkWithGroundStation({ satelliteId, groundStationId, start, hours, minPitch }).then(response => {
          if (response.code === 200) {
            const cover = response.respBody
            this.single.count = cover.count
            this.single.duration = cover.duration
          } else {
            this.$message.error(response.message)
          }
        })
      },
      handleSingleCountClear() {
        this.single.count = 0
      },
      handleSingleDurationClear() {
        this.single.duration = 0
      },

      handleSinglePageSizeChange(size) {
        this.single.pageSize = size
        // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
        this.$options.methods.querySingleLinkByPage.bind(this)() 
      },
      handleSinglePageChange(page) {
        this.single.currentPage = page
        // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
        this.$options.methods.querySingleLinkByPage.bind(this)() 
      },

      handleMultiStartChange(datetime) {
			  this.multi.start = datetime
      },
      handleMultiHoursChange(value) {
        this.multi.hours = value
      },
      handleMultiMinPitchChange(value) {
        this.multi.minPitch = value
      },
      handleMultiGroundStation() {
        const groundStationIdList = this.multiGroundStation.selected
        console.log("groundStationIdList:", groundStationIdList)
        this.dlgMultiGroundStationVisible = false
      },
      handleMultiSatellite() {
        const satelliteIdList = this.multiSatellite.selected
        console.log("satelliteIdList:", satelliteIdList)
        this.dlgMultiSatelliteVisible = false
      },
      handleMultiSatelliteQuery() {
        const groundStationIds = this.multiGroundStation.selected
        if (groundStationIds.length < 1) {
          this.$message({
            message: '未选择信关站',
            type: 'warning'
          })
          return
        }
        const satelliteId = this.multi.satelliteid
        const start = this.multi.start
        const hours = this.multi.hours
        const minPitch = this.multi.minPitch
        postMultiLinkWithGroundStation({ satelliteId, groundStationIds, start, hours, minPitch }).then(response => {
          if (response.code === 200) {
            const data = response.respBody
            let x = data.map(item => item.groundStationText)
            let yCount = data.map(item => item.count)
            let yDuration = data.map(item => item.duration)
          
            this.multiSatelliteCountOptions.xAxis.data = x
            this.multiSatelliteCountOptions.series[0].data = yCount
        
            this.multiSatelliteDurationOptions.xAxis.data = x
            this.multiSatelliteDurationOptions.series[0].data = yDuration
          }
        })
        
      },
      handleMultiGroundStationQuery() {
        const satelliteIds = this.multiSatellite.selected
        if (satelliteIds.length < 1) {
          this.$message({
            message: '未选择卫星',
            type: 'warning'
          })
          return
        }
        if (this.multi.querying) {
          this.$message({
            message: '正在进行查询...',
            type: 'warning'
          })
          return
        }
        
        const groundStationId = this.multi.groundstationid
        const start = this.multi.start
        const hours = this.multi.hours
        const minPitch = this.multi.minPitch
        postMultiLink({ satelliteIds, groundStationId, start, hours, minPitch })

        // 轮询查询结果是否完成，上面请求的后台计算很耗时
        if (this.multiTimer) {
          clearInterval(this.multiTimer)
        }
        this.multiTimer = setInterval(() => {
          postMultiLinkFinished({}).then(response => {
            const finished = response.respBody
            if (finished) {
              this.multi.querying = false
              clearInterval(this.multiTimer)
              // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
              this.$options.methods.queryMultiLinkByPage.bind(this)() 
            } else {
              this.multi.querying = true
            }
          })
        }, 2000)

      },

      handleMultiPageSizeChange(size) {
        this.multi.pageSize = size
        // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
        this.$options.methods.queryMultiLinkByPage.bind(this)() 
      },
      handleMultiPageChange(page) {
        this.multi.currentPage = page 
        // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
        this.$options.methods.queryMultiLinkByPage.bind(this)() 
      },


      handleRegionStartChange(datetime) {
			  this.region.start = datetime
      },
      handleRegionHoursChange(value) {
        this.region.hours = value
      },
      handleRegionMinLngChange(value) {
        this.region.minLng = value
      },
      handleRegionMaxLngChange(value) {
        this.region.maxLng = value
      },
      handleRegionMinLatChange(value) {
        this.region.minLat = value
      },
      handleRegionMaxLatChange(value) {
        this.region.maxLat = value
      },
      handleRegionQuery() {
        const satelliteId = this.region.satelliteid
        const start = this.region.start
        const hours = this.region.hours
        const minLng = this.region.minLng
        const maxLng = this.region.maxLng
        const minLat = this.region.minLat
        const maxLat = this.region.maxLat

        postRegionTotalLink({ satelliteId, start, hours, minLng, maxLng, minLat, maxLat }).then(response => {
          if (response.code === 200) {
            this.region.count = response.respBody.count
            this.region.duration = response.respBody.duration
          } else {
            this.$message.error(response.message)
          }
        })

        postRegionLink({ satelliteId, start, hours, minLng, maxLng, minLat, maxLat })

        // 轮询查询结果是否完成，上面请求的后台计算很耗时
        if (this.regionTimer) {
          clearInterval(this.regionTimer)
        }
        this.regionTimer = setInterval(() => {
          postRegionLinkFinished({}).then(response => {
            const finished = response.respBody
            if (finished) {
              this.region.querying = false
              clearInterval(this.regionTimer)
              // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
              this.$options.methods.queryRegionLinkByPage.bind(this)() 
            } else {
              this.region.querying = true
            }
          })
        }, 2000)

      },

      handleRegionCountClear() {
        this.region.count = 0
      },
      handleRegionDurationClear() {
        this.region.duration = 0
      },

      handleRegionPageSizeChange(size) {
        this.region.pageSize = size
        // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
        this.$options.methods.queryRegionLinkByPage.bind(this)() 
      },
      handleRegionPageChange(page) {
        this.region.currentPage = page
        // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
        this.$options.methods.queryRegionLinkByPage.bind(this)() 
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
.button-width {
  width: 100px;
}



</style>
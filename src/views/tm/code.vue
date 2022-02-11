<template>
  
  <div class="root">
    <el-row :gutter="10">
			<el-col :span="12">
				<el-checkbox v-model="refreshing" @change="handleRefresh">刷 新</el-checkbox>	  
        <el-divider direction="vertical"></el-divider>
        <el-button size="small" @click="handleTmCodeQuery">查 询</el-button>
        <el-divider direction="vertical"></el-divider>
      
        <el-popover
          placement="right-start"
          width="200"
          trigger="click">
          <div v-for="item in runningList" :key="item" class="text item">
            {{item}}
          </div>
          <el-badge slot="reference" :value="runningCount" type="primary">
            <el-button size="small" @click="handleTmCodeRunning">卫星数目</el-button>
          </el-badge>
        </el-popover>

        <el-divider direction="vertical"></el-divider>
        <el-select size="small" v-model="satellite.satelliteid" placeholder="请选择卫星" @change="handleTmCodeSatellite">
          <el-option
            v-for="item in satellite.satellites"
            :key="item.satelliteId"
            :label="item.satelliteText"
            :value="item.satelliteId">
          </el-option>
        </el-select>
        <el-divider direction="vertical"></el-divider>
        <el-switch v-model="run" @change="handleTmCodeRun"></el-switch>
			</el-col>
      <el-col :span="4" style="text-align: right;">
        <el-button size="small" @click="dlgSatelliteBatchVisible = true">批量启动</el-button>
      </el-col>
      <el-col :span="4" style="text-align: right;">
        <el-popconfirm title="确定全部启动吗？" @confirm="handleTmCodeRunAll">
          <el-button size="small" slot="reference">全部启动</el-button>
        </el-popconfirm>
        <el-divider direction="vertical"></el-divider>
        <el-popconfirm title="确定全部停止吗？" @confirm="handleTmCodeCloseAll">
          <el-button size="small" slot="reference">全部停止</el-button>
        </el-popconfirm>
      </el-col>
			<el-col :span="4" style="text-align: right;">
				<el-radio-group v-model="sendType" @change="handleTmCodeSendType">
          <el-radio label="autoSend">自动发送</el-radio>
          <el-radio label="extDrive">外测驱动</el-radio>
        </el-radio-group>
			</el-col>
		</el-row>

    <el-row :gutter="10">
			<el-col :span="12">
			</el-col>
      <el-col :span="4" :offset="12" style="text-align: right; margin-top:10px;">
        <el-button size="small" @click="handleTmCodeGroundStationOfAutoSendVisible">信关站设定</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button size="small" @click="dlgFaultVisible = true">故障设定</el-button>
      </el-col>
      <el-col :span="4" style="text-align: right; margin-top:10px;">
        <el-popover
          placement="right-start"
          width="200"
          trigger="click">
          <div v-for="item in satelliteFaultList" :key="item" class="text item">
            {{item}}
          </div>
          <el-badge slot="reference" :value="satelliteFaultCount" type="primary">
            <el-button size="small" @click="handleTmCodeSatelliteFaulting">卫星故障</el-button>
          </el-badge>
        </el-popover>

        <el-divider direction="vertical"></el-divider>
        
        <el-popover
          placement="right-start"
          width="200"
          trigger="click">
          <div v-for="item in groundStationFaultList" :key="item" class="text item">
            {{item}}
          </div>
          <el-badge slot="reference" :value="groundStationFaultCount" type="primary">
            <el-button size="small" @click="handleTmCodeGroundStationFaulting">信关站故障</el-button>
          </el-badge>
        </el-popover>
      </el-col>
			<el-col :span="4" style="text-align: right;margin-top:10px;">
				<el-input v-model="sendCount" readonly size="small" class="input-with-select">
          <el-button @click="handleTmCodeSendCountZero" size="small" slot="append" icon="el-icon-refresh"></el-button>
        </el-input>
			</el-col>
		</el-row>

    <el-dialog title="信关站选择" :visible.sync="dlgGroundStationVisible">
      <el-form :model="groundstation" ref="groundstation">
        <el-form-item label="请选择自动发送的信关站" label-width="200px" prop="Id">
          <el-select size="small" v-model="groundstation.groundstationid" placeholder="请选择信关站">
            <el-option
              v-for="item in groundstation.groundstations"
              :key="item.groundStationId"
              :label="item.groundStationText"
              :value="item.groundStationId">
            </el-option>
        </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dlgGroundStationVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleTmCodeGroundStationOfAutoSend">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量启动" :visible.sync="dlgSatelliteBatchVisible">
      <el-form :model="satelliteBatch" ref="satelliteBatch">
        <el-form-item label="" label-width="120px" prop="satelliteId">
          <el-transfer :titles="['可选卫星', '被选卫星']" v-model="satelliteBatch.selected" :data="satelliteBatch.satellites"></el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dlgSatelliteBatchVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleTmCodeRunBatch">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="故障设定" :visible.sync="dlgFaultVisible">
      <el-tabs v-model="activeFault">
        <el-tab-pane label="卫星数据故障" name="satelliteFault">
          <el-form :model="satelliteFault" ref="satelliteFault" label-width="80px" label-position="left">
            <el-form-item >
              <el-transfer :titles="['可选卫星', '被选卫星']" v-model="satelliteFault.selected" :data="satelliteFault.satellites"></el-transfer>
            </el-form-item>
            <el-form-item>
              <el-row :gutter="10">	
                <el-col :span="12">
                  <el-divider direction="vertical"></el-divider>
                </el-col>
                <el-col :span="12" style="text-align: right;">
                  <el-button size="small" @click="dlgFaultVisible = false">取 消</el-button>
                  <el-button size="small" type="primary" @click="handleTmCodeSatelliteFault">确 定</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="信关站故障" name="groundstationFault">
          <el-form :model="groundstationFault" ref="groundstationFault" label-width="80px" label-position="left">
            <el-form-item>
              <el-transfer :titles="['可选信关站', '被选信关站']" v-model="groundstationFault.selected" :data="groundstationFault.groundstations"></el-transfer>
            </el-form-item>
            <el-form-item>
              <el-row :gutter="10">	
                <el-col :span="12">
                  <el-divider direction="vertical"></el-divider>
                </el-col>
                <el-col :span="12" style="text-align: right;">
                  <el-button size="small" @click="dlgFaultVisible = false">取 消</el-button>
                  <el-button size="small" type="primary" @click="handleTmCodeGroundStationFault">确 定</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </el-tab-pane>

      </el-tabs>
    </el-dialog>

    <el-table :data="codeList" style="width: 100%">
      <el-table-column prop="id" label="参数ID"></el-table-column>
      <el-table-column prop="name" label="参数名称"></el-table-column>
      <el-table-column prop="bd" label="起始波道"></el-table-column>
      <el-table-column prop="srcType" label="参数类型"></el-table-column>
      <el-table-column prop="paramType" label="仿真数值类型">
        <template slot-scope="scope">
          <el-select v-model="scope.row.paramType" :disabled="scope.row.id < 24" @change="handleTmCodeParamType(scope.row)">
            <el-option
              v-for="item in paramTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>  
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="coefficient" label="系数">
        <template slot-scope="scope">
          <el-input-number size="small" controls-position="right" v-model="scope.row.coefficient" :disabled="scope.row.id < 24" @change="handleTmCodeCoefficient(scope.row)"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="当前值">
          <template slot-scope="scope">
            <el-tag size="small" type="info" class="tag">{{ scope.row.value }}</el-tag>
          </template>
      </el-table-column>


    </el-table>
   
    <el-pagination
      class="pagination"
      background
      layout="total, sizes, prev, pager, next"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
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
  import { postSatellites } from '@/api/api_satellite'
  import { postGroundStations } from '@/api/api_groundstation'
  import { 
    postTmCodesByPage, postTmCodeIsRunning, postTmCodeRunning, postTmCodeSendCount, putTmCodeSendCountZero,
    putTmCodeRun, putTmCodeRunBatch, putTmCodeRunAll, putTmCodeSendType, putTmCodeParamType, putTmCodeCoefficient,
    postTmCodeGroundStationOfAutoSend, putTmCodeGroundStationOfAutoSend, 
    putTmCodeSatelliteFault, putTmCodeGroundStationFault, postTmCodeSatelliteFaulting, postTmCodeGroundStationFaulting
 } from '@/api/api_tm'

  export default {
    data() {
        return {
          refreshing: false,
          timer: null,  //定时器
          runningCount: 0,
          runningList: [],
          run: false,
          satellite: {
            satelliteid: '',
            satellites: []
          },
          dlgSatelliteBatchVisible: false,
          satelliteBatch: {
            satellites: [],
            selected: []
          },
          dlgGroundStationVisible: false,
          groundstation: {
            groundstationid: '',
            groundstations: [],
          },
          
          activeFault: 'satelliteFault',
          dlgFaultVisible: false,
          satelliteFault: {
            satellites: [],
            selected: [],
          },
          satelliteFaultCount: 0,
          satelliteFaultList: [],
          groundstationFault: {
            groundstations: [],
            selected: [],
          },
          groundStationFaultCount: 0,
          groundStationFaultList: [],

          sendType: 'autoSend',
          sendCount: 0,
          codeList: [],
          paramTypes: [{
            value: "constant",
            label: "常数"
          },{
            value: "increment",
            label: "递增"
          },{
            value: "random",
            label: "随机"
          },{
            value: "sin",
            label: "正弦"
          },{
            value: "cmd",
            label: "指令"
          }],

          total: 0,
          pageSize: 10,
          currentPage: 1
        }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
		  //清除定时器
	    clearInterval(this.timer)             
	    this.timer = null
	  },
    methods: {
      init() {
        //初始化卫星列表
        postSatellites({}).then(response => {
          if (response.code === 200) {
            const satellites = response.respBody
            this.satellite.satellites = satellites
            if (satellites.length > 0) {
              this.satellite.satelliteid = satellites[0].satelliteId

              let batch = []
              for(let i = 0, length = satellites.length; i < length; i++) {
					      batch.push({
						      key: satellites[i].satelliteId,
						      label: satellites[i].satelliteText
					      })
				      }
              this.satelliteBatch.satellites = batch
              
              let satelliteFault = []
              for(let i = 0, length = satellites.length; i < length; i++) {
					      satelliteFault.push({
						      key: satellites[i].satelliteId,
						      label: satellites[i].satelliteText
					      })
				      }
              this.satelliteFault.satellites = satelliteFault

            }
          }
        }).then(() => {
          // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
          this.$options.methods.queryByPage.bind(this)() 
          this.$options.methods.queryRunningList.bind(this)() 
          this.$options.methods.queryIsRunning.bind(this)() 
          this.$options.methods.querySendCount.bind(this)() 
        })

        //初始化信关站列表
        postGroundStations({}).then(response => {
          if (response.code === 200) {
            const groundstations = response.respBody
            this.groundstation.groundstations = groundstations
            if (groundstations.length > 0) {
              this.groundstation.groundstationid = groundstations[0].groundStationId
            }

            let groundstationFault = []
              for(let i = 0, length = groundstations.length; i < length; i++) {
					      groundstationFault.push({
						      key: groundstations[i].groundStationId,
						      label: groundstations[i].groundStationText
					      })
				      }
            this.groundstationFault.groundstations = groundstationFault
          }
        })

        //故障卫星和故障信关站
        postTmCodeSatelliteFaulting({}).then(response => {
          this.satelliteFaultCount = response.respBody.count
          this.satelliteFaultList = response.respBody.faultList
        })
        postTmCodeGroundStationFaulting({}).then(response => {
          this.groundStationFaultCount = response.respBody.count
          this.groundStationFaultList = response.respBody.faultList
        })
        
      },
      queryByPage() {
        const satelliteId = this.satellite.satelliteid

        const pageSize = this.pageSize
        const currentPage = this.currentPage
        postTmCodesByPage({ satelliteId, pageSize, currentPage }).then(response => {
			    console.log(response)
          if (response.code === 200) {
            const page = response.respBody
            this.total = page.total
            this.currentPage = page.currentPage
            this.codeList = page.dataList
          } 
		    })
      },
      queryRunningList() {
        postTmCodeRunning({}).then(response => {
          //console.log(response)
          this.runningCount = response.respBody.count
          this.runningList = response.respBody.runningList
        })
      },
      queryIsRunning() {
        const satelliteId = this.satellite.satelliteid
        postTmCodeIsRunning({satelliteId}).then(response => {
          //console.log(response)
          this.run = response.respBody
        })
      },
      querySendCount() {
        const satelliteId = this.satellite.satelliteid
        postTmCodeSendCount({satelliteId}).then(response => {
          //console.log(response)
          this.sendCount = response.respBody
        })
      },

      handleTmCodeRunning() {
        // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
        this.$options.methods.queryRunningList.bind(this)() 
      },

      handleRefresh() {
        // 清除定时器
			  if (this.timer != null) {
			  	clearInterval(this.timer)
			  	this.timer = null
			  }
			  if (this.refreshing) {
				  //箭头函数的this指向所在的函数绑定到的那个对象
				  this.timer = setInterval(() => {
				    // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
            this.$options.methods.queryByPage.bind(this)() 
            this.$options.methods.queryRunningList.bind(this)() 
            this.$options.methods.queryIsRunning.bind(this)() 
            this.$options.methods.querySendCount.bind(this)() 
				  }, 1000);  
				  
			  } 
      },
      
      handleTmCodeQuery() {
        // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
        this.$options.methods.queryByPage.bind(this)() 
        this.$options.methods.queryRunningList.bind(this)() 
        this.$options.methods.queryIsRunning.bind(this)() 
        this.$options.methods.querySendCount.bind(this)() 
      },

      handleTmCodeSatellite() {
        const satelliteId = this.satellite.satelliteid
        postTmCodeIsRunning({satelliteId}).then(response => {
          //console.log(response)
          const isRun = response.respBody
          this.run = isRun
          if (isRun) {
            // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
            this.$options.methods.queryByPage.bind(this)() 
            this.$options.methods.querySendCount.bind(this)()
          } else {
            this.total = 0
            this.currentPage = 1
            this.codeList = []
          }
        })

      },

      handleTmCodeRun() {
        const satelliteId = this.satellite.satelliteid
        const isRun = this.run
        const sendType = this.sendType
        putTmCodeRun({ satelliteId, isRun, sendType }).then(() => {
          // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
          this.$options.methods.queryByPage.bind(this)() 
          this.$options.methods.queryRunningList.bind(this)() 
          this.$options.methods.querySendCount.bind(this)() 
        }).then(() => {
          if (!isRun) {
            this.total = 0
            this.currentPage = 1
            this.codeList = []
          }
        })
      },

      handleTmCodeRunBatch() {
        this.dlgSatelliteBatchVisible = false

        const satelliteIdList = this.satelliteBatch.selected
        const sendType = this.sendType
        putTmCodeRunBatch({satelliteIdList, sendType}).then(response => {
          // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
          this.$options.methods.queryByPage.bind(this)() 
          this.$options.methods.queryRunningList.bind(this)() 
          this.$options.methods.queryIsRunning.bind(this)() 
          this.$options.methods.querySendCount.bind(this)() 
        })
      },

      handleTmCodeRunAll() {
        const isRun = true
        const sendType = this.sendType
        putTmCodeRunAll({isRun, sendType}).then(response => {
          // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
          this.$options.methods.queryByPage.bind(this)() 
          this.$options.methods.queryRunningList.bind(this)() 
          this.$options.methods.queryIsRunning.bind(this)() 
          this.$options.methods.querySendCount.bind(this)() 
        })
      },

      handleTmCodeCloseAll() {
        const isRun = false
        const sendType = this.sendType
        putTmCodeRunAll({isRun, sendType}).then(response => {
          // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
          this.$options.methods.queryByPage.bind(this)() 
          this.$options.methods.queryRunningList.bind(this)() 
          this.$options.methods.queryIsRunning.bind(this)() 
          this.$options.methods.querySendCount.bind(this)() 
        }).then(() => {
          this.total = 0
          this.currentPage = 1
          this.codeList = []
          this.sendCount = 0
        })

      },

      handleTmCodeSendType() {
        const satelliteId = this.satellite.satelliteid
        const sendType = this.sendType
        const isRun = this.run
        if (isRun) {
          putTmCodeSendType({satelliteId, sendType}).then(response => {
            // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
            this.$options.methods.queryByPage.bind(this)() 
            this.$options.methods.queryRunningList.bind(this)() 
            this.$options.methods.queryIsRunning.bind(this)() 
            this.$options.methods.querySendCount.bind(this)() 
          })
        }
      },

      handleTmCodeGroundStationOfAutoSendVisible() {
        this.dlgGroundStationVisible = true
        const satelliteId = this.satellite.satelliteid
        postTmCodeGroundStationOfAutoSend({satelliteId}).then(response => {
          //console.log(response)
          this.groundstation.groundstationid = response.respBody
        })
      },

      handleTmCodeGroundStationOfAutoSend() {
        this.dlgGroundStationVisible = false
        const satelliteId = this.satellite.satelliteid
        const groundStationId = this.groundstation.groundstationid
        putTmCodeGroundStationOfAutoSend({satelliteId, groundStationId}).then(response => {
          console.log(response)
        })
      },

      handleTmCodeSatelliteFault() {
        this.dlgFaultVisible = false

        const satelliteIdList = this.satelliteFault.selected
        putTmCodeSatelliteFault({satelliteIdList}).then(() => {
          return postTmCodeSatelliteFaulting({})
        }).then(response => {
          this.satelliteFaultCount = response.respBody.count
          this.satelliteFaultList = response.respBody.faultList
        })
      },
      handleTmCodeGroundStationFault() {
        this.dlgFaultVisible = false

        const groundStationIdList = this.groundstationFault.selected
        putTmCodeGroundStationFault({groundStationIdList}).then(() => {
          return postTmCodeGroundStationFaulting({})
        }).then(response => {
          this.groundStationFaultCount = response.respBody.count
          this.groundStationFaultList = response.respBody.faultList
        })
      },
      handleTmCodeSatelliteFaulting() {
        postTmCodeSatelliteFaulting({}).then(response => {
          console.log(response)
          this.satelliteFaultCount = response.respBody.count
          this.satelliteFaultList = response.respBody.faultList
        })
      },
      handleTmCodeGroundStationFaulting() {
        postTmCodeGroundStationFaulting({}).then(response => {
          console.log(response)
          this.groundStationFaultCount = response.respBody.count
          this.groundStationFaultList = response.respBody.faultList
        })
      },

      handleTmCodeSendCountZero() {
        const satelliteId = this.satellite.satelliteid
        putTmCodeSendCountZero({satelliteId}).then(response => {
          // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
          this.$options.methods.querySendCount.bind(this)() 
        })
      },

      handleTmCodeParamType(row) {
        console.log(row)
        const satelliteId = this.satellite.satelliteid
        const paramId = row.id
        const paramType = row.paramType
        putTmCodeParamType({satelliteId, paramId, paramType}).then(response => {
          if (response.code === 200) {
          } else {
            this.$message.error('仿真数值类型修改失败')
          }
        })
      },

      handleTmCodeCoefficient(row) {
        console.log(row)
        const satelliteId = this.satellite.satelliteid
        const paramId = row.id
        const coefficient = row.coefficient
        putTmCodeCoefficient({satelliteId, paramId, coefficient}).then(response => {
          if (response.code === 200) {
          } else {
            this.$message.error('系数修改失败')
          }
        })
      },
      
      handlePageSizeChange(size) {
        console.log("size:", size)
        this.pageSize = size
        // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
        this.$options.methods.queryByPage.bind(this)() 
      },
      handlePageChange(page) {
        console.log("page:", page)
        this.currentPage = page
        // 调用方法, 包含对data数据的修改和调用(调用vue的实例对象), 需要对调用方法绑定作用域
        this.$options.methods.queryByPage.bind(this)() 
      }

    }
  }
</script>

<style scoped>
.tag {
  width: 120px;
}

.pagination {
  margin-top: 20px;
  margin-right: 50px;
  float: right;
}
</style>
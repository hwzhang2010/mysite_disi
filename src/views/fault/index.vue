<template>
  <div class="root">
    <el-tabs v-model="activeFault" type="card">
      <el-tab-pane label="卫星故障" name="satelliteFault">
        <el-row :gutter="10">
          <el-col :span="20">
            <el-button size="small" class="button-width" @click="handleFaultSatelliteVisible">卫星配置</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-select size="small" v-model="satellite.satelliteid" placeholder="请选择查询卫星" clear>
              <el-option
                v-for="item in satellite.satellites"
                :key="item.satelliteId"
                :label="item.satelliteText"
                :value="item.satelliteId">
              </el-option>
            </el-select>
            <el-divider direction="vertical"></el-divider>
            <el-select size="small" v-model="faultlevel.satellitelevel" placeholder="请选择级别" clear>
              <el-option
                v-for="item in faultlevel.levels"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-divider direction="vertical"></el-divider>
            <el-button size="small" @click="handleFaultSatelliteQuery">查询</el-button>
          </el-col>
          <el-col :span="4" style="text-align: right;">
          </el-col>
        </el-row>

        <el-dialog title="故障卫星选择" :visible.sync="dlgFaultSatelliteVisible">
          <el-form :model="faultsatellite" ref="faultsatellite">
            <el-form-item label="" label-width="120px" prop="satelliteId">
              <el-transfer :titles="['可选卫星', '被选卫星']" v-model="faultsatellite.selected" :data="faultsatellite.satellites"></el-transfer>
            </el-form-item>
            <el-form-item>
              <el-row :gutter="10">	
                <el-col :span="12">
                  <el-switch v-model="faultsatellite.recover" active-text="恢复" inactive-text="故障"></el-switch>
                  <el-divider direction="vertical"></el-divider>
                </el-col>
              <el-col :span="12" style="text-align: right;">
                <el-button size="small" @click="dlgFaultSatelliteVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="handleFaultSatellitesSend">确 定</el-button>
              </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          
        </el-dialog>

        <el-table :data="faultSatelliteList" ref="faultSatelliteTable" style="width: 100%">
          <el-table-column prop="satelliteId" label="卫星ID"></el-table-column>
          <!--<el-table-column prop="level" label="级别"></el-table-column>-->
          <el-table-column prop="level" label="级别">
            <template slot-scope="scope">
              <el-select v-model="scope.row.level" >
                <el-option
                  v-for="item in faultlevel.levels"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>  
              </el-select>
            </template>
          </el-table-column>
          <!--<el-table-column prop="mainName" label="设备"></el-table-column>-->
          <el-table-column prop="device" label="设备">
            <template slot-scope="scope">
              <el-select v-model="scope.row.device" >
                <el-option
                  v-for="item in satellitedevices"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>  
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="故障操作"
            width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleFaultSatelliteSend(scope.$index, scope.row)">发送</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button type="text" size="small" @click="handleFaultSatelliteRecover(scope.$index, scope.row)">恢复</el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-tab-pane>

      <el-tab-pane label="信关站故障" name="groundStationFault">
        <el-row :gutter="10">
          <el-col :span="20">
            <el-button size="small" class="button-width" @click="handleFaultGroundStationVisible">信关站配置</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-select size="small" v-model="groundstation.groundstationid" placeholder="请选择查询信关站" clear>
              <el-option
                v-for="item in groundstation.groundstations"
                :key="item.groundStationId"
                :label="item.groundStationText"
                :value="item.groundStationId">
              </el-option>
            </el-select>
            <el-divider direction="vertical"></el-divider>
            <el-select size="small" v-model="faultlevel.groundstationlevel" placeholder="请选择级别" clear>
              <el-option
                v-for="item in faultlevel.levels"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-divider direction="vertical"></el-divider>
            <el-button size="small" @click="handleFaultGroundStationQuery">查询</el-button>
          </el-col>
          <el-col :span="4" style="text-align: right;">
          </el-col>
        </el-row>

        <el-dialog title="故障信关站选择" :visible.sync="dlgFaultGroundStationVisible">
          <el-form :model="faultgroundstation" ref="faultgroundstation">
            <el-form-item label="" label-width="120px" prop="groundStationId">
              <el-transfer :titles="['可选信关站', '被选信关站']" v-model="faultgroundstation.selected" :data="faultgroundstation.groundstations"></el-transfer>
            </el-form-item>
            <el-form-item>
              <el-row :gutter="10">	
                <el-col :span="12">
                  <el-switch v-model="faultgroundstation.recover" active-text="恢复" inactive-text="故障"></el-switch>
                  <el-divider direction="vertical"></el-divider>
                </el-col>
              <el-col :span="12" style="text-align: right;">
                <el-button size="small" @click="dlgFaultGroundStationVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="handleFaultGroundStationsSend">确 定</el-button>
              </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </el-dialog>

        <el-table :data="faultGroundStationList" ref="faultgroundstationTable" style="width: 100%">
          <el-table-column prop="groundStationId" label="信关站ID"></el-table-column>
          <!--
          <el-table-column prop="level" label="级别"></el-table-column>
          <el-table-column prop="device" label="设备"></el-table-column>
          -->
          <el-table-column prop="level" label="级别">
            <template slot-scope="scope">
              <el-select v-model="scope.row.level" >
                <el-option
                  v-for="item in faultlevel.levels"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>  
              </el-select>
            </template>
          </el-table-column>
          <!--<el-table-column prop="mainName" label="设备"></el-table-column>-->
          <el-table-column prop="device" label="设备">
            <template slot-scope="scope">
              <el-select v-model="scope.row.device" >
                <el-option
                  v-for="item in groundstationdevices"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>  
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="故障操作"
            width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleFaultGroundStationSend(scope.$index, scope.row)">发送</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button type="text" size="small" @click="handleFaultGroundStationRecover(scope.$index, scope.row)">恢复</el-button>
            </template>
          </el-table-column>
          
        </el-table>

      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import { postSatellites } from '@/api/api_satellite'
  import { postGroundStations } from '@/api/api_groundstation'
  import { postFaultLevels, postSatelliteDevices, postFaultSatelliteIds, postFaultSatellites, postFaultSatellitesById,
           postFaultSatellitesSend, postFaultSatelliteSend, postFaultSatellitesRecoverSend, postFaultSatelliteRecoverSend, 
           postFaultGroundStationDevices, postFaultGroundStationIds, postFaultGroundStations, postFaultGroundStationsById, 
           postFaultGroundStationsSend, postFaultGroundStationsRecoverSend, postFaultGroundStationSend, postFaultGroundStationRecoverSend
          } from '@/api/api_fault'
  export default {
    data() {
      return {
        activeFault: 'satelliteFault',
        faultlevel: {
          satellitelevel: 0,
          groundstationlevel: 0,
          levels:[],
        },

        dlgFaultSatelliteVisible: false,
        satellite: {
          satelliteid: '',
          satellites: [],
        },
        faultsatellite: {
          selected:[],
          satellites:[],
          recover:false,
        },
        satellitedevices: [],
        faultSatelliteList: [], 

        dlgFaultGroundStationVisible: false,
        groundstation: {
          groundstationid: '',
          groundstations: [],
        },
        faultgroundstation: {
          selected:[],
          groundstations:[],
          recover:false,
        },
        groundstationdevices:[],
        faultGroundStationList: [], 

      }
    },
    mounted() {
      this.init()
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
            }

            let options = []
            for(let i = 0, length = satellites.length; i < length; i++) {
					    options.push({
						    key: satellites[i].satelliteId,
						    label: satellites[i].satelliteText
					    })
				    }
            this.faultsatellite.satellites = options
          }
        })

        //初始化信关站列表
        postGroundStations({}).then(response => {
          if (response.code === 200) {
            const groundstations = response.respBody
            this.groundstation.groundstations = groundstations
            if (groundstations.length > 0) {
              this.groundstation.groundstationid = groundstations[0].groundStationId
            }

            let options = []
            for(let i = 0, length = groundstations.length; i < length; i++) {
					    options.push({
						    key: groundstations[i].groundStationId,
						    label: groundstations[i].groundStationText
					    })
				    }
            this.faultgroundstation.groundstations = options
          }
        })

        //初始化故障级别
        postFaultLevels({}).then(response => {
          const levels = response.respBody
          this.faultlevel.levels = levels
        })

        //初始化卫星设备列表
        postSatelliteDevices({}).then(response => {
          if (response.code === 200) {
            const devices = response.respBody
            this.satellitedevices = devices
          }
        })

        //初始化故障卫星信息
        postFaultSatellites({}).then(response => {
          this.faultSatelliteList = response.respBody
        })

        // 初始化信关站设备列表
        postFaultGroundStationDevices({}).then(response => {
          if (response.code === 200) {
            const devices = response.respBody
            this.groundstationdevices = devices
          }
        })

        //初始化故障信关站信息
        postFaultGroundStations({}).then(response => {
          this.faultGroundStationList = response.respBody
        })

      },

      handleFaultSatelliteVisible() {
        postFaultSatelliteIds({}).then(response => {
          const selected = response.respBody
          this.faultsatellite.selected = selected
        })
        
        this.dlgFaultSatelliteVisible = true
      },

      handleFaultSatellitesSend() {
        const satelliteIds = this.faultsatellite.selected
        const level = this.faultlevel.satellitelevel

        const recover = this.faultsatellite.recover
        if (recover) {
          postFaultSatellitesRecoverSend({satelliteIds, level}).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '故障恢复发送成功',
                type: 'success'
              })
            } else {
              this.$message.error(response.message)
            }
            setTimeout(() => { 
              postFaultSatellites({}).then(resp => {
                 this.faultSatelliteList = resp.respBody
              }) 
            }, 3000) 
          })
        } else {
          postFaultSatellitesSend({satelliteIds, level}).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '故障数据发送成功',
                type: 'success'
              })
            } else {
              this.$message.error(response.message)
            }
            setTimeout(() => { 
              postFaultSatellites({}).then(resp => {
                 this.faultSatelliteList = resp.respBody
              }) 
            }, 3000) 
          })
        }

        this.dlgFaultSatelliteVisible = false
      },

      handleFaultSatelliteQuery() {
        const satelliteId = this.satellite.satelliteid
        const level = this.faultlevel.satellitelevel
    
        postFaultSatellitesById({satelliteId, level}).then(response => {
          this.faultSatelliteList = response.respBody
        })
 
      },

      handleFaultSatelliteSend(index, row) {
        //console.log(index, row)
        const satelliteId = row.satelliteId
        const level = row.level
        const id = row.device
        
        postFaultSatelliteSend({satelliteId, id, level}).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '故障数据发送成功',
              type: 'success'
            })
          } else {
            this.$message.error(response.message)
          }
          return postFaultSatellites({})
        }).then(response => {
          this.faultSatelliteList = response.respBody
        })
      },

      handleFaultSatelliteRecover(index, row) {
        //console.log(index, row)
        const satelliteId = row.satelliteId

        postFaultSatelliteRecoverSend({satelliteId}).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '故障恢复发送成功',
              type: 'success'
            })
          } else {
            this.$message.error(response.message)
          }
          setTimeout(() => { 
              postFaultSatellites({}).then(resp => {
                 this.faultSatelliteList = resp.respBody
              }) 
          }, 3000) 
        })
      },

      handleFaultGroundStationVisible() {
        postFaultGroundStationIds({}).then(response => {
          const selected = response.respBody
          this.faultgroundstation.selected = selected
        })
        
        this.dlgFaultGroundStationVisible = true
      },

      handleFaultGroundStationQuery() {
        const groundStationId = this.groundstation.groundstationid
        const level = this.faultlevel.groundstationlevel
    
        postFaultGroundStationsById({groundStationId, level}).then(response => {
          this.faultGroundStationList = response.respBody
        })
      },

      
      handleFaultGroundStationsSend() {
        const groundStationIds = this.faultgroundstation.selected
        const level = this.faultlevel.groundstationlevel
        
        const recover = this.faultgroundstation.recover
        if (recover) {
          postFaultGroundStationsRecoverSend({groundStationIds, level}).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '故障恢复发送成功',
                type: 'success'
              })
            } else {
              this.$message.error(response.message)
            }
            setTimeout(() => { 
              postFaultGroundStations({}).then(resp => {
                 this.faultGroundStationList = resp.respBody
              }) 
            }, 3000) 
          })
        } else {
          postFaultGroundStationsSend({groundStationIds, level}).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '故障数据发送成功',
                type: 'success'
              })
            } else {
              this.$message.error(response.message)
            }
            setTimeout(() => { 
              postFaultGroundStations({}).then(resp => {
                 this.faultGroundStationList = resp.respBody
              }) 
            }, 3000) 
          })
        }
        
        this.dlgFaultGroundStationVisible = false
      },

      handleFaultGroundStationSend(index, row) {
         //console.log(index, row)
        const groundStationId = row.groundStationId
        const level = row.level
        const id = row.device
        
        postFaultGroundStationSend({groundStationId, id, level}).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '故障数据发送成功',
              type: 'success'
            })
          } else {
            this.$message.error(response.message)
          }
          return postFaultGroundStations({})
        }).then(response => {
          this.faultGroundStationList = response.respBody
        })
        
      },

      handleFaultGroundStationRecover(index, row) {
        //console.log(index, row)
        const groundStationId = row.groundStationId

        postFaultGroundStationRecoverSend({groundStationId}).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '故障恢复发送成功',
              type: 'success'
            })
          } else {
            this.$message.error(response.message)
          }
          setTimeout(() => { 
              postFaultGroundStations({}).then(resp => {
                 this.faultGroundStationList = resp.respBody
              }) 
          }, 3000) 
        })
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
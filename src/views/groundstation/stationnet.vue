<template>
  <div class="root">
    <el-row :gutter="10">
      <el-col :span="8">
        (站网计划)应答设置：
        <el-radio-group v-model="reply" @change="handleReplyChange">
          <el-radio label="OK">OK</el-radio>
          <el-radio label="NOK">NOK</el-radio>
        </el-radio-group>
      </el-col>
			<el-col :span="4">
			</el-col>
			<el-col :span="12" style="text-align: right;">
			</el-col>
		</el-row>

    <el-row :gutter="10">
      <el-col :span="2" style="margin-top:20px;">
        信关站选择：
      </el-col>
      <el-col :span="6" style="margin-top:20px;">
        <el-select size="small" v-model="groundstation.groundstationname" placeholder="请选择信关站">
          <el-option
                v-for="item in groundstation.groundstations"
                :key="item.groundStationName"
                :label="item.groundStationText"
                :value="item.groundStationName">
          </el-option>
        </el-select>
	  </el-col>
    <el-col :span="2" style="margin-top:20px;">
      分系统选择：
    </el-col>
    <el-col :span="6" style="margin-top:20px;">
      <el-select size="small" v-model="subsystem" placeholder="请选择分系统代号">
        <el-option
          v-for="item in subsystems"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>  
      </el-select>
    </el-col>
    <el-col :span="2" style="margin-top:20px;">
      健康选择：
    </el-col>
    <el-col :span="6" style="margin-top:20px;">
      <el-select size="small" v-model="health" placeholder="请选择健康级别">
        <el-option
          v-for="item in healths"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>  
      </el-select>
      
    </el-col>
	</el-row>

  <el-row :gutter="10">
    <el-col :span="2" style="margin-top:20px;">
      设备编号：
    </el-col>
    <el-col :span="6" style="margin-top:20px;">
      <el-input size="small" v-model="equipmentid" label="请输入设备编号" style="width:200px;"></el-input>
	  </el-col>
    <el-col :span="2" style="margin-top:20px;">
      警告信息：
    </el-col>
    <el-col :span="6" style="margin-top:20px;">
      <el-input size="small" v-model="warning" placeholder="请输入警告信息" style="width:200px;"></el-input>
    </el-col>
    <el-col :span="8" style="margin-top:20px;">
      <el-button size="small" type="primary" @click="handleStationNetStateSend">发送</el-button>
    </el-col>
	</el-row>



  </div>
</template>

<script>
  import { postGroundStations } from '@/api/api_groundstation'
  import { putStationNetReply, putStationNetState } from '@/api/api_stationnet'

  export default {
    data() {
        return {
          reply: 'OK',
          groundstation: {
            groundstationname: '',
            groundstations: [],
          },
          subsystems: [{
            value: '1',
            label: '1'
          }, {
            value: '2',
            label: '2'
          }, {
            value: '3',
            label: '3'
          }, {
            value: '4',
            label: '4'
          }, {
            value: '5',
            label: '5'
          }],
          subsystem: '1',
          equipmentid: '1',
          warning: '',
          healths: [{
            value: '1',
            label: '健康'
          }, {
            value: '2',
            label: '良好'
          }, {
            value: '3',
            label: '注意'
          }, {
            value: '4',
            label: '恶化'
          }, {
            value: '5',
            label: '故障'
          }],
          health: '1',
          
        }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        //初始化信关站列表
        postGroundStations({}).then(response => {
          if (response.code === 200) {
            const groundstations = response.respBody
            this.groundstation.groundstations = groundstations
            if (groundstations.length > 0) {
              this.groundstation.groundstationname = groundstations[0].groundStationName
            }
          }
        })

      },

      handleReplyChange() {
        const reply = this.reply
        putStationNetReply({reply}).then(response => {
          const update = response.respBody
          if (update > 0) {
            this.$message({
              message: '应答方式设置成功',
              type: 'success'
            })
          } else {
            this.$message.error('应答方式设置失败')
          }
        })
      },

      handleStationNetStateSend() {
        const groundStationName = this.groundstation.groundstationname
        const subsystemId = this.subsystem
        const equipmentId = this.equipmentid
        const warning = this.warning
        const healthLevel = this.health
        putStationNetState({ groundStationName, subsystemId, equipmentId, warning, healthLevel }).then(response => {
          const update = response.respBody
          if (update > 0) {
            this.$message({
              message: '应答方式发送成功',
              type: 'success'
            })
          } else {
            this.$message.error('应答方式发送失败')
          }
        })
      },


    }
  }
</script>

<style scoped>
</style>
<template>
  <div class="root">
    
    <el-row :gutter="10">
      <el-col :span="4">
        <el-select size="small" v-model="satelliteid" placeholder="请选择卫星">
          <el-option
                v-for="item in satellites"
                :key="item.satelliteId"
                :label="item.satelliteText"
                :value="item.satelliteId">
          </el-option>
        </el-select>
	  </el-col>
    <el-col :span="8">
      <el-button size="small" @click="handleTmRsltSelectVisible">参数选择</el-button>
      <el-divider direction="vertical"></el-divider>
      <el-select v-model="paramType" size="small">
        <el-option
          v-for="item in paramTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>  
      </el-select>
      <el-divider direction="vertical"></el-divider>
      <el-input-number size="small" controls-position="right" v-model="coefficient"></el-input-number>
    </el-col>
    <el-col :span="6">
      <el-date-picker size="small"
        v-model="start" @change="handleStartChange"
        type="datetime"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择开始时间">
      </el-date-picker>
      <el-divider direction="vertical"></el-divider>
      <el-input-number size="small" v-model="hours" @change="handleHoursChange" :min="1" :max="144" label="时间长度"></el-input-number>
    </el-col>
    <el-col :span="6">
      <el-date-picker size="small"
        v-model="start" @change="handleStartChange"
        type="datetime"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择开始时间">
      </el-date-picker>
      <el-divider direction="vertical"></el-divider>
      <el-input v-model="value" size="small" class="input-with-select" style="width:160px;">
        <el-button @click="handleTmRsltQuery" size="small" slot="append" icon="el-icon-refresh"></el-button>
      </el-input>
    </el-col>


	</el-row>
 

  <el-dialog title="遥测参数选择" :visible.sync="dlgTmRsltVisible">
      <el-form :model="tmrslt" ref="groundstation">
        <el-form-item label="请选择遥测参数" label-width="200px" prop="Id">
          
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dlgTmRsltVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="dlgTmRsltVisible = false">确 定</el-button>
      </div>
  </el-dialog>

  </div>
</template>

<script>
  import { formatDateTime } from '@/utils/common'
  //import { postTmRsltsByPage, postTmRsltAdd, putTmRsltUpdate, delTmRslt, postTmRsltFrameAdd, delTmRsltFrame } from '@/api/api_tm'

  export default {
    data() {
      return {
        satelliteid: "",
        satellites: [],
        dlgTmRsltVisible: false,
        tmrslt: null,
        paramType:'',
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
        coefficient:1,
        start: '',
        hours: 1,
        datetime: '',
        value: '',

      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        //初始化时间选择器
        let current = new Date()
				const start = formatDateTime(current, 'yyyy-MM-dd HH:mm:ss')
        this.start = start
        this.datetime = start
      },
      handleTmRsltSelectVisible() {
        this.dlgTmRsltVisible = true
      },

      handleTmRsltQuery() {

      },

       handleStartChange(datetime) {
				//console.log("datetime: ", datetime)
			  this.start = datetime
      },
      handleHoursChange(value) {
        //console.log("hours:", value)
        this.hours = value
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
</style>
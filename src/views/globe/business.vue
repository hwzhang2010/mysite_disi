<template>
  <div class="root">
		<el-row :gutter="10">
      <el-col :span="12">
        <el-button size="small" @click="handleRefresh">刷新</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button size="small" @click="dlgSatelliteVisible = true">卫星</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button size="small" @click="dlgGroundStationVisible = true">信关站</el-button>
			</el-col>

      <el-col :span="12" style="text-align: right;">
        <el-input v-model="time" size="small" readonly class="input-time">
          <template slot="prepend">时间:</template>
        </el-input>
			</el-col>
		</el-row>

    <el-dialog title="卫星信息" :visible.sync="dlgSatelliteVisible">
      <el-form :model="satellite">
        <el-form-item label="请选择卫星" label-width="120px">
          <el-select size="small" v-model="satellite.satelliteid" placeholder="请选择卫星" style="width: 240px">
            <el-option
            v-for="item in satellite.satellites"
            :key="item.satelliteId"
            :label="item.satelliteText"
            :value="item.satelliteId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源使用率" label-width="120px">
          <el-input size="small" v-model="satellite.usage" autocomplete="off" style="width: 240px">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="运行状况" label-width="120px">
          <el-input size="small" v-model="satellite.condition" autocomplete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="健康状态" label-width="120px">
          <el-select size="small" v-model="satellite.health" placeholder="请选择健康等级" style="width: 240px">
            <el-option label="正常" value="normal"></el-option>
            <el-option label="注意" value="notice"></el-option>
            <el-option label="警告" value="warning"></el-option>
            <el-option label="恶化" value="deterioration"></el-option>
            <el-option label="严重" value="abnormal"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dlgSatelliteVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSatellite">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="信关站信息" :visible.sync="dlgGroundStationVisible">
      <el-form :model="groundstation">
        <el-form-item label="请选择信关站" label-width="120px">
          <el-select v-model="groundstation.groundstationid" placeholder="请选择信关站" style="width: 240px">
            <el-option
              v-for="item in groundstation.groundstations"
              :key="item.groundStationId"
              :label="item.groundStationText"
              :value="item.groundStationId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源使用率" label-width="120px">
          <el-input size="small" v-model="groundstation.usage" autocomplete="off" style="width: 240px">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="配置情况" label-width="120px">
          <el-input size="small" v-model="groundstation.equipment" autocomplete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="载波状态" label-width="120px">
          <el-input size="small" v-model="groundstation.carrier" autocomplete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="健康状态" label-width="120px">
          <el-select size="small" v-model="groundstation.health" placeholder="请选择健康等级" style="width: 240px">
            <el-option label="正常" value="normal"></el-option>
            <el-option label="注意" value="notice"></el-option>
            <el-option label="警告" value="warning"></el-option>
            <el-option label="恶化" value="deterioration"></el-option>
            <el-option label="严重" value="abnormal"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dlgGroundStationVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleGroundStation">确 定</el-button>
      </div>
    </el-dialog>
    
    
    <div id="map"></div>

  </div>
</template>

<script>
  import satelliteMarker from "../../assets/satellite.png"
  import groundstationMarker from "../../assets/groundstation.png"
  import { formatDateTime } from '@/utils/common'
  import { postSatellites } from '@/api/api_satellite'
  import { postGroundStations } from '@/api/api_groundstation'
  import { postSatelliteBusiness, putSatelliteBusiness, postGroundStationBusiness, putGroundStationBusiness } from '@/api/api_business'
 
  export default {
    name: 'Business',
    data() {
      return {
        time: '2000-01-01 00:00:00',
        healths: {
          "normal":"正常", 
          "notice":"注意", 
          "warning":"警告", 
          "deterioration":"恶化", 
          "abnormal":"严重"
        },
        dlgSatelliteVisible: false,
        dlgGroundStationVisible: false,
        satellite: {
          satelliteid: '',
          satellites: [],
          usage: 0,
          condition: '',
          health: 'normal'
        },
        groundstation: {
          groundstationid: '',
          groundstations: [],
          usage: 0,
          equipment: '',
          carrier: '',
          health: 'normal'
        },
        map : null,
        layerGroup: null,
        satelliteIcon: null,
        groundstationIcon: null,
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
          }
        })

        this.map = L.map("map", {
          center: L.latLng(40.07, 116.25),
          zoom: 2,
          maxZoom:18
        })
        // 加载地图服务(高德)
        L.tileLayer(
          "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"
        ).addTo(this.map)

        this.satelliteIcon = L.icon({
	        iconUrl: satelliteMarker,
	        iconSize: [42, 32],
	        iconAnchor: [13, 21]
        })
        this.groundstationIcon = L.icon({
          iconUrl: groundstationMarker,
          iconSize: [32, 32],
          iconAnchor: [13, 21]
        })

        this.layerGroup = L.layerGroup().addTo(this.map)

        //let marker = L.marker([40.07, 116.25], {
        //  icon: this.satelliteIcon,
        //  // draggable:true,
        //  riseOnHover: true
        //}).addTo(this.map).bindPopup("我是单个marker")

        /*
        let latlng2 = [{
          lat:25.19,lng:101.28}, {
          lat:43.77,lng:87.68}, {
          lat:34.27,lng:108.95}]
        let layers = []
        for (let i = 0; i < latlng2.length; i++) {
          let layer = new l.marker([latlng2[i].lat,latlng2[i].lng],{
            icon:this.groundstationicon
          })
          layers.push(layer)
        }
        let mygroup = l.layergroup(layers)
        this.map.addlayer(mygroup)
        */


      },
      handleRefresh() {
        const current = new Date()
        const timeStamp = current.getTime()
        this.time = formatDateTime(current, 'yyyy-MM-dd HH:mm:ss')

        this.layerGroup.clearLayers()
        
        postSatelliteBusiness({timeStamp}).then(response => {
          if (response.code === 200) {
            const businesses = response.respBody
            for (let i = 0; i < businesses.length; i++) {
              let lat = businesses[i].lat
              let lng = businesses[i].lng
              let health = this.healths[businesses[i].health]
              let popup = L.popup()
                          .setLatLng({lat,lng})
                          .setContent(`<p>卫星ID:${businesses[i].satelliteId}<br/>资源使用率:${businesses[i].usage}%<br/>运行状况:${businesses[i].condition}<br/>健康状态:${health}</p>`)
              
              let textIcon = L.divIcon({
                  html: businesses[i].satelliteId,
                  className: 'my-div-icon',
                  iconSize:30,
                  iconAnchor: [12, 32]
              })
              L.marker([lat, lng], { icon: textIcon }).addTo(this.layerGroup)

              let marker = L.marker([lat, lng], {
                icon:this.satelliteIcon,
                // draggable:true,
                // riseOnHover:true
              }).addTo(this.layerGroup).bindPopup(popup)

            }
          }
        })

        postGroundStationBusiness({}).then(response => {
          if (response.code === 200) {
            const businesses = response.respBody
            for (let i = 0; i < businesses.length; i++) {
              let lat = businesses[i].lat
              let lng = businesses[i].lng
              let health = this.healths[businesses[i].health]
              let popup = L.popup()
                          .setLatLng({lat,lng})
                          .setContent(`<p>信关站ID:${businesses[i].groundStationId}<br/>资源使用率:${businesses[i].usage}%<br/>配置情况:${businesses[i].equipment}<br/>载波状态:${businesses[i].carrier}<br/>健康状态:${health}</p>`)
              
              let textIcon = L.divIcon({
                  html: businesses[i].groundStationId,
                  className: 'my-div-icon',
                  iconSize:30,
                  iconAnchor: [12, 32]
              })
              L.marker([lat, lng], { icon: textIcon }).addTo(this.layerGroup)
              
              let marker = L.marker([lat, lng], {
                icon:this.groundstationIcon,
                // draggable:true,
                // riseOnHover:true
              }).addTo(this.layerGroup).bindPopup(popup)
            }
          }
        })


        //let latlng = [{
        //  lat:33.0,lng:71.0}, {
        //  lat:40.0,lng:-170.0}, {
        //  lat:-30.0,lng:75.0}]
        //for (let i = 0; i < latlng.length; i++) {
        //  let lat = latlng[i].lat
        //  let lng = latlng[i].lng
        //  let marker = L.marker([lat, lng], {
        //    icon:this.satelliteIcon,
        //    // draggable:true,
        //    // riseOnHover:true
        //  }).addTo(this.layerGroup).bindPopup('我是第'+i+"个marker")
        //}

      },
      handleSatellite() {
        const satelliteId = this.satellite.satelliteid
        const usage = this.satellite.usage
        const condition = this.satellite.condition
        const health = this.satellite.health

        putSatelliteBusiness({ satelliteId, usage, condition, health }).then(response => {
          console.log(response)
        })

        this.dlgSatelliteVisible = false
      },
      handleGroundStation() {
        const groundStationId = this.groundstation.groundstationid
        const usage = this.groundstation.usage
        const equipment = this.groundstation.equipment
        const carrier = this.groundstation.carrier
        const health = this.groundstation.health

        putGroundStationBusiness({ groundStationId, usage, equipment, carrier, health }).then(response => {
          console.log(response)
        })

        this.dlgGroundStationVisible = false
      }





    }
  }
</script>

<style scoped>
#map {
  margin-top: 10px;
  width: 100%;
  height: 100vh;
}
.my-div-icon{
  font-size:12px;
  /*background:red;*/
  /*width:5px;*/
  color:green;
}
.input-time {
  width: 240px;
}
</style>
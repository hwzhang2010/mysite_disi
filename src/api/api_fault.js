/**
 * 每个模块都应该有自己的接口文件去统一管理api
 */
import { get, post, put, del } from '@/utils/request.js'

// 获取故障设备列表(分页)
//export const postDevicesByPage = params => post('/api/v1/siin/devices/list/page', params)

// 根据设备ID获取可能的故障类别
//export const postFaultsByMain = params => post('/api/v1/siin/fault/list/main', params)

// 获取故障级别
export const postFaultLevels = params => post('/api/v1/siin/fault/list/levels', params)

// 获取卫星故障的设备
export const postSatelliteDevices = params => post('/api/v1/siin/fault/list/satellite/device', params)

// 向后台传递要发送的故障内容(卫星, 多个)
export const postFaultSatellitesSend = params => post('/api/v1/siin/fault/satellites/send', params)

// 向后台传递要发送的故障内容(卫星，单个)
export const postFaultSatelliteSend = params => post('/api/v1/siin/fault/satellite/send', params)

// 向后台传递要发送的故障恢复(卫星，多个)
export const postFaultSatellitesRecoverSend = params => post('/api/v1/siin/faultrecover/satellites/send', params)

// 向后台传递要发送的故障恢复(卫星, 单个)
export const postFaultSatelliteRecoverSend = params => post('/api/v1/siin/faultrecover/satellite/send', params)

// 获取已经发送的卫星故障
export const postFaultSatellites = params => post('/api/v1/siin/fault/list/satellites', params)

// 根据卫星ID和故障级别查询故障信息
export const postFaultSatellitesById = params => post('/api/v1/siin/fault/list/satellites/query', params)

// 获取故障的卫星ID
export const postFaultSatelliteIds = params => post('/api/v1/siin/fault/list/satelliteids', params)


// 获取信关站故障的设备
export const postFaultGroundStationDevices = params => post('/api/v1/siin/fault/list/groundstation/device', params)

// 向后台传递要发送的故障内容(信关站，多个)
export const postFaultGroundStationsSend = params => post('/api/v1/siin/fault/groundstations/send', params)

// 向后台传递要发送的故障内容(信关站，单个)
export const postFaultGroundStationSend = params => post('/api/v1/siin/fault/groundstation/send', params)

// 向后台传递要发送的故障恢复(信关站，多个)
export const postFaultGroundStationsRecoverSend = params => post('/api/v1/siin/faultrecover/groundstations/send', params)

// 向后台传递要发送的故障恢复(信关站，单个)
export const postFaultGroundStationRecoverSend = params => post('/api/v1/siin/faultrecover/groundstation/send', params)

// 获取已经发送的信关站故障
export const postFaultGroundStations = params => post('/api/v1/siin/fault/list/groundstations', params)

// 根据信关站ID和故障级别查询故障信息
export const postFaultGroundStationsById = params => post('/api/v1/siin/fault/list/groundstations/query', params)

// 获取故障的信关站ID
export const postFaultGroundStationIds = params => post('/api/v1/siin/fault/list/groundstationids', params)

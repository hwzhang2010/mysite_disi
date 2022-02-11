/**
 * 每个模块都应该有自己的接口文件去统一管理api
 */
import { get, post, put, del } from '@/utils/request.js'

// 根据卫星ID查询遥测参数(分页)
export const postTmRsltsByPage = params => post('/api/v1/sitm/rslt/list/page', params)

// 根据卫星ID添加遥测参数
export const postTmRsltAdd = params => post('/api/v1/sitm/rslt/insert', params)

// 根据卫星ID和参数ID更新遥测参数
export const putTmRsltUpdate = params => put('/api/v1/sitm/rslt/update', params)

// 根据卫星ID和参数ID删除遥测参数
export const delTmRslt = params => del('/api/v1/sitm/rslt/delete', params)


// 根据卫星ID添加遥测参数表
export const postTmRsltFrameAdd = params => post('/api/v1/sitm/rslt/frame/insert', params)

// 根据卫星ID删除遥测参数表
export const delTmRsltFrame = params => del('/api/v1/sitm/rslt/frame/drop', params)



// 根据卫星ID查询遥测源码(分页)
export const postTmCodesByPage = params => post('/api/v1/sitm/code/list/page', params)

// 根据卫星ID查询遥测源码仿真发送状态
export const postTmCodeIsRunning = params => post('/api/v1/sitm/satellite/isrunning', params)

// 查询所有启动的卫星ID
export const postTmCodeRunning = params => post('/api/v1/sitm/satellite/running', params)

// 启动/关闭单个卫星的遥测源码仿真发送
export const putTmCodeRun = params => put('/api/v1/sitm/satellite/run', params)

// 批量启动/关闭卫星的遥测源码仿真发送
export const putTmCodeRunBatch = params => put('/api/v1/sitm/satellite/run/batch', params)

// 全部启动/关闭卫星的遥测源码仿真发送
export const putTmCodeRunAll = params => put('/api/v1/sitm/satellite/run/all', params)

// 改变卫星的遥测源码仿真发送方式
export const putTmCodeSendType = params => put('/api/v1/sitm/satellite/sendtype', params)

// 根据卫星ID获取遥测源码仿真发送计数
export const postTmCodeSendCount = params => post('/api/v1/sitm/satellite/sendcount', params)

// 卫星的遥测源码仿真发送计数清零
export const putTmCodeSendCountZero = params => put('/api/v1/sitm/satellite/sendcount/zero', params)

// 改变卫星遥测源码仿真的参数类型
export const putTmCodeParamType = params => put('/api/v1/sitm/satellite/paramtype', params)

// 改变卫星遥测源码仿真的系数
export const putTmCodeCoefficient = params => put('/api/v1/sitm/satellite/coefficient', params)

// 查询卫星遥测源码自动发送的信关站
export const postTmCodeGroundStationOfAutoSend = params => post('/api/v1/sitm/groundstation/autosend/current', params)

// 设置卫星遥测源码自动发送的信关站
export const putTmCodeGroundStationOfAutoSend = params => put('/api/v1/sitm/groundstation/autosend', params)

// 设置遥测源码数据故障的卫星
export const putTmCodeSatelliteFault = params => put('/api/v1/sitm/fault/satellites', params)

// 设置故障的信关站
export const putTmCodeGroundStationFault = params => put('/api/v1/sitm/fault/groundstations', params)

// 查询遥测源码数据故障的卫星
export const postTmCodeSatelliteFaulting = params => post('/api/v1/sitm/faulting/satellites', params)

// 查询故障的信关站
export const postTmCodeGroundStationFaulting = params => post('/api/v1/sitm/faulting/groundstations', params)
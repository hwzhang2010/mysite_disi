/**
 * 每个模块都应该有自己的接口文件去统一管理api
 */
import { get, post, put, del } from '@/utils/request.js'

// 获取单星覆盖列表(分页)
export const postSingleLinkByPage = params => post('/api/v1/siin/link/single/list/page', params)

// 根据卫星ID和时间区间获取并存储单星覆盖
export const postSingleLink = params => post('/api/v1/siin/link/single/save', params)

// 根据卫星ID，信关站ID和时间区间获取单星覆盖
export const postSingleLinkWithGroundStation = params => post('/api/v1/siin/link/single/groundstation', params)

// 根据卫星ID，信关站ID列表和时间区间获取单星覆盖
export const postMultiLinkWithGroundStation = params => post('/api/v1/siin/link/multi/list', params)

// 获取多星覆盖列表(分页)
export const postMultiLinkByPage = params => post('/api/v1/siin/link/multi/list/page', params)

// 根据卫星ID列表，信关站ID和时间区间获取并存储多星覆盖
export const postMultiLink = params => post('/api/v1/siin/link/multi/save', params)

// 根据卫星ID列表，信关站ID和时间区间获取并存储多星覆盖，完成状态
export const postMultiLinkFinished = params => post('/api/v1/siin/link/multi/finished', params)

// 根据卫星ID列表，经纬度范围和时间区间获取地域覆盖
export const postRegionTotalLink = params => post('/api/v1/siin/link/region', params)

// 根据卫星ID列表，经纬度范围和时间区间获取并存储多星覆盖
export const postRegionLink = params => post('/api/v1/siin/link/region/save', params)

// 获取地域覆盖列表(分页)
export const postRegionLinkByPage = params => post('/api/v1/siin/link/region/list/page', params)

// 根据卫星ID列表，经纬度范围和时间区间获取并存储多星覆盖，完成状态
export const postRegionLinkFinished = params => post('/api/v1/siin/link/region/finished', params)
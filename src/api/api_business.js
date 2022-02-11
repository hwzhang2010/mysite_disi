/**
 * 每个模块都应该有自己的接口文件去统一管理api
 */
import { get, post, put, del } from '@/utils/request.js'

// 获取卫星运营数据
export const postSatelliteBusiness = params => post('/api/v1/siin/satellite/business/list', params)

// 根据卫星ID更新运营数据
export const putSatelliteBusiness = params => put('/api/v1/siin/satellite/business/update', params)

// 获取信关站运营数据
export const postGroundStationBusiness = params => post('/api/v1/siin/groundstation/business/list', params)

// 根据信关站ID更新运营数据
export const putGroundStationBusiness = params => put('/api/v1/siin/groundstation/business/update', params)
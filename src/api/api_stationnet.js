/**
 * 每个模块都应该有自己的接口文件去统一管理api
 */
import { get, post, put, del } from '@/utils/request.js'


// 更新站网计划响应状态
export const putStationNetReply = params => put('/api/v1/siin/stationnet/reply/update', params)

// 更新站网状态
export const putStationNetState = params => put('/api/v1/siin/stationnet/state/update', params)

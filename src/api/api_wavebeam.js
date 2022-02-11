/**
 * 每个模块都应该有自己的接口文件去统一管理api
 */
import { get, post, put, del } from '@/utils/request.js'

// 根据卫星ID和时间获取最大点波束
export const postSatelliteWaveBeamMax = params => post('/api/v1/siin/wavebeam/max/list/save', params)

// 根据卫星ID和时间获取视场角点波束
export const postSatelliteWaveBeamView = params => post('/api/v1/siin/wavebeam/view/list/save', params)

// 根据卫星ID和时间获取视场角，侧摆角点波束
export const postSatelliteWaveBeamSway = params => post('/api/v1/siin/wavebeam/sway/list/save', params)

// 获取点波束列表(分页)
export const postWaveBeamByPage = params => post('/api/v1/siin/wavebeam/list/page', params)
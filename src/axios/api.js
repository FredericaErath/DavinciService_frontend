import requests from './request'
import requests_form from './request_form'
const api = '192.168.1.179:9001'

//user
export const login_api = (data) =>
  requests({ url: 'http://' + api + '/login/', method: 'post', data })
export const get_all_users_api = (data) =>
  requests({ url: 'http://' + api + '/admin/get_all_user', method: 'get', data })
export const get_users_api = (data) =>
  requests({ url: 'http://' + api + '/admin/get_user', method: 'post', data })
export const add_one_user = (data) =>
  requests({ url: 'http://' + api + '/admin/add_user', method: 'post', data })
export const delete_user = (data) =>
  requests({ url: 'http://' + api + '/admin/delete_user', method: 'post', data })
export const upload_users = (data) =>
  requests_form({ url: 'http://' + api + '/admin/upload_users', method: 'post', data })
export const revise_user = (data) =>
  requests({ url: 'http://' + api + '/admin/revise_user', method: 'post', data })
//instrument
export const get_instrument_api = (data) =>
  requests({ url: 'http://' + api + '/admin/get_instruments', method: 'get', data })
export const get_instrument = (data) =>
  requests({ url: 'http://' + api + '/admin/get_specific_instruments', method: 'post', data })
export const add_instrument = (data) =>
  requests({ url: 'http://' + api + '/admin/add_instrument', method: 'post', data, responseType: 'arraybuffer' })
export const download_qrcode = (data) =>
  requests({ url: 'http://' + api + '/admin/download_instrument_qrcode', method: 'post', data, responseType: 'arraybuffer'})
export const revise_instrument = (data) =>
  requests({ url: 'http://' + api + '/admin/revise_instruments', method: 'post', data})
export const upload_instruments = (data) =>
  requests_form({ url: 'http://' + api + '/admin/upload_instruments', method: 'post', data, responseType: 'arraybuffer'})
export const delete_instruments = (data) =>
  requests({ url: 'http://' + api + '/admin/delete_instruments', method: 'post', data})
//consumable
export const get_consumable = (data) =>
  requests({ url: 'http://' + api + '/admin/get_supply', method: 'post', data })
export const insert_supply = (data) =>
  requests({ url: 'http://' + api + '/admin/insert_supply', method: 'post', data})
export const delete_supply = (data) =>
  requests({ url: 'http://' + api + '/admin/delete_supply', method: 'post', data})
export const revise_supply = (data) =>
  requests({ url: 'http://' + api + '/admin/revise_supply', method: 'post', data})
//surgery
export const get_surgery = (data) =>
  requests({ url: 'http://' + api + '/admin/get_surgery', method: 'post', data})
export const update_surgery = (data) =>
  requests({ url: 'http://' + api + '/admin/update_surgery', method: 'post', data})
export const insert_surgery = (data) =>
  requests({ url: 'http://' + api + '/admin/insert_surgery_admin', method: 'post', data})
//dashboard
export const get_surgery_dashobard = (data) =>
  requests({ url: 'http://' + api + '/admin/get_surgery_dashboard', method: 'post', data})
export const get_doctor_contribution = (data) =>
  requests({ url: 'http://' + api + '/admin/get_doctor_contribution', method: 'post', data})
export const get_general_data = (data) =>
  requests({ url: 'http://' + api + '/admin/get_general_data', method: 'post', data})
//message
export const get_message = (data) =>
  requests({ url: 'http://' + api + '/admin/get_message', method: 'post', data})
export const delete_message = (data) =>
  requests({ url: 'http://' + api + '/admin/delete_message', method: 'post', data})
export const update_message = (data) =>
  requests({ url: 'http://' + api + '/admin/update_message', method: 'post', data})
  
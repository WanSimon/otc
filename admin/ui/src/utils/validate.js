/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

//验证手机号
export function isMobile(rule, value, callback) {
  if('' == value || undefined == value || null == value) return callback();
  var pattern = /^1[345789]\d{9}$/
  if(pattern.test(value)) return callback();
  return callback(new Error('请输入正确的手机号'));
}
//验证身份证号码*/
export function isIdcard(rule, value, callback) {
  if('' == value || undefined == value || null == value) return callback();
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if((!reg.test(value)) && value != '') {
    callback(new Error('请输入正确的身份证号码'));
  }else{
    callback();
  }
}
//验证邮箱
export function isEmail(rule, value,callback) {
  if('' == value || undefined == value || null == value) return callback();
  const reg =/^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
  if(!reg.test(value)){
    callback(new Error('请输入正确的邮箱地址'));
  }else{
    callback();
  }
}

//是否手机号码或者固话
export function isPhone(rule, value, callback) {
  if('' == value || undefined == value || null == value) return callback();
  const reg = /^((0\d{2,3}-\d{7,8})|(1[345789]\d{9}))$/;
  if(!reg.test(value)) {
    callback(new Error('请输入正确的电话号码或者固话号码'));
  }else{
    callback();
  }
}

//验证MAC地址, 不要中间的-或：
export function isMac(rule, value, callback) {
  if('' == value || undefined == value || null == value) return callback();
  const reg = /^([0-9a-fA-F]{2}){6}$/;
  if(!reg.test(value)) {
    callback(new Error('请输入正确的MAC地址,注意不需要填写中间的-或:'));
  }else{
    callback();
  }
}

//验证数字输入框最大数值
export function checkMaxNumber(rule, value, callback) {
  if (value < 0 || value > 32767) {
    callback(new Error('请输入[0,32767]之间的数字'));
  } else {
    callback();
  }
}

//验证输入是否为正整数
export function isPositiveInteger(rule, value, callback) {
  if ('' == value || undefined == value || null == value) return callback();
  const reg = /^[1-9]+\d*$/;
  if (!reg.test(value)) {
    callback(new Error('必须为正整数'));
  } else {
    callback();
  }
}

//验证设备型号编号是否以M/T开头
export function checkTypeFormat(rule, value, callback){
  if ('' == value || undefined == value || null == value) return callback();
  const reg = /^[MT][0-9]{3}$/;
  if (!reg.test(value)) {
    callback(new Error('必须以M或T开头,后三位需为数字'));
  } else {
    callback();
  }
}

//验证价格只能填写到小数点后两位，最大为0.01
export function checkPrice(rule, value, callback){
  if ('' == value || undefined == value || null == value) return callback();
  const reg = /^\d+(\.\d{1,2})?$/;
  if (!reg.test(value)) {
    callback(new Error('价格只能为数字,单位元,且只能填写到小数点后两位'));
  }else if(Number(value)< 0.01){
    callback(new Error('价格不可为0'));
  } else {
    callback();
  }
}

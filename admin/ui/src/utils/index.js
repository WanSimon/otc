/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (new Date(time)) {
    date = new Date(time);
  } else if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  });
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ');
  if (!search) {
    return {}
  }
  const obj = {};
  const searchArr = search.split('&');
  searchArr.forEach(v => {
    const index = v.indexOf('=');
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val
    }
  });
  return obj
}

/**
 * @param {Array} list
 * @returns {Object}
 */
export function parseTree(list) {
  if (!list || list.length === 0) return {};
  let cloneData = JSON.parse(JSON.stringify(list));      // 对源数据深度克隆
  let data = cloneData.filter(father => {                      // 循环所有项，并添加children属性
    let branchArr = cloneData.filter(child => father.value === child.parentId);       // 返回每一项的子级数组
    branchArr.length > 0 ? father.children = branchArr : '';   //给父级添加一个children属性，并赋值
    let parentArr = list.filter(item => item.value === father.parentId);
    if (parentArr.length === 0) {
      father.isTop = true;
      return true;
    } else {
      father.isTop = false;
      return false;
    }

  });
  return data;
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}


//从对象中获取某些值
export function zget(cell, key, value, original) {
  if (arguments.length === 0) return null;
  if (!Array.isArray(original)) return cell;
  cell = `,${cell},`;
  let ret = original.reduce((concat, item) => {
    if (-1 !== cell.indexOf(`,${item[key]},`)) return concat ? `${concat},${item[value]}` : `${item[value]}`;
    return concat;
  }, '');
  return ret;
}

//级联选择器获取选用节点的值
export function getSelectId(value) {
  if (value && value instanceof Array && value.length > 0) {
    let arr = [...value];
    return arr.pop();
  } else {
    return '';
  }
}

//金额
export function parseMoney(cent) {
  try {
    return '￥' + cent / 100;
  } catch (e) {
    return "";
  }
}

//table排序
export function orderBy(column) {
  let sort = {order: {}};
  //排序字段
  let prop = column.prop;
  //排序方式
  let type = column.order;
  sort.order.prop = prop;
  if (type === 'descending') {
    sort.order.value = 'desc'; // 降序
  } else if (type === 'ascending') {
    sort.order.value = 'asc'; // 升序
  } else {
    sort.order.value = null; // null
  }
  return sort;
}

/**
 * 时间差
 * start:开始时间
 * end:结束时间
 */

export function intervalTime(start, end) {
  if (!end) return null;
  // 转换时间戳
  let start_time = new Date(start).getTime();
  let end_time = new Date(end).getTime();
  //时间差
  let interval_time = end_time - start_time;
  //相差天数
  let days = Math.floor(interval_time / (24 * 3600 * 1000));
  //小时数
  let leave1 = interval_time % (24 * 3600 * 1000);  //计算天数后剩余的毫秒数
  let hours = Math.floor(leave1 / (3600 * 1000));
  //分钟数
  let leave2 = leave1 % (3600 * 1000);     //计算小时数后剩余的毫秒数
  let minutes = Math.floor(leave2 / (60 * 1000));
  //秒数
  let leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
  let seconds = Math.round(leave3 / 1000);

  let d = days ? `${days} 天` : '';
  let h = hours ? `${hours} 小时` : '';
  let m = minutes ? `${minutes} 分` : '';
  let s = seconds ? `${seconds} 秒` : '';

  return d + h + m + s;
}

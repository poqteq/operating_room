/**
 * 转化成RMB元字符串
 * @param digits 当数字类型时，允许指定小数点后数字的个数，默认2位小数
 */

export function yuan(value: any, digits: number = 2): string {
  if (typeof value === "number") {
    value = value.toFixed(digits);
  }
  return `&yen ${value}`;
}
/**
 * 类似 `_.get`，根据 `path` 获取安全值
 * jsperf: https://jsperf.com/es-deep-getttps://jsperf.com/es-deep-get
 *
 * @param obj 数据源，无效时直接返回 `defaultValue` 值
 * @param path 若 `null`、`[]`、未定义及未找到时返回 `defaultValue` 值
 * @param defaultValue 默认值
 */
export function deepGet(obj: any, path: string | string[], defaultValue?: any) {
  if (!obj || path == null || path.length === 0) {
    return defaultValue;
  }
  if (!Array.isArray(path)) {
    // tslint:disable-next-line:no-bitwise
    path = ~path.indexOf(".") ? path.split(".") : [path];
  }
  if (path.length === 1) {
    const checkObj = obj[path[0]];
    return typeof checkObj === "undefined" ? defaultValue : checkObj;
  }
  return path.reduce((o, k) => o[k], obj) || defaultValue;
}
/**
 * 字符串格式化
 * ```
 * format('this is ${name}', { name: 'asdf' })
 * // output: this is asdf
 * format('this is ${user.name}', { user: { name: 'asdf' } }, true)
 * // output: this is asdf
 * ```
 */
export function format(str: string, obj: {}, needDeepGet = false): string {
  return (str || "").replace(/\${([^}]+)}/g, (work: string, key: string) =>
    needDeepGet ? deepGet(obj, key.split("."), "") : (obj || {})[key] || ""
  );
}

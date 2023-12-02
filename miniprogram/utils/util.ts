const tokenKey: string = 'token'

/**
 * 存储token
 */
export function saveToken(token: string): void {
  wx.setStorageSync(tokenKey, `Bearer ${token}`)
}

/**
 * 获取token值
 */
export function getToken(): string {
  return wx.getStorageSync(tokenKey)
}

/**
 * 移除token
 */
export function removeToken(): void {
  wx.removeStorage({
    key: tokenKey
  })
}


/**
 * 把驼峰命名改成下划线命名
 * @param data any 入参
 * @returns any
 */
export function camelToUnderline(data: any): any {
  if (typeof data != 'object' || !data) return data
  if (Array.isArray(data)) {
    return data.map(item => camelToUnderline(item))
  }

  const newData: any = {}
  for (let key in data) {
    let newKey = key.replace(/([A-Z])/g, (_p, m) => `_${m.toLowerCase()}`)
    newData[newKey] = camelToUnderline(data[key])
  }
  return newData
}

/**
 * 把下划线命名改成驼峰命名
 * @param data any 入参
 * @returns any
 */
export function underlineToCamel(data: any): any {
  if (typeof data != 'object' || !data) return data
  if (Array.isArray(data)) {
    return data.map(item => underlineToCamel(item))
  }

  const newData: any = {}
  for (let key in data) {
    let newKey = key.replace(/_([a-z])/g, (_p, m) => m.toUpperCase())
    newData[newKey] = underlineToCamel(data[key])
  }
  return newData
}

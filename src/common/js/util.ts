/* tslint:disable */
const tools = {
  /**
   * 机型判断
   * @return  type  判断返回参数
   */
  deviceType () {
    let type = ''
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
      type = 'I'
    } else {
      type = 'A'
    }
    return type
  },
  /**
   * rem设置
   */
  setFontSize: function () {
      let scWid: any = document.documentElement.offsetWidth || document.body.offsetWidth
      let initScWid: any = 375
      let initFontSize: any = 50
      scWid = scWid > 750 ? 750 : scWid
      document.getElementsByTagName('html')[0].style.fontSize = (scWid * initFontSize) / initScWid + 'px'
  },
  getQueryString(par: string): any {
    let localUrl = document.location.href
    let get = localUrl.indexOf(par + '=')
    if (get === -1) {
      return false
    }
    let getPar = localUrl.slice(par.length + get + 1)
    let nextPar = getPar.indexOf('&')
    if (nextPar !== -1) {
      getPar = getPar.slice(0, nextPar)
    }
    return getPar
  },
  status (par: string):any {
    if (par === '1') {
      return '已实名'
    } else if(par === '2') {
      return '未实名'
    } else if (par === '3') {
      return '未登录'
    }
  },
  formatDateTime (t:string, allType?:boolean) {
    let date = t.split('T')[0]
    let y = date.split('-')[0]
    let m = date.split('-')[1]
    let d = date.split('-')[2]
    let time = t.split('T')[1].split('.')[0]
    let h = time.split(':')[0]
    let min = time.split(':')[1]
    if (allType) {
      return y + '-' + m + '-' + d + ' ' + h + ':' + min
    } else {
      return y +'-'+ m + '-' + d
    }
  }
}
export default tools
  
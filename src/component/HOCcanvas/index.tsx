import * as React from 'react';
import * as QRCode from 'qrcode'
import util from '../../common/js/util'
import JsBridge from '../../common/js/jsBridge.js'
interface State {
  codeUrl: string,
  isShare: boolean,
  shareImg: any,
  [key: string]: any
}
export default function HOCcanvas(Comp: any){
	return class WrapperComp extends React.Component<{}, State>{
		constructor(props: any){
			super(props)
			this.state = {
        codeUrl: '',
        isShare: false,
        shareImg: ''
      }
      this.share = this.share.bind(this)
      this.draw = this.draw.bind(this)
      this.closePop = this.closePop.bind(this)
    }
    public shouldComponentUpdate(nextProps: any, nextState: any) {
      if (nextState.shareImg) {
        return true
      } else {
        return false
      }
    }
    // 生成二维码
    public share(initurl: string) {
      QRCode.toDataURL(initurl).then(url => {
        this.setState({
          codeUrl: url
        })
      })
    }
    // canvas合成海报
    public draw(bgUrl: string, key: any, x: number, y: number) {
      const c = document.getElementById('canvas')
      const ctx = (c as any).getContext('2d')
      const img = new Image()
      const img2 = new Image()
      ctx.rect(0, 0, 400, 700)
      img.setAttribute('crossOrigin','anonymous')
      img2.setAttribute('crossOrigin','anonymous')
      img.src = bgUrl
      img2.src = this.state.codeUrl
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 400, 700)
        ctx.drawImage(img2, x, y, 120, 120)
        const postUrl = (c as any).toDataURL('image/png', .2) // 生成的图片url(base64)
        this.setState({
          [key]: postUrl,
          isShare: true
        }, () => {
          // 调用原生分享
          const shareInfo = {
            shareImageUrl: postUrl.replace('data:image/png;base64,', '')
          } 
          if(util.deviceType() === 'A') { // and分享
            JsBridge.jsBridge('selectTheImage',shareInfo)
            JsBridge.jsBridge('interceptBack',{isIntercept: true})
          }
        })
      }
    }
   
    // 瓜分BTc页面安卓手机关闭分享海报弹框
    public closePop() {
      this.setState({
        isShare: false
      })   
    }
		public render(){
      return (
          <Comp closePop={this.closePop} draw={this.draw} share={this.share}
          state={this.state} {...this.props} />
      ) 
		}
	}
}
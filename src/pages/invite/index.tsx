import * as React from 'react';
import * as ClipboardJS from 'clipboard'
import http from '../../common/js/http'
import './index.scss'
import { connect } from 'react-redux'
/* tslint:disable */
interface state {
    list: any,
    personInfo: any
}
interface Props {
    userInfo: any
}
class Invite extends React.Component<Props, state> {
    constructor(props:any) {
        super(props)
        this.state = {
            list: [],
            personInfo: {}
        }
        this.copy = this.copy.bind(this)
        // this.goShare = this.goShare.bind(this)
    }
    public componentDidMount() {
        document.title = '邀请'
        if (this.props.userInfo.token) {
            this.copy() // 初始化
            this.getRank()
            this.getInfo()
        }     
    }
    public componentWillReceiveProps(nextProps: any) {
       console.log('www', nextProps.userInfo)
       if (nextProps.userInfo.token) {
           setTimeout(() => {
                this.getRank()
                this.getInfo()
           }, 0)
       }
    }
    public getRank() {
        http.post('user-service/user/getinvitationrank', {
            topThree: true
        }).then((res: any) => {
            if (res.code === 200) {
                this.setState({
                    list: res.data
                })
            }
        })
    }
    public getInfo() {
        http.post('user-service/user/getinvitationinfo').then((res: any) => {
            if (res.code === 200) {
                this.setState({
                    personInfo: res.data
               })
            }
        })
    }
    copy() {
        let clipboard = new ClipboardJS('.copyBox')
        clipboard.on('success', (e) => {
            console.info('Action:', e.action)
            console.info('Text:', e.text)
            // this.$toast.info('复制成功',1)
            e.clearSelection()
        })

        clipboard.on('error', (e) => {
            console.error('Action:', e.action)
            console.error('Trigger:', e.trigger)
            // this.$toast.info('复制失败',1)
        })
    }
   getPerson = (personInfo: any) => {
       return (
            <div className="head">
                <div className="inner-header">
                <div className="top">
                    <div className="avatar">
                        {/* <i className="iconfont">&#xe720;</i> */}
                        <img src={personInfo.headPhoto} alt="" />
                    </div>
                    <div className="personInfo">
                        <p><span className="mobile">{personInfo.phone}</span><span className="vipClass">{this.state.personInfo.vip}</span></p>
                        <p className="info">{personInfo.vipInvitationMes}(20%)</p>
                    </div>
                    <div className="narrow">
                        <img src={require('../../common/image/narrow@2x.png')} alt="" />
                    </div>
                </div>
                <div className="bottom">
                    <div className="item">
                        <p>{personInfo.sunCount}</p>
                        <p>邀请人数</p>
                    </div>
                    <div className="item">
                        <p>{personInfo.identityCount}</p>
                        <p>已实名</p>
                    </div>
                    <div className="item">
                        <p>{personInfo.invitationTool}</p>
                        <p>获得收益</p>
                    </div>
                </div>
            </div>
         </div>
       )
   }
   getRankInfo = (list: any) => {
       return (
        <div className="showRank">
            <div className="rank1">
                <p className="num2">
                    <img src={require('../../common/image/rank2@2x.png')} alt="" />
                </p>
                <div className="avatar">
                    <img src={list[1].headPhoto} alt="" />
                </div>
                <p className="mobile">{list[1].phone}</p>
                <p className="prize"><img src={require('../../common/image/icon.png')} alt="" className="icon"/><span>{this.state.list[1].invitationTool}</span></p>
            </div>
            <div className="rank2">
                <p className="num2">
                    <img src={require('../../common/image/rank1@2x.png')} alt="" />
                </p>
                <div className="avatar">
                    <img src={list[0].headPhoto} alt="" />
                </div>
                <p className="mobile">{list[0].phone}</p>
                <p className="prize"><img src={require('../../common/image/icon.png')} alt="" className="icon" /><span>{this.state.list[0].invitationTool}</span></p>
            </div>
            <div className="rank3">
                <p className="num2">
                    <img src={require('../../common/image/rank3@2x.png')} alt="" />
                </p>
                <div className="avatar">
                <img src={list[2].headPhoto} alt="" />
                </div>
                <p className="mobile">{list[2].phone}</p>
                <p className="prize"><img src={require('../../common/image/icon.png')} alt="" className="icon"/><span>{this.state.list[2].invitationTool}</span></p>
            </div>
        </div>
       )
   
   }
  public render () {
    return (
      <div className="invite-container">
        {
            this.state.personInfo ? this.getPerson( this.state.personInfo) : null
        }
        <div className="middle">
            <div className="bg-middle">
                {
                    this.state.list.length ? this.getRankInfo(this.state.list) : null
                }
                <p className="buleInfo" >查看完整榜单</p>
            </div>
        </div>
        <div className="footer">
            <div className="shareCode">
                <p className="name">邀请码</p>
                {
                    this.state.personInfo ?  <p className="code"><input readOnly value={this.state.personInfo.inviteCode || ''} type="text" id="address"/></p>
                    : null
                }
                <p className="copyBox" data-clipboard-action="copy" 
                    data-clipboard-target="#address" onClick={this.copy.bind(this)}>
                    <span className="copyIcon"></span><span>复制</span></p>
            </div>
            <div className="shareBtn" >立即分享</div>
        </div>
      </div>
    ) 
  }
}
const mapStateToProps = (state: any) => {
    return {
        userInfo:state.user.userInfo
    }
}
export default connect(mapStateToProps, null)(Invite);
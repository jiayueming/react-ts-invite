import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import HOCcanvas from '../../component/HOCcanvas'
import util from '../../common/js/util'
import http from '../../common/js/http'
import './index.scss'
const temp: any = window
temp.closeShare = () => {
    if (temp.callback !== 'undefined') {
        temp.callback.close()
    }
}
temp.setCallback = (callback: any) => {
    temp.callback = callback;
}
interface State {
    currentIndex: number,
    navList: object[],
    inviteDetail: any,
    list: any[],
    list2: any[],
    list3: any[],
    hasMore: boolean, // 是否加载更多
    page: any,
    showRule: boolean,
    shareImg: string,
    codeUrl: string,
    noData: boolean,
    userDetail: any,
    codeDetail: any,
    userInfo: object,
    pageTotal: number,
    personInfo: object
}
interface Props {
    state: any,
    userInfo: any,
    showShare: any,
    dispatchShowShare: any,
    closePop: any,
    share: any,
    draw: any
}
type HomeProps = Props & RouteComponentProps
class InviteData extends React.Component<HomeProps, State> {
    public static getDerivedStateFromProps(props:any,state:any){
        if(props.userInfo !== state.userInfo){
            return {        
                userInfo:props.userInfo      
            }    
        }    
        return null
    }
    constructor(props:any) {
        super(props)
        this.state = {
            currentIndex: 0,
            navList: [{name: '我的邀请'}, {name: '昨日排名'}, {name: '每日收益'}],
            inviteDetail: {},
            list: [],
            list2: [],
            list3: [],
            hasMore: true, // 是否加载更多
            page: 1, // pageIndex
            showRule: false,
            shareImg: '',
            codeUrl: '',
            noData: false,
            userDetail: {},
            codeDetail: {},
            userInfo: {},
            pageTotal: 0,
            personInfo: {}
        }
        this.show = this.show.bind(this)
        this.hide = this.hide.bind(this)
        this.goInvite = this.goInvite.bind(this)
        this.processAsync = this.processAsync.bind(this)
        this.getPersonInvite = this.getPersonInvite.bind(this)
        this.getRank = this.getRank.bind(this)
        this.getIncome = this.getIncome.bind(this)
        this.getInviteList = this.getInviteList.bind(this)
        this.getCode = this.getCode.bind(this)
        this.getUserDetail = this.getUserDetail.bind(this)
        this.loadMore = this.loadMore.bind(this)
    }
    public close() {
        this.props.closePop()
    }
  
    public componentDidMount() {
        temp.setCallback(this)
        if (this.props.userInfo.token) {
            console.log('mount')
            this.getPersonInvite()
            this.getInviteList()
            this.getCode()
            this.getUserDetail()
            if (this.props.showShare) {// showShare,从二三级页面过来直接打开分享
               this.processAsync()
               this.props.dispatchShowShare(false)
            }
        }  
    }
    public componentDidUpdate(prevProps:any, prevState:any){
        if(this.props.userInfo !== prevState.userInfo) {
            // 做一些需要this.props的事
            setTimeout(() => {
                this.getPersonInvite()
                this.getInviteList()
                this.getCode()
                this.getUserDetail()
                if (this.props.showShare) {
                   this.processAsync()
                   this.props.dispatchShowShare(false)
                }
            }, 0)
        }
    }
    public check(index:number){
        this.setState({
            currentIndex: index,
            noData: false,
            page:1,
            list: [],
            list2: [],
            list3: []
        })
        if (index === 0) {
            this.getInviteList()
        } else if (index === 1) {
            this.getRank()
        } else {
            this.getIncome()
        }
    }
    public show() {
        this.setState({showRule: true})
    }
    public hide() {
        this.setState({showRule: false}) 
    }
    public goInvite() {
        this.props.history.replace('/invite')
    }
    public async processAsync() {
        const url = this.state.codeDetail.inviteUrl + '?inviteCode='+this.state.codeDetail.invoiceCode
        const bgUrl = require('../../common/image/haibao.png')
        await this.props.share(url)
        await this.props.draw(bgUrl, 'shareImg', '140', '435')
    }
    
    // 获取邀请数好收益
    public getPersonInvite() {
        http.post('user-service/partybtc/getinviteAmount').then(res => {
            if (res.code === 200) {
                this.setState({inviteDetail: res.data})
            }
        })
    }
    // 获取排名榜单信息
    public getRank() {
        http.post('user-service/partybtc/getpartyrank').then(res => {
            if (res.code === 200) {
                if (res.data.length) {
                    this.setState({list: res.data})
                } else {
                    this.setState({noData: true})
                }
            }
        })
    }
    // 获取收益列表
    public getIncome() {
        http.post('user-service/partybtc/getrewardlist').then(res => {
            if (res.code === 200) {
                res.data.map((item:any, index:number) => {
                    item.createDate = util.formatDateTime(item.createDate)
                    return item
                })
                if (res.data.length){
                    this.setState({list3: res.data})
                } else {
                    this.setState({noData: true})
                }
            }
        })
    }
    // 获取邀请好友列表
    public getInviteList() {
        http.post('user-service/user/getbeinvitations', {
            page: this.state.page,
            pageSize: 20,
            party: 'partyBtc'
        }).then(res => {
            if (res.code === 200) {
                res.data.list.map((item:any) => {
                    item.InvitationTime = util.formatDateTime(item.InvitationTime, true)
                    item.identity = util.status(item.identity)
                    return item
                })
                const oldList = this.state.list2
                if (res.data.list.length) {
                    this.setState({
                        list2: res.data.list.concat(oldList),
                        pageTotal: res.data.pages // 总页数
                    })
                } else {
                    this.setState({noData: true})
                }
            }
        })
    }

    // 邀请好友加载更多
    public loadMore(data: any[]) {
        if (!data.length || this.state.page >= this.state.pageTotal) {
            this.setState({hasMore: false})
        } else {
            // eslint-disable-next-line 
            // this.state.page++ // 当前页数+1
            this.setState({
                page: +1
            })
            this.getInviteList()
        }
    }
    // 获取海报和二维码
    public getCode() {
        http.get('user-service/user/config/getNewInvoiceCode').then(res => {
            if (res.code === 200) {
               this.setState({codeDetail: res.data})
            }
        })
    }
    // 获取当前用户情况
    public getUserDetail() {
        http.post('user-service/partybtc/getpartyrankseniority').then(res => {
            if (res.code === 200) {
               this.setState({
                    userDetail: res.data
               })
            }
        })
    }
    public render () {
        return (
            <div className="inviteData-container">
                <div className="bg">
                    <div className="title">
                        <img src={require('../../common/image/wemzi@2x.png')} alt="" />
                    </div>
                    <p className="rule" onClick={this.show} />
                    <div className="btn" onClick={this.goInvite}>
                        <p>TOOL</p>
                        <p>查看</p>
                    </div>
                </div>
                <div className="btn-box" onClick={this.processAsync}>
                    <img src={require('../../common/image/anniu@2x.png')} alt="" />
                </div>
                <div className="content">
                    <div className="inviteDetail">
                        <div className="left">
                            <p>{this.state.inviteDetail.inviteAmount || '0'}</p>
                            <p className="gray-font">我已邀请</p>
                        </div>
                        <div className="right">
                            <p>￥{this.state.inviteDetail.rewardCny || '0'}</p>
                            <p className="gray-font">我的收益</p>
                        </div>
                    </div>
                    <div className="list">
                        <div className="title">
                            {
                                this.state.navList.map((item:any, index:number) => {
                                    return <p className={this.state.currentIndex === index ? 'active': ''} key={index}
                                    onClick={this.check.bind(this, index)}>{item.name}</p>
                                })
                            }
                        </div>
                        <div className="inner-list" style={{display: this.state.currentIndex === 0 ? 'block': 'none'}}>
                            <div className="subTitle inviteTitle">
                                <p>邀请时间</p>
                                <p>昵称</p>
                                <p>状态</p>
                            </div>
                            {
                                this.state.list2.length ? this.state.list2.map((item, index) => {
                                    return <div className="item padding0" key={index}>
                                        <p>{item.InvitationTime}</p>
                                        <p className="ml55">{item.phone}</p>
                                        <p>{item.identity}</p>
                                    </div>
                                }) : null
                            }
                            <p onClick={this.loadMore.bind(this, this.state.list2)} 
                             style={{display:(this.state.hasMore && this.state.list2.length) ? 'block' : 'none'}}
                             className="load">点击更多</p>
                        </div>
                        <div className="inner-list" style={{display: this.state.currentIndex === 1 ? 'block': 'none'}}>
                            <div className="rankTitle subTitle padding56">
                                <p>名次</p>
                                <p>昵称</p>
                                <p>邀请人数</p>
                            </div>
                            {
                                this.state.list.map((item, index) => {
                                    return <div key={index} className="item">
                                        <p style={{display: item.rank <= 3 ? 'block': 'none'}}>
                                            <img style={{display: item.rank === 1 ? 'block': 'none'}} src={require('../../common/image/first@2x.png')} alt="" />
                                            <img style={{display: item.rank === 2 ? 'block': 'none'}} src={require('../../common/image/second@2x.png')} alt="" />
                                            <img style={{display: item.rank === 3 ? 'block': 'none'}} src={require('../../common/image/third@2x.png')} alt="" />
                                        </p>
                                        <p style={{display: item.rank > 3 ? 'block': 'none'}} className="ml3">{item.rank || '--'}</p>
                                        <p>{item.mobile}</p>
                                        <p>{item.inviteAmount || '--'}</p>
                                    </div>
                                })
                            }
                        </div>     
                        <div className="inner-list" style={{display: this.state.currentIndex === 2 ? 'block': 'none'}}>
                            <div className="subTitle rankTitle">
                                <p>日期</p>
                                <p>奖励</p>
                            </div>
                            {
                                this.state.list3.map((item, index) => {
                                    return <div className="item padding30" key={index}>
                                        <p>{item.createDate}</p>
                                        <p className="activeColor">{item.rewardBtc}BTC</p>
                                    </div>
                                })
                            }
                        </div>
                        <div className="noData" style={{display : this.state.noData ? 'block' : 'none'}}>
                            <img src={require('../../common/image/kongshuju@2x.png')} alt="" />
                            <p>快去邀请好友吧~</p>
                        </div>
                    </div>
                </div>
                <div className="footer" style={{display: this.state.userDetail.partySeniority && this.state.currentIndex === 1 ? 'block' : 'none'}}>
                    <p className="footer-title">我的排名:</p>
                    <div className="userRank">
                        <p>{this.state.userDetail.rank || '--'}</p>
                        <p className="ml30">{this.state.userDetail.title || '--'}</p>
                        <p>{this.state.userDetail.inviteAmount || '--'}</p>
                    </div>
                </div>
                <div className="footer" style={{display: !this.state.userDetail.partySeniority ? 'block' : 'none'}}>
                    <p className="warn">初级实名并邀请好友登录后即可参与活动</p>
                </div>
                <div className="popup-rule-box" style={{display: this.state.showRule ? 'block': 'none'}}>
                    <div className="popup-content">
                        <p className="rule-title">活动规则</p>
                        <p className="rule-text">1. 只有通过实名认证的用户才可参与瓜分1BTC的活动</p>
                        <p className="rule-text">2. 被邀请者需要注册并登录APP才算有效用户。一定要登录哦！登录后才能瓜分BTC。</p>
                        <p className="rule-text">3. 每日凌晨0点进行统计，截止时间为24小时。以登录时间为准。24小时之后的新用户登录将记录到新的一天中。</p>
                        <p className="rule-text">4. 收益将在次日12点之前进行发放。并以BTC的形式发放至用户钱包。</p>
                        <p className="rule-text">5. 关于提币，快比特小黑将在社群提前告知提币规则与时间。</p>
                        <div className="close" onClick={this.hide}>
                            <img src="https://html.51nbapi.com/html/IntegralMall/images/public_icon_close@2x.png" alt="" />
                        </div>
                    </div>
                </div>
                <div className="popup-rule-box" style={{display : this.props.state.isShare ? 'block': 'none'}}>
                    <div className="imgbox">
                        <img src={this.props.state.shareImg} alt="" />
                    </div>
                </div>
                <canvas id="canvas" className="canvas" width="400" height="700">
                    Your browser does not support the HTML5 canvas tag.
                </canvas>
            </div>
        )
    }
    
}
const mapStateToProps = (state: any) => {
    return {
        userInfo:state.user.userInfo
    }
}
// export default connect(mapStateToProps, null)(InviteData);
export default connect(mapStateToProps, null)(HOCcanvas(InviteData));

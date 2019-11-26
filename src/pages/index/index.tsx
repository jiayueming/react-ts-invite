import * as React from 'react'
import BScroll from 'better-scroll'
import http from '../../common/js/http'
import util from '../../common/js/util'
import './index.scss'
interface State {
    currentIndex: number,
    navList: any,
    list: any,
    searchForm: any,
    hasMore: boolean,
    scroll: any,
    pageTotal: number
}
class Index extends React.Component<{}, State> {
    constructor(props:any) {
        super(props)
        this.state = {
            currentIndex: 0,
            navList: [
                {name: '邀请记录'}, 
                {name: '未登录'}, 
                {name: '已实名'}, 
                {name: '登录未实名'}
            ],
            list: [],
            searchForm: {
              page: 0,
              phone: sessionStorage.getItem('phone')
            },
            hasMore: true, // 是否加载更多
            scroll: null,
            pageTotal: 0
        }
        this.mixData = this.mixData.bind(this)
        this.initScroll = this.initScroll.bind(this)
    }
    public componentDidMount() {
      document.title = '邀请'
      this.loadMore()
      this.initScroll()
    }
    // 合并state的对象数据
    public mixData = (target:any, data:any) => {
        const newData = Object.assign({}, target, data)
        return newData
    }
    public initScroll() {
        let scroll: any
        if (!scroll) {
          scroll = new BScroll('.listWrapper', {
            click: true,
            scrollY: true
          })
          scroll.on('scrollEnd', () => {
            // 到底部时候,给父组件通知消息
            // y是scroll 纵轴坐标,maxScrollY 最大纵向滚动位置,scroll 纵向滚动的位置区间是 0 - maxScrollY，并且y,maxScrollY都是负值。
            if (scroll.y === 0) {
              return
            }
            if (scroll.y <= (scroll.maxScrollY + 100)) {
              this.loadMore()
              scroll.refresh() // 加载更多数据后，重新计算高度
            }
          })
        } else {
            scroll.refresh()
        }
    }
    public loadMore () {
        if (!this.state.hasMore) {
          return
        }
        // eslint-disable-next-line 
        this.state.searchForm.page++ // 当前页数+1
        this.getList()
    }
    public getList() {
        http.post('user-service/user/getbeinvitations', this.state.searchForm).then(res => {
          if (res.code === 200) {
            const oldList = this.state.list
            this.setState({
              list: res.data.list.concat(oldList),
              pageTotal: res.data.pages // 总页数
            })
            this._checkMore(res.data.list) // 检查是否滑倒底部
          }
        })
    }
    public _checkMore (data: any) {
        if (!data.length || this.state.searchForm.page >= this.state.pageTotal) {
          this.setState({hasMore: false})
        }
    }
    public check(index: number) {
        if (index === 0) {
          this.setState({
            currentIndex: index,
            hasMore: true,
            list: [],
            searchForm: {
              page: 0,
              phone: sessionStorage.getItem('phone')
            }
          }, () => {
            this.loadMore()
            this.initScroll()
          })
        } else if(index === 1) {
          this.setState({
            currentIndex: index,
            list: [],
            hasMore: true,
            searchForm: {
              page: 0,
              hasLogin: false,
              phone: sessionStorage.getItem('phone')
            }
          }, () => {
            this.loadMore()
            this.initScroll()
          })
        } else if(index === 2){
          this.setState({
            currentIndex: index,
            list: [],
            hasMore: true,
            searchForm: {
              page: 0,
              identity: 1,
              phone: sessionStorage.getItem('phone')
            }
          }, () => {
            this.loadMore()
            this.initScroll()
          })
        } else if(index === 3) {
          this.setState({
            currentIndex: index,
            list: [],
            hasMore: true,
            searchForm: {
              page: 0,
              identity: 2,
              hasLogin: true,
              phone: sessionStorage.getItem('phone')
            }
          }, () => {
            this.loadMore()
            this.initScroll()
          })
        }
    }
    public render () {
        return (
            <div className="container">
              <div className="header">
                <div className="nav">
                  {
                    this.state.navList.map((item:any, index:number) => {
                      return <p className={this.state.currentIndex === index ? 'activeNav': ''} key={index}
                        onClick={this.check.bind(this, index)}>{item.name}</p>
                    })
                  }
                </div>
                <p className="info">仅展示一级邀请的被邀请人信息</p>
              </div>
              <div className="list">
                <div className="list-title">
                  <p>邀请时间</p>
                  <p>被邀请人号码</p>
                  <p style={{display: this.state.currentIndex === 0 ? 'block': 'none'}}>状态</p>
                </div>
                <div className="listWrapper">
                  <div className="list-container">
                    {
                      this.state.list.length ? this.state.list.map((item:any, index:number) => {
                        return  <div className="list-item" key={index}>
                        <p>{util.formatDateTime(item.InvitationTime, true)}</p>
                        <p>{item.phone}</p>
                        <p style={{display: this.state.currentIndex === 0 ? 'block': 'none'}}>{util.status(item.identity)}</p>
                      </div>
                      }): null
                    }
                    <p className="loading" style={{display: this.state.hasMore ? 'block' : 'none'}}>正在加载中...</p>
                  </div>
                  <div className="noData" style={{display: (!this.state.list.length && !this.state.hasMore) ? 'block' : 'none'}}>
                    <div><img src={require('../../common/image/norecord@2x.png')} alt="" /></div>
                    <p>您暂时没有数据哦</p>
                  </div>
                </div>
              </div>
            </div>    
        )
    }
}
export default Index
import * as React from 'react'
import { Route } from 'react-router-dom'
import util from './common/js/util'
// import JsBridge from './common/js/jsBridge.js'
import { connect } from 'react-redux'
import { saveUserInfo } from './redux/user.redux'
import Invite from './pages/invite'
import Index from './pages/index'
import InviteData from './pages/inviteData'
interface Props {
  dispatchUserInfo: any
}
class App extends React.Component<Props, {}> {
  public componentDidMount() {
    util.setFontSize()
    // if (util.deviceType() === 'A') {
    //   JsBridge.jsBridge('getToken', {}, (res: any) => {
    //     const data = JSON.parse(res)
    //     this.iosBack(data)
    //   })
    // } else {
    //   const key = 'inviteFriendsGetParams'
    //   window[key] = (result: any) => {
    //     this.iosBack(result)
    //   }
    // }
    sessionStorage.setItem('token', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzY3NTAyOTksInVzZXJfbmFtZSI6IuS_oemdmeaVjyIsImp0aSI6ImQwYWVlNGQ5LWNmNDUtNDUxMy1hZDJlLTdlNmQ2MTk1N2M0MyIsImNsaWVudF9pZCI6InVzZXItc2VydmljZSIsInNjb3BlIjpbInNlcnZpY2UiXX0.VZrEGsZTh4IZUm_qWB3bOkaAK8HAcE2fpuGwSYDo3050UsErjszV5aUX23dsF6ENMUjPasJipn_2nmFCw9_1Jf5stc4IsIoIbVwfvupplUJN-Vj0tez0b-_DfP1HaTJkXS9HjuLHmuGUCeeeAxzbq7UGx60PieqicJDVLiGj0F5uzmB8BQCG-sZD6Y-ZiRuAqm5jpu535ckal96afsWxDXeSecwUN8qYltJyaCnYilgW5rZOpEtuVuiquGTxrKOdSv85Kw_xQpnQ0-ponQIVs10ZdB9Osgvqn9pXcznr0xY1Cdtuoyul52354dQVmaBUnKi0_uyxIQJV53EE0hPJ_A')
    sessionStorage.setItem('phone', '15617907340')
    sessionStorage.setItem('deviceId', '1124234')
    const result = {
      token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzY3NTAyOTksInVzZXJfbmFtZSI6IuS_oemdmeaVjyIsImp0aSI6ImQwYWVlNGQ5LWNmNDUtNDUxMy1hZDJlLTdlNmQ2MTk1N2M0MyIsImNsaWVudF9pZCI6InVzZXItc2VydmljZSIsInNjb3BlIjpbInNlcnZpY2UiXX0.VZrEGsZTh4IZUm_qWB3bOkaAK8HAcE2fpuGwSYDo3050UsErjszV5aUX23dsF6ENMUjPasJipn_2nmFCw9_1Jf5stc4IsIoIbVwfvupplUJN-Vj0tez0b-_DfP1HaTJkXS9HjuLHmuGUCeeeAxzbq7UGx60PieqicJDVLiGj0F5uzmB8BQCG-sZD6Y-ZiRuAqm5jpu535ckal96afsWxDXeSecwUN8qYltJyaCnYilgW5rZOpEtuVuiquGTxrKOdSv85Kw_xQpnQ0-ponQIVs10ZdB9Osgvqn9pXcznr0xY1Cdtuoyul52354dQVmaBUnKi0_uyxIQJV53EE0hPJ_A'
      ,phone: '15617907340',
      deviceId: '1124234'
    }
    console.log('555')
    this.props.dispatchUserInfo(result)
  }
  public iosBack (result: any) {
    console.log(result)
    this.props.dispatchUserInfo(result)
    sessionStorage.setItem('token', result.token)
    sessionStorage.setItem('phone', result.phone)
    sessionStorage.setItem('deviceId', result.deviceId)
  }
  public render() {
    return (
      <div>
        {routes.map((route:any, i:any) => <RouteWithSubRoutes key={i} {...route} />)}
      </div>
    );
  }
}
const RouteWithSubRoutes = (route: any)=> (
    <Route
    path={route.path}
    component={route.component}
    exact={route.exact}
  />
)
const routes = [
  {
    exact: true,
    path: '/invite',
    component: Invite
  },
  {
    exact: true,
    path: '/index',
    component: Index
  },
  {
    exact: true,
    path: '/inviteData',
    component: InviteData
  }
]

const mapDispatch = (dispatch: any) => ({
	dispatchUserInfo(res: any) {
    dispatch(saveUserInfo(res))
	}
});
export default connect(null, mapDispatch)(App)

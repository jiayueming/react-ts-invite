const USER_INFO = 'USER_INFO'
const initState = {
	userInfo: {name: 'jjjj'}
}
// reducers
export function user(state=initState, action: any){
	switch(action.type){
		case USER_INFO:
			return {...state,userInfo:action.payload.userInfo}
		default:
			return state
	}
}

// action
export function saveUserInfo(userInfo: any) {
	return {type: USER_INFO, payload:{userInfo}}
}

export function dispatchUserInfo(info: object) {
	return (dispatch: any)=>{
		dispatch(saveUserInfo(info))
	}
}



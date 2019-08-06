

// 保存数据的属性 state
// 如果不使用函数的方式会报警告
export const state = () => {
    return {
      userInfo:{
          token:'',
          user:{
              nickname:''
          }
      }
    }
}

// 同步修改数据 mutations
export const mutations = {
    seruserinfo(state,data){
        state.userInfo = data
    },
    serusertoken(state,token){
        state.userInfo.token = token
    },
    clearUserInfo(state){
        state.userInfo={}
    }
}


// 异步修改数据 actions
export const actions = {
    
}



// 保存数据的属性 state
// 如果不使用函数的方式会报警告
export const state = () => {
    return {
        history: []
    }
}

// 同步修改数据 mutations
export const mutations = {
    seruserHistory(state,arr){
       state.history = arr
    }
}


// 异步修改数据 actions
export const actions = {}

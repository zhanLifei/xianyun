// 这个文件专门处理错误操作
import {Message} from 'element-ui';
export default function({$axios,redirect}){
    $axios.onError(err=>{
        const{statusCode , message} = err.response.data;
        if(statusCode === 400){
            Message.warning({message})
        }
        // 未授权
        if( statusCode === 401 || statusCode === 403 ){
            // 跳转到登录页
            redirect("/user/login");
        }
    })
}

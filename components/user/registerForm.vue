<template>
    <el-form 
        :model="registerForm" 
        ref="form" 
        :rules="rules" 
        class="registerForm">
            <el-form-item class="form-item" prop="username">
                <el-input 
                placeholder="用户名手机" v-model="registerForm.username">
                </el-input>
            </el-form-item>

            <el-form-item class="form-item" prop="captcha">
                <el-input 
                placeholder="验证码" v-model="registerForm.captcha">
                    <template slot="append">
                        <el-button @click="handleSendCaptcha">
                            发送验证码
                        </el-button>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item class="form-item" prop="nickname">
                <el-input 
                placeholder="你的名字" v-model="registerForm.nickname" >
                </el-input>
            </el-form-item>

            <el-form-item class="form-item" prop="password">
                <el-input 
                placeholder="密码" 
                type="password"
                v-model="registerForm.password"
                ></el-input>
            </el-form-item>

            <el-form-item class="form-item" prop="passwordok">
                <el-input 
                placeholder="确认密码" 
                type="password"
                v-model="registerForm.passwordok">
                </el-input>
            </el-form-item>

            <el-button 
            class="submit" 
            type="primary" 
            @click="handleRegSubmit">
                注册
            </el-button>
        </el-form>
</template>

<script>
export default {
    data(){
        return {
            // 表单数据
            registerForm: {
                username:'',
                captcha:'',
                password:'',
                nickname:''
            },
            // 表单规则
            rules: {
                username:[{required: true , message:'手机号不能为空' , trigger:'blur'}],
                captcha:[{required: true , message:'验证码不能为空' , trigger:'blur'}],
                password:[{required: true , message:'密码不能为空' , trigger:'blur'}],
                nickname:[{required: true , message:'昵称不能为空' , trigger:'blur'}],
                passwordok:[{required: true , message:'确认密码不能为空' , trigger:'blur'}]
            },
        }
    },
    methods: {
        // 发送验证码
        handleSendCaptcha(){
            this.$axios({
                url:'/captchas',
                method:'POST',
                data:{tel:this.registerForm.username},
            }).then(res=>{
                console.log(res);
            })
        },


        // 注册
        handleRegSubmit(){
           console.log(this.form)
           const {passwordok,...prop}= this.registerForm
           this.$axios({
                url:'accounts/register',
                method:'POST',
                data:prop,
            }).then(res=>{
                console.log(res);
                this.$message({
                    message:'注册成功',
                    type:'success'
                })
            })
        }
    }
}
</script>

<style scoped lang="less">
    .form{
        padding:25px;
    }

    .form-item{
        margin-bottom:20px;
    }

    .form-text{
        font-size:12px;
        color:#409EFF;
        text-align: right;
        line-height: 1;
    }

    .submit{
        width:100%;
        margin-top:10px;
    }
</style>
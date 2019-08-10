<template>
  <div class="main">
    <div class="air-column">
      <h2>剩机人</h2>
      <el-form class="member-info" v-for="(item,index) in user" :key="index">
        <div class="member-info-item">
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)" v-show="index > 0">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div class="insurance-item" v-for="(item,index) in data.insurances" :key="index">
          <el-checkbox
            :label="`${item.type}:￥${item.price}/${user.length}份 > 最高赔付${item.compensation}`"
            border
            @change="handleInsurance(item.id)"
          ></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入内容" v-model="contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>
    <input type="hidden" :value="alPrice">
  </div>
</template>

<script>
export default {
  props: {
    // 数据
    data: {
      type: Object,
      // 默认是空数组
      default: {}
    }
  },
  data() {
    return {
      user: [
        {
          username: "",
          id: ""
        }
      ],
      seatInfosData:{
        seat_info:{}
      }, //获取价格的
      insurances: [], //保险id
      contactName: "", //联系人姓名
      contactPhone: "", //联系人电话
      invoice: false, //是否需要发票
      captcha: "", //手机验证码
    };
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      //类似于: var arr=[...arr,5,6,7]
      this.user = [...this.user, { username: "", id: "" }];
    },

    // 移除乘机人
    handleDeleteUser(index) {
      // 截取当前索引值至下一索引
      this.user.splice(index, 1);
    },
    //去除保险事件
    handleInsurance(id) {
      console.log(id);
      //如果insurances的数据在数组中已经有包含了
      if (this.insurances.indexOf(id) > -1) {
        // 则读取insurances数组从0索引开始的数据赋给一个数组变量
        let arr = this.insurances.slice(0);
        // 再将这个数组索引值insurances.indexOf(id)开始包含本身开始删除1个数值
        arr.splice(this.insurances.indexOf(id), 1);
        // 将删除后的数组重新赋值给insurances数组
        this.insurances = arr;
      } else {
        //如果insurances的数据在数组中没有,则添加
        this.insurances = [...new Set([...this.insurances, id])];
      }

      console.log(this.insurances);
    },
    // 发送手机验证码
    handleSendCaptcha() {
      this.$axios({
        url: "/captchas",
        method: "POST",
        data: {
          tel: this.contactPhone
        }
      }).then(res => {
        const { code } = res.data;
        this.$confirm(`模拟手机验证码为：${code}`, "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning"
        });
      });
    },

    // 提交订单
    handleSubmit() {
      // 通过query获取id
      console.log(this.$route.query);
      // 需要传递的参数
      const ordeDta = {
        users: this.user,
        insurances: this.insurances,
        contactName: this.contactName,
        contactPhone: this.contactPhone,
        invoice: this.invoice,
        captcha:this.captcha,
        seat_xid:this.$route.query.seat_xid,
        air:this.$route.query.id

      };
      this.$axios({
        url: "/airorders",
        method: "POST",
        data: ordeDta,
        // 规定需要设置token值验证
        headers:{
          Authorization:`Bearer ${this.$store.state.user.userInfo.token }`
        }
      }).then(res => {
        console.log(res);
        // 跳转付款页面
        this.$router.push({
          path:"/air/pay",
          query:{
            id:res.data.data.id
          }
        });
      });
    }
  },

  computed: {
    alPrice(){
      let price =0

      // 接口还没返回，默认是0
      if(!this.data.seat_infos){
          return  0;
      }
      // 单价
      price += this.data.seat_infos.org_settle_price;
      // // 燃油费
      price += this.data.airport_tax_audlet
      // // // 保险费
      price += this.insurances.length*30
      // // //乘机人
      price *= this.user.length
      // 把总价格先传到父组件
      this.$emit("setAllPrice", price)

      return price
    }
  },

};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: block;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>
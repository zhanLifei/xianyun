<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥{{payList.price}}</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row type="flex" justify="space-between" align="middle" class="pay-qrcode">
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas id="qrcode-stage"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
// 生成二维码的包
import QRCode from "qrcode";

export default {
  data() {
    return {
      payList: {},
      timer: null
    };
  },
  methods: {
    isPay() {
      return this.$axios({
        url: "/airorders/checkpay",
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        },
        data: {
          id: this.payList.id,
          nonce_str: this.payList.price,
          out_trade_no: this.payList.orderNo
        }
      }).then(res => {
        // 返回promise
        return res.data;
      })
    }
  },
  mounted() {
    const { id } = this.$route.query;
    // 启动一次定时器
    setTimeout(() => {
      this.$axios({
        url: `/airorders/${id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        }
      }).then(res => {
        // price 用于展示
        this.payList = res.data;
        const { payInfo } = res.data;
        // 生成二维码到canvas
        const stage = document.querySelector("#qrcode-stage");
        QRCode.toCanvas(stage, payInfo.code_url);
        // 每3秒一次定时器
        this.timer = setInterval(() => {
          this.isPay().then(value => {
              if(value==='支付完成'){
                  this.$message.success('支付金额已收取')
                  clearInterval(this.timer)
              }
          });
        }, 3000);
      });
    }, 1);
  },

  // 组件销毁时清除定时器
  destroyed () {
      clearInterval(this.timer)
  }
};
</script>

<style scoped lang="less">
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>
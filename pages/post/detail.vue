<template>
  <div class="container el-row is-justify-space-between el-row--flex">
    <!-- 左边模块 -->
    <div class="main">
      <!-- 面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/post/detail' }">旅游攻略</el-breadcrumb-item>
        <el-breadcrumb-item>详情攻略</el-breadcrumb-item>
      </el-breadcrumb>

      <div v-for="(item,index) in detailData" :key="index">
        <h1>{{item.title}}</h1>
        <div class="post-info">
          <span>攻略：{{item.city.created_at}}</span>
          <span>阅读：{{item.watch}}</span>
        </div>
        <p class="summaryP">{{item.summary}}</p>
        <div class="image">
          <img v-for="(item2,index) in item.images" :key="index" :src="item2" alt />
        </div>
        <!-- 赞区域 -->
        <div class="el-row is-justify-center el-row--flex">
          <div class="ctrl-item">
            <i class="iconfont iconpinglun"></i>
            <p>评论(100)</p>
          </div>
          <div class="ctrl-item">
            <i class="iconfont iconstar1"></i>
            <p>收藏</p>
          </div>
          <div class="ctrl-item">
            <i class="iconfont iconfenxiang"></i>
            <p>分享</p>
          </div>
          <div class="ctrl-item">
            <i class="iconfont iconding"></i>
            <p>点赞(41)</p>
          </div>
        </div>
      </div>

      <!-- 评论 -->
      <h4 class="pinglun">评论</h4>
      <div class="el-textarea">
        <textarea
          autocomplete="off"
          placeholder="说点什么吧..."
          class="el-textarea__inner"
          style="resize: none; min-height: 33px;"
          v-model="textarea"
          @keyup.13="fabiao"
        >
        ></textarea>
      </div>
      <el-button
        type="primary"
        :style="{float: 'right' ,width:'70px' ,marginTop:'20px'}"
        @click="fabiao"
      >发表</el-button>

      <!-- ===========上传 ===========-->
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible" size="tiny">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
      <!-- ============================== -->
      <div class="liuyan">
        <div class="cmt-list" v-for="(item,index) in cacheFlightsData" :key="index">
          <div class="cmt-item">
            <div class="cmt-info">
              <img style="width: 16px" src="http://157.122.54.189:9095/assets/images/avatar.jpg" />
              {{item.account.nickname}}
              <i>{{new Date(item.created_at)}}</i>
              <span style="    float: right">{{item.level}}</span>
            </div>
            <div class="cmt-content">
              <div class="cmt-new">
                <p class="cmt-message">{{item.content}}</p>
                <div class="cmt-ctrl">
                  <a href="javascript:;" style="display:none">回复</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-row type="flex" justify="center" style="margin-top:10px;">
        <!-- size-change：切换条数时候触发 -->
        <!-- current-change：选择页数时候触发 -->
        <!-- current-page: 当前页数 -->
        <!-- page-size：当前条数 -->
        <!-- total：总条数 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[1 ,2, 3, 4]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-row>
    </div>
    <!-- 右边模块 -->
    <div class="aside">
      <div class="aside-title">相关攻略</div>

      <a href="/post/detail?id=629" class="recommend-item nuxt-link-active">
        <div class="post-imgText el-row el-row--flex">
          <div class="post-img el-row is-align-middle el-row--flex">
            <img
              src="https://n3-q.mafengwo.net/s10/M00/E8/E4/wKgBZ1octoCABhgLAAafahORRLs91.jpeg?imageView2%2F2%2Fw%2F1360%2Fq%2F90"
              alt
            />
          </div>
          <div class="post-text">
            <div class="post-title">你真棒</div>
            <p>2019-08-09 9:42 阅读 5</p>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
// import moment from 'moment';
export default {
  data() {
    return {
      //   渲染的数据
      detailData: {},
      total: 0,
      pageIndex: 1,
      pageSize: 4,
      //   评论的数据
      commentsList: {},
      cacheFlightsData: {},
      textarea: "", //文本内容
      content: "",
      created_at: "", //时间
      files: [],
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    // 初始化效果,实现分页的变化
    init() {
      const start = (this.pageIndex - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.cacheFlightsData = this.commentsList.slice(start, end);
    },
    // 上传图片================
    handleSuccess(response, file, fileList){
      console.log(file);
      this.$axios({
      url:'/upload',
      }).then(res=>{
        console.log(res);
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // ==========================

    //   分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.init();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageIndex = val;
      this.init();
    },
    //   发表评论
    fabiao() {
      console.log(123);
      this.$axios({
        url: "/comments",
        method: "POST",
        // 规定需要设置token值验证
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        },
        data: {
          content: this.textarea,
          post: this.$route.query.id,
          pics:this.files
        }
      }).then(res => {
        if (res.data.message === "提交成功") {
          this.$message.success("提交成功");
          if (this.textarea === "") {
            return false;
          }
          this.textarea = "";
          this.comment();
        }
      });
    },
    // 分页初始化
    comment() {
      this.$axios({
        url: "/posts/comments",
        params: { post: this.$route.query.id }
      }).then(res => {
        console.log(res.data.data);
        this.commentsList = res.data.data;
        this.cacheFlightsData = { ...res.data.data };
        //   文章总页数
        this.total = this.commentsList.length;
        this.cacheFlightsData = this.commentsList.slice(0, 4);
      });
    }
  },

  mounted() {
    this.$axios({
      url: "/posts",
      params: this.$route.query
    }).then(res => {
      this.detailData = res.data.data;
    });
    this.comment();
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 0 auto;
  padding-top: 20px;
  margin-bottom: 50px;
}
.main {
  width: 700px;
  h1 {
    border-bottom: 1px solid #dddddd;
    margin: 20px 0 15px 0;
    padding-bottom: 15px;
  }
  .summaryP {
    height: 82px;
    overflow: hidden;
    columns: red;
  }
  .post-info {
    color: #999;
    padding: 20px;
    text-align: right;
  }
  .image {
    width: 700px;
    margin-top: 15px;
    img {
      width: 100%;
    }
  }
  h3 {
    margin: 15px 0;
  }
  /deep/ .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 100px;
    margin: 10px 0 30px 0;
  }

  .ctrl-item {
    margin: 40px 20px;
    font-size: 20px;
    text-align: center;
    cursor: pointer;
    i {
      display: block;
      font-size: 28px;
      color: orange;
    }
    p {
      margin-top: 5px;
      font-size: 14px;
      color: #999;
    }
  }
  .el-upload {
    margin: 20px 0 10px 0;
  }
  .liuyan {
    border-top: 1px solid #ddd;
  }
  .cmt-list {
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    // margin-bottom: 10px;
  }
  .cmt-item {
    border-bottom: 1px dashed #ddd;
    padding: 20px 20px 5px;
    height: 73px;
  }
  .cmt-info {
    margin-bottom: 10px;
    font-size: 12px;
    color: #666;
  }
  .cmt-content {
    padding: 0 0 0 30px;
  }
  .cmt-message {
    margin-top: 10px;
  }

  .pinglun {
    font-weight: 400;
    font-size: 18px;
    margin-bottom: 20px;
  }
}
.aside {
  width: 280px;
  .aside-title {
    font-weight: 400;
    font-size: 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
  }
  .post-imgText {
    margin: 10px 0;
    img {
      width: 100px;
      height: 80px;
    }
    .post-text {
      height: 80px;
      .post-title {
        margin-bottom: 45px;
      }
      p {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>


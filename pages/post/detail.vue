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
      <el-tag
        type="info"
        closable
        v-if="reply.nickname"
        @close="handleCloseReply"
      >回复@{{reply.nickname}}</el-tag>
      <div class="el-textarea">
        <textarea
          autocomplete="off"
          placeholder="说点什么吧..."
          class="el-textarea__inner"
          style="resize: none; min-height: 33px;"
          v-model="cmtForm.content"
          @keyup.13="fabiao"
          ref="cmtInput"
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
        :action="$axios.defaults.baseURL + `/upload`"
        list-type="picture-card"
        :file-list="cmtForm.pics"
        name="files"
        :on-success="handleSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="$axios.defaults.baseURL + dialogImageUrl" alt />
      </el-dialog>
      <!-- ============================== -->
      <!-- 无评论时,total为0的时候显示 -->
      <div v-if="!total" class="kong">==========前排吃瓜,暂无评论==========</div>
      <!-- 评论区域 ,total为0的时候隐藏 -->
      <div class="liuyan" v-if="total">
        <div class="cmt-list" v-for="(item,index) in cacheFlightsData" :key="index">
          <div class="cmt-item">
            <div class="cmt-info">
              <img style="width: 16px" :src="$axios.defaults.baseURL + item.account.defaultAvatar" />
              {{item.account.nickname}}
              <i>{{item.created_at | newTime}}</i>
              <span style="float: right">{{item.level}}</span>
            </div>
            <!-- 评论楼层 -->
            <CommaentFloor
              v-if="item.parent"
              :comment="item.parent"
              @handleReply="handleReply"
              @handlePictureCardPreview="handlePictureCardPreview"
            />

            <div class="cmt-content">
              <div class="cmt-new" style="position: relative">
                <p class="cmt-message">{{item.content}}</p>
                <el-row type="flex">
                  <div
                    class="cmt-pic"
                    v-for="(pic, picIndex) in item.pics"
                    :key="picIndex"
                    @click="handlePictureCardPreview(pic)"
                  >
                    <img :src="$axios.defaults.baseURL + pic.url" />
                  </div>
                </el-row>
                <div class="cmt-ctrl">
                  <a href="javascript:;" style="display:block" @click="handleReply(item)">回复</a>
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
          v-if="total"
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
import moment from "moment";
import CommaentFloor from "@/components/post/commaentFloor";
export default {
  components: {
    CommaentFloor
  },
  data() {
    return {
      //   渲染的数据
      detailData: {},
      total: 0,
      pageIndex: 1,
      pageSize: 4,
      //   渲染评论的数据
      commentsList: [],
      cacheFlightsData: {},
      cmtForm: {
        content: "", //评论的内容
        pics: [], //上传的图片
        follow: "", //回复ID
        post: this.$route.query.id
      },
      reply: {},

      created_at: "", //时间

      dialogImageUrl: "",
      dialogVisible: false
    };
  },

  // 过滤时间
  filters: {
    newTime(value) {
      return moment(value).format("YYYY-MM-DD hh:mm");
    }
  },
  methods: {
    // 初始化效果,实现分页的变化
    init() {
      const start = (this.pageIndex - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.cacheFlightsData = this.commentsList.slice(start, end);
    },
    // 上传图片================
    handleSuccess(file, fileList) {
      console.log(file);
      this.cmtForm.pics.push(file[0]);
      console.log(this.cmtForm.pics);
    },
    handleRemove(file, fileList) {
      // file就是用户当前删除的图片对象
      var current = file.name;
      console.log(file);
      for (var i = 0; i < this.cmtForm.pics.length; i++) {
        if (this.cmtForm.pics[i].name === current) {
          this.cmtForm.pics.splice(i, 1);
          break;
        }
      }
    },
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // ==========================

    // 回复楼层
    handleReply(comment) {
      console.log(comment);
      this.reply = comment.account;
      this.cmtForm.follow = comment.id;
      // window.scrollTo(0, this.$refs.cmtInput.offsetTop);
    },
    handleCloseReply() {
      this.reply = {};
      this.cmtForm.follow = "";
    },
    //   分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.init();
      this.comment();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageIndex = val;
      this.init();
      this.comment();
    },
    //   发表评论
    fabiao() {
      this.$axios({
        url: "/comments",
        method: "POST",
        // 规定需要设置token值验证
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        },
        data: this.cmtForm
      }).then(res => {
        console.log(res);
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
        // console.log(res.data.data);
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
    padding: 20px 20px 5px 40px;

    // height: 73px;
  }
  .cmt-info {
    margin-bottom: 10px;
    font-size: 12px;
    color: #666;
  }
  .cmt-content {
    padding: 0 0 0 5px;
  }
  .cmt-message {
    margin-top: 10px;
    margin-bottom: 30px;
  }
  .cmt-pic {
    border: 1px dashed #ddd;
    padding: 4px;
    height: 70px;
    margin: 2px;
    img {
      width: 100px;
      height: 70px;
    }
  }
  .cmt-ctrl {
    float: right;
    font-size: 12px;
    color: blue;
    position: absolute;
    bottom: 5px;
    right: 0;
    a:hover {
      text-decoration: underline;
    }
  }

  .pinglun {
    font-weight: 400;
    font-size: 18px;
    margin-bottom: 20px;
  }

  .kong {
    width: 100%;
    border: dashed 1px #999;
    line-height: 50px;
    text-align: center;
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


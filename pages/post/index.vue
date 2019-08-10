<template>
  <div class="post">
    <el-row :gutter="24">
      <el-col :span="6">
        <!-- 侧边栏 -->
        <div class="grid-content bg-purple dabox">
          <div class="menus">
            <div
              class="menu-item"
              v-for="(item,index) in postsAdd"
              :key="index"
              @mouseover="kkk(index)"
            >
              <span>{{item.type}}</span>
              <i class="el-icon-arrow-right"></i>
              <!-- 鼠标移入展示功能 -->
              <div v-if="current === index">
                <div class="box">
                  <div class="son" v-for="(item1,index) in item.children" :key="index">
                    <span class="tatlee">{{index+1}}&nbsp;</span>
                    <nuxt-link :to="`post?city=${item1.city}`">
                      <span
                        class="tatlee1"
                        style="margin-left:5px"
                        @click="postFlights"
                      >{{item1.city}}</span>
                    </nuxt-link>
                    <nuxt-link to="/post/detail">
                      <span class="tatlee2" style="margin-left:5px">{{item1.desc}}</span>
                    </nuxt-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 推荐城市 -->
        <div class="chengshi">
          <h4>推荐城市</h4>
          <a href="#">
            <img src="http://157.122.54.189:9093/images/pic_sea.jpeg" alt />
          </a>
        </div>
      </el-col>
      <el-col :span="18">
        <!-- 攻略区域 -->
        <div style="margin-top: 15px" class="yeloow">
          <el-input placeholder="请输入想去的地方，比如：'广州'" v-model="content" @keyup.13.native="handContent">
            <el-button slot="append" icon="el-icon-search" @click="handContent"></el-button>
          </el-input>
        </div>
        <!-- 推荐部分 -->
        <div class="tuijian">
          <span>推荐:&nbsp;&nbsp;</span>
          <nuxt-link
            :to="`post?city=${item.name}`"
            v-for="(item,index) in recommendPost"
            :key="index"
          >
            <span
              :class="{recommend:current===index}"
              @mouseover="currentRecommend(index)"
            >&nbsp;{{item.name}}&nbsp;</span>
          </nuxt-link>
        </div>
        <!-- 标题部分 -->
        <div class="title">
          <div class="title-t">
            <h3>推荐攻略</h3>
          </div>
          <el-button type="primary" style="float: right">
            <i class="el-icon-edit"></i> 写游记
          </el-button>
        </div>

        <!-- 推荐攻略部分 -->
        <div class="strategy" v-for="(item,index) in cacheFlightsData" :key="index">
          <h4>
            <nuxt-link :to="`/post/detail?id=${item.id}`">{{item.title}}</nuxt-link>
          </h4>
          <p>
            <a href="#">{{item.summary}}</a>
          </p>
          <div
            class="images card-images post-item image-text el-row is-justify-space-between is-align-middle el-row--flex"
          >
            <a href="#" v-for="(item,index) in item.images" :key="index">
              <img :src="item" alt />
            </a>
          </div>
          <!-- 点评部分 -->
          <div class="post-info-left el-row is-justify-space-between el-row--flex">
            <div class="posinfo">
              <i class="el-icon-location-outline"></i>
              <span>{{item.cityName}}</span>
              <span>by</span>
              <a href="#">
                <img src="http://157.122.54.189:9095/assets/images/avatar.jpg" alt />
                地球发动机
              </a>
              <i class="el-icon-view">{{item.watch}}</i>
            </div>

            <span class="post-info-right zan" style="margin-top: 20px;">41赞</span>
          </div>
        </div>

        <!-- 分页 -->
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
      </el-col>
    </el-row>
  </div>
  
</template>

<script>

export default {

  data() {
    return {
      //输入框的内容
      content: "",
      //   城市列表
      postsAdd: {
        type: "",
        children: [{ city: "" }, { desc: "" }]
      },
      // tab切换初始值
      current: -1,
      // 页面渲染的数据
      postList: {
        title: "1",
        summary: "",
        images: [],
        cityName: "",
        watch: ""
      },
      //   推荐城市
      recommendPost: [{ name: "广州" }, { name: "成都" }, { name: "北京" }],
      newDataList: {},
      cacheFlightsData: {}, //缓存的数据
      urlName: "",
      total: 0,
      pageIndex: 1,
      pageSize: 1
    };
  },
  methods: {
    //  搜索城市功能
    handContent(){
        if(this.content){
            // 直接跳转啦,已经处理过了过滤
            this.$router.push(`?city=${this.content}`)
        };
    },
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
    // 热门城市切换
    kkk(index) {
      this.current = index;
    },
    currentRecommend(index) {
      this.current = index;
    },
    // 通过id过滤
    postFlights() {
      this.cacheFlightsData = this.postList.filter(v => {
        return v.cityName.replace("市", "") === this.urlName;
      });
    },

    initList() {
      // 列表攻略文章渲染
      this.$axios({
        url: "/posts"
      }).then(res => {
        // console.log(res);
        //   文章数据获取
        this.postList = res.data.data;
        this.cacheFlightsData = { ...res.data.data };
        //   文章总页数
        this.total = this.postList.length;
        this.cacheFlightsData = this.postList.slice(0, 1);
      });
    },

    // 初始化效果,实现分页的变化
    init() {
      const start = (this.pageIndex - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.cacheFlightsData = this.postList.slice(start, end);
    }
  },
  mounted() {
    // 推荐城市渲染
    this.$axios({
      url: "/posts/cities"
    }).then(res => {
      this.postsAdd = res.data.data;
    });
    this.initList();
  },
  

  watch: {
    // 监听路由的变化
    $route() {
      this.urlName = this.$route.query.city;
      //  在这里调用id的过滤方法
      this.postFlights();
    }
  },
};
</script>

<style lang="less" scoped>
.post {
  width: 1000px;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 20px;
}
.chengshi {
  h4 {
    line-height: 40px;
    margin-top: 13px;
    font-size: 16px;
    font-weight: 400;
    border-bottom: 1px solid #ddd;
  }
  a {
    img {
      width: 231px;
      margin-top: 10px;
    }
  }
}
.dabox {
  position: relative;
  .box {
    position: absolute;
    border: 1px solid #ccc;
    background-color: #fff;
    left: 231px;
    top: 0px;
    width: 320px;
    height: 300px;
    z-index: 2;
    display: none;
    height: 205px;
    .tatlee {
      color: #ffa500;
      font-size: 16px;
      margin-left: 15px;
      font-style: italic;
      font-weight: 600;
    }
    .tatlee1 {
      color: #ffa500;
      font-size: 14px;
    }
    .tatlee2 {
      color: #666666;
    }
  }
}
.menus {
  border: 1px solid #ddd;
}
.menu-item {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ddd;
  padding: 0 15px 0 20px;
  font-size: 14px;
  i {
    float: right;
    line-height: 40px;
    font-size: 20px;
    color: #ccc;
  }
  &:hover .box {
    display: block;
  }
}
.yeloow {
  /deep/ .el-input__inner {
    border: none;
  }
  /deep/ .el-input-group {
    border: #ffa500 3px solid;
  }
  /deep/ .el-button--default {
    background-color: #fff;
  }
  /deep/ .el-input-group__append {
    border: none;
  }
  /deep/ .el-icon-search {
    color: #ffa500;
    font-weight: 600;
    font-size: 16px;
  }
}

.tuijian {
  span {
    color: #666666;
    font-size: 12px;
  }
  .recommend {
    color: #ffa500;
    text-decoration: underline;
  }
}

.title {
  margin: 20px 0;
  height: 50px;
  border-bottom: 1px solid #eee;
  .title-t {
    display: inline-block;
    height: 50px;
    border-bottom: 2px solid #ffa500;
    h3 {
      font-weight: 400;
      font-size: 18px;
      color: orange;
      float: left;
    }
  }
}
.strategy {
  padding-bottom: 15px;
  margin-top: 15px;
  border-bottom: 1px solid #eee;
  h4 {
    margin-bottom: 15px;
    font-weight: 400;
    font-size: 18px;
    &:hover {
      color: #ffa500;
    }
  }
  p {
    font-size: 14px;
    height: 60px;
    overflow: hidden;
    margin-bottom: 14px;
  }

  .images {
    a {
      img {
        width: 220px;
        height: 150px;
        display: block;
        object-fit: cover;
      }
    }
  }
}
.posinfo {
  font-size: 12px;
  color: rgb(108, 106, 106);
  margin-top: 20px;
  margin-bottom: 10px;
  span {
    margin-left: 5px;
  }
  a {
    color: #ffa500;
    margin: 0 0 5px 0;
    img {
      width: 18px;
      vertical-align: middle;
    }
  }
}
.zan {
  color: #ffa500;
}
</style>


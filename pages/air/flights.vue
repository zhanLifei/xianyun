<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters :data="cacheFlightsData" @setDataList="setDataList" />

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <FlightsItem v-for="(item,index) in newDataList" :key="index" :data="item" />
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
            :page-sizes="[2, 4, 6, 8]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </el-row>
      </div>

      <!-- 侧边栏 -->
      <FlightsAside />
    </el-row>
  </section>
</template>

<script>
import FlightsListHead from "@/components/air/flightsListHead";
import FlightsItem from "@/components/air/flightsItem";
import FlightsFilters from "@/components/air/flightsFilters.vue";
import FlightsAside from "@/components/air/flightsAside.vue";

export default {
  components: {
    FlightsItem,
    FlightsListHead,
    FlightsFilters,
    FlightsAside
  },
  data() {
    return {
      flightsData: {}, // 渲染页面的全部数据
      cacheFlightsData: {
        //筛选之后的数据列表
        info: {},
        options: {}
      },
      newDataList: [], //定义一个新数组,用于分页
      pageIndex: 1, //当前页数
      pageSize: 2, //当前条数
      total: 8 //总页数
    };
  },

  watch: {
    // 监听路由信息的变化
    $route() {
      this.pageIndex = 1;
      this.$axios({
        url: "/airs", //机票列表接口
        method: "GET",
        params: this.$route.query //获取url的5个参数
      }).then(res => {
        this.flightsData = res.data; //显示全部机票数据列表
        this.cacheFlightsData = { ...res.data }; //筛选之后的数据列表
        //数据的总长度赋值给total,虽然接口里有total值,因为是一次性获取数据的,所以用长度比较好,下面还要通过截取的方式实现分页
        this.total = this.flightsData.flights.length;
        // 蒋每页截取之后的数据赋值给新数组
        this.newDataList = this.flightsData.flights.slice(0, 2);
      });
    }

  },

  methods: {
    //当前条数的事件
    handleSizeChange(val) {
      console.log(val);
      this.pageSize = val;
      this.init();
    },
    //当前页数的事件
    handleCurrentChange(val) {
      console.log(val);
      this.pageIndex = val;
      this.init();
    },
    // 初始化效果,实现分页的变化
    init() {
      const start = (this.pageIndex - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.newDataList = this.flightsData.flights.slice(start, end);
    },
    // arr是展示筛选数据的
    setDataList(arr) {
      // console.log(arr);
      if (arr) {
        this.pageIndex = 1;
        this.flightsData.flights = arr;
        this.total = arr.length;
      }
      this.init();
    },

    getdata() {
      this.$axios({
        url: "/airs", //机票列表接口
        method: "GET",
        params: this.$route.query //获取url的5个参数
      }).then(res => {
        this.flightsData = res.data; //显示全部机票数据列表
        this.cacheFlightsData = { ...res.data }; //筛选之后的数据列表
        //数据的总长度赋值给total,虽然接口里有total值,因为是一次性获取数据的,所以用长度比较好,下面还要通过截取的方式实现分页
        this.total = this.flightsData.flights.length;
        // 蒋每页截取之后的数据赋值给新数组
        this.newDataList = this.flightsData.flights.slice(0, 2);
      });
    }
  },

  mounted() {
    this.getdata();
  }

};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>
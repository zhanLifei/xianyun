<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{data.info.departCity}} - {{data.info.destCity}}
        /
        {{data.info.departDate}}
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airport" placeholder="起飞机场" @change="handleAirport">
          <el-option v-for="(item,index) in data.options.airport" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="flightTimes" placeholder="起飞时间" @change="handleFlightTimes">
          <el-option
            v-for="(item, index) in data.options.flightTimes"
            :key="index"
            :label="`${item.from}:00 - ${item.to}:00`"
            :value="`${item.from},${item.to}`"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="company" placeholder="航空公司" @change="handleCompany">
          <el-option v-for="(item,index) in data.options.company" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型" @change="handleAirSize">
          <el-option v-for="(item , index) in airSizepei" :key="index" :label="item.name" :value="item.size"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button type="primary" round plain size="mini" @click="handleFiltersCancel">撤销</el-button>
    </div>
  </div>
</template>

<script>
export default {
     props: {
        // 数据
        data: {
            type: Object,
            // 默认是空数组
            default: {},
        },

    },
    data(){
        
        return {
            airport: "",        // 机场
            flightTimes: "",    // 出发时间
            company: "",        // 航空公司
            airSize: '',        // 机型大小
            // 机型大小
            airSizepei:[
              {name:'大',size:"L"},{name:'中',size:'M'},{name:'小',size:'S'}
              ]
        }
    },
    
    methods: {
        // 选择机场时候触发,value就是选择的那个值
        handleAirport(value){
          // console.log(this.data.flights[0].org_airport_name);
            // 循环过滤
            const arr = this.data.flights.filter(v=>{
              // 过滤的值与value值匹配的存入arr数组中
              return v.org_airport_name===value
            });

            this.$emit("setDataList", arr);
        },

        // 选择出发时间时候触发
        handleFlightTimes(value){
          const [from , to ] = value.split(",");  //把字符串分隔数组 [6,00]~[12,00]
          const arr = this.data.flights.filter(v => {
            // 出发小时
            const start = v.dep_time.split(':')[0]  // 6
            // 返回过滤出 出发小时大于等于from的或者小于to的  譬如:出发小时大于等于6的或者小于12的  '6:00~12:00'
            return  start>=from && start < to;
          });

          this.$emit("setDataList", arr)
        },

         // 选择航空公司时候触发
        handleCompany(value){
            const arr = this.data.flights.filter(v=>{
              return v.airline_name ===value
            })
            console.log(arr);
          this.$emit("setDataList", arr)
        },

         // 选择机型时候触发
        handleAirSize(value){
           const arr = this.data.flights.filter(v=>{
              return v.plane_size ===value
           })
          this.$emit("setDataList", arr)
        },
        
        // 撤销条件时候触发
        handleFiltersCancel(){
            this.airport= "",        // 机场
            this.flightTimes= "",    // 出发时间
            this.company= "",        // 航空公司
            this.airSize= ''       // 机型大小
            this.$emit("setDataList",this.data.flights)
        },
    }
}
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>
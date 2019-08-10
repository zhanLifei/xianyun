<template>
    <div class="container">
        <el-row type="flex" justify="space-between">
            <!-- 订单表单 -->
            <orderForm :data="insurancesData" @setAllPrice="setAllPrice"/>

            <!-- 侧边栏 -->
            <orderAside :data="insurancesData" :allPrice="allPrice"/>
        </el-row>
    </div>
</template>

<script>
import orderForm from "@/components/air/orderForm.vue";
import orderAside from "@/components/air/orderAside.vue";
export default {
    components:{
        orderForm,
        orderAside,
    },
    data () {
        return {
            insurancesData:{
                seat_infos:{}
            },   //获取的保险数
            allPrice:0
        }
    },
    methods: {
        setAllPrice(price){
            this.allPrice = price
            this.$store.commit('pay/allPrice',price)
        }
    },
    mounted () {
        const {query} = this.$route;
        // console.log(query);
        this.$axios({
            url:`/airs/${query.id}`,
            method:'GET',
            params:{
                seat_xid:query.seat_xid
            }
        }).then(res=>{
            this.insurancesData = res.data
            console.log(res);
        })
    }
}
</script>

<style lang="less" scoped>
    .container{
        width:1000px;
        margin:20px auto;
    }
    
    /*aside*/
    .aside{
        width: 350px;
        height: fit-content;
        border:1px #ddd solid;
    }
</style>
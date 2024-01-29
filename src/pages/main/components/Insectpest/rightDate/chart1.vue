<template>
    <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.6)" class="top" @mouseenter="showPopup"
        @mouseleave="onBotMouseLeave">
        <div class="st_titles">
            {{ this.modelData }}模型预测
        </div>
        <div class="chart-container">
            <!-- 折线图容器 -->
            <div id="chart1" class="chart"></div>
            <!-- 按钮浮动在折线图上 -->
            <!-- <div class="button-container"> -->
            <!-- <div @click="totalEnergy" class="energy-button new">放大</div> -->
            <!-- <div @click="changeEnergy(1)" class="energy-button conventional">常规电源</div>
                <div @click="changeNewenergy(1)" class="energy-button new">新能源</div> -->
            <!-- </div> -->
        </div>
        <PopupComponent v-if="isMouseOverBot" ref="popup1" @close-popup="hidePopup" :alldata="allData" />
    </div>
</template>

<script>
import * as echarts from 'echarts'
import util from '@/utils/request.js';
import PopupComponent from '../PopupComponent.vue'
export default {
    components: { PopupComponent },
    data() {
        return {
            loading: false,
            isMouseOverBot: false,
            tabindex: 0,
            colorLine: ['#FFC22E', '#bfc'],
            rightData: [
                {
                    name: '真实功率',
                    data: []
                },
                {
                    name: '预测功率',
                    data: []
                },
            ],
            allData: [],
            titleName: '',
            postData: {
                region: '湖北省',
                district: '宜昌市',
                site: '三峡',
                datetimes_start: '',
                datetimes_end: ''
            },
            modelData: ''
        };
    },
    created() {
        // 按钮联动
        this.$bus.$on('left1', () => {
            this.changeEnergy(2)
        });
        this.$bus.$on('left2', () => {
            this.changeNewenergy(2)
        });
        this.$bus.$on('total1', () => {
            this.totalEnergy(2)
        })
        this.updateChart(this.totalData)
    },
    methods: {
        //Echarts数据渲染
        initChart() {
            var chartDom = document.getElementById('chart1');
            this.chartInstance = echarts.init(chartDom);
            var option = this.getOption();
            this.chartInstance.setOption(option);
        },
        changeEnergy(flag) {
            this.updateChart(this.conventionalData);
            if (flag === 2) return;
            this.$bus.$emit('chart1')
        },
        changeNewenergy(flag) {
            this.updateChart(this.newData);
            if (flag === 2) return
            this.$bus.$emit('chart2')
        },
        totalEnergy() {
            // console.log('11111', flag);
        },
        updateChart(data) {
            if (this.chartInstance) {
                this.chartInstance.dispose(); // 销毁图表实例
            }
            this.initChart();
            this.chartInstance.setOption(this.getOption(data)); // 设置新数据
        },
        getOption(data = this.rightData) {
            return {
                title: {
                    text: this.titleName,
                    textStyle: {
                        color: '#fff',
                    },
                    left: '5%',

                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    bottom: 0,
                    textStyle: {
                        color: '#fff',
                    },
                    // data: data.map(item => item.name),
                    left: 'center'
                },
                xAxis: {
                    // name: 't/min',
                    data: Array.from({ length: this.rightData[0].data.length }, (_, i) => i),
                    axisLabel: {
                        show: true,
                        interval: 19,
                        textStyle: {
                            fontWeight: 'bold'
                        }
                    },
                },
                yAxis: [
                    {
                        name: '功率(P/MW)',
                        type: 'value',
                        nameTextStyle: {
                            fontWeight: 'bold'
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                fontWeight: 'bold'
                            }
                        },
                        axisPointer: {
                            snap: true,
                        },
                    },
                ],
                series: data.map((item, index) => ({
                    name: item.name,
                    type: 'line',
                    data: item.data,
                    // 是否有阴影面积
                    // areaStyle: {},
                    // areaStyle: {
                    //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    //         {
                    //             offset: 0,
                    //             color: 'rgb(255, 158, 68)'
                    //         },
                    //         {
                    //             offset: 1,
                    //             color: 'rgb(255, 70, 131)'
                    //         }
                    //     ])
                    // },
                    showSymbol: true,//是否默认展示圆点
                    symbol: 'circle',     //设定为实心点
                    symbolSize: 0,
                    smooth: true,
                    emphasis: {
                        focus: 'series'
                    },
                    itemStyle: {
                        color: this.colorLine[index], // 设置单独的颜色
                    },
                    animationDelay: function (idx) {
                        return idx * 10;
                    }
                })),
                animationEasing: 'elasticOut',
                animationDelayUpdate: function (idx) {
                    return idx * 5;
                }
            };
        },
        //鼠标移入移出
        showPopup() {
            this.isMouseOverBot = true;
            this.allData[0].name = this.modelData + '模型数据'
        },
        hidePopup() {
            this.isMouseOverBot = false;
        },
        onBotMouseLeave(event) {
            // 获取鼠标位置
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            // 获取 PopupComponent 的 DOM 元素
            const popupElement = this.$refs.popup1.$refs.popup;
            const leftElement = this.$el;
            // 获取 PopupComponent 的位置和尺寸
            const popupRect = popupElement.getBoundingClientRect();
            const leftRect = leftElement.getBoundingClientRect();

            // 判断鼠标是否在 PopupComponent 区域内
            if (
                mouseX < popupRect.left ||
                // mouseX > popupRect.right ||
                mouseY < popupRect.top ||
                mouseY > popupRect.bottom ||
                // mouseX < leftRect.left ||
                mouseX > leftRect.right ||
                mouseY < leftRect.top ||
                mouseY > leftRect.bottom
            ) {
                // console.log('离开');
                this.hidePopup();
            }
        },
        // 预测数据计算
        computeSeries(data) {
            data.forEach((item) => {
                // 真实功率
                this.rightData[0].data.push(item.gt)
                // 预测功率
                this.rightData[1].data.push(item.pred)
            })
            this.allData = []
            this.allData = data
            // console.log(this.allData, 'this.allData');
            // 传递初始数据
            this.$bus.$emit('rightData1', { rightData: this.rightData, allData: this.allData, modelData: this.modelData })
            this.updateChart(this.rightData);
        },
    },
    mounted() {
        this.$bus.$on('formData', (data) => {
            // console.log(data, 'data');
            this.titleName = data.region + data.district + data.site
            this.postData.region = data.region
            this.postData.district = data.district
            this.postData.site = data.site
            let obj = JSON.parse(localStorage.getItem('area'))
            this.postData.datetimes_start = obj.datetimes_start
            this.postData.datetimes_end = obj.datetimes_end
            // console.log(this.postData, 'this.postData');
        })
        util.post('/api/get_result_power', this.postData)
            .then(response => {
                // 处理POST请求的响应
                if (response && response.code === 200) {
                    // 请求成功的处理逻辑
                    // console.log(response, 'response初始数据');
                    this.modelData = response.data[0].model
                    this.computeSeries(response.data)
                    // this.$refs.upload.submit();
                } else {
                    // 请求失败的处理逻辑
                    this.$message.error('服务器错误')
                }
            })
            .catch(error => {
                // 处理POST请求的错误
                this.$message.error('POST请求错误')
                console.error('POST请求错误', error);
            });
    },
    beforeDestroy() {
        this.$bus.$off('formData')
    }
}
</script>
<style lang="scss" scoped>
.top {
    width: 100%;
    /* height: 100%; */
    z-index: 99999;
    height: 34vh;

    /* padding-bottom: 5.5vh; */
    /* height: 28vh; */

    .st_titles {
        background-size: 100% 107%;
        background-repeat: no-repeat;
        background-image: url('../../../../../assets/img/ch/item_new.png');
    }

    .chart-container {
        position: relative;
        height: calc(100% - 4vh);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../../../../../assets/img/ch/chbg_new.png');
        transform: translateX(-50%);
        animation-name: moveRightToLeft;
        animation-duration: 1.5s;
        animation-fill-mode: forwards;

        .chart {
            width: 100%;
            height: 100%;
        }

        .button-container {
            display: flex;
            position: absolute;
            top: 10px;
            right: 10px;
        }

        .energy-button {
            padding: 1px 2px;
            margin: 2px;
            border-radius: 3px;
            font-size: 14px;
            cursor: pointer;
            text-align: center;
            font-weight: bold;
            color: rgb(55, 209, 259);
            transition: background-color 0.3s;

            &.conventional {
                background-color: rgba(84, 122, 194, .5);
            }

            &.new {
                background-color: rgba(84, 122, 194, .5);
            }

            &:hover {
                color: rgb(2, 188, 233);
                background-color: rgb(14, 33, 72);
            }
        }
    }
}

/* .chartclass{

} */
</style>
<template>
    <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.6)" class="top" @mouseenter="showPopup"
        @mouseleave="onBotMouseLeave">
        <div class="st_titles">
            {{ this.modelData }}模型预测
        </div>
        <div class="chart-container">
            <!-- 折线图容器 -->
            <div id="chart2" class="chart"></div>
        </div>
        <PopupComponent v-if="isMouseOverBot" ref="popup2" @close-popup="hidePopup" :alldata="allData" />
    </div>
</template>

<script>
import * as echarts from 'echarts'
import PopupComponent from '../PopupComponent.vue'
export default {
    components: { PopupComponent },
    data() {
        return {
            loading: false,
            isMouseOverBot: false,
            colorLine: ['rgb(255,164,0)', '#bfc'],
            tabindex: 0,
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
            allData: [
            ],
            modelData: ''
        };
    },
    created() {
    },
    methods: {
        //Echarts数据渲染
        initChart() {
            var chartDom = document.getElementById('chart2');
            this.chartInstance = echarts.init(chartDom);
            var option = this.getOption();
            this.chartInstance.setOption(option);
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
                },
                legend: {
                    bottom: 0,
                    textStyle: {
                        color: '#fff',
                    },
                    data: data.map(item => item.name),
                    left: 'center',
                },
                toolbox: {
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
                tooltip: {
                    trigger: 'axis'
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
                series: [
                    {
                        name: '预测功率',
                        type: 'bar',
                        data: this.rightData.find(item => item.name === '预测功率').data,
                        // 是否有阴影面积
                        // areaStyle: {
                        // },
                        showSymbol: true,//是否默认展示圆点
                        symbol: 'circle',     //设定为实心点
                        symbolSize: 0,
                        smooth: true,
                        emphasis: {
                            focus: 'series'
                        },
                        itemStyle: {
                            borderRadius: 5,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#14c8d4' },
                                { offset: 1, color: '#43eec6' }
                            ])
                        },
                        animationDelay: function (idx) {
                            return idx * 10;
                        }
                    },
                    {
                        name: '真实功率',
                        type: 'bar',
                        data: this.rightData.find(item => item.name === '真实功率').data,
                        // 是否有阴影面积
                        // areaStyle: {
                        // },
                        showSymbol: true,//是否默认展示圆点
                        symbol: 'circle',     //设定为实心点
                        symbolSize: 0,
                        smooth: true,
                        emphasis: {
                            focus: 'series'
                        },
                        itemStyle: {
                            borderRadius: 5,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#FFC22E' },
                                { offset: 1, color: '#bfa' }
                            ])
                        },
                        animationDelay: function (idx) {
                            return idx * 10;
                        }
                    },
                ],
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
            const popupElement = this.$refs.popup2.$refs.popup;
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
    },
    mounted() {
        this.$bus.$on('rightData1', (data) => {
            // console.log(data, 'data');
            this.allData = data.allData
            this.modelData = data.modelData
            this.rightData = data.rightData
            this.updateChart(this.rightData);
        })
    },
    beforeDestroy() {
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
}

.st_titles {
    background-size: 100% 100%;
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

/* .chartclass{

} */
</style>
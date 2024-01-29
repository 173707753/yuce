<template>
  <div id="app">
        <input type="button" value="toggle" @click="flag=!flag">
        <!-- 需求：点击按钮，让 h3 显示，再点击，让 h3 隐藏 -->
        <transition enter-active-class="animated bounceIn" 
        leave-active-class="animated bounceOut"
        :duration="200">
            <h3 v-show="flag">这是一个h3</h3>
        </transition>

        <!-- <transition enter-active-class="bounceIn" leave-active-class="bounceOut">
            <h3 v-show="flag" class="animated">这是一个h3</h3>
        </transition> -->
    </div>
</template>

<script>
/ eslint-disable /
import animate from "animate.css";
export default {
  data() {
    return {
      aaa: '',
      show: false,
      flag: false
    }
  },
  methods: {
    handleClick() {
      console.log(123)
      this.show = !this.show
    }
  },
}
</script>
<style scoped>
#detailContrainer.slide-enter-active {
    animation: .9s bounceInDown;
}

@keyframes bounceInDown {
    0% {
        transform: translateX(100%);
    }
    100% {
        transform: translateX(0);
    }
}
</style>
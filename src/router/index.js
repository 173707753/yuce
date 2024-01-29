import Vue from 'vue'
import VueRouter from 'vue-router'
// import routes from './routes'
import pagesRouter from './pages'
import viewsRouter from './views'


const Router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [...pagesRouter, ...viewsRouter],
})

Vue.use(VueRouter)
export default Router

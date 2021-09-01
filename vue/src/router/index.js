import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Storage from "../views/Storage.vue"
import Purchase from "../views/Purchase.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import Orders from "../views/Orders.vue"

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/storage',
        name: 'Storage',
        component: Storage
    },
    {
        path: '/purchase',
        name: 'Purchase',
        component: Purchase
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/orders',
        name: 'Orders',
        component: Orders
    }

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">Record Store</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="navi">
          <b-nav-item> <router-link to="/">Home</router-link></b-nav-item>
          <b-nav-item v-if="token != ''">
            <router-link to="/purchase">Purchase</router-link></b-nav-item
          >
          <b-nav-item v-if="token != ''">
            <router-link to="/orders">Orders</router-link></b-nav-item
          >
        </b-navbar-nav>

        <b-navbar-nav v-if="token != ''" class="ml-auto">
          <b-nav-form>
            <b-form-input
              v-model="search_title"
              size="sm"
              class="mr-sm-2"
              placeholder="Search..."
            ></b-form-input>
            <b-button @click="searchAction" size="sm" class="my-2 my-sm-0"
              >Search</b-button
            >
          </b-nav-form>

          <b-nav-item-dropdown text="Sort by" right>
            <b-dropdown-item @click="sort(1)">Title</b-dropdown-item>
            <b-dropdown-item @click="sort(2)">Genre</b-dropdown-item>
            <b-dropdown-item @click="sort(3)">Price</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>Cart</em>
            </template>
            <b-dropdown-item v-for="item in cart" v-bind:key="item.Id"
              ><span
                >{{ item.title }} - {{ item.price }} $ x{{ item.stock }}</span
              ></b-dropdown-item
            >
            <b-dropdown-item class="sum"
              ><p>Total sum: {{ sum }} $</p>
              <b-button router-link to="/purchase" size="sm" class="ml-2"
                >Buy</b-button
              >
              <b-button @click="clearCart" size="sm" class="ml-2"
                >Clear</b-button
              ></b-dropdown-item
            >
          </b-nav-item-dropdown>
          <b-button v-if="is_admin" @click="manageOrders" size="sm" class="ml-2"
            >Manage orders</b-button
          >
          <b-button v-if="is_admin" @click="add_record" size="sm" class="ml-2"
            >Add record</b-button
          >
          <b-button @click="logout" size="sm" class="my-2 my-sm-0"
            >Logout</b-button
          >
        </b-navbar-nav>
        <b-navbar-nav v-else class="ml-auto">
          <b-navbar-nav class="navi">
            <b-nav-item>
              <router-link to="/register">Register</router-link></b-nav-item
            >
            <b-nav-item>
              <router-link to="/login">Login</router-link></b-nav-item
            >
          </b-navbar-nav>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Header",
  data() {
    return {
      search_title: "",
    };
  },
  computed: {
    ...mapState(["cart"]),
    ...mapState(["sum"]),
    ...mapState(["token"]),
    ...mapState(["admin"]),
  },
  methods: {
    ...mapActions(["search_record_by_title"]),
    ...mapActions(["sort_records"]),
    ...mapActions(["empty_cart"]),
    ...mapActions(["delete_token"]),
    ...mapActions(["is_admin"]),
    ...mapActions(["manage_orders"]),
    ...mapActions(["add_record"]),
    searchAction: function () {
      this.search_record_by_title(this.search_title);
    },
    sort: function (type) {
      this.sort_records(type);
    },
    clearCart: function () {
      this.empty_cart();
    },
    add_record: function () {
      window.location = "http://localhost:8000/add_record/" + this.token;
    },
    manageOrders: function () {
      window.location = "http://localhost:8000/" + this.token;
    },
    logout: function () {
      this.delete_token();
    },
  },
};
</script>

<style scoped>
.navi a {
  color: white !important;
}
.sum {
  border: 1px solid black;
}
</style>
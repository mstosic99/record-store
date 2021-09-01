<template>
  <div>
    <Header />
    <b-container v-if="token != ''" fluid>
      <b-form>
        <b-row>
          <select v-model="selectedOrder">
            <option v-for="o in orders" v-bind:key="o.Id" :value="o.order_id">
              {{ o }}
            </option>
          </select>
        </b-row>
      </b-form>
    </b-container>
    <b-container v-else fluid>
      <p>Please log in!</p>
    </b-container>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import router from "@/router";
import { mapState, mapActions } from "vuex";
import Joi from "joi";

export default {
  name: "Orders",
  components: {
    Header,
  },
  data() {
    return {
      selectedOrder: "",
    };
  },
  computed: {
    ...mapState(["orders"]),
    ...mapState(["token"]),
  },
  mounted: function () {
    this.load_orders();
  },
  methods: {
    ...mapActions(["load_orders"]),
  },
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.record {
  border: 1px solid black;
  margin: 0px;
}

.record .col-4 {
  text-align: center;
  max-width: 100%;
}
.record .title {
  font-size: 25px;
}

.shop-row {
}
</style>

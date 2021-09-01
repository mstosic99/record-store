<template>
  <div class="home">
    <Header />
    <b-modal v-model="modalShow">{{ modalRecord }}</b-modal>
    <b-jumbotron header="Welcome to the Record Store"></b-jumbotron>
    <b-container>
      <b-row class="shop-row">
        <b-col
          class="record"
          v-for="record in records"
          v-bind:key="record.Id"
          cols="3"
        >
          <b-col class="title" cols="12"
            ><p>{{ record.title }}</p></b-col
          >
          <b-col cols="12"
            ><img :src="record.image" class="img-circle"
          /></b-col>
          <b-col cols="12"
            ><p>{{ record.name }}</p></b-col
          >
          <b-col cols="12"
            ><p>{{ record.price }} $</p></b-col
          >
          <b-col cols="12"
            ><p>Available: {{ record.stock }}</p></b-col
          >
          <b-col cols="12"
            ><b-button
              v-if="token != ''"
              @click="addToCart(record)"
              variant="primary"
              >Add to cart</b-button
            ></b-col
          >
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import router from "@/router";
import { mapState, mapActions } from "vuex";

export default {
  name: "Home",
  components: {
    Header,
  },
  data() {
    return {
      modalShow: false,
      modalRecord: "",
    };
  },
  computed: {
    ...mapState(["records"]),
    ...mapState(["token"]),
    ...mapState(["cart"]),
  },
  mounted: function () {
    this.load_records();
  },
  methods: {
    ...mapActions(["load_records"]),
    ...mapActions(["add_to_cart"]),
    addToCart: function (record) {
      var exists = -1;
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].record_id == record.record_id) {
          exists = i;
          break;
        }
      }
      console.log(exists);
      if (exists == -1 || record.stock > this.cart[exists].stock) {
        this.add_to_cart(record);
        this.modalRecord = record.title + " added to cart!";
      } else {
        this.modalRecord = record.title + " no more in stock!";
      }
      this.modalShow = !this.modalShow;
    },
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
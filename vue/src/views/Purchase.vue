<template >
  <div>
    <Header />
    <div v-if="token != ''">
      <b-container v-if="cart.length > 0">
        <b-form-group label="Pick an address option">
          <b-form-radio v-model="selected" name="some-radios" value="existing"
            >Existing address</b-form-radio
          >
          <b-form-radio v-model="selected" name="some-radios" value="new"
            >New address</b-form-radio
          >
        </b-form-group>
        <b-row v-if="selected == 'existing'" class="mt-5">
          <!-- <b-dropdown id="dropdown-1" text="Existing addresses" class="m-md-2">
            <b-dropdown-item v-for="addr in addresses">{{addr.address}} - {{addr.zipcode}}</b-dropdown-item>
         </b-dropdown> -->
          <!-- <b-form-group label="Pick a address option">
           <b-form-radio v-for="addr in addresses" v-model="selectedAddr" name="some-radios" value="addr.address_id">{{ addr.address }} - {{ addr.zipcode }}</b-form-radio>
        </b-form-group> -->
          <p>Select address:</p>
          <select v-model="selectedAddr">
            <option
              v-for="addr in addresses"
              v-bind:key="addr.Id"
              :value="addr.address_id"
            >
              {{ addr.address }} - {{ addr.zipcode }}
            </option>
          </select>
        </b-row>

        <b-row v-if="selected == 'new'" class="mt-5">
          <b-col class="new" cols="3">
            <b-input v-model="address" placeholder="Address"></b-input>
          </b-col>
          <b-col cols="3">
            <b-input v-model="zipcode" placeholder="Zipcode"></b-input>
          </b-col>
          <b-col cols="3">
            <b-button variant="primary" size="lg" @click="addAddress"
              >Add address</b-button
            >
          </b-col>
        </b-row>
        <b-row class="mt-5">
          <b-col>
            <b-table class="mt-5" striped hover :items="cart"></b-table>
          </b-col>
          <b-col offset="10" cols="2">
            <p>Total sum: {{ sum }} $</p>
          </b-col>
          <b-col cols="3">
            <b-button variant="primary" size="lg" @click="purchase"
              >Purchase</b-button
            >
          </b-col>
        </b-row>
      </b-container>
      <b-container class="empty mt-5" v-else>
        <p>Cart is empty</p>
      </b-container>
    </div>
    <div v-else>
      <p>Please log in!</p>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import { mapState, mapActions } from "vuex";
import Joi from "joi";

const addressSchema = Joi.object().keys({
  address: Joi.string().min(5).max(40).required(),
  zipcode: Joi.number(),
});

export default {
  name: "Purchase",
  components: {
    Header,
  },
  data() {
    return {
      addr: {},
      address: "",
      zipcode: "",
      selected: "",
      selectedAddr: -1,
    };
  },
  computed: {
    ...mapState(["cart"]),
    ...mapState(["sum"]),
    ...mapState(["addresses"]),
    ...mapState(["token"]),
  },
  mounted: function () {
    if (this.token != "") this.load_addresses();
  },
  methods: {
    ...mapActions(["place_order"]),
    ...mapActions(["load_addresses"]),
    ...mapActions(["add_address"]),
    purchase: function () {
      // var info = [];
      // info.push(this.name);
      // info.push(this.address);
      // info.push(this.phone);
      // this.buy_cart(info);
      // this.name = '';
      // this.address = '';
      // this.phone = '';
      console.log(this.myModel);
      this.place_order(this.selectedAddr);
    },
    addAddress: function () {
      let { error } = addressSchema.validate({
        address: this.address,
        zipcode: this.zipcode,
      });
      if (error) {
        alert(error);
      } else {
        var dto = [this.address, this.zipcode];
        this.add_address(dto);
      }
    },
  },
};
</script>

<style scoped>
.empty p {
  font-size: 30px;
}
</style>

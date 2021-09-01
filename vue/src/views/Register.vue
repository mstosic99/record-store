<template>
  <div>
    <Header />
    <b-container v-if="token == ''" fluid>
      <b-form>
        <b-row>
          <b-input v-model="username" placeholder="Username"></b-input>
          <b-input
            v-model="password"
            type="password"
            placeholder="Password"
          ></b-input>
          <b-input v-model="email" placeholder="Email"></b-input>
          <b-input v-model="name" placeholder="Name"></b-input>
          <b-input v-model="lastname" placeholder="Lastname"></b-input>
          <b-input v-model="phone" placeholder="Phone"></b-input>
          <b-button variant="primary" size="lg" @click="loginUser"
            >Register</b-button
          >
        </b-row>
      </b-form>
    </b-container>
    <b-container v-else fluid>
      <p>Logged in!</p>
    </b-container>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import router from "@/router";
import { mapState, mapActions } from "vuex";
// import Joi from "joi";

// const registerSchema = Joi.object().keys({
//   username: Joi.string().min(5).max(40).required(),
//   password: Joi.string().min(5).max(15).required(),
//   name: Joi.string().min(2).max(20),
//   lastname: Joi.string().min(2).max(20),
//   email: Joi.string().email(),
//   phone: Joi.number(),
// });

export default {
  name: "Register",
  components: {
    Header,
  },
  data() {
    return {
      username: "",
      password: "",
      email: "",
      name: "",
      lastname: "",
      phone: "",
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  methods: {
    ...mapActions(["register"]),
    loginUser: function () {
      //let { error } = registerSchema.validate({username: this.username, password: this.password, email: this.email, name: this.name, lastname: this.lastname, phone: this.phone});
      // if(error) {
      //   alert(error);
      // }
      // else {
      var dto = [
        this.username,
        this.password,
        this.email,
        this.name,
        this.lastname,
        this.phone,
      ];
      console.log(dto);
      this.register(dto);
      // }
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

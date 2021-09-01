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
          <b-button variant="primary" size="lg" @click="loginUser"
            >Login</b-button
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
import Joi from "joi";

const loginSema = Joi.object().keys({
  username: Joi.string().min(5).max(40).required(),
  password: Joi.string().min(5).max(50).required(),
});

export default {
  name: "Login",
  components: {
    Header,
  },
  data() {
    return {
      username: "",
      password: "",
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  methods: {
    ...mapActions(["login"]),
    ...mapActions(["is_admin"]),
    loginUser: function () {
      let { error } = loginSema.validate({
        username: this.username,
        password: this.password,
      });
      if (error) {
        alert(error);
      } else {
        var dto = [this.username, this.password];
        console.log(dto);
        console.log("dto");
        this.login(dto);
      }
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

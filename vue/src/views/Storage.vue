<template>
  <div>
    <Header />
    <b-container fluid>
      <b-form>
        <b-row class="mt-5">
          <b-col class="new" cols="1">
            <p>Add new record</p>
          </b-col>
          <b-col class="new" cols="3">
            <b-input v-model="newTitle" placeholder="Title"></b-input>
          </b-col>
          <b-col cols="3">
            <b-input v-model="newGenre" placeholder="Genre"></b-input>
          </b-col>
          <b-col cols="3">
            <b-input v-model="newPrice" placeholder="Price"></b-input>
          </b-col>
          <b-col cols="2">
            <b-button variant="primary" size="lg" @click="addNew"
              >Save</b-button
            >
          </b-col>
        </b-row>
        <b-row class="mt-5">
          <b-col class="delete" cols="1">
            <p>Remove a record</p>
          </b-col>
          <b-col class="delete" cols="9">
            <b-input v-model="remove_id" placeholder="Delete ID"></b-input>
          </b-col>
          <b-col cols="2">
            <b-button variant="primary" size="lg" @click="deleteID"
              >Delete</b-button
            >
          </b-col>
        </b-row>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import { mapActions } from "vuex";

export default {
  name: "Storage",
  components: {
    Header,
  },
  data() {
    return {
      newTitle: "",
      newGenre: "",
      newPrice: "",
      remove_id: "",
    };
  },
  methods: {
    ...mapActions(["new_record"]),
    ...mapActions(["delete_record"]),
    addNew: function () {
      const record = JSON.stringify({
        title: this.newTitle,
        genre: this.newGenre,
        price: this.newPrice,
      });
      this.new_record(record);

      this.newTitle = "";
      this.newGenre = "";
      this.newPrice = "";
    },
    deleteID: function () {
      this.delete_record(this.remove_id);
      this.remove_id = "";
    },
  },
};
</script>
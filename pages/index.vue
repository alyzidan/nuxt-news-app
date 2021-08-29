<template>
  <div class="md-layout md-alignment-center" style="margin: 4em 0">
    <md-toolbar class="fixed-toolbar" elevation="1">
      <md-button @click="showleftSideBar = true" class="md-icon-button">
        <md-icon>menu</md-icon>
      </md-button>
      <nuxt-link class="md-primary md-title" to="/login"> login </nuxt-link>
      <nuxt-link class="md-primary md-title" to="/"> News </nuxt-link>
      <!-- <nuxt-link  class="md-primary md-title" to="/registartion">
        register
      </nuxt-link> -->

      <md-button class="md-accent" @click="showSidePanel = true">
        Categories
      </md-button>

      <div class="md-toolbar-section-end">
              <template v-if="isAuthenticated">
                      <md-button>
                              <md-avatar>
                                      <img :src="user.avatar" :alt="user.email">
                                      {{user.email}}
                              </md-avatar>
                      </md-button>
                      <md-button>
                              logout
                      </md-button>
              </template>
              <template v-else>
                        <md-button v-if="!isAuthenticated" to="/login">Login</md-button>
                        <md-button v-if="!isAuthenticated" to="/register">Register</md-button>
              </template>
      </div>
    </md-toolbar>
    
    <md-drawer md-fixed :md-active.sync="showleftSideBar">
      <md-toolbar md-elevation="1">
        <span class="md-title">Personal Feed</span>
      </md-toolbar>
      <md-progress-bar v-if="loading" md-mode="indeterminate"></md-progress-bar>

      <md-field>
        <label for="country">Country</label>
        <md-select @input="changeCountry" name="country" id="country">
          <md-option value="us">United States</md-option>
          <md-option value="uk">United Kingdom</md-option>
          <md-option value="de">Germany </md-option>
          <md-option value="ru">Russia </md-option>
        </md-select>
      </md-field>
    </md-drawer>

    <md-drawer class="md-right" md-fixed :md-active.sync="showSidePanel">
      <md-toolbar :md-eleveation="1">
        <span class="md-title">News Categories</span>
      </md-toolbar>
      <md-progress-bar v-if="loading" md-mode="indeterminate">
      </md-progress-bar>
      <md-list>
        <md-subheader>
          <md-list-item
            v-for="(newsCategory, i) in newsCategories"
            :key="i"
            @click="loadCategory(newsCategory.name)"
          >
            <md-icon
              :class="newsCategory.path === category ? `md-primary` : ''"
              >{{ newsCategory.icon }}</md-icon
            >
            <span class="md-list-item-text">{{ newsCategory.name }}</span>
          </md-list-item>
        </md-subheader>
      </md-list>
    </md-drawer>
    <!-- <md-button class="md-accent">click me</md-button> -->
    
      <div class="md-layout-item md-size-95">
        <md-content class="md-layout md-gutter card-inner">
          <ul
            class="
              md-layout-item
              md-large-size-25
              md-medium-size-33
              md-small-size-50
              md-xsmall-size-100
            "
            v-for="headline in headlines"
            :key="headline.id"
          >
            <md-card style="margin-top: 1em" md-with-hover>
              <md-card-media md-ratio="16:9">
                <img
                  src="https://coderbytestaticimages.s3.amazonaws.com/consumer-v2/nav/coderbyte_logo_digital_multi_light.png"
                  :alt="headline.title"
                />
              </md-card-media>
              <md-card-header>
                <div class="md-title">
                  <a :href="headline.url"> {{ headline.name }}</a>
                </div>
                <div>
                  <md-icon class="small-icon"> book </md-icon>
                </div>
                <div>
                  <md-icon class="small-icon">face</md-icon>
                </div>
              </md-card-header>
              <md-card-content>
                {{ headline.description }}
              </md-card-content>
              <md-card-actions>
                <md-button class="md-icon-button">
                  <md-icon> bookmark </md-icon>
                </md-button>
              </md-card-actions>
            </md-card>
            <!-- <li>
              {{ headline }}
            </li> -->
          </ul>
        </md-content>
      </div>
    
  </div>
</template>

<style>
.card-inner {
  background: #007998;
  padding: 1rem;
}
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
.fixed-toolbar {
  position: fixed;
  top: 0;
  z-index: 5;
}
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
<script>
import Logo from "~/components/Logo.vue";

export default {
  data: () => ({
    showSidePanel: false,
    showleftSideBar: false,
    newsCategories: [
      { name: "Top Headlines", path: "", icon: "today" },
      { name: "Technology", path: "technology", icon: "keyboard" },
      { name: "Business", path: "business", icon: "business_center" },
      { name: "Entertainment", path: "entertainment", icon: "fastfood" },
      { name: "Science", path: "science", icon: "fingerprint" },
      { name: "Sports", path: "sports", icon: "golf_course" },
    ],
  }),
  components: {
    Logo,
  },
  async fetch({ store }) {
    await store.dispatch(
      "loadHeadlines",
      `/api/top-headlines/sources?country=${store.state.country}&category=${store.state.category}`
    );
  },
  // watch: {
  //   async country() {
  //     await this.$store.dispatch(
  //       "loadHeadlines",
  //       `/api/top-headlines/sources?country=${store.state.country}&category=${store.state.category}`
  //     );
  //   },
  // },
  computed: {
    headlines() {
      return this.$store.getters.headlines;
    },
    category() {
      return this.$store.getters.category;
    },
    loading() {
      return this.$store.getters.loadingState;
    },
    isAuthenticated(){
            return this.$store.getters.isAuthenticated
    },
    country() {
      return this.$store.getters.country;
    },
    user() {
      return this.$store.getters.user;
    },

  },
  methods: {
    async loadCategory(category) {
      this.$store.commit(`SET_CATEGORY`, category);
      await this.$store.dispatch(
        "loadHeadlines",
        `/api/top-headlines/sources?country=${this.$store.state.country}&category=${this.$store.state.category}`
      );
    },
    changeCountry(country) {
      console.log(country);
      this.$store.commit("SET_COUNTRY", country);
    },
  },
};
</script>
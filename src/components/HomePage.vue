<template>
  <v-app id="inspire">
    <v-navigation-drawer
        v-model="drawer"
        :clipped="$vuetify.breakpoint.lgAndUp"
        app
    >
      <v-list dense>
        <template v-for="item in items">
          <v-row
              v-if="item.heading"
              :key="item.heading"
              align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
          </v-row>
          <v-list-group
              v-else-if="item.children"
              :key="item.text"
              v-model="item.model"
              :prepend-icon="item.model ? item.icon : item['icon-alt']"
              append-icon=""
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
                v-for="(child, i) in item.children"
                :key="i"
                link
            >
              <v-list-item-action v-if="child.icon">
                <v-icon color="black">{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
              v-else
              :key="item.text"
              link
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
        :clipped-left="$vuetify.breakpoint.lgAndUp"
        app
        color="yellow darken-1"
        dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title
          style="width: 300px"
          class="ml-0 pl-4"
      >
        <span class="hidden-sm-and-down">Desafio Unbox</span>
      </v-toolbar-title>
      <v-text-field
          flat
          solo-inverted
          hide-details
          v-model="filter.title"
          prepend-inner-icon="mdi-magnify"
          color="black"
          placeholder="Titulo do Filme"
          class="hidden-sm-and-down"
      ></v-text-field>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main class="ma-5 pa-2">
      <v-container fluid grid-list-xl>
        <v-layout wrap justify-space-around>
          <v-flex v-for="movie in movies" :key="movie.id" class="flex-empty">
            <v-card color="gray" dark width="350px" height="350px">
              <v-card-text>{{ movie.title }}</v-card-text>
              <v-img :src="movie.url" height="250px" />
              <v-card-text > Duração: {{ movie.duration }}</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

    </v-main>
    <v-pagination
        v-if="pagination.total > 1"
        v-model="currentPage"
        :length="pagination.last_page"
        color="black"/>
    <v-dialog
        v-model="dialog"
        width="800px"
    >
      <v-card>
        <v-card-title class="grey darken-2">
          Create contact
        </v-card-title>
        <v-container>
          <v-row class="mx-2">
            <v-col
                class="align-center justify-space-between"
                cols="12"
            >
              <v-row
                  align="center"
                  class="mr-0"
              >
                <v-avatar
                    size="40px"
                    class="mx-3"
                >
                  <img
                      src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                      alt=""
                  >
                </v-avatar>
                <v-text-field
                    placeholder="Name"
                ></v-text-field>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  prepend-icon="mdi-account-card-details-outline"
                  placeholder="Company"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  placeholder="Job title"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  prepend-icon="mdi-mail"
                  placeholder="Email"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  type="tel"
                  prepend-icon="mdi-phone"
                  placeholder="(000) 000 - 0000"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  prepend-icon="mdi-text"
                  placeholder="Notes"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn
              text
              color="primary"
          >More</v-btn>
          <v-spacer></v-spacer>
          <v-btn
              text
              color="primary"
              @click="dialog = false"
          >Cancel</v-btn>
          <v-btn
              text
              @click="dialog = false"
          >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>

import _ from 'lodash'

export default {
  props: {
    source: String,

  },

  data: () => ({
    currentPage: 1,
    filter: {},
    dialog: false,
    drawer: null,
    items: [
      {
        icon: 'mdi-chevron-up',
        'icon-alt': 'mdi-chevron-down',
        text: 'Seções',
        model: false,
        children: [
          { text: 'Terror' },
          { text: 'Suspense' },
          { text: 'Ação' }
        ],
      }
    ],
    movies: [],
    pagination: {}
  }),

  mounted() {
    this.getMovies()
  },

  methods: {
    getMovies (filter = '') {
      this.$http.get('/movie' + filter)
        .then(response => {
          this.pagination = response.data.data
          this.movies = response.data.data.data
        })
        .catch(error => console.log(error))
    },
  },

  watch: {
    filter: {
      handler: _.debounce(function (val) {
        if (val) {
          const queryString = Object.keys(val).map(key => key + ':' + val[key]).join(';')
          return this.getMovies('?search=' + queryString)
        }
      }, 500),
      deep: true
    },
    currentPage: function (val) {
      this.getMovies('?page=' + val)
    }
  },
}
</script>


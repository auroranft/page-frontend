<script setup lang="ts">
const route = useRoute()

const navList = [
  {
    id: 1,
    name: 'Marketplace',
    url: 'marketplace'
  },
  // {
  //   id: 2,
  //   name: 'Limited',
  //   url: 'limited'
  // },
  // {
  //   id: 3,
  //   name: 'Auction',
  //   url: 'auction'
  // },
  {
    id: 4,
    name: 'Create',
    url: 'create'
  }
]
</script>

<template>
  <header class="p-3 mb-3 border-bottom navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container-fluid">
      <div class="d-flex flex-wrap align-items-center justify-content-between">
        <div class="d-flex flex-wrap align-items-center justify-content-lg-start justify-content-between">
          <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-light text-decoration-none">
            <img src="@/assets/images/logo.png" alt="nft" width="40" height="40" />
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 mb-md-0">
              <li v-for="item in navList">
                <a :href="`/${item.url}`" :class="`nav-link px-2 link-light ${item.url === route.name ? 'active' : ''}`">{{ item.name }}</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
          <input type="search" class="form-control" placeholder="Search..." aria-label="Search">
        </form> -->

        <Web3ConnectBtn />
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav {
  font-weight: 500;
}
.active {
  text-decoration: underline;
}
.dropdown-toggle {
  outline: 0;
}
</style>
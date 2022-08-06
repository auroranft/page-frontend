<script setup lang="ts">
import { DAO, USDT, DST } from '@/constants/tokensAddress'

const tokenList = [DAO, USDT, DST];

definePageMeta({
  title: 'Account'
});
</script>

<template>
  <main>
    <div class="container py-5">
      <div class="card">
        <h4 class="card-header">
          <i class="bi bi-wallet-fill"></i>
          Wallet Info
        </h4>
        <div class="card-body">
          <p class="card-text">Account Address: <Web3Account /></p>
          <p class="card-text">Account Balance: <Web3Balance /></p>
        </div>
      </div>

      <hr class="my-4">

      <div class="card">
        <h4 class="card-header">
          <i class="bi bi-list-task"></i>
          Token List
        </h4>
        <div class="card-body">
          <Web3TokenBalance v-for="(token, index) in tokenList" :key="index" :tokenAddress="token" />
        </div>
      </div>
    </div>
  </main>
</template>
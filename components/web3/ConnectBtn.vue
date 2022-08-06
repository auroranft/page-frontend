<script setup lang="ts">
const { active, account, deactivate } = useWeb3();
</script>

<template>
  <div>
    <div class="dropdown text-end" v-if="active">
      <a href="#" class="d-block link-light text-decoration-none dropdown-toggle" id="dropdownAccount" data-bs-toggle="dropdown" aria-expanded="false">
        <img src="@/assets/images/avatar.png" alt="account" width="32" height="32" class="rounded-circle">
        {{ $truncateAccount(account)}}
      </a>
      <ul class="dropdown-menu text-small" aria-labelledby="dropdownAccount">
        <li><a class="dropdown-item disabled" href="/account"><i class="bi bi-person-circle"></i> My Account</a></li>
        <li><a class="dropdown-item" href="/account/nfts"><i class="bi bi-columns-gap"></i> My NFTs</a></li>
        <li><a class="dropdown-item" href="/account/wallet"><i class="bi bi-wallet-fill"></i> My wallet</a></li>
        <li><a class="dropdown-item disabled" href="/account/preferences"><i class="bi bi-gear-fill"></i> Preferences</a></li>
        <li><a class="dropdown-item" href="/account/manage"><i class="bi bi-kanban"></i> Manage</a></li>
        <li><hr class="dropdown-divider" /></li>
        <li><button class="dropdown-item" type="button" @click="deactivate"><i class="bi bi-box-arrow-right"></i> Disconnect</button></li>
      </ul>
    </div>
    <div v-else>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalConnectAccount">
        Connect Account
      </button>
    </div>
  </div>
</template>
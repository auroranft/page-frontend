<script setup lang="ts">
import { AbiItem } from 'web3-utils'
import { MarketContractAddress } from '@/constants/index';
import MarketABI from '~~/constants/abis/Market_abi.json';

import { defalutCollectionForm } from '@/constants/interface/Collection'

const { account, library, chainId } = useWeb3();
watch([account, library, chainId], () => {
  if (!!account.value && !!library.value && !!chainId.value) {
    getBaseInfo();
  }
});

// 加载状态
const loading = useLoading();
// 提交状态
const isSubmit = useSubmit();
const timestamp = useTimestamp();

// 表单字段
const formModel = defalutCollectionForm;

function createCollection() {
  isSubmit.value = true;
  loading.value = true;

  formModel.royalty = currentRoyaltyRate.value;

  if (formModel.name
    && formModel.symbol
    && formModel.verifyRights
    && formModel.agreenTerms
  ) {
    const contract = new library.value.eth.Contract(MarketABI as AbiItem[], MarketContractAddress[chainId.value]);
    contract.methods.addCollection(
      formModel.name,
      formModel.symbol,
      formModel.royalty
    ).send({ from: account.value })
    .on('error', function() {
      loading.value = false;
      document.getElementById('closeModalAddCollection').click();
     })
    .then(() => {
      timestamp.value = Date.parse(new Date().toString());
      loading.value = false;
      document.getElementById('closeModalAddCollection').click();
    })
  } else {
    loading.value = false;
  }
}

// 获取基本信息
const currentRoyaltyRate = ref<number>(0);
const maxRoyaltyRate = ref<number>(0);
async function getBaseInfo() {
  const contract = new library.value.eth.Contract(MarketABI as AbiItem[], MarketContractAddress[chainId.value]);
  maxRoyaltyRate.value = await contract.methods.maxRoyaltyRate().call({ from: account.value });
}

function changeRoyalty(e: any) {
  currentRoyaltyRate.value = e.target.value;
}

onMounted(() => {
  getBaseInfo();
});

</script>

<template>
  <div style="display: inline-block;">
    <button
      type="button"
      class="btn btn-outline-primary"
      style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
      data-bs-toggle="modal"
      data-bs-target="#modalAddCollection"
    >
      <i class="bi bi-plus"></i>
    </button>
    <div class="modal fade" id="modalAddCollection" tabindex="-1" aria-labelledby="modalAddCollectionLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalAddCollectionLabel">Create New Collection</h5>
            <button id="closeModalAddCollection" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row g-5">
              <div class="col">
                <p class="fw-lighter">When creating a new collection, you are deploying your own contract to the blockchain! NFTrade charges zero platform transaction fees, so you only need to pay for the network gas fees. This is a collection under your own unique contract, meaning you are the owner of the contract and you'll be able to add as many NFTs to that collection as you'd like. Your minted tokens will receive incremental IDs starting from 1, increasing with each new NFT in the collection.</p>
                <p class="fw-lighter">Since this is a unique contract address, you will have the opportunity to verify your collection later on.</p>
                <form :class="`needs-validation ${isSubmit ? 'was-validated' : ''}`" novalidate>

                  <div class="my-4">
                    <label for="name" class="form-label">Name</label>
                    <p class="fw-lighter">Crypto Punks / Meebits / etc..</p>
                    <input type="text" class="form-control" id="name" placeholder="Enter the collection's name" v-model="formModel.name" required>
                    <div class="invalid-feedback">
                      You must choose a name
                    </div>
                  </div>

                  <div class="my-4">
                    <label for="symbol" class="form-label">Symbol</label>
                    <p class="fw-lighter">CPNKS / MBTS / etc..</p>
                    <input type="text" class="form-control" id="symbol" placeholder="Enter the collection's symbol" v-model="formModel.symbol" required>
                    <div class="invalid-feedback">
                      You must choose a symbol
                    </div>
                  </div>

                  <div class="my-4">
                    <label for="royaltyRate" class="form-label">RoyaltyRate: {{ currentRoyaltyRate }} %</label>
                    <input type="range" class="form-range" min="0" :max="maxRoyaltyRate" step="1" id="royaltyRate" :value="currentRoyaltyRate" @change="changeRoyalty" required>
                  </div>

                  <div class="my-4"></div>

                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="verifyRights" v-model="formModel.verifyRights" required>
                    <label class="form-check-label fw-lighter" for="verifyRights">I verify I am minting a unique collection and that this is not a reproduction, stolen intellectual property, or a scam.</label>
                  </div>

                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="agreenTerms" v-model="formModel.agreenTerms" required>
                    <label class="form-check-label fw-lighter" for="agreenTerms">I approve NFTrade's Terms & Conditions</label>
                  </div>

                  <hr class="my-4">

                  <button class="w-100 btn btn-primary btn-lg" type="button" :disabled="loading" @click="createCollection">
                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    {{ loading ? 'Loading...' : 'Create Collection' }}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
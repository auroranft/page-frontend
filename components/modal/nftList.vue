<script setup lang="ts">
// import { Datepicker } from 'vanillajs-datepicker';
import { AbiItem } from 'web3-utils'
import { MarketContractAddress, TokenAddressERC20 } from '@/constants/index';
import MarketABI from '~~/constants/abis/Market_abi.json';
import TokenERC721ABI from '~~/constants/abis/TokenERC721_abi.json';

import { INftListItem } from '@/constants/interface/Nft';

// nft info
const nftInfo = ref<INftListItem>();

interface NftListProps {
  nftInfo: INftListItem
}
const props = defineProps<NftListProps>();
nftInfo.value = props.nftInfo;


// 加载状态
const loading = useLoading();
// 提交状态
const isSubmit = useSubmit();
const timestamp = useTimestamp();

const { account, library, chainId } = useWeb3();
watch([account], () => {
  if (!!account.value && !!library.value && !!chainId.value) {
    getBaseInfo();
  }
});

// 表单字段
interface IFormModel {
  token: string,
  tokenId: number,
  isBid: boolean,
  payToken: string,
  payAmount: number,
  bonusRate?: number,
  endTime?: number,
  agreenTerms: boolean,
}
const formModel = ref<IFormModel>({
  token: nftInfo.value.token,
  tokenId: nftInfo.value.tokenId,
  isBid: false,
  payToken: null,
  payAmount: null,
  bonusRate: 0,
  endTime: Date.parse(new Date().toString()) / 1000 + 10 * 60,
  agreenTerms: false,
});

// 获取基本信息
const isBid = ref<boolean>(true);
const currentBonusRate = ref<number>(0);
const maxBonusRate = ref<number>(0);
async function getBaseInfo() {
  formModel.value.token = nftInfo.value.token;
  formModel.value.tokenId = nftInfo.value.tokenId;
  formModel.value.payToken = TokenAddressERC20[chainId.value];

  const contract = new library.value.eth.Contract(MarketABI as AbiItem[], MarketContractAddress[chainId.value]);
  maxBonusRate.value = await contract.methods.maxBonusRate().call({ from: account.value });
  // 获取最新信息
  const newNftInfo = await contract.methods.nftById(nftInfo.value.nftId).call();
  const tempItem = {
    ...nftInfo,
    ...newNftInfo,
  };
  nftInfo.value = tempItem;
}
function changeBid(bid: boolean) {
  isBid.value = bid;
}

function changeBonus(e: any) {
  currentBonusRate.value = e.target.value;
}

// NFT list
async function nftList() {
  isSubmit.value = true;
  loading.value = true;

  if (formModel.value.token
    && formModel.value.tokenId
    && formModel.value.payToken
    && formModel.value.payAmount
    && formModel.value.agreenTerms
  ) {
    formModel.value.isBid = isBid.value;

    // NFT 授权
    const contractForNFT = new library.value.eth.Contract(TokenERC721ABI as AbiItem[], nftInfo.value.token);
    const isApprovedForAll = await contractForNFT.methods.isApprovedForAll(account.value, MarketContractAddress[chainId.value]).call();
    if (!isApprovedForAll) {
      await contractForNFT.methods.setApprovalForAll(MarketContractAddress[chainId.value], true).send({ from: account.value });
    }
    // list
    const contract = new library.value.eth.Contract(MarketABI as AbiItem[], MarketContractAddress[chainId.value]);
    contract.methods.list(
      formModel.value.token,
      formModel.value.tokenId,
      formModel.value.isBid,
      formModel.value.payToken,
      library.value.utils.toWei(formModel.value.payAmount.toString(), 'ether'),
      formModel.value.bonusRate,
      formModel.value.endTime
    )
    .send({ from: account.value })
    .then(() => {
      loading.value = false;
      timestamp.value = Date.parse(new Date().toString());
      document.getElementById('closeModalNftList').click();
    }).catch((e: any) => {
      console.info(e);
      loading.value = false;
    })
  } else {
    loading.value = false;
  }
}

onMounted(() => {
  getBaseInfo();

  // const elem = document.querySelector('input[name="endTime"]');
  // const datepicker = new Datepicker(elem, {
  //   // ...options
  // }); 
});

</script>

<template>
  <div style="display: inline-block;">
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#modalNftList"
      :disabled="nftInfo.onSale"
    >
      List
    </button>
    <div class="modal fade" id="modalNftList" tabindex="-1" aria-labelledby="modalNftListLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalNftListLabel">NFT List</h5>
            <button id="closeModalNftList" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row g-5">
              <div class="col">
                <form :class="`needs-validation ${isSubmit ? 'was-validated' : ''}`" novalidate>
                  <div class="my-4">
                    <label for="token" class="form-label">Token</label>
                    <input type="text" readonly class="form-control-plaintext" id="token" v-model="formModel.token" required>
                    <div class="invalid-feedback">
                      You must input token
                    </div>
                  </div>

                  <div class="my-4">
                    <label for="tokenId" class="form-label">TokenId</label>
                    <input type="text" readonly class="form-control-plaintext" id="tokenId" v-model="formModel.tokenId" required>
                    <div class="invalid-feedback">
                      You must input tokenId
                    </div>
                  </div>

                  <div class="my-4">
                    <label for="payToken" class="form-label">PayToken</label>
                    <input type="text" readonly class="form-control-plaintext" id="payToken" v-model="formModel.payToken" required>
                    <div class="invalid-feedback">
                      You must input payToken
                    </div>
                  </div>

                  <div class="my-4">
                    <label for="payAmount" class="form-label">PayAmount</label>
                    <input type="number" class="form-control" id="payAmount" v-model="formModel.payAmount" required>
                    <div class="invalid-feedback">
                      You must input payAmount
                    </div>
                  </div>

                  <div class="my-4">
                    <label for="isBid" class="form-label">Bid</label>
                    <div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="isBid" id="bidLimited" :value="false" :checked="!isBid" @change="changeBid(false)">
                        <label class="form-check-label" for="bidLimited">Limited</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="isBid" id="bidAuction" :value="true" :checked="isBid" @change="changeBid(true)">
                        <label class="form-check-label" for="bidAuction">Auction</label>
                      </div>
                    </div>
                  </div>

                  <div class="my-4" v-if="isBid">
                    <label for="bonusRate" class="form-label">Bonus Rate: {{ currentBonusRate }} %</label>
                    <input type="range" class="form-range" min="0" :max="maxBonusRate" step="1" id="bonusRate" v-model="formModel.bonusRate" @change="changeBonus" :required="isBid">
                  </div>

                  <div class="my-4" v-if="isBid">
                    <label for="endTime" class="form-label">EndTime</label>
                    <input type="number" class="form-control" id="endTime" v-model="formModel.endTime" :required="isBid">
                    <div class="invalid-feedback">
                      You must input endTime
                    </div>

                    <!-- <ClientOnly>
                      <input type="text" name="endTime">
                    </ClientOnly> -->
                    <!-- <i class="bi bi-calendar-date input-group-text"></i>
                    <label for="endTime" class="form-label">EndTime</label>
                    <date-picker locale="en" type="datetime" mode="single" />
                    <input type="text" id="endTime" class="datepicker_input form-control" placeholder="Please input end time" :required="isBid">
                    <div class="invalid-feedback">
                      You must input endTime
                    </div> -->
                  </div>

                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="agreenTerms" v-model="formModel.agreenTerms" required>
                    <label class="form-check-label fw-lighter" for="agreenTerms">I approve NFTrade's Terms & Conditions</label>
                  </div>

                  <hr class="my-4">

                  <button class="w-100 btn btn-primary btn-lg" type="button" :disabled="loading" @click="nftList">
                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    {{ loading ? 'Loading...' : 'NFT List' }}
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
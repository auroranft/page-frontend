<script setup lang="ts">
import { JSBI } from '@/constants/jsbi';
import { AbiItem } from 'web3-utils'
import { MarketContractAddress, ipfsUploadDomain, ipfsUploadPort, ipfsFilePrefix } from '@/constants/index';
import TokenERC721ABI from '~~/constants/abis/TokenERC721_abi.json';
import MarketABI from '~~/constants/abis/Market_abi.json';
import TokenERC20ABI from '~~/constants/abis/TokenERC20_abi.json';
import { create as ipfsHttpClient } from 'ipfs-http-client'

import { ICollectionItem } from '@/constants/interface/Collection'
import { INftProperty, defalutNftForm } from '@/constants/interface/Nft'

const commonURI = 'https://ipfs.infura.io/ipfs/QmUC4RmLypFruXTFNn51ZuqAmt4BFzLEpm8n3Wjg3sLP1a';

const client = ipfsHttpClient({ url: ipfsUploadDomain + ipfsUploadPort + '/api/v0' });

const { account, library, chainId } = useWeb3();
const router = useRouter();

// 引用plugin
const { $compare } = useNuxtApp()

// 加载状态
const loading = useLoading();
// 提交状态
const isSubmit = useSubmit();
const timestamp = useTimestamp();
// 初始化表单参数
const formModel = defalutNftForm;

watch([account, library, timestamp], () => {
  if (!!library.value && !!account.value) {
    refreshCollection();
    queryBalanceAndApprove();
  }
});

const newNFTFeeToken = ref<string>(null);
const newNFTFeeAmount = ref<string>('0');
const ableBalance = ref<boolean>(false);
const ableApprove = ref<boolean>(false);
// 查询余额与授权
async function queryBalanceAndApprove() {
  const marketContractAddress = MarketContractAddress[chainId.value];
  // 获取配置代币信息
  const marketContract = new library.value.eth.Contract(MarketABI as AbiItem[], marketContractAddress);
  newNFTFeeToken.value = await marketContract.methods.newNFTFeeToken().call();
  newNFTFeeAmount.value = await marketContract.methods.newNFTFeeAmount().call();
  // 获取当前账户余额
  const erc20Contract = new library.value.eth.Contract(TokenERC20ABI as AbiItem[], newNFTFeeToken.value);
  const balance = await erc20Contract.methods.balanceOf(account.value).call();
  if (JSBI.greaterThanOrEqual(JSBI.BigInt(balance), JSBI.BigInt(newNFTFeeAmount.value))) {
    ableBalance.value = true;
  } else {
    ableBalance.value = false;
  }
  // 获取当前账户授权额度
  const allowance = await erc20Contract.methods.allowance(account.value, marketContractAddress).call();
  if (JSBI.greaterThanOrEqual(JSBI.BigInt(allowance), JSBI.BigInt(newNFTFeeAmount.value))) {
    ableApprove.value = true;
  } else {
    ableApprove.value = false;
  }
}

// 专辑列表
const collectionList = ref<ICollectionItem[]>([]);
// 刷新专辑列表
function refreshCollection() {
  const contract = new library.value.eth.Contract(MarketABI as AbiItem[], MarketContractAddress[chainId.value]);
  collectionList.value = [];
  contract.methods.getCollectionTokenList()
  .call({ from: account.value })
  .then(async (tokenList: string[]) => {
    if (tokenList.length > 0) {
      const getResult = tokenList.map(async (item: string) => {
        const collection = await contract.methods.collectionMap(item).call();
        if (collection.owner === account.value) {
          collectionList.value.push(collection);
        }
      })
      await Promise.all(getResult);
      if (collectionList.value.length > 0) {
        collectionList.value.sort($compare("createTime"));
        formModel.collection = collectionList.value[0].token;
      }
    }
  })
}

// 上传LOGO
async function uploadLogo(e: any) {
  loading.value = true;
  const file = e.target.files[0];
  try {
    const added = await client.add(
      file,
      {
        progress: (prog) => console.log(`received: ${prog}`)
      }
    );
    const url = `${ipfsUploadDomain}${ipfsFilePrefix}/${added.path}`;
    formModel.fileUrl = url;
    loading.value = false;
  } catch (error) {
    console.log('Error uploading file: ', error);
    formModel.fileUrl = null;
    loading.value = false;
  }
}

// 属性
const propertiesList = useState<INftProperty[]>('propertiesList', () => [{
  property: null,
  value: null,
}]);
// 属性修改
function changeProperties(e: any, name: string, index: number) {
  if (name === 'property') {
    propertiesList.value[index].property = e.target.value;
  } else if (name === 'value') {
    propertiesList.value[index].value = e.target.value;
  }
  if (propertiesList.value[index].property && propertiesList.value[index].value) {
    if (!propertiesList.value[index + 1]) {
      propertiesList.value.push({
        property: null,
        value: null,
      });
    }
  }
  if (!propertiesList.value[index].property || !propertiesList.value[index].value) {
    const propertiesListLength = propertiesList.value.length;
    if (propertiesListLength > (index + 1) && !propertiesList.value[propertiesListLength - 1].property && !propertiesList.value[propertiesListLength - 1].value) {
      propertiesList.value.pop();
    }
  }
}

// 创建NFT
async function createNft() {
  isSubmit.value = true;
  loading.value = true;
  if (formModel.fileUrl
    && formModel.name
    && formModel.collection
    && formModel.approveRights
    && formModel.agreenTerms
  ) {
    if (propertiesList.value.length > 0) {
      propertiesList.value.map(item => {
        if (item.property && item.value) {
          formModel.properties.push(item);
        }
      });
    }
    const data = JSON.stringify(formModel);
    try {
      const added = await client.add(data);
      const url = `${ipfsUploadDomain}${ipfsFilePrefix}/${added.path}`;
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      const marketContractAddress = MarketContractAddress[chainId.value];
      // 先判断是否有权限
      const contractForNFT = new library.value.eth.Contract(TokenERC721ABI as AbiItem[], formModel.collection);
      const mintRole = await contractForNFT.methods.MINTER_ROLE().call();
      const hasRole = await contractForNFT.methods.hasRole(mintRole, marketContractAddress).call();
      if (!hasRole) {
        await contractForNFT.methods.grantRole(mintRole, marketContractAddress).send({ from: account.value });
      }
      // NFT 授权
      const isApprovedForAll = await contractForNFT.methods.isApprovedForAll(account.value, MarketContractAddress[chainId.value]).call();
      if (!isApprovedForAll) {
        await contractForNFT.methods.setApprovalForAll(MarketContractAddress[chainId.value], true).send({ from: account.value });
      }
      // Mint
      const contract = new library.value.eth.Contract(MarketABI as AbiItem[], MarketContractAddress[chainId.value]);
      contract.methods.newNFT(formModel.collection, account.value, url).send({
        from: account.value
      }).then((value) => {
        queryBalanceAndApprove();
        loading.value = false;
        router.push('/account/nfts');
      }).catch((e: any) => {
        loading.value = false;
        // router.push('/account/nfts');
      });
    } catch (error) {
      console.log('Error uploading file: ', error);
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
}

// 创建NFT-测试
async function createNftTest() {
  loading.value = true;
  if (!!account.value && !!chainId.value && formModel.collection) {
    try {
      // ERC20 授权
      if (!ableApprove.value) {
        const erc20Contract = new library.value.eth.Contract(TokenERC20ABI as AbiItem[], newNFTFeeToken.value);
        await erc20Contract.methods.approve(MarketContractAddress[chainId.value], newNFTFeeAmount.value).send({ from: account.value });
        ableApprove.value = true;
      }
      // Mint
      const contract = new library.value.eth.Contract(MarketABI as AbiItem[], MarketContractAddress[chainId.value]);
      await contract.methods.newNFT(formModel.collection, account.value, commonURI).send({ from: account.value });
      queryBalanceAndApprove();
      loading.value = false;
    } catch(e: any) {
      console.info(e);
      loading.value = false;
    }



    // const marketContractAddress = MarketContractAddress[chainId.value];
    // // 先判断是否有权限
    // const contractForNFT = new library.value.eth.Contract(TokenERC721ABI as AbiItem[], formModel.collection);
    // const mintRole = await contractForNFT.methods.MINTER_ROLE().call();
    // const hasRole = await contractForNFT.methods.hasRole(mintRole, marketContractAddress).call();
    // if (!hasRole) {
    //   await contractForNFT.methods.grantRole(mintRole, marketContractAddress).send({ from: account.value });
    // }
    // // NFT 授权
    // const isApprovedForAll = await contractForNFT.methods.isApprovedForAll(account.value, MarketContractAddress[chainId.value]).call();
    // if (!isApprovedForAll) {
    //   await contractForNFT.methods.setApprovalForAll(MarketContractAddress[chainId.value], true).send({ from: account.value });
    // }
    // // Mint
    // const contract = new library.value.eth.Contract(MarketABI as AbiItem[], MarketContractAddress[chainId.value]);
    // contract.methods.newNFT(formModel.collection, account.value, commonURI).send({
    //   from: account.value
    // }).then(() => {
    //   queryBalanceAndApprove();
    //   loading.value = false;
    // }).catch((e: any) => {
    //   loading.value = false;
    // })
  } else {
    loading.value = false;
  }
}

onMounted(() => {
  if (!!library.value && !!account.value && !!chainId.value) {
    refreshCollection();
    queryBalanceAndApprove();
  }
});
</script>

<template>
  <div v-if="account">
    <div class="pb-5 text-center">
      <h2>Create NFTs</h2>
      <p class="lead fw-lighter">NFTs can represent essentially any type of digital file, with artists creating NFTs featuring pictures, videos, gifs, audio files, and mixtures of them all. There are also utility NFT tokens, which provide a good or service and contain inherent value coded within them, what's your vision?</p>
    </div>

    <div class="row g-5">
      <div class="col">
        <form :class="`needs-validation ${isSubmit ? 'was-validated' : ''}`" novalidate>
          <div class="row g-3">
            <div class="col-12">
              <label for="uploadFile" class="form-label">Upload File</label>
              <p class="fw-lighter">Add your unique image / video / audio file</p>
              <input class="form-control" type="file" id="uploadFile" @change="uploadLogo" required>
              <div v-if="formModel.fileUrl" class="text-center">
                <img :src="formModel.fileUrl" class="rounded" alt="">
              </div>
              <div class="invalid-feedback">
                You must upload a file
              </div>
            </div>

            <div class="col-12">
              <label for="name" class="form-label">Name</label>
              <p class="fw-lighter">Choose a unique name for your NFT</p>
              <input type="text" class="form-control" id="name" placeholder="Enter the NFT's name" v-model="formModel.name" required>
              <div class="invalid-feedback">
                You must choose a name
              </div>
            </div>

            <div class="col-12">
              <label for="description" class="form-label">Description</label>
              <p class="fw-lighter">Describe your NFT, help other users understand what's unique about it</p>
              <textarea class="form-control" id="description" rows="3" placeholder="Enter the NFT's description" v-model="formModel.description"></textarea>
            </div>

            <div class="col-12">
              <label for="properties" class="form-label">Properties</label>
              <p class="fw-lighter">List attributes that represents your NFT (color, shape, mood, etc..)</p>
              <div class="row my-3" v-for="(item, index) in propertiesList" :key="index">
                <div class="col-6">
                  <input type="text" class="form-control" :id="`property-${index}`" placeholder="Property" @input="changeProperties($event, 'property', index)" :value="item.property">
                </div>
                <div class="col-6">
                  <input type="text" class="form-control" :id="`value-${index}`" placeholder="Value" @input="changeProperties($event, 'value', index)" :value="item.value">
                </div>
              </div>
            </div>

            <div class="col-12">
              <label for="collection" class="form-label">
                Collection 
                <ClientOnly><ModalAddCollection /></ClientOnly>
              </label>
              <p class="fw-lighter">The collection where your NFT will appear.</p>
              <div class="input-group has-validation">
                <select class="form-select" id="collection" v-model="formModel.collection" aria-label="Select a Collection" placeholder="Select a Collection" required>
                  <option v-for="item in collectionList" :key="item.token" :value="item.token">{{ item.name }}</option>
                </select>
                <button class="btn btn-outline-secondary" type="button" @click="refreshCollection">
                  <i class="bi bi-arrow-repeat"></i>
                </button>
                <div class="invalid-feedback">
                  You must choose / create a collection
                </div>
              </div>
            </div>
          </div>

          <hr class="my-4">

          <p class="fw-semibold fst-italic">Note, the process of minting an NFT is an irreversible process, make sure all the above details are right.</p>

          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="approveRights" v-model="formModel.approveRights" required>
            <label class="form-check-label fw-lighter" for="approveRights">I approve that I'm the owner or have the rights of publication and sale.</label>
          </div>

          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="agreenTerms" v-model="formModel.agreenTerms" required>
            <label class="form-check-label fw-lighter" for="agreenTerms">I approve NFTrade's Terms & Conditions</label>
          </div>

          <hr class="my-4">

          <button v-if="ableBalance" class="w-100 btn btn-primary btn-lg" type="button" :disabled="loading" @click="createNftTest">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ loading ? 'Loading...' : 'Create' }}
          </button>
          <!-- <button v-else-if="ableBalance && !ableApprove" class="w-100 btn btn-primary btn-lg" type="button" :disabled="loading" @click="approve">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ loading ? 'Loading...' : 'Approve' }}
          </button> -->
          <button v-else-if="!ableBalance" class="w-100 btn btn-primary btn-lg" type="button" disabled>
            Insufficient Balance
          </button>
        </form>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="pb-5 text-center">
      <Web3ConnectBtn />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AbiItem } from 'web3-utils'
import { AuroranNFTDataContractAddress, AuroranMarketContractAddress, AuroranNFTQueryContractAddress, CollectionRoleList } from '@/constants/index';
import AuroranNFTDataABI from '~~/constants/abis/AuroranNFTData.json';

// 加载状态
const loading = useLoading();
// 提交状态
const isSubmit = useSubmit();

const formRole = ref<string>(null);
const formAccount = ref<string>(null);
const accountIsValid = ref<boolean>(false);

const { account, library, chainId } = useWeb3();
watch([account, library, chainId], () => {
  if (!!library.value && !!account.value && !!chainId.value) {
    // getCollectionRole();
    // formAccount.value = AuroranMarketContractAddress[chainId.value];
    formAccount.value = AuroranNFTQueryContractAddress[chainId.value];
  }
});

// // 获取专辑角色值
// const roleManageValue = ref<string>('');
// async function getCollectionRole() {
//   loading.value = true;
//   // const contract = new library.value.eth.Contract(AuroranNFTDataABI as AbiItem[], AuroranMarketContractAddress[chainId.value]);
//   // roleManageValue.value = await contract.methods.MANAGER_ROLE().call();
//   const contract = new library.value.eth.Contract(AuroranNFTDataABI as AbiItem[], AuroranNFTDataContractAddress[chainId.value]);
//   roleManageValue.value = await contract.methods.QUERY_ROLE().call();
//   console.info(roleManageValue.value);

//   loading.value = false;
// }

onMounted(() => {
  // getCollectionRole();
    formAccount.value = AuroranNFTQueryContractAddress[chainId.value];
});

function checkAddress() {
  if (!formAccount.value) {
    accountIsValid.value = false;
  } else {
    try {
      formAccount.value = library.value.utils.toChecksumAddress(formAccount.value);
      accountIsValid.value = false;
    } catch (error) {
      accountIsValid.value = true;
    }
  }
}

// 查看是否拥有管理权限
const HasRoleApprove = ref<boolean>(false);
async function query() {
  isSubmit.value = true;
  loading.value = true;
  try {
    const contract = new library.value.eth.Contract(AuroranNFTDataABI as AbiItem[], AuroranNFTDataContractAddress[chainId.value]);
    HasRoleApprove.value = await contract.methods.hasRole(formRole.value, library.value.utils.toChecksumAddress(formAccount.value)).call();
  } catch (error) {
    accountIsValid.value = true;
    setTimeout(() => {
      accountIsValid.value = false;
    }, 3000);
  }

  isSubmit.value = false;
  loading.value = false;
}

async function approve() {
  isSubmit.value = true;
  loading.value = true;
  try {
    const contract = new library.value.eth.Contract(AuroranNFTDataABI as AbiItem[], AuroranNFTDataContractAddress[chainId.value]);
    if (HasRoleApprove.value) {
      await contract.methods.revokeRole(library.value.utils.toChecksumAddress(formAccount.value)).send({ from: account.value });
    } else {
      await contract.methods.grantRole(formRole.value, library.value.utils.toChecksumAddress(formAccount.value)).send({ from: account.value });
    }
  } catch (error) {
    accountIsValid.value = true;
    setTimeout(() => {
      accountIsValid.value = false;
    }, 3000);
  }

  isSubmit.value = false;
  loading.value = false;
}

</script>

<template>
  <div class="py-3">
    <div class="container">
      <h4>NFTData Approve</h4>
      <div v-if="accountIsValid" class="alert alert-danger fade show" role="alert">
        Address is invalid!!!
      </div>
      <form :class="`needs-validation ${isSubmit ? 'was-validated' : ''}`" novalidate>
        <div class="mb-3">
          <label for="role" class="form-label">
            Role
          </label>
          <select class="form-select" id="role" v-model="formRole" aria-label="Select a Role" placeholder="Select a Role" required>
            <option v-for="item in CollectionRoleList" :key="item.value" :value="item.value">{{ item.name }}</option>
          </select>
          <div class="invalid-feedback">
            You must choose a role
          </div>
        </div>
        <div class="mb-3">
          <label for="account" class="form-label">Account</label>
          <input class="form-control" id="account" v-model="formAccount" placeholder="Required Account Address" @input="checkAddress" required>
          <div class="invalid-feedback">
            Required Account Address
          </div>
        </div>
        <div class="mb-3">
          <label for="account" class="form-label">Result: {{ HasRoleApprove }}</label>
        </div>

        <div class="mb-3">
          <button class="btn btn-primary" type="button" :disabled="!formRole || !formAccount || loading || accountIsValid" @click="query">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ loading ? 'Loading...' : 'Query' }}
          </button>
          <button class="btn btn-danger ms-3" type="button" :disabled="!formRole || !formAccount || loading || accountIsValid" @click="approve">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ loading ? 'Loading...' :  HasRoleApprove ? 'Remove' : 'Approve' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

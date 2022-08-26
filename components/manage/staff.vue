<script setup lang="ts">
import { AbiItem } from 'web3-utils'
import { AuroranMarketContractAddress } from '@/constants/index';
import AuroranMarketABI from '~~/constants/abis/AuroranMarket.json';

// 加载状态
const loading = useLoading();
// 提交状态
const isSubmit = useSubmit();

const formAccount = ref<string>(null);
const accountIsValid = ref<boolean>(false);

const { account, library, chainId } = useWeb3();
watch([account, library, chainId], () => {
  if (!!library.value && !!account.value && !!chainId.value) {
    getCollectionRole();
  }
});

// 获取专辑角色值
const roleManageValue = ref<string>('');
async function getCollectionRole() {
  loading.value = true;
  const contract = new library.value.eth.Contract(AuroranMarketABI as AbiItem[], AuroranMarketContractAddress[chainId.value]);
  roleManageValue.value = await contract.methods.MANAGER_ROLE().call();

  loading.value = false;
}

onMounted(() => {
  getCollectionRole();
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
const CollectionIsManage = ref<boolean>(false);
async function query() {
  isSubmit.value = true;
  loading.value = true;
  try {
    const contract = new library.value.eth.Contract(AuroranMarketABI as AbiItem[], AuroranMarketContractAddress[chainId.value]);
    CollectionIsManage.value = await contract.methods.hasRole(roleManageValue.value, library.value.utils.toChecksumAddress(formAccount.value)).call();
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
    const contract = new library.value.eth.Contract(AuroranMarketABI as AbiItem[], AuroranMarketContractAddress[chainId.value]);
    if (CollectionIsManage.value) {
      await contract.methods.removeManager(library.value.utils.toChecksumAddress(formAccount.value)).send({ from: account.value });
    } else {
      await contract.methods.addManager(library.value.utils.toChecksumAddress(formAccount.value)).send({ from: account.value });
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
      <h4>Staff Manage</h4>
      <div v-if="accountIsValid" class="alert alert-danger fade show" role="alert">
        Address is invalid!!!
      </div>
      <form :class="`needs-validation ${isSubmit ? 'was-validated' : ''}`" novalidate>
        <div class="mb-3">
          <label for="account" class="form-label">Account</label>
          <input class="form-control" id="account" v-model="formAccount" placeholder="Required Account Address" @input="checkAddress" required>
          <div class="invalid-feedback">
            Required Account Address
          </div>
        </div>
        <div class="mb-3">
          <label for="account" class="form-label">Result: {{ CollectionIsManage }}</label>
        </div>

        <div class="mb-3">
          <button class="btn btn-primary" type="button" :disabled="!formAccount || loading || accountIsValid" @click="query">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ loading ? 'Loading...' : 'Query' }}
          </button>
          <button class="btn btn-danger ms-3" type="button" :disabled="!formAccount || loading || accountIsValid" @click="approve">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ loading ? 'Loading...' :  CollectionIsManage ? 'Remove' : 'Approve' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

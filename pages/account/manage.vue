<script setup lang="ts">
import { AbiItem } from 'web3-utils'
import { AuroranNFTDataContractAddress } from '@/constants/index';
import AuroranNFTDataABI from '~~/constants/abis/AuroranNFTData.json';

definePageMeta({
  title: 'Manage'
})

// 加载状态
const loading = useLoading();

const { account, library, chainId } = useWeb3();
watch([account, library, chainId], () => {
  if (!!library.value && !!account.value && !!chainId.value) {
    getCollectionRole();
  }
});

const CollectionIsAdmin = ref<boolean>(false);
const CollectionIsManage = ref<boolean>(false);
// 获取专辑角色值
async function getCollectionRole() {
  loading.value = true;
  const contract = new library.value.eth.Contract(AuroranNFTDataABI as AbiItem[], AuroranNFTDataContractAddress[chainId.value]);
  const CollectionRoleAdmin = await contract.methods.DEFAULT_ADMIN_ROLE().call();
  const CollectionRoleManage = await contract.methods.ADMIN_ROLE().call();

  CollectionIsAdmin.value = await contract.methods.hasRole(CollectionRoleAdmin, account.value).call();
  CollectionIsManage.value = await contract.methods.hasRole(CollectionRoleManage, account.value).call();

  loading.value = false;
}

</script>

<template>
  <main>
    <div v-if="CollectionIsManage" class="container py-5">
      <ul class="nav nav-tabs" id="manageTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="collection-tab" data-bs-toggle="tab" data-bs-target="#collection-tab-pane" type="button" role="tab" aria-controls="collection-tab-pane" aria-selected="true">
            Collection Manage
          </button>
        </li>
        <li v-if="CollectionIsAdmin" class="nav-item" role="presentation">
          <button class="nav-link" id="staff-tab" data-bs-toggle="tab" data-bs-target="#staff-tab-pane" type="button" role="tab" aria-controls="staff-tab-pane" aria-selected="false">
            Market Manage
          </button>
        </li>
        <li v-if="CollectionIsAdmin" class="nav-item" role="presentation">
          <button class="nav-link" id="nftData-approve-tab" data-bs-toggle="tab" data-bs-target="#nftData-approve-tab-pane" type="button" role="tab" aria-controls="nftData-approve-tab-pane" aria-selected="false">
            NFTData Approve
          </button>
        </li>
      </ul>
      <div class="tab-content" id="manageTabContent">
        <div class="tab-pane fade show active" id="collection-tab-pane" role="tabpanel" aria-labelledby="collection-tab" tabindex="0">
          <ManageCollection />
        </div>
        <div v-if="CollectionIsAdmin" class="tab-pane fade" id="staff-tab-pane" role="tabpanel" aria-labelledby="staff-tab" tabindex="0">
          <ManageStaff />
        </div>
        <div v-if="CollectionIsAdmin" class="tab-pane fade" id="nftData-approve-tab-pane" role="tabpanel" aria-labelledby="nftData-approve-tab" tabindex="0">
          <ManageNftDataApprove />
        </div>
      </div>
    </div>
    <div v-else class="container py-5">
        <h1>No permission</h1>
    </div>
  </main>
</template>

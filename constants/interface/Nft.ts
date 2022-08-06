import { ICollectionItem } from './Collection';

interface INftProperty {
  property?: string,
  value?: string,
}

interface INftFormModel {
  fileUrl?: string,
  name?: string,
  description?: string,
  properties?: INftProperty[],
  collection?: string,
  approveRights?: boolean,
  agreenTerms?: boolean,
}

const defalutNftForm: INftFormModel = {
  fileUrl: null,
  name: null,
  description: null,
  properties: [],
  collection: null,
  approveRights: false,
  agreenTerms: false,
}

interface INftListItem {
  nftId: number,
  tokenId: number,
  token: string,
  owner: string,
  creator: string,
  collection: ICollectionItem,
  tokenURI: string,
  isBid: boolean,
  onSale: boolean,
  metadata?: INftFormModel,
}

interface INftPayment {
  lister: string,
  payToken: string,
  payAmount: number,
  bonusRate: number,
  createTime: number,
  cancelTime: number,
  finishedTime: number,
  endTime: number,
  txRoundId: number,
}

interface INftOffer {
  offerId: number,
  account: string,
  amount: number,
  createTime: number,
  finishedTime: number,
  txRoundId: number,
}

interface IOfferLast {
  offerId: number,
  account: string,
  amount: number,
  totalAmount: number,
}

interface IHistoryEvent {
  blockHash: string,
  blockNumber: number,
  name: string,
  token: string,
  tokenId: string,
  from: string,
  to: string,
  payToken: string,
  payAmount: string,
  createTime: string,
}

export {
  INftProperty,
  INftFormModel,
  defalutNftForm,
  INftListItem,
  INftPayment,
  INftOffer,
  IOfferLast,
  IHistoryEvent
}
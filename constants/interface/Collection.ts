interface ICollectionItem {
  token: string,
  owner: string,
  name: string,
  symbol: string,
  tokenURI: string,
  royalty: number,
  createTime: number,
  approve: boolean,
  show: boolean,
  metadata?: any,
}

interface ICollectionFormModel {
  name: string,
  symbol: string,
  royalty: number,
  verifyRights: boolean,
  agreenTerms: boolean,
}

const defalutCollectionForm: ICollectionFormModel = {
  name: null,
  symbol: null,
  royalty: 0,
  verifyRights: false,
  agreenTerms: false,
}

export {
  ICollectionItem,
  ICollectionFormModel,
  defalutCollectionForm
}
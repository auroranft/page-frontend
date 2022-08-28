import{y as e}from"./entry-edde8571.mjs";const n=()=>e("timestamp",()=>Date.parse(new Date().toString())),a=()=>e("isSubmit",()=>!1);var i=[{inputs:[{internalType:"address payable",name:"wallet_",type:"address"},{internalType:"address payable",name:"feeRecipient_",type:"address"},{internalType:"address",name:"newNFTFeeToken_",type:"address"},{internalType:"uint256",name:"newNFTFeeAmount_",type:"uint256"},{internalType:"uint256",name:"transferFeeRate_",type:"uint256"},{internalType:"address",name:"nftDataContractAddress_",type:"address"}],stateMutability:"nonpayable",type:"constructor"},{anonymous:!1,inputs:[{indexed:!0,internalType:"bytes32",name:"role",type:"bytes32"},{indexed:!0,internalType:"bytes32",name:"previousAdminRole",type:"bytes32"},{indexed:!0,internalType:"bytes32",name:"newAdminRole",type:"bytes32"}],name:"RoleAdminChanged",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"bytes32",name:"role",type:"bytes32"},{indexed:!0,internalType:"address",name:"account",type:"address"},{indexed:!0,internalType:"address",name:"sender",type:"address"}],name:"RoleGranted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"bytes32",name:"role",type:"bytes32"},{indexed:!0,internalType:"address",name:"account",type:"address"},{indexed:!0,internalType:"address",name:"sender",type:"address"}],name:"RoleRevoked",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"string",name:"name",type:"string"},{indexed:!0,internalType:"address",name:"token",type:"address"},{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"address",name:"from",type:"address"},{indexed:!1,internalType:"address",name:"to",type:"address"},{indexed:!1,internalType:"address",name:"payToken",type:"address"},{indexed:!1,internalType:"uint256",name:"payAmount",type:"uint256"},{indexed:!1,internalType:"uint256",name:"createTime",type:"uint256"}],name:"historyEvent",type:"event"},{inputs:[],name:"DEFAULT_ADMIN_ROLE",outputs:[{internalType:"bytes32",name:"",type:"bytes32"}],stateMutability:"view",type:"function",constant:!0},{inputs:[],name:"MANAGER_ROLE",outputs:[{internalType:"bytes32",name:"",type:"bytes32"}],stateMutability:"view",type:"function",constant:!0},{inputs:[{internalType:"string",name:"name",type:"string"},{internalType:"string",name:"symbol",type:"string"},{internalType:"uint256",name:"royalty",type:"uint256"}],name:"addCollection",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"marnagerAddress",type:"address"}],name:"addManager",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"token",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"buy",outputs:[],stateMutability:"payable",type:"function",payable:!0},{inputs:[{internalType:"address",name:"token",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"deal",outputs:[],stateMutability:"payable",type:"function",payable:!0},{inputs:[],name:"feeRecipient",outputs:[{internalType:"address payable",name:"",type:"address"}],stateMutability:"view",type:"function",constant:!0},{inputs:[{internalType:"address",name:"token",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"getNftSaleMap",outputs:[{components:[{internalType:"uint256",name:"nftId",type:"uint256"},{internalType:"address",name:"token",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"address payable",name:"owner",type:"address"},{internalType:"bool",name:"isBid",type:"bool"},{internalType:"bool",name:"onSale",type:"bool"}],internalType:"struct MarketConstant.NFTSale",name:"",type:"tuple"}],stateMutability:"view",type:"function",constant:!0},{inputs:[{internalType:"uint256",name:"nftId",type:"uint256"},{internalType:"uint256",name:"txRoundId",type:"uint256"}],name:"getOfferLast",outputs:[{components:[{internalType:"uint256",name:"offerId",type:"uint256"},{internalType:"address",name:"account",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"},{internalType:"uint256",name:"totalAmount",type:"uint256"}],internalType:"struct MarketConstant.OfferLast",name:"",type:"tuple"}],stateMutability:"view",type:"function",constant:!0},{inputs:[{internalType:"uint256",name:"nftId",type:"uint256"},{internalType:"uint256",name:"txRoundId",type:"uint256"}],name:"getOfferListMap",outputs:[{components:[{internalType:"uint256",name:"offerId",type:"uint256"},{internalType:"address",name:"account",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"},{internalType:"uint256",name:"createTime",type:"uint256"},{internalType:"uint256",name:"finishedTime",type:"uint256"},{internalType:"uint256",name:"txRoundId",type:"uint256"}],internalType:"struct MarketConstant.Offer[]",name:"",type:"tuple[]"}],stateMutability:"view",type:"function",constant:!0},{inputs:[{internalType:"uint256",name:"nftId",type:"uint256"},{internalType:"uint256",name:"txRoundId",type:"uint256"}],name:"getPaymentMap",outputs:[{components:[{internalType:"address",name:"lister",type:"address"},{internalType:"address",name:"payToken",type:"address"},{internalType:"uint256",name:"payAmount",type:"uint256"},{internalType:"uint256",name:"bonusRate",type:"uint256"},{internalType:"uint256",name:"createTime",type:"uint256"},{internalType:"uint256",name:"cancelTime",type:"uint256"},{internalType:"uint256",name:"finishedTime",type:"uint256"},{internalType:"uint256",name:"endTime",type:"uint256"},{internalType:"uint256",name:"txRoundId",type:"uint256"}],internalType:"struct MarketConstant.NFTPayment",name:"",type:"tuple"}],stateMutability:"view",type:"function",constant:!0},{inputs:[{internalType:"bytes32",name:"role",type:"bytes32"}],name:"getRoleAdmin",outputs:[{internalType:"bytes32",name:"",type:"bytes32"}],stateMutability:"view",type:"function",constant:!0},{inputs:[{internalType:"uint256",name:"nftId",type:"uint256"}],name:"getTxRoundIdByNFTId",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function",constant:!0},{inputs:[{internalType:"bytes32",name:"role",type:"bytes32"},{internalType:"address",name:"account",type:"address"}],name:"grantRole",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes32",name:"role",type:"bytes32"},{internalType:"address",name:"account",type:"address"}],name:"hasRole",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function",constant:!0},{inputs:[{internalType:"address",name:"token",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"bool",name:"isBid",type:"bool"},{internalType:"address",name:"payToken",type:"address"},{internalType:"uint256",name:"payAmount",type:"uint256"},{internalType:"uint256",name:"bonusRate",type:"uint256"},{internalType:"uint256",name:"endTime",type:"uint256"}],name:"list",outputs:[],stateMutability:"payable",type:"function",payable:!0},{inputs:[{internalType:"address",name:"token",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"listCancelled",outputs:[],stateMutability:"payable",type:"function",payable:!0},{inputs:[],name:"maxBonusRate",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function",constant:!0},{inputs:[],name:"maxRoyaltyRate",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function",constant:!0},{inputs:[],name:"maxTransferFeeRate",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function",constant:!0},{inputs:[{internalType:"address",name:"collection",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"string",name:"uri",type:"string"}],name:"newNFT",outputs:[],stateMutability:"payable",type:"function",payable:!0},{inputs:[],name:"newNFTFeeAmount",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function",constant:!0},{inputs:[],name:"newNFTFeeToken",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function",constant:!0},{inputs:[],name:"nftDataContractAddress",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function",constant:!0},{inputs:[{internalType:"address",name:"token",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"offer",outputs:[],stateMutability:"payable",type:"function",payable:!0},{inputs:[],name:"rateDenominator",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function",constant:!0},{inputs:[{internalType:"address",name:"marnagerAddress",type:"address"}],name:"removeManager",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes32",name:"role",type:"bytes32"},{internalType:"address",name:"account",type:"address"}],name:"renounceRole",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes32",name:"role",type:"bytes32"},{internalType:"address",name:"account",type:"address"}],name:"revokeRole",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address payable",name:"_feeRecipient",type:"address"}],name:"setFeeRecipient",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"_maxBonusRate",type:"uint256"}],name:"setMaxBonusRate",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"_maxRoyaltyRate",type:"uint256"}],name:"setMaxRoyaltyRate",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"_maxTransferFeeRate",type:"uint256"}],name:"setMaxTransferFeeRate",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"_newNFTFeeAmount",type:"uint256"}],name:"setNewNFTFeeAmount",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_newNFTFeeToken",type:"address"}],name:"setNewNFTFeeToken",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"_transferFeeRate",type:"uint256"}],name:"setTransferFeeRate",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address payable",name:"_wallet",type:"address"}],name:"setWallet",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes4",name:"interfaceId",type:"bytes4"}],name:"supportsInterface",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function",constant:!0},{inputs:[],name:"transferFeeRate",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function",constant:!0},{inputs:[],name:"wallet",outputs:[{internalType:"address payable",name:"",type:"address"}],stateMutability:"view",type:"function",constant:!0},{stateMutability:"payable",type:"receive",payable:!0}];export{i as A,a,n as u};

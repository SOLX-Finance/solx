export type Solx = {
  version: '0.1.0';
  name: 'solx';
  instructions: [
    {
      name: 'initialize';
      accounts: [
        {
          name: 'signer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'globalState';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'vault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'authority';
          type: 'publicKey';
        },
        {
          name: 'operator';
          type: 'publicKey';
        },
        {
          name: 'treasury';
          type: 'publicKey';
        },
        {
          name: 'fee';
          type: 'u64';
        },
      ];
    },
    {
      name: 'purchase';
      accounts: [
        {
          name: 'buyer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'globalState';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'listing';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'listingPaymentMintAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'buyerPaymentMintAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'whitelistedState';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'paymentMintState';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'paymentMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'priceUpdate';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram2022';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'id';
          type: {
            array: ['u8', 16];
          };
        },
      ];
    },
    {
      name: 'createListing';
      accounts: [
        {
          name: 'lister';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'globalState';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'listing';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'collateralMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'listingCollateralMintAccount';
          isMut: true;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'listerCollateralMintAccount';
          isMut: true;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'whitelistedState';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftTokenAccount';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'nftMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'id';
          type: {
            array: ['u8', 16];
          };
        },
        {
          name: 'collateralAmount';
          type: 'u64';
        },
        {
          name: 'priceAmount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'mintNft';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'lister';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'globalState';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'masterEditionAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftMetadata';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'metadataProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'id';
          type: {
            array: ['u8', 16];
          };
        },
        {
          name: 'name';
          type: 'string';
        },
        {
          name: 'symbol';
          type: 'string';
        },
        {
          name: 'uri';
          type: 'string';
        },
      ];
    },
    {
      name: 'initiateDispute';
      accounts: [
        {
          name: 'initiator';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'globalState';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'listing';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'nftTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'dispute';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'id';
          type: {
            array: ['u8', 16];
          };
        },
      ];
    },
    {
      name: 'resolveDispute';
      accounts: [
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'globalState';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'dispute';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'listing';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'nftTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'listingPaymentMintAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'listingCollateralMintAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'buyerPaymentMintAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'sellerCollateralMintAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'treasuryPaymentMintAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'treasuryCollateralMintAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'paymentMintState';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'collateralMintState';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'paymentMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'collateralMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram2022';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'id';
          type: {
            array: ['u8', 16];
          };
        },
        {
          name: 'verdict';
          type: {
            defined: 'Verdict';
          };
        },
      ];
    },
    {
      name: 'closeListing';
      accounts: [
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'globalState';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'treasury';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'listing';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'listingCollateralMintAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'listingPaymentMintAccount';
          isMut: true;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'authorityCollateralMintAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'authorityPaymentMintAccount';
          isMut: true;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'treasuryPaymentMintAccount';
          isMut: true;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'collateralMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'paymentMint';
          isMut: true;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'collateralWhitelistedState';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'paymentWhitelistedState';
          isMut: true;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'nftMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram2022';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'id';
          type: {
            array: ['u8', 16];
          };
        },
      ];
    },
    {
      name: 'whitelist';
      accounts: [
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'globalState';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'whitelistedState';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'mint';
          type: 'publicKey';
        },
        {
          name: 'whitelisted';
          type: 'bool';
        },
      ];
    },
    {
      name: 'updateMint';
      accounts: [
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'globalState';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'paymentMintState';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'paymentMint';
          type: 'publicKey';
        },
        {
          name: 'feed';
          type: 'string';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'dispute';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'initiator';
            type: 'publicKey';
          },
          {
            name: 'resolved';
            type: 'bool';
          },
        ];
      };
    },
    {
      name: 'globalState';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'authority';
            type: 'publicKey';
          },
          {
            name: 'operator';
            type: 'publicKey';
          },
          {
            name: 'treasury';
            type: 'publicKey';
          },
          {
            name: 'fee';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'listing';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'nft';
            type: 'publicKey';
          },
          {
            name: 'buyer';
            type: 'publicKey';
          },
          {
            name: 'collateralMint';
            type: 'publicKey';
          },
          {
            name: 'paymentMint';
            type: 'publicKey';
          },
          {
            name: 'collateralAmount';
            type: 'u64';
          },
          {
            name: 'paymentAmount';
            type: 'u64';
          },
          {
            name: 'priceUsd';
            type: 'u64';
          },
          {
            name: 'expiryTs';
            type: 'u64';
          },
          {
            name: 'state';
            type: {
              defined: 'ListingState';
            };
          },
        ];
      };
    },
    {
      name: 'paymentMintState';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'feed';
            type: 'string';
          },
        ];
      };
    },
    {
      name: 'whitelistedState';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'whitelisted';
            type: 'bool';
          },
        ];
      };
    },
  ];
  types: [
    {
      name: 'Verdict';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'BuyerFault';
          },
          {
            name: 'SellerFault';
          },
          {
            name: 'Refund';
          },
        ];
      };
    },
    {
      name: 'ListingState';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Opened';
          },
          {
            name: 'Purchased';
          },
          {
            name: 'Disputed';
          },
          {
            name: 'Banned';
          },
        ];
      };
    },
  ];
  events: [
    {
      name: 'Initialized';
      fields: [
        {
          name: 'globalState';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'authority';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'operator';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'treasury';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'fee';
          type: 'u64';
          index: false;
        },
      ];
    },
    {
      name: 'ListingCreated';
      fields: [
        {
          name: 'id';
          type: 'string';
          index: false;
        },
        {
          name: 'globalState';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'listing';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'nft';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'buyer';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'collateralMint';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'collateralAmount';
          type: 'u64';
          index: false;
        },
        {
          name: 'priceUsd';
          type: 'u64';
          index: false;
        },
      ];
    },
    {
      name: 'ListingPurchased';
      fields: [
        {
          name: 'id';
          type: 'string';
          index: false;
        },
        {
          name: 'globalState';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'listing';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'nft';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'buyer';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'paymentMint';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'paymentAmount';
          type: 'u64';
          index: false;
        },
        {
          name: 'disputePeriodExpiryTs';
          type: 'u64';
          index: false;
        },
      ];
    },
    {
      name: 'ListingClosed';
      fields: [
        {
          name: 'id';
          type: 'string';
          index: false;
        },
        {
          name: 'globalState';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'listing';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'nft';
          type: 'publicKey';
          index: false;
        },
      ];
    },
    {
      name: 'ListingDisputed';
      fields: [
        {
          name: 'id';
          type: 'string';
          index: false;
        },
        {
          name: 'globalState';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'initiator';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'listing';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'nft';
          type: 'publicKey';
          index: false;
        },
      ];
    },
    {
      name: 'DisputeResolved';
      fields: [
        {
          name: 'id';
          type: 'string';
          index: false;
        },
        {
          name: 'globalState';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'listing';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'nft';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'verdict';
          type: {
            defined: 'Verdict';
          };
          index: false;
        },
      ];
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'Forbidden';
      msg: 'Forbidden';
    },
    {
      code: 6001;
      name: 'MintNotWhitelisted';
      msg: 'Mint is not whitelisted';
    },
    {
      code: 6002;
      name: 'InvalidState';
      msg: 'Invalid state';
    },
    {
      code: 6003;
      name: 'InvalidInitiator';
      msg: 'Invalid initiator';
    },
    {
      code: 6004;
      name: 'Expired';
      msg: 'Expired';
    },
    {
      code: 6005;
      name: 'InvalidMint';
      msg: 'Invalid mint';
    },
    {
      code: 6006;
      name: 'InvalidBuyer';
      msg: 'Invalid buyer';
    },
    {
      code: 6007;
      name: 'InvalidSeller';
      msg: 'Invalid seller';
    },
    {
      code: 6008;
      name: 'InvalidTreasury';
      msg: 'Invalid treasury';
    },
    {
      code: 6009;
      name: 'InvalidPaymentMint';
      msg: 'Invalid payment mint';
    },
    {
      code: 6010;
      name: 'InvalidCollateralMint';
      msg: 'Invalid collateral mint';
    },
    {
      code: 6011;
      name: 'InvalidNftMint';
      msg: 'Invalid nft mint';
    },
    {
      code: 6012;
      name: 'DisputePeriodNotExpired';
      msg: 'Dispute period has not expired';
    },
    {
      code: 6013;
      name: 'InsufficientBalance';
      msg: 'Insufficient balance';
    },
  ];
};

export const SolxIDL = {
  version: '0.1.0',
  name: 'solx',
  instructions: [
    {
      name: 'initialize',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'globalState',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'authority',
          type: 'publicKey',
        },
        {
          name: 'operator',
          type: 'publicKey',
        },
        {
          name: 'treasury',
          type: 'publicKey',
        },
        {
          name: 'fee',
          type: 'u64',
        },
      ],
    },
    {
      name: 'purchase',
      accounts: [
        {
          name: 'buyer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'globalState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'listing',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nftMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'listingPaymentMintAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'buyerPaymentMintAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'whitelistedState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'paymentMintState',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'paymentMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'priceUpdate',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram2022',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'id',
          type: {
            array: ['u8', 16],
          },
        },
      ],
    },
    {
      name: 'createListing',
      accounts: [
        {
          name: 'lister',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'globalState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'listing',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'collateralMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'listingCollateralMintAccount',
          isMut: true,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'listerCollateralMintAccount',
          isMut: true,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'whitelistedState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nftTokenAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'nftMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'id',
          type: {
            array: ['u8', 16],
          },
        },
        {
          name: 'collateralAmount',
          type: 'u64',
        },
        {
          name: 'priceAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'mintNft',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'lister',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'globalState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nftMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nftTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'masterEditionAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nftMetadata',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'metadataProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'id',
          type: {
            array: ['u8', 16],
          },
        },
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'symbol',
          type: 'string',
        },
        {
          name: 'uri',
          type: 'string',
        },
      ],
    },
    {
      name: 'initiateDispute',
      accounts: [
        {
          name: 'initiator',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'globalState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'listing',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nftMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'nftTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'dispute',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'id',
          type: {
            array: ['u8', 16],
          },
        },
      ],
    },
    {
      name: 'resolveDispute',
      accounts: [
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'globalState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'dispute',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'listing',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nftMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'nftTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'listingPaymentMintAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'listingCollateralMintAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'buyerPaymentMintAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'sellerCollateralMintAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'treasuryPaymentMintAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'treasuryCollateralMintAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'paymentMintState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'collateralMintState',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'paymentMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'collateralMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram2022',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'id',
          type: {
            array: ['u8', 16],
          },
        },
        {
          name: 'verdict',
          type: {
            defined: 'Verdict',
          },
        },
      ],
    },
    {
      name: 'closeListing',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'globalState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'treasury',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'listing',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'listingCollateralMintAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'listingPaymentMintAccount',
          isMut: true,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'authorityCollateralMintAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authorityPaymentMintAccount',
          isMut: true,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'treasuryPaymentMintAccount',
          isMut: true,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'collateralMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'paymentMint',
          isMut: true,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'collateralWhitelistedState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'paymentWhitelistedState',
          isMut: true,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'nftMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'nftTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram2022',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'id',
          type: {
            array: ['u8', 16],
          },
        },
      ],
    },
    {
      name: 'whitelist',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'globalState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'whitelistedState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'mint',
          type: 'publicKey',
        },
        {
          name: 'whitelisted',
          type: 'bool',
        },
      ],
    },
    {
      name: 'updateMint',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'globalState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'paymentMintState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'paymentMint',
          type: 'publicKey',
        },
        {
          name: 'feed',
          type: 'string',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'dispute',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'initiator',
            type: 'publicKey',
          },
          {
            name: 'resolved',
            type: 'bool',
          },
        ],
      },
    },
    {
      name: 'globalState',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'operator',
            type: 'publicKey',
          },
          {
            name: 'treasury',
            type: 'publicKey',
          },
          {
            name: 'fee',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'listing',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'nft',
            type: 'publicKey',
          },
          {
            name: 'buyer',
            type: 'publicKey',
          },
          {
            name: 'collateralMint',
            type: 'publicKey',
          },
          {
            name: 'paymentMint',
            type: 'publicKey',
          },
          {
            name: 'collateralAmount',
            type: 'u64',
          },
          {
            name: 'paymentAmount',
            type: 'u64',
          },
          {
            name: 'priceUsd',
            type: 'u64',
          },
          {
            name: 'expiryTs',
            type: 'u64',
          },
          {
            name: 'state',
            type: {
              defined: 'ListingState',
            },
          },
        ],
      },
    },
    {
      name: 'paymentMintState',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'feed',
            type: 'string',
          },
        ],
      },
    },
    {
      name: 'whitelistedState',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'whitelisted',
            type: 'bool',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'Verdict',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'BuyerFault',
          },
          {
            name: 'SellerFault',
          },
          {
            name: 'Refund',
          },
        ],
      },
    },
    {
      name: 'ListingState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Opened',
          },
          {
            name: 'Purchased',
          },
          {
            name: 'Disputed',
          },
          {
            name: 'Banned',
          },
        ],
      },
    },
  ],
  events: [
    {
      name: 'Initialized',
      fields: [
        {
          name: 'globalState',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'authority',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'operator',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'treasury',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'fee',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'ListingCreated',
      fields: [
        {
          name: 'id',
          type: 'string',
          index: false,
        },
        {
          name: 'globalState',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'listing',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'nft',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'buyer',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'collateralMint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'collateralAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'priceUsd',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'ListingPurchased',
      fields: [
        {
          name: 'id',
          type: 'string',
          index: false,
        },
        {
          name: 'globalState',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'listing',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'nft',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'buyer',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'paymentMint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'paymentAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'disputePeriodExpiryTs',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'ListingClosed',
      fields: [
        {
          name: 'id',
          type: 'string',
          index: false,
        },
        {
          name: 'globalState',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'listing',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'nft',
          type: 'publicKey',
          index: false,
        },
      ],
    },
    {
      name: 'ListingDisputed',
      fields: [
        {
          name: 'id',
          type: 'string',
          index: false,
        },
        {
          name: 'globalState',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'initiator',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'listing',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'nft',
          type: 'publicKey',
          index: false,
        },
      ],
    },
    {
      name: 'DisputeResolved',
      fields: [
        {
          name: 'id',
          type: 'string',
          index: false,
        },
        {
          name: 'globalState',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'listing',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'nft',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'verdict',
          type: {
            defined: 'Verdict',
          },
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'Forbidden',
      msg: 'Forbidden',
    },
    {
      code: 6001,
      name: 'MintNotWhitelisted',
      msg: 'Mint is not whitelisted',
    },
    {
      code: 6002,
      name: 'InvalidState',
      msg: 'Invalid state',
    },
    {
      code: 6003,
      name: 'InvalidInitiator',
      msg: 'Invalid initiator',
    },
    {
      code: 6004,
      name: 'Expired',
      msg: 'Expired',
    },
    {
      code: 6005,
      name: 'InvalidMint',
      msg: 'Invalid mint',
    },
    {
      code: 6006,
      name: 'InvalidBuyer',
      msg: 'Invalid buyer',
    },
    {
      code: 6007,
      name: 'InvalidSeller',
      msg: 'Invalid seller',
    },
    {
      code: 6008,
      name: 'InvalidTreasury',
      msg: 'Invalid treasury',
    },
    {
      code: 6009,
      name: 'InvalidPaymentMint',
      msg: 'Invalid payment mint',
    },
    {
      code: 6010,
      name: 'InvalidCollateralMint',
      msg: 'Invalid collateral mint',
    },
    {
      code: 6011,
      name: 'InvalidNftMint',
      msg: 'Invalid nft mint',
    },
    {
      code: 6012,
      name: 'DisputePeriodNotExpired',
      msg: 'Dispute period has not expired',
    },
    {
      code: 6013,
      name: 'InsufficientBalance',
      msg: 'Insufficient balance',
    },
  ],
} as const;

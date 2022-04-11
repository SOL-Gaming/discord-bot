
import fetch from 'node-fetch';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MintLayout,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  Keypair,
  Connection,
  SystemProgram,
  TransactionInstruction,
  PublicKey,
} from '@solana/web3.js';

export const mintNFT = async (
    connection: Connection,
    walletKeypair: Keypair,
    metadataLink: string,
    mutableMetadata: boolean = true,
    collection: PublicKey = null,
    maxSupply: number = 0,
    verifyCreators: boolean,
    use: Uses = null,
    receivingWallet: PublicKey = null,
  ): Promise<MintResult | void> => {
    // Retrieve metadata
    const data = await createMetadata(
      metadataLink,
      verifyCreators,
      collection,
      use,
    );
    if (!data) return;
  
    // Create wallet from keypair
    const wallet = new anchor.Wallet(walletKeypair);
    if (!wallet?.publicKey) return;
  
    // Allocate memory for the account
    const mintRent = await connection.getMinimumBalanceForRentExemption(
      MintLayout.span,
    );
  
    // Generate a mint
    const mint = anchor.web3.Keypair.generate();
    const instructions: TransactionInstruction[] = [];
    const signers: anchor.web3.Keypair[] = [mint, walletKeypair];
  
    instructions.push(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mint.publicKey,
        lamports: mintRent,
        space: MintLayout.span,
        programId: TOKEN_PROGRAM_ID,
      }),
    );
    instructions.push(
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        0,
        wallet.publicKey,
        wallet.publicKey,
      ),
    );
  
    const userTokenAccoutAddress = await getTokenWallet(
      wallet.publicKey,
      mint.publicKey,
    );
    instructions.push(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        userTokenAccoutAddress,
        wallet.publicKey,
        wallet.publicKey,
      ),
    );
  
    // Create metadata
    const metadataAccount = await getMetadata(mint.publicKey);
  
    instructions.push(
      ...new CreateMetadataV2(
        { feePayer: wallet.publicKey },
        {
          metadata: metadataAccount,
          metadataData: data,
          updateAuthority: wallet.publicKey,
          mint: mint.publicKey,
          mintAuthority: wallet.publicKey,
        },
      ).instructions,
    );
  
    instructions.push(
      Token.createMintToInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        userTokenAccoutAddress,
        wallet.publicKey,
        [],
        1,
      ),
    );
  
    // Create master edition
    const editionAccount = await getMasterEdition(mint.publicKey);
  
    instructions.push(
      ...new CreateMasterEditionV3(
        {
          feePayer: wallet.publicKey,
        },
        {
          edition: editionAccount,
          metadata: metadataAccount,
          mint: mint.publicKey,
          mintAuthority: wallet.publicKey,
          updateAuthority: wallet.publicKey,
          maxSupply: new anchor.BN(maxSupply),
        },
      ).instructions,
    );
  
    if (!mutableMetadata) {
      instructions.push(
        ...new UpdateMetadataV2(
          {},
          {
            metadata: metadataAccount,
            metadataData: data,
            updateAuthority: walletKeypair.publicKey,
            primarySaleHappened: null,
            isMutable: false,
          },
        ).instructions,
      );
    }
  
    if (receivingWallet) {
      const derivedAccount = await getTokenWallet(
        receivingWallet,
        mint.publicKey,
      );
      const createdAccountIx = Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        derivedAccount,
        receivingWallet,
        wallet.publicKey,
      );
      const transferIx = Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        userTokenAccoutAddress,
        derivedAccount,
        wallet.publicKey,
        signers,
        1,
      );
      const closeAccountIx = Token.createCloseAccountInstruction(
        TOKEN_PROGRAM_ID,
        userTokenAccoutAddress,
        wallet.publicKey,
        wallet.publicKey,
        signers,
      );
      instructions.push(createdAccountIx, transferIx, closeAccountIx);
    }
  
    const res = await sendTransactionWithRetryWithKeypair(
      connection,
      walletKeypair,
      instructions,
      signers,
    );
  
    try {
      await connection.confirmTransaction(res.txid, 'max');
    } catch {
      // ignore
    }
  
    // Force wait for max confirmations
    await connection.getParsedTransaction(res.txid, 'confirmed');
  
    console.log('NFT created', res.txid);
    console.log('\nNFT: Mint Address is ', mint.publicKey.toBase58());
    console.log('NFT: Metadata address is ', metadataAccount.toBase58());
    return { metadataAccount, mint: mint.publicKey };
  };
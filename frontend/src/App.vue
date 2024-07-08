<template>
  <div id="app">
    <button @click="connectWallet">Connect Wallet</button>
    <div v-if="account">
      <p>Connected Account: {{ account }}</p>
      <input type="file" @change="onFileChange" />
      <input type="text" v-model="nftName" placeholder="NFT Name" />
      <input type="text" v-model="nftDescription" placeholder="NFT Description" />
      <button @click="mintNFT">Mint NFT</button>
      <div>
        <h3>Your NFTs:</h3>
        <div v-for="(token, index) in tokens" :key="index" class="nft-card">
          <p>{{ token.name }}</p>
          <img :src="token.image" alt="NFT Image" />
          <form @submit.prevent="transferNFT(token.id)">
            <input type="text" v-model="recipient" placeholder="Recipient Address" />
            <button type="submit">Transfer NFT</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { create } from 'ipfs-http-client';
import contractABI from './contract-abi.json';

const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export default {
  data() {
    return {
      web3: null,
      account: null,
      contract: null,
      tokens: [],
      nftName: '',
      nftDescription: '',
      nftImage: null,
      recipient: ''
    };
  },
  methods: {
    async connectWallet() {
      try {
        const provider = await detectEthereumProvider();
        if (provider) {
          this.web3 = new Web3(provider);
          const accounts = await provider.request({ method: 'eth_requestAccounts' });
          this.account = accounts[0];
          this.contract = new this.web3.eth.Contract(
            contractABI,
            'YOUR_DEPLOYED_CONTRACT_ADDRESS'
          );
          this.loadNFTs();
        } else {
          alert('Please install MetaMask!');
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    },
    async onFileChange(event) {
      this.nftImage = event.target.files[0];
    },
    async mintNFT() {
      try {
        if (!this.nftImage || !this.nftName || !this.nftDescription) {
          alert('Please provide all NFT details.');
          return;
        }

        const imageData = await this.uploadToIPFS(this.nftImage);
        const metadata = {
          name: this.nftName,
          description: this.nftDescription,
          image: `https://ipfs.infura.io/ipfs/${imageData.path}`
        };
        const metadataFile = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
        const metadataData = await this.uploadToIPFS(metadataFile);

        const tokenURI = `https://ipfs.infura.io/ipfs/${metadataData.path}`;
        const receipt = await this.contract.methods.mintNFT(this.account, tokenURI).send({ from: this.account });
        console.log('Minted: ', receipt);
        this.loadNFTs();
      } catch (error) {
        console.error('Error minting NFT:', error);
      }
    },
    async uploadToIPFS(file) {
      const added = await ipfs.add(file);
      return added;
    },
    async loadNFTs() {
      try {
        const totalSupply = await this.contract.methods.totalSupply().call();
        const tokens = [];
        for (let i = 0; i < totalSupply; i++) {
          const tokenId = await this.contract.methods.tokenByIndex(i).call();
          const tokenURI = await this.contract.methods.tokenURI(tokenId).call();
          const response = await fetch(tokenURI);
          const metadata = await response.json();
          metadata.id = tokenId;
          tokens.push(metadata);
        }
        this.tokens = tokens;
      } catch (error) {
        console.error('Error loading NFTs:', error);
      }
    },
    async transferNFT(tokenId) {
      try {
        await this.contract.methods.transferFrom(this.account, this.recipient, tokenId).send({ from: this.account });
        console.log(`Transferred token ${tokenId} to ${this.recipient}`);
        this.loadNFTs();
      } catch (error) {
        console.error('Error transferring NFT:', error);
      }
    }
  }
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
}

button {
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
}

.nft-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  display: inline-block;
  text-align: left;
}

.nft-card img {
  max-width: 100px;
  display: block;
  margin: 0 auto;
}

form {
  display: flex;
  flex-direction: column;
}

input[type="text"] {
  margin: 5px 0;
  padding: 5px;
}

button[type="submit"] {
  padding: 5px;
  cursor: pointer;
}
</style>

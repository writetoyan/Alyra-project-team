![N|Solid](assets/ban_logo.png)

Ce projet DeFi consiste à mettre en place une solution de stacking ERC20 utilisant une méthode de récompense proportionnelle au montant stacké.

__Auteurs :__
- Alex
- Yannick
- Gregory

<br />
<br />
<br />
<br />
<br />





![N|Solid](assets/ban_hr.png)
# Spécifications fonctionnelles
- Pouvoir 'stake' son token ERC20
- Pouvoir 'unstake' ses tokens
- Créer son propre token de récompense ou utiliser l’ETH ou un autre token ERC20 
- Respecter un ratio entre la quantité de la récompense et la valeur bloquées sur le smart contract
- Utiliser l’oracle Chainlink

<br />
<br />
<br />
<br />
<br />





![N|Solid](assets/ban_hr.png)

# Table des matières  
- [Spécifications fonctionnelles](#spécifications-fonctionnelles)
- [Table des matières](#table-des-matières)
- [1. DOSSIER DE TRAVAIL](#1-dossier-de-travail)
  - [1.1.Installation des PACKAGES](#11installation-des-packages)
    - [1.1.1 TRUFFLE-UNBOX-REACT](#111-truffle-unbox-react)
    - [1.1.2. HDWalletProvider](#112-hdwalletprovider)
    - [1.1.3. DOTENV](#113-dotenv)
    - [1.1.4. MochaJS](#114-mochajs)
    - [1.1.5. ChaiJS](#115-chaijs)
    - [1.1.6. Solidity Coverage](#116-solidity-coverage)
    - [1.1.7. Eth-Gas-Reporter](#117-eth-gas-reporter)
  - [1.2. Paramétrage des fichiers de configurations](#12-paramétrage-des-fichiers-de-configurations)
    - [1.2.1. truffle-config.js](#121-truffle-configjs)
    - [1.2.2. .env](#122-env)
    - [1.2.3. .gitignore](#123-gitignore)
- [2. SMARTS CONTRACTS](#2-smarts-contracts)
  - [2.1. Ecriture des Smarts Contracts](#21-ecriture-des-smarts-contracts)
    - [2.1.1. ayg_erc20.sol](#211-ayg_erc20sol)
    - [2.1.2. ayg_app.sol](#212-ayg_appsol)
    - [2.1.3. ayg_erc721.sol](#213-ayg_erc721sol)
  - [2.2. Ecriture des fichiers de déployement](#22-ecriture-des-fichiers-de-déployement)
  - [2.3. Tests unitaires des Smarts Contracts](#23-tests-unitaires-des-smarts-contracts)
    - [2.3.1. Résultat du Coverage](#231-résultat-du-coverage)
    - [2.3.2. Résultat de la consomation de gas](#232-résultat-de-la-consomation-de-gas)
  - [2.4. Documentation des Smarts Contracts](#24-documentation-des-smarts-contracts)
    - [2.4.1. Utilisation de NatSpec](#241-utilisation-de-natspec)
    - [2.4.2. Mise en ligne de la documentation](#242-mise-en-ligne-de-la-documentation)
  - [2.5. Utilisation d'un Oracle](#25-utilisation-dun-oracle)
  - [2.6. Utilisation d'un noeud RPC](#26-utilisation-dun-noeud-rpc)
  - [2.7. Utilisation d'un stockage décentralisé](#27-utilisation-dun-stockage-décentralisé)
- [3. DAPP](#3-dapp)
  - [3.1 Librairie UI](#31-librairie-ui)
  - [3.2 Codage de la DApp](#32-codage-de-la-dapp)
  - [3.2.1 Fonctionnalité pour l'admin](#321-fonctionnalité-pour-ladmin)
    - [3.2.1.1 Création d'un ERC20](#3211-création-dun-erc20)
    - [3.2.1.2 Paramètres de stacking](#3212-paramètres-de-stacking)
    - [3.2.1.3 Paramètre de pool](#3213-paramètre-de-pool)
    - [3.2.1.4 Création de NFT Reward / NFT Boost](#3214-création-de-nft-reward--nft-boost)
  - [3.2.2 Fonctionnalité pour l'utilisateur](#322-fonctionnalité-pour-lutilisateur)
    - [3.2.2.1 Stacking de Token ERC20](#3221-stacking-de-token-erc20)
    - [3.2.2.2 Apport de liquidité dans une POOL](#3222-apport-de-liquidité-dans-une-pool)
    - [3.2.2.3 Swap entre token ERC20](#3223-swap-entre-token-erc20)
  - [3.3 Test local](#33-test-local)
- [4. MISE EN LIGNE](#4-mise-en-ligne)
  - [4.1 Choix de la blockchain](#41-choix-de-la-blockchain)
    - [4.1.1 Deployement sur Kovan](#411-deployement-sur-kovan)
  - [4.2 Choix de l'hébergement](#42-choix-de-lhébergement)
    - [4.2.1 Deployement sur Github Pages](#421-deployement-sur-github-pages)
- [5. JEUX DE DONNEES](#5-jeux-de-donnees)
  - [5.1. Création d'un bot](#51-création-dun-bot)
- [6. LICENCE](#6-licence)

<br />
<br />
<br />
<br />
<br />





![N|Solid](assets/ban_hr.png)

# 1. DOSSIER DE TRAVAIL


Création du dossier depuis lequel nous allons travailler

```sh
$ mkdir ayg_labs
$ cd ayg_labs
```

<br />

## 1.1.Installation des PACKAGES   

Dans le cadre de ce développement nous aurons besoin d'installer différents packages et librairies.

<br />

### 1.1.1 TRUFFLE-UNBOX-REACT

Pour notre envoronnement de travail nous avons choisi d'utilser la box `Truffle-Unbox-React` qui offre l'avantage d'embarquer un environement Truffle et la structure initiale d'une Dapp sous le language React.
```sh
$ truffle unbox react
```

![N|Solid](assets/cmd_truffle-unbox-react1.png)
![N|Solid](assets/cmd_truffle-unbox-react2.png)

<br />

### 1.1.2. HDWalletProvider

```sh
$ npm install @truffle/hdwallet-provider
```

<br />

### 1.1.3. DOTENV

```sh
$ npm install dotenv
```


<br />

### 1.1.4. MochaJS

```sh
$ npm install --global mocha
```

<br />




### 1.1.5. ChaiJS

```sh
$ npm install chai
```

<br />




### 1.1.6. Solidity Coverage

```sh
$ npm install --save-dev solidity-coverage
```

<br />




### 1.1.7. Eth-Gas-Reporter

```sh
$ npm install --save-dev --prefixe . eth-gas-reporter 
```

<br /><hr />

## 1.2. Paramétrage des fichiers de configurations

### 1.2.1. truffle-config.js
### 1.2.2. .env
### 1.2.3. .gitignore

<br />
<br />
<br />
<br />
<br />





![N|Solid](assets/ban_hr.png)

# 2. SMARTS CONTRACTS

<br />

## 2.1. Ecriture des Smarts Contracts
### 2.1.1. ayg_erc20.sol 
### 2.1.2. ayg_app.sol 
### 2.1.3. ayg_erc721.sol

<br /><hr />

## 2.2. Ecriture des fichiers de déployement

<br /><hr />

## 2.3. Tests unitaires des Smarts Contracts
### 2.3.1. Résultat du Coverage
### 2.3.2. Résultat de la consomation de gas

<br /><hr />

## 2.4. Documentation des Smarts Contracts
### 2.4.1. Utilisation de NatSpec
### 2.4.2. Mise en ligne de la documentation

<br /><hr />

## 2.5. Utilisation d'un Oracle

Pour pouvoir obtenir le cours en temps réel des token ERC20 utilisé dans notre DApp nous avons choisi [ChainLink](https://chain.link/).   
- Doc https://docs.chain.link/?_ga=2.199118056.612825648.1658574247-2034576199.1654020323   
- Github https://github.com/smartcontractkit/chainlink   

<br /><hr />

## 2.6. Utilisation d'un noeud RPC

Pour nous connecter à la blockchain Kovan nous avons utilisé la solution [INFURA](https://infura.io/).   
- Doc https://docs.infura.io/infura/networks/ethereum   
- Doc ipfs https://docs.infura.io/infura/networks/ipfs   
- Github https://github.com/INFURA   

<br /><hr />

## 2.7. Utilisation d'un stockage décentralisé

Pour le stockage des NFT nous avons utilisé la solution [IPFS](https://ipfs.io/).
- Doc https://docs.ipfs.io/
- Github https://github.com/ipfs/ipfs

<br />
<br />
<br />
<br />
<br />





![N|Solid](assets/ban_hr.png)

# 3. DAPP

<br />

## 3.1 Librairie UI

Pour l'UI de la DApp nous avons choisi d'utiliser [Material UI](https://mui.com/).   
- Doc 
- Github https://github.com/mui/material-ui   

Installation :
```sh
$ npm install @mui/material @emotion/react @emotion/styled
```

<br /><hr />

## 3.2 Codage de la DApp

## 3.2.1 Fonctionnalité pour l'admin
### 3.2.1.1 Création d'un ERC20
### 3.2.1.2 Paramètres de stacking
### 3.2.1.3 Paramètre de pool
### 3.2.1.4 Création de NFT Reward / NFT Boost
## 3.2.2 Fonctionnalité pour l'utilisateur
### 3.2.2.1 Stacking de Token ERC20
### 3.2.2.2 Apport de liquidité dans une POOL
### 3.2.2.3 Swap entre token ERC20

<br /><hr />

## 3.3 Test local

Dans un premier temps la DApp sera testée localement en utilisant la blockchain locale `Ganache`.   
Depuis notre dossier `Truffle` excécutons la commande suivante

```sh
$ ganache
```

![N|Solid](assets/cmd_ganache.png)

Nous pouvons alors récupérer les addresse des comptes.
```txt
Available Accounts
==================
(0) 0xeF7B0e0378d12921528FDFC7d406c498CAC1BD55 (1000 ETH)
(1) 0xaA4EDd85E1A7ac1Ae5af4c6805aAB07618441d6C (1000 ETH)
(2) 0xE9034411a77Fe957e0521C73D4cC6D67121140b8 (1000 ETH)
(3) 0x99b619dD90D5E4C9C2Ab32699a122312a0929218 (1000 ETH)
(4) 0x0F8ae7FDfb084009c8ac36FE7623BC656982f903 (1000 ETH)
(5) 0x626d04c0dDEc16738A8Ce84a4874410bE65ba7d3 (1000 ETH)
(6) 0x3a0230f2e1563A70607ce853bb22d2F5BCE4DB02 (1000 ETH)
(7) 0xD68A164c5b98d8F334f55f2D448805Fb935ce125 (1000 ETH)
(8) 0x3dfE381563d2CF80B01E85b8D0802188425B05f4 (1000 ETH)
(9) 0x66D99Ab8e89AC1A739135dfec2E594C780FadbA5 (1000 ETH)

Private Keys
==================
(0) 0x9c35b06501ee0475fad08f7c86d9bd66499deb32c1223bc72bba1b2106844f18
(1) 0xab0e8a28a3e3742d4c0ccaf94523eb51aab93db98592d16b9cf121afb7cf6352
(2) 0xa6ae802d6a7481e325b93646d2700d681e4c9c62cf7cff055cb5445334d7f68f
(3) 0xdde5a8d815600596da610e95e51161a3326c46fe328f3761406034ffa586617a
(4) 0x5afe5cdaa7e3d45753bb299f17639979c584225147bc303a5f1a3cb5d362a2c1
(5) 0x9bde0d7263d2d3dbd00ccf3375d307ba80a73ba467e97e906328faf78f4ed79f
(6) 0x5de9398b7ddfbef8df12aed5bad5da7ddd220fbdacd74d8c623cf0849b2e27e6
(7) 0xb9a79299e352820aaf3f32c6ef682856cef7ecb3013273599d80dbee8cc7c211
(8) 0x1ac4ad5822b80f346a7d3f3017b4f2ae5cfc5dd2a21c7e65719860a44d63c31a
(9) 0x227d7181ad85473b983f397c36662f909d8157d4df6744f281427deb5ed2c0c7
```

Nous pouvons ajouté le compte(0) qui servira de compte de deployement pour nos tests.

![N|Solid](assets/soft_metamask_local_addaccount.png)

<br />
<br />
<br />
<br />
<br />





![N|Solid](assets/ban_hr.png)

# 4. MISE EN LIGNE

<br />

## 4.1 Choix de la blockchain

<br />

Nous avons fait le choix de déployer nos smarts contracts sur la blockchain de test `KOVAN`

<br />

### 4.1.1 Deployement sur Kovan

Depuis notre dossier `Truffle` excécutons la commande suivante

```sh
$ truffle migrate --network kovan
```

<br /><hr />

## 4.2 Choix de l'hébergement

### 4.2.1 Deployement sur Github Pages

<br />
<br />
<br />
<br />
<br />





![N|Solid](assets/ban_hr.png)

# 5. JEUX DE DONNEES

<br />

## 5.1. Création d'un bot

<br />
<br />
<br />
<br />
<br />





![N|Solid](assets/ban_hr.png)

# 6. LICENCE

MIT
<br />
<br />
<br />
<br />
<br />





![N|Solid](assets/ban_foot.png)
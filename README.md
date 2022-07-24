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
  - [2.2. Tests unitaires des Smarts Contracts](#22-tests-unitaires-des-smarts-contracts)
    - [2.2.1. Résultat du Coverage](#221-résultat-du-coverage)
    - [2.2.2. Résultat de la consomation de gas](#222-résultat-de-la-consomation-de-gas)
  - [2.3. Documentation des Smarts Contracts](#23-documentation-des-smarts-contracts)
    - [2.3.1. Utilisation de NatSpec](#231-utilisation-de-natspec)
    - [2.3.2. Mise en ligne de la documentation](#232-mise-en-ligne-de-la-documentation)
  - [2.4. Utilisation d'un Oracle](#24-utilisation-dun-oracle)
  - [2.5. Utilisation d'INFURA](#25-utilisation-dinfura)
  - [2.5. Utilisation d'IPFS](#25-utilisation-dipfs)
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
- [4. MISE EN LIGNE](#4-mise-en-ligne)
  - [4.1 Choix de l'hébergement](#41-choix-de-lhébergement)
  - [4.2 Deployement](#42-deployement)
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

<br />

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
## 2.1. Ecriture des Smarts Contracts
### 2.1.1. ayg_erc20.sol 
### 2.1.2. ayg_app.sol 
### 2.1.3. ayg_erc721.sol

## 2.2. Tests unitaires des Smarts Contracts
### 2.2.1. Résultat du Coverage
### 2.2.2. Résultat de la consomation de gas

## 2.3. Documentation des Smarts Contracts
### 2.3.1. Utilisation de NatSpec
### 2.3.2. Mise en ligne de la documentation


## 2.4. Utilisation d'un Oracle
## 2.5. Utilisation d'INFURA
## 2.5. Utilisation d'IPFS

<br />
<br />
<br />
<br />
<br />





![N|Solid](assets/ban_hr.png)

# 3. DAPP

## 3.1 Librairie UI
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

<br />
<br />
<br />
<br />
<br />





![N|Solid](assets/ban_hr.png)

# 4. MISE EN LIGNE

## 4.1 Choix de l'hébergement

## 4.2 Deployement

<br />
<br />
<br />
<br />
<br />





![N|Solid](assets/ban_hr.png)

# 5. JEUX DE DONNEES

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
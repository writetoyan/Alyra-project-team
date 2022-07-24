![N|Solid](assets/ban_logo.png)

Ce projet DeFi consiste à mettre en place une solution de stacking ERC20 utilisant une méthode de récompense proportionnelle au montant stacké.

__Auteurs :__
- Alex
- Yannick
- Gregory


<br />

# Spécifications fonctionnelles
- Pouvoir 'stake' son token ERC20
- Pouvoir 'unstake' ses tokens
- Créer son propre token de récompense ou utiliser l’ETH ou un autre token ERC20 
- Respecter un ratio entre la quantité de la récompense et la valeur bloquées sur le smart contract
- Utiliser l’oracle Chainlink

<br />

# Table des matières  
- [Spécifications fonctionnelles](#spécifications-fonctionnelles)
- [Table des matières](#table-des-matières)
- [DOSSIER DE TRAVAIL](#dossier-de-travail)
  - [1.1.Installation des PACKAGES](#11installation-des-packages)
    - [1.1.1 TRUFFLE-UNBOX-REACT](#111-truffle-unbox-react)
    - [1.1.2. HDWalletProvider](#112-hdwalletprovider)
    - [1.1.3. DOTENV](#113-dotenv)
    - [1.1.4. MochaJS](#114-mochajs)
    - [1.1.5. ChaiJS](#115-chaijs)
    - [1.1.6. Solidity Coverage](#116-solidity-coverage)
    - [1.1.6. Eth-Gas-Reporter](#116-eth-gas-reporter)
  - [1.2. Paramétrage des fichiers de configurations](#12-paramétrage-des-fichiers-de-configurations)
  - [Smart Contracts](#smart-contracts)
  - [Documentation NatSpec](#documentation-natspec)
- [2. SMARTS CONTRACTS](#2-smarts-contracts)
  - [2.1. ayg_erc20.sol](#21-ayg_erc20sol)
- [3. DAPP](#3-dapp)
- [4. MISE EN LIGNE](#4-mise-en-ligne)


<br />

![N|Solid](assets/ban_hr.png)

<div id='dossierdetravail'/> 


# DOSSIER DE TRAVAIL


Création du dossier depuis lequel nous allons travailler

```sh
$ mkdir ayg_labs
$ cd ayg_labs
```

<br /><hr />

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




### 1.1.6. Eth-Gas-Reporter

```sh
$ npm install --save-dev --prefixe . eth-gas-reporter 
```

<br />




<br /><hr />

<div id='parametragefichierconfig'/> 

## 1.2. Paramétrage des fichiers de configurations

...

<br /><hr />
## Smart Contracts






<br /><hr />
## Documentation NatSpec









<br />

![N|Solid](assets/ban_hr.png)

<div id='smartcontract'/> 

# 2. SMARTS CONTRACTS



<div id='aygerc20'/> 


## 2.1. ayg_erc20.sol 


...


<br />




<br />

![N|Solid](assets/ban_hr.png)

<div id='dapp'/> 

# 3. DAPP





<br />

![N|Solid](assets/ban_hr.png)

<div id='misenligne'/> 

# 4. MISE EN LIGNE




<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />

![N|Solid](assets/ban_foot.png)

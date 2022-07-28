// Import NPM
import React, { useEffect, useState } from 'react';
import Dapp_Contract from './contracts/Dapp_Greg.json';
import Erc20AYG_Contract from './contracts/Erc20_AYG.json';
import getWeb3 from './getWeb3';

// Import ASSETS
import './App.css';

// Import UI
import CssBaseline from '@mui/material/CssBaseline';

// Import COMPONENTS
import CnxWeb3 from "./components/CnxWeb3";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Footer from "./components/Footer";



function App() {
  const [state, setState] = useState({ isOwner: false, web3: null, accounts: null, contract: null });

  const [addrOwner, setAddrOwner] = useState(0);
  const [addrUser, setAddrUser] = useState(0);
  const [displayAdmintool, setDisplayAdmintool] = useState(0);

  useEffect(() => {
    (async function () {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
  
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
  
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Dapp_Contract.networks[networkId];
  
        const instance = new web3.eth.Contract(Dapp_Contract.abi, deployedNetwork && deployedNetwork.address);
        console.log(instance.methods);



//      let workflowStatus = await instance.methods.workflowStatus().call();
        let owner = await instance.methods.owner().call();
//        setContractState({ owner: owner, workflowStatus: workflowStatus });
  
        setState({ web3: web3, accounts: accounts, contract: instance });
  
        const addrOwner = setAddrOwner(owner);
        const addrUser = setAddrUser(accounts[0]);
  
        if(owner==accounts[0]){
          setDisplayAdmintool(1);
  //          await SetDisplayAdmintool();
        }
  
  
        
      } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        const addrUser = setAddrUser(accounts[0]);

        const TOKEN_ADDRESS = "0x4fa8a098151D6d739Dab43D414164225D5e8Fd58" //AYG
        const erc20token = new web3.eth.Contract(Erc20AYG_Contract.abi, TOKEN_ADDRESS)
        
        console.log(erc20token.methods);

        erc20token.methods.name().call(function (err, res) {
          if (err) {
            console.log("Une erreur s'est produite", err)
            return
          }
          console.log("Le token est : ", res)
        })

        erc20token.methods.totalSupply().call(function (err, res) {
          if (err) {
            console.log("Une erreur s'est produite", err)
            return
          }
          console.log("La totalSupply est de : ", res)
        })
        console.log("addrUser = "+addrUser)


/*
        deposit = async(depositAmount)=>{
          const web3 = window.web3
          const ethers = web3.utils.toWei(this.depositAmount.value, 'ether')
          await web3.contract.methods.Deposit(depositAmount).send({from: this.account, value: ethers})
        }
*/
//        erc20token.methods.faucet(addrUser, 1000000000000000000).send({from: addrUser})
//          .then(function () {
//            console.log("Claim Faucet OK : ")
//          });


//        handleSubmit = async (e) => {
//          e.preventDefault();
//          const component = this;
/*
          await erc20token.methods.faucet(addrUser, 1000000000000000000).send({ from: addrUser })
            .then(function (receipt) {
              let newProposal = receipt.events.ProposalRegistered.returnValues.proposalId;
//              component.setState({ toastResult: "Proposition n°" + newProposal + " viens d'être ajoutée !" });
              setTimeout(() => window.location.reload(), 3000);
            });
//        }
*/

      } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
      }
    })();
  }, []);

  if (!state.web3) {

    return (
      <div>
        <CnxWeb3></CnxWeb3>
      </div>
    );

  } else {

    return (
      <div className="App">

        <CssBaseline />

        <ResponsiveAppBar
          contract={state.contract}
          account={state.accounts[0]}
          addrUser={addrUser}
        />

        <Footer> </Footer>
      </div>
    );

  }


};

export default App;
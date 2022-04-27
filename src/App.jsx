import { useAddress, useMetamask, useEditionDrop, useToken, useVote, useNetwork } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import './App.css';
import { ChainId } from '@thirdweb-dev/sdk';
import { AddressZero } from "@ethersproject/constants";
import Confetti from 'react-confetti'

const App = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  const network = useNetwork();
  const connectWithMetamask = useMetamask();
  console.log("👋 Address:", address);

  // Initialize our editionDrop contract
  const editionDrop = useEditionDrop("0x77738af784B6C36Bd5C741059499A9592F312ea9");

  const token = useToken("0x684f9205b38B3dd0D31B8d5c2192256f50435453");
    const vote = useVote("0x9F28ceE0C3BCED1cD52C2b7C2fDa8446bA638382");
  // State variable for us to know if user has our NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming lets us easily keep a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false);
    
    // Holds the amount of token each member has in state.
const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
// The array holding all of our members addresses.
const [memberAddresses, setMemberAddresses] = useState([]);

// A fancy function to shorten someones wallet address, no need to show the whole thing. 
const shortenAddress = (str) => {
  return str.substring(0, 6) + "..." + str.substring(str.length - 4);
};
  const [proposals, setProposals] = useState([]);
const [isVoting, setIsVoting] = useState(false);
const [hasVoted, setHasVoted] = useState(false);
  const [showNFT, setShowNFT] = useState(false);
  const [count, setCount] = useState(0);
  

// Retrieve all our existing proposals from the contract.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // A simple call to vote.getAll() to grab the proposals.
  const getAllProposals = async () => {
    try {
      const proposals = await vote.getAll();
      setProposals(proposals);
    } catch (error) {
      console.log("failed to get proposals", error);
    }
  };
  getAllProposals();
}, [hasClaimedNFT, vote]);

// We also need to check if the user already voted.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // If we haven't finished retrieving the proposals from the useEffect above
  // then we can't check if the user voted yet!
  if (!proposals.length) {
    return;
  }

  const checkIfUserHasVoted = async () => {
    try {
      const hasVoted = await vote.hasVoted(proposals[2].proposalId, address);
      setHasVoted(hasVoted);
      if (hasVoted) {
        console.log("🥵 User has already voted");
      } else {
        console.log("🙂 User has not voted yet");
      }
    } catch (error) {
      console.error("Failed to check if wallet has voted", error);
    }
  };
  checkIfUserHasVoted();

}, [hasClaimedNFT, proposals, address, vote]);
// This useEffect grabs all the addresses of our members holding our NFT.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
  // with tokenId 0.
  const getAllAddresses = async () => {
    try {
      const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
      setMemberAddresses(memberAddresses);
      console.log("🚀 Members addresses", memberAddresses);
    } catch (error) {
      console.error("failed to get member list", error);
    }

  };
  getAllAddresses();
}, [hasClaimedNFT, editionDrop.history]);

// This useEffect grabs the # of token each member holds.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  const getAllBalances = async () => {
    try {
      const amounts = await token.history.getAllHolderBalances();
      setMemberTokenAmounts(amounts);
      console.log("👜 Amounts", amounts);
    } catch (error) {
      console.error("failed to get member balances", error);
    }
  };
  getAllBalances();
}, [hasClaimedNFT, token.history]);

// Now, we combine the memberAddresses and memberTokenAmounts into a single array
const memberList = useMemo(() => {
  return memberAddresses.map((address) => {
    // We're checking if we are finding the address in the memberTokenAmounts array.
    // If we are, we'll return the amount of token the user has.
    // Otherwise, return 0.
    const member = memberTokenAmounts?.find(({ holder }) => holder === address);

    return {
      address,
      tokenAmount: member?.balance.displayValue || "0",
    }
  });
}, [memberAddresses, memberTokenAmounts]);
  
  useEffect(() => {
    // If they don't have an connected wallet, exit!
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("Failed to get balance", error);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  const proceed = () => {
    setHasClaimedNFT(true);
    setShowNFT(false);
  }

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setShowNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to mint NFT", error);
    } finally {
      setIsClaiming(false);
    }
     
  };
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const s = new Date();
let dayString = days[s.getDay()];
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];


let month = months[s.getMonth()];
  let dayNum = s.getDate();
  let year = s.getFullYear();

 

 

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  
    return (
      <div className="content">
        {showNFT && <Confetti />}
         <div className="yellow-bgn">{!address && (<h1>Welcome to <span>ScholarDAO</span></h1>)}
           {address && (<h1 className="welcome">Welcome to ScholarDAO</h1>)}
           {!address && (<button onClick={connectWithMetamask} className="btn-hero">
          Connect your wallet
        </button>)}
           </div>
       {!address && (<div className="landing"></div>)}
      {address && (<div><div className="landing2">
       </div> 
        {(network?.[0].data.chain.id !== ChainId.Rinkeby) && (
    <div className="rinkeby-caution">
      <h2>Please connect to Rinkeby</h2>
      <p>
        This dapp only works on the Rinkeby network, please switch networks
        in your connected wallet.
      </p>
    </div>)
      }
        {(network?.[0].data.chain.id == ChainId.Rinkeby) && (<div>
                   {!hasClaimedNFT &&(
        <div>
        {!showNFT && (<div className="mint-nft">     
      <h1>Mint your free 🍪DAO Membership NFT</h1>
      <button
        className="btn-mint"
        disabled={isClaiming}
        onClick={mintNft}
      >
        {isClaiming ? "Minting..." : "Mint Your NFT (FREE)"}
      </button>
          </div>)}
    {showNFT && (
          <div className="show-nft"> 
            <h1>Congratulations Scholar!</h1>
        <div class="card-container">
    <div class="card-nft">
    <section className="section1">
    
                <img src="scripts/assets/fourmen.jpg" className="image" />
                
    
       
      </section>
      <section className="section2">
                <img src="scripts/assets/fourmen.jpg" className="image" />
      </section>
          </div>
       </div> 
            <div className="button-box">
            <a href={`https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`} target="_blank">View your NFT on OpenSea </a>
            <div onClick={proceed} className="button">Proceed</div>
              </div>
            </div>
    )}
    </div>)} 
      {hasClaimedNFT && (<div className="member-page">
      <h1>🍪DAO Member Page</h1>
        <div className="cards-page">
          <div className="member-section">
        <div className="member-cards">
          <h2>Member List</h2>
          <div class="scrollit">
          <table className="card">
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
            </div>
        </div>
            <div className="dao-updates">
          <h2>DAO Updates</h2>    
<div className="container">
 <div>
  <div className="slides-wrapper">
   <div className="img-container text">
      <p><span className="date">{dayString}, {dayNum} {month} {year}.</span>
ScholarDAO to fund cryptocurrency projects by university students
        <small>The newly launched ScholarDAO will allocate $11 million a year to university-level students working...<a href="#">Read More</a></small></p>
      
    </div>
  <div className="img-container text">
      <p><span className="date">{dayString}, {dayNum} {month} {year}.</span>
ScholarDAO to fund cryptocurrency projects by university students
        <small>The newly launched ScholarDAO will allocate $11 million a year to university-level students working...<a href="#">Read More</a></small></p>
      
    </div>
    <div className="img-container text">
      <p><span className="date">{dayString}, {dayNum} {month} {year}.</span>
ScholarDAO to fund cryptocurrency projects by university students
        <small>The newly launched ScholarDAO will allocate $11 million a year to university-level students working...<a href="#">Read More</a></small></p>
      
    </div>
  </div>
  <div className="slide-change">
  <a className="prev" onclick="plusSlides(-1)">❮</a>
<a className="next" onclick="plusSlides(1)">❯</a>
  </div>
  <div className="slider">
    <div class="selected"></div>
     <div className="slider-button" onclick="currentSlide(1)"></div>
     <div className="slider-button" onclick="currentSlide(2)"></div>
     <div className="slider-button" onclick="currentSlide(3)"></div>
  </div>
    </div>
</div>
              </div>
              </div>
           <div className="cards">
            <h2>Active Proposals</h2>
            <form
               onSubmit={
                 
                 async(e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);

                // lets get the votes from the form for the values
                const votes = proposals.map( (proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // first we need to make sure the user delegates their token to vote
                try {
                  //we'll check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await token.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await token.delegateTo(address);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await vote.get(proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return vote.vote(proposalId, _vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      })
                    );
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await vote.get(proposalId);

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      // and log out a success message
                      console.log("successfully voted");
                    } catch (err) {
                      console.error("failed to execute votes", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  }
                } catch (err) {
                  console.error("failed to delegate tokens", err);
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
              >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="proposal-card">
                  <h3>{proposal.description}</h3>
                  <div className="input-section">
                    {proposal.votes.map(({ type, label }) => (
                      <div 
                        className="radio-input"
                        key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                          //default the "abstain" vote to checked
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button className="btn-submit" disabled={isVoting || hasVoted} type="submit"
              
                >
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
              </button>
              {!hasVoted && (
                <small>
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
            </form>
          </div>
      </div>
        
    </div>)}
      </div>)}
        </div>)}
        
        </div>
    );


  // This is the case where we have the user's address
  // which means they've connected their wallet to our site!
  
}

export default App;

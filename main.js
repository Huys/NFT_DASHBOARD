Moralis.start({ serverUrl: "https://fvtcw5amiayk.bigmoralis.com:2053/server", appId: "lGpcDeXRp3W19ykVzdLEr0BQrz9126tIxkfANs7U" });
let currentUser;

function fetchNFTMetadata(NFTs) {
  let promises = [];
  for (let i = 0; i < NFTs.length; i++) {
    let nft = NFTs[i];
    let id = nft.token_id;
    promises.push(fetch("https://fvtcw5amiayk.bigmoralis.com:2053/server/functions/getNFT?_ApplicationId=lGpcDeXRp3W19ykVzdLEr0BQrz9126tIxkfANs7U&nftId=" + id)
      .then(res => res.json())
      .then(res => JSON.parse(res.result))
      .then(res => { nft.metadata = res; })
      .then(res => {
        const options = { address: CONTRACT_ADDRESS, token_id: id, chain: "rinkeby" };
        return Moralis.Web3API.token.getTokenIdOwners(options)
      })
      .then(res => {
        nft.owners = [];
        res.result.forEach(element => {
          nft.owners.push(element.owner_of);
        })
        return nft;
      }));
  }
  return Promise.all(promises);
}

function renderInventory(NFTs, ownerData) {
  const parent = document.getElementById("app");
  for (let i = 0; i < NFTs.length; i++) {
    const nft = NFTs[i];
    console.log(nft)
    let htmlString = `
    <div class="card">
      <img class="card-img-top" src=${nft.metadata.image} alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">${nft.metadata.name}</h5>
        <p class="card-text">${nft.metadata.description}</p>
        <p class="card-text">Amount: ${nft.amount}</p>
        <p class="card-text">Number of Owners: ${nft.owners.length}</p>
        <p class="card-text">Your balance: ${ownerData[nft.token_id] || 0}</p>
        <a href="/mint.html?nftId=${nft.token_id}" class="btn btn-primary">Mint</a>
        <a href="/transfer.html?nftId=${nft.token_id}" class="btn btn-primary">Transfer</a>
      </div>
    </div>
    `
    let col = document.createElement("div");
    col.className = "col col-md-4"
    col.innerHTML = htmlString;
    parent.appendChild(col);

  }
}

async function getOwnerData() {
  let accounts = currentUser.get("accounts");
  const options = { chain: "rinkeby", address: accounts[0], token_address: CONTRACT_ADDRESS }
  return Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
    let result = data.result.reduce((object, currentElement) => {
      object[currentElement.token_id] = currentElement.amount;
      return object;
    }, {})
    return result;
  });
}

async function initializeApp() {
  currentUser = Moralis.User.current();
  if (!currentUser) {
    currentUser = await Moralis.authenticate({ signingMessage: "Log in using Moralis" });
  }

  const options = { address: CONTRACT_ADDRESS, chain: "rinkeby" };
  let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
  let NFTWithMetadata = await fetchNFTMetadata(NFTs.result);
  let ownerData = await getOwnerData();
  renderInventory(NFTWithMetadata, ownerData);
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
  window.location.pathname=''
}

initializeApp();

document.getElementById("log-out").onclick = logOut;
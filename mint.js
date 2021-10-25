Moralis.start({ serverUrl: "https://fvtcw5amiayk.bigmoralis.com:2053/server", appId: "lGpcDeXRp3W19ykVzdLEr0BQrz9126tIxkfANs7U" });
let web3;

async function init() {
  let currentUser = Moralis.User.current();
  if (!currentUser) {
    window.location.pathname = "/index.html";
  }

  web3 = await Moralis.enableWeb3();
  let accounts = await web3.eth.getAccounts();


  const urlParams = new URLSearchParams(window.location.search);
  const nftId = urlParams.get("nftId");
  document.getElementById("token_id_input").value = nftId;
  document.getElementById("address_input").value = accounts[0];
}

async function mint() {
  let tokenId = parseInt(document.getElementById("token_id_input").value);
  let address = document.getElementById("address_input").value;
  let amount = parseInt(document.getElementById("amount_input").value);
  const accounts = await web3.eth.getAccounts();
  const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
  contract.methods.mint(address, tokenId, amount).send({ from: accounts[0], value: 0 })
    .on("receipt", function (receipt) {
      alert("Mint done");
    })
}

document.getElementById("submit_mint").onclick = mint;

init();
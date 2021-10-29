Moralis.start({ serverUrl: "https://fvtcw5amiayk.bigmoralis.com:2053/server", appId: "lGpcDeXRp3W19ykVzdLEr0BQrz9126tIxkfANs7U" });

async function init() {
  let currentUser = Moralis.User.current();
  if (!currentUser) {
    window.location.pathname = "/index.html";
  }

  await Moralis.enableWeb3();

  const urlParams = new URLSearchParams(window.location.search);
  const nftId = urlParams.get("nftId");
  document.getElementById("token_id_input").value = nftId;
}

async function transfer() {
  let tokenId = parseInt(document.getElementById("token_id_input").value);
  let address = document.getElementById("address_input").value;
  let amount = parseInt(document.getElementById("amount_input").value);

  const options = {
    type: "erc1155",
    receiver: address,
    contract_address: CONTRACT_ADDRESS,
    token_id: tokenId.toString(),
    amount: amount
  }
  let result = await Moralis.transfer(options);
  console.log(result)
}

document.getElementById("submit_transfer").onclick = transfer;

init();
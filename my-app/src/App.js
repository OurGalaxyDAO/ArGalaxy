import logo from './logo.svg';
import './App.css';
import Arweave from 'arweave'
// import * as Buffer from 'buffer';
// const Arweave = require('arweave');
import {Buffer} from 'buffer';
// import dotenv from "dotenv";
require('dotenv').config()
dotenv.config();
Buffer.from('anything','base64');
const IPFS = require('ipfs')
// import * as IPFS from 'ipfs-core'
const arweave = Arweave.init({
  host: '127.0.0.1',
  port: 1984,
  protocol: 'http'
});
function App()  {
 
  
  async function getImage(){
    let pathTree = []

    //  get input from client 
    let uri = document.getElementById("nftUri").value
    const validCID  = uri;
    
    // start fetch things with ipfs
    console.log("start ipfs")
    const ipfs = await IPFS.create();
    console.log("started !")
    console.log(ipfs.ls(validCID))
    for await (const file of ipfs.ls(validCID)) {
      console.log(file.path)
      pathTree.push(file.path)
    }
    console.log(pathTree)
    console.log("finished")
    // finished fectch path and store all path in pathTree
    
    let fronturi = "https://ipfs.io/ipfs/" //QmQ5ZEKtszvy1FLwgTexb5LJJiQ9yZgVLXTbE3fhSiAdJ4
    let finaluri = fronturi + pathTree[0] 
    const img = document.getElementById("nftImg")
    // set up the source of the img
    console.log(finaluri)
    img.src = finaluri
    img.style.display = ""
    // check for error
    img.addEventListener('error', function handleError() {
      console.log(img.src);
      document.getElementById("status").innerText = "invalid uri"
      img.style.display = "none"
      img.src = 'https://upload.wikimedia.org/wikipedia/commons/a/a5/About.me_icon.jpg';
    });
    uploadImage(pathTree)
    
  }
  async function uploadImage(pathTree){
    for (let i in pathTree){
      let fronturi = "https://ipfs.io/ipfs/" //QmQ5ZEKtszvy1FLwgTexb5LJJiQ9yZgVLXTbE3fhSiAdJ4
      let finaluri = fronturi + pathTree[i]
      const imageDataUri = getDataUrl(finaluri)

      console.log("Finallyyyyyyyyy",imageDataUri)
      const imageBuffer = Buffer.from(imageDataUri.split(",")[1], "base64");

      // Create and submit transaction
      const key = JSON.parse(process.env.KEY);
      const transaction = await arweave.createTransaction(
        {
          data: imageBuffer,
        },
        key
      );

      await arweave.transactions.sign(transaction, key);
      await arweave.transactions.post(transaction);

      // Transaction ID gets updated after arweave.transactions.post, which is a bit unintuitive
      console.log("transaction ID", transaction.id);

      // Read data back
      const transactionData = await arweave.transactions.getData(transaction.id);
      console.log(
        "transaction data",
        Buffer.from(transactionData, "base64").toString()
      );
    }
  }
  function getDataUrl(url) {
    // create image
    console.log(url)
    var img = new Image;
    
    // Create canvas
    console.log("generating uri")
    var  myCanvas = document.getElementById("imgCanvas")
    // myCanvas.width = img.width;
    // myCanvas.height = img.height;
    var  ctx = myCanvas.getContext('2d');
    // 
    img.onload = function(){
      
      ctx.drawImage(img,0,0);
    }
    img.src = url;
    // Set width and height
    
    // // Draw the image
    // ctx.drawImage(img, 0, 0);
    console.log(myCanvas.toDataURL('image/png'))
    return myCanvas.toDataURL('image/png');
 }
  
  return (
    <div className="App">
      <div>
        <h2>
          Please input your nft uri
        </h2>
        {/*  QmQ5ZEKtszvy1FLwgTexb5LJJiQ9yZgVLXTbE3fhSiAdJ4 */}
        {/* https://gateway.pinata.cloud/ipfs/QmQ5ZEKtszvy1FLwgTexb5LJJiQ9yZgVLXTbE3fhSiAdJ4 */}
        <input type="text" id="nftUri"></input>
        <button onClick={getImage}>
          submit
        </button>
        <img id="nftImg"></img>
        <h3 id="status"></h3>
        <canvas id="imgCanvas"></canvas>
      </div>
    </div>
  );
}

export default App;

// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAABGJJREFUeF7t1AEJAAAMAsHZv/RyPNwSyDncOQIECEQEFskpJgECBM5geQICBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAgQdWMQCX4yW9owAAAABJRU5ErkJggg==
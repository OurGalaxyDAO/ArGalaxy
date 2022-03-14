import logo from './logo.svg';
import './App.css';
const IPFS = require('ipfs')
// import * as IPFS from 'ipfs-core'
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
      </div>
    </div>
  );
}

export default App;

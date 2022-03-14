import logo from './logo.svg';
import './App.css';

function App()  {
  function getImage(){
    //  get input from client 
    let uri = document.getElementById("nftUri").value
    let fronturi = ""//"https://gateway.pinata.cloud/ipfs/"
    let finaluri = fronturi + uri 
    const img = document.getElementById("nftImg")
    // set up the source of the img
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

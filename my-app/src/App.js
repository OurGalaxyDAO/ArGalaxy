// for css
import { Layout, Menu, Breadcrumb,Steps, Button, message  } from 'antd';
import { FileOutlined , HomeOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

import React from 'react';
import logo from './logo.svg';
import './App.css';
import Arweave from 'arweave'
// import * as Buffer from 'buffer';
// const Arweave = require('arweave');
import {Buffer} from 'buffer';

// frontend element
const { SubMenu } = Menu;
const { Header, Content, Footer } = Layout;
const navTitle = ["home","doc"];
const { Step } = Steps;


// import dotenv from "dotenv";
// require('dotenv').config()
// dotenv.config();
Buffer.from('anything','base64');
const IPFS = require('ipfs')
// import * as IPFS from 'ipfs-core'
const arweave = Arweave.init({
  host: '127.0.0.1',
  port: 1984,
  protocol: 'http'
});
function App()  {
  
  // document.getElementById("btn_getimg").onclick=getImage()
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

  // for front end
  function handleNav(index){
    if (index==0){
      window.location.reload();
    }
    if(index==1){
      window.open("https://github.com/OurGalaxyDAO/ArGalaxy-NFT-migration-to-Arweave")
      
    }

  }

  const steps = [
    {
      title: 'First',
      content: <div class="steps_container"><h2> Please input your nft uri</h2>
                {/*  QmQ5ZEKtszvy1FLwgTexb5LJJiQ9yZgVLXTbE3fhSiAdJ4 */}
                {/* https://gateway.pinata.cloud/ipfs/QmQ5ZEKtszvy1FLwgTexb5LJJiQ9yZgVLXTbE3fhSiAdJ4 */}
                <input type="text" id="nftUri"></input>
                <button id="btn_getimg" onClick={getImage}>
                  submit
                </button>
                <img id="nftImg"></img>
                <h3 id="status"></h3>
                <canvas id="imgCanvas"></canvas></div>,
    },
    {
      title: 'Second',
      content: 'Second-content',
    },
    {
      title: 'Last',
      content: 'Last-content',
    },
  ];

  const [current, setCurrent] = React.useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  return (
    
    <div className="App">
       
          <Layout className="layout">
              <Header style={{ position: 'fixed', zIndex: 100, width: '100%' }}>
                <div className="logo">
                  <img className='companylogo' src={require('./img/arweave2.png')}/>
                </div>
                <Menu theme='light' mode="horizontal" defaultSelectedKeys={['0']}>
                  {new Array(2).fill(null).map((_, index) => {
                      if (index == 0) return <Menu.Item icon={<HomeOutlined />} key={index} onClick={() => handleNav(index)}>{navTitle.at(index)}</Menu.Item>;
                      if (index == 1) return <Menu.Item icon={<FileOutlined />} key={index}onClick={() => handleNav(index)}>{navTitle.at(index)}</Menu.Item>;
                    return <Menu.Item key={index} onClick={() => handleNav(index)}>{navTitle.at(index)}</Menu.Item>;
                  })}
                </Menu>
              </Header>
          </Layout>
      <div id="Cover">
        {/* overlay for cover */}
        <div id="Coverup"></div>
        
          <div id="title_container">
          
            <h1>NFT Migration <br/>to Arweave</h1>
            <h3>Presented by ArGalaxy</h3>
            <h4>Trusted by:&ensp; <span id="title_container_number">21238</span> Users Worldwide <br/>Supported by: &ensp;Arweave</h4>
            
          </div>
          <div id="slogan_container">
            <h3 id="slogan_container_first">few clicks to   <span id="slogan_container_secure"> Secure Your NFTs</span></h3>
            <h2>Permanently </h2>
          </div>
          <div id="logo"></div>

      </div>
      
      <div id="input_container">
        <div id="input_container_bg" >
          <h3>Migrate Now!</h3>
          <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
          </Steps>
          <div className="steps-content">{steps[current].content}</div>
          <div className="steps-action">
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={() => message.success('Processing complete!')}>
                Done
              </Button>
            )}
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                Previous
              </Button>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default App;

// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAABGJJREFUeF7t1AEJAAAMAsHZv/RyPNwSyDncOQIECEQEFskpJgECBM5geQICBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAgQdWMQCX4yW9owAAAABJRU5ErkJggg==
import React from 'react';
import {Button, Slider, Input, Upload,Checkbox, message, Icon} from 'antd';
import tv from '../data/img/tv.png';
import test from '../data/img/test.jpg';
import '../index.css';
import { relative } from 'path';
import copyIcon from '../data/icon/copycode_btn.png';
import uploadIcon from '../data/icon/upload_btn.png';
import generateIcon from '../data/icon/generate_btn.png';
import originImgBg from '../data/icon/originimg_bg.png';
import mainBg from '../data/icon/main_bg.png';

var maincanvas, img;
const contentWidth = 1070;
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
class MainPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            // ImageSrc:null,
            code:'',
            pixelData:null,
            renderWidth:0,
            renderHeight:0,
            renderFontSize:3,
            fontBold:false,
            CurrentFileName:'',
        }
    }
    handleOnRenderSizeChange=()=>{
        var renderWidthInput = document.getElementById('renderWidthInput');
        var renderHeightInput = document.getElementById('renderHeightInput');
        this.setState({
            renderWidth:renderWidthInput.value,
            renderHeight:renderHeightInput.value,
        })
    }
    handleOnRenderFontSizeChange=(value)=>{
        this.setState({
            renderFontSize:value,
        })
    }
    handleOnFontBold=()=>{
        var fontB = this.state.fontBold;
        this.setState({
            fontBold:!fontB,
        })
    }

    // handleUpload=()=>{
    //     var file = document.getElementById('mainUploadFile').files[0];
    //     var fileSrc = window.URL.createObjectURL(file);
    //     this.setState({
    //         ImageSrc:fileSrc,
    //         CurrentFileName:file.name,
    //         code:''
    //     },()=>{
    //         const _this = this;
    //         img = document.getElementById('mainImg');
    //         img.onload = function(){
                
    //             _this.setState({
    //                 renderWidth:img.width,
    //                 renderHeight:img.height,
    //             })
    //         }
    //     })
    // }

    handleUpload=(info)=>{
        if (info.file.status !== 'uploading') 
        {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') 
          {
            getBase64(info.file.originFileObj, imageUrl => this.setState({
                imageUrl,
                loading: false,
              },()=>{
                const _this = this;
                img = document.getElementById('mainImg');
                img.onload = function(){
                
                _this.setState({
                    renderWidth:img.width,
                    renderHeight:img.height,
                })
            }
              }));
            message.success(`${info.file.name} file uploaded successfully`);
          } 
          else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
            
          }

    }

    handleFakeUploadOnClick=()=>{
        document.getElementById('mainUploadFile').click();
    }
    handleCopyClick=()=>{
        var copyContent = document.getElementById('mainTextarea');
        copyContent.select();
        document.execCommand("Copy");
    }
    handleGenerateClick=()=>{
        maincanvas = document.createElement('canvas');
        maincanvas.width = this.state.renderWidth;
        maincanvas.height = this.state.renderHeight;
        maincanvas.getContext('2d').drawImage(img, 0, 0, this.state.renderWidth, this.state.renderHeight);
        var tempPixelData = maincanvas.getContext('2d').getImageData(0, 0, this.state.renderWidth, this.state.renderHeight).data;
        // console.log(tempPixelData)
        this.setState({
            pixelData : tempPixelData,
            code:''
        },()=>{
            var i = 0, newLine = 0;
            var currentCode = this.state.code;
            var pixelData = this.state.pixelData;

            while(i<pixelData.length)
            {
                var grey = (pixelData[i]+pixelData[i+1]+pixelData[i+2])/3;
                if(grey<25)
                {
                    currentCode = currentCode+'M';
                }
                else if(grey<50){
                    currentCode = currentCode+'#';
                }
                else if(grey<75){
                    currentCode = currentCode+'H';
                }
                else if(grey<100){
                    currentCode = currentCode+'A';
                }
                else if(grey<125){
                    currentCode = currentCode+'V';
                }
                else if(grey<150){
                    currentCode = currentCode+'=';
                }
                else if(grey<175){
                    currentCode = currentCode+'+';
                }
                else if(grey<200){
                    currentCode = currentCode+'-';
                }
                else if(grey<225){
                    currentCode = currentCode+'.';
                }
                else{
                    currentCode = currentCode+' ';
                }
                i = i+4;
                newLine = newLine+1;
                if(newLine%this.state.renderWidth==0)
                {
                    currentCode = currentCode+'\n';
                    this.setState({
                        code:currentCode,
                    })
                }

            }
        })
        
    }
    
    
    render(){
        return (
            <div style={{backgroundImage: 'url('+mainBg+')',backgroundRepeat:'repeat-y', width:'100%',  display:'flex', flexDirection:'column', alignItems:'center'}}>
            <div style={{height:160, display:'flex', justifyContent:'center', alignItems:'center'}}>
                {/* <span style={{width:486, height:78,  cursor:'pointer'}}
                    onClick={this.handleFakeUploadOnClick.bind(this)}>
                    <img src={uploadIcon}></img>
                    <input id='mainUploadFile' type='file'  onChange={this.handleUpload.bind(this)} 
                    style={{width:120, height:48, display:'none'}}>
                    </input>
                </span> */}
                <Upload name='file' action='https://www.mocky.io/v2/5cc8019d300000980a055e76' headers={{authorization: 'authorization-text',}} 
                onChange={this.handleUpload.bind(this)}>
                    <span style={{width:486, height:78,  cursor:'pointer'}}>
                        <img src={uploadIcon}></img>
                    </span>
                </Upload>
            </div>
            <div style={{backgroundImage: 'url('+originImgBg+')',width:contentWidth, height:668, display:'flex', flexDirection:'column', alignItems:'center'}}>
                <div style={{height:80,width:contentWidth-36,  display:'flex', alignItems:'center', 
                justifyContent:'flex-start',marginLeft:22, marginTop:2}}>
                    <p style={{width:960, marginLeft:30, color:'black', padding:8,fontSize:20,}}>当前图片：{this.state.CurrentFileName}</p>
                </div>
                <div style={{height:580,width:960,display:'flex', justifyContent:'center', alignItems:'center',marginLeft:20}}>
                    <img id='mainImg'  src={this.state.imageUrl} style={{maxHeight:560, maxWidth:936}}></img>
                </div>
                
            </div>
            <div style={{width:contentWidth, height:160, display:'flex', justifyContent:'space-around', alignItems:'center'}}>
                <span style={{width:430, height:78,  cursor:'pointer'}} onClick={this.handleGenerateClick.bind(this)}>
                    <img src={generateIcon}></img>
                </span>
                <span style={{width:430, height:78,  cursor:'pointer'}}  onClick={this.handleCopyClick.bind(this)}>
                    <img src={copyIcon}></img>
                </span>
            </div>
            <div >
                    <textarea id='mainTextarea' type="text" style={{margin:0,fontSize:this.state.renderFontSize,fontFamily:'宋体', width:contentWidth, height:800,
                    lineHeight:1,padding:0,borderRadius:5, border:'3px solid black', fontWeight:this.state.fontBold?'bold':'normal'}} wrap='off' value={this.state.code}></textarea>
            </div>
                
                
                <div style={{width:contentWidth, height:240,display:'flex',alignItems:'center'}}>
                    <div style={{width:contentWidth/2, float:'left', height:160}}>
                        <div style={{display:'flex', height:80, alignItems:'center'}}>
                            <p>宽&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度：</p>
                            <Input id='renderWidthInput' type='text' style={{width:100}} value={this.state.renderWidth} onChange={this.handleOnRenderSizeChange.bind(this)}>
                            </Input>
                            <p>&nbsp;&nbsp;pt</p>
                        </div>
                        <div style={{display:'flex', height:80,alignItems:'center'}}>
                            <p>高&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度：</p>
                            <Input id='renderHeightInput' type='text' style={{width:100}} value={this.state.renderHeight} onChange={this.handleOnRenderSizeChange.bind(this)}>
                            </Input>
                            <p>&nbsp;&nbsp;pt</p>
                        </div>

                    </div>
                    <div style={{width:contentWidth/2, float:'left', height:160}}>
                        <div style={{display:'flex', height:80, alignItems:'center'}}>
                            <p>字体大小：</p>
                        <Slider id='fontSizeTrack' style={{width:200}} min={1} max={50} defaultValue={this.state.renderFontSize} 
                        onChange={this.handleOnRenderFontSizeChange.bind(this)} step={0.1}></Slider>
                        </div>
                        <div style={{display:'flex', height:80,alignItems:'center'}}>
                        <p>加&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;粗：</p>
                    <Checkbox onChange={this.handleOnFontBold.bind(this)}></Checkbox>
                        </div>

                    </div>
                    
                    
                    
                    
                </div>
                
            </div>
            
        )
    }
}
export default MainPage;
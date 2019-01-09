import React, { Component } from 'react';
import { 
Button
 } from 'antd';
import style from './PointMap.less'

export default class PicturesWall extends Component {

  state={
    img:'',
    point:[],
    left:'',
    top:'',
    width:'',
    height:'',
    x:'',
    y:'',
  }

   getObjectURL = (file)=> {  
    let url = null;  
    if (window.createObjcectURL !== undefined) {  
        url = window.createOjcectURL(file);  
    } else if (window.URL !== undefined) {  
        url = window.URL.createObjectURL(file);  
    } else if (window.webkitURL !== undefined) {  
        url = window.webkitURL.createObjectURL(file);  
    }  
    return url;  
  }

  test = ()=> {
    const { a }  = this.refs;
    const  b =this.getObjectURL(a.files[0]);
    this.setState({
      img:b,
    })
  }

  clickImage =(e) => {
    console.log("sdd")
    let { point } = this.state;
    // const { b }  = this.refs;
    // const x = e.pageX-b.offsetLeft;
    // const y = e.pageY-b.offsetTop;
    console.log(e.pageX)
    point.push(
      <button  style={{left:`${e.pageX-5}px`,top:`${e.pageY-5}px`,position:'absolute',borderRadius:'10px 10px 10px 10px',height:'10px',width:'10px',backgroundColor:'rgb(30,144,253)',border:0,outline:'none'}}></button>
    )
    this.setState({
      // left:`${b.offsetLeft}px`, 
      // top:`${b.offsetTop}px`,
      // width:`${b.width}px`,
      // height:`${b.height}px`,
      point:point,
    })

  }

  render(){

    const { img,left,top,width,height,point } =  this.state ;
    console.log(point);

    return (
      <div style={{overflow:''}}>
        <span>
          <input type="file" ref="a" onChange={this.test.bind(this)} accept="image/png, image/jpeg, image/gif, image/jpg" />
        </span>
        <br />
        <div className={style.mydimg}>
          <img ref='b' src={img} alt="" onClick={this.clickImage.bind()} />
        </div>
        {
          point.map((value)=>{
            return value;
          })
        }
        {/* <div style={{position:'absolute',left:this.state.left,top:this.state.top,height:this.state.height,width:this.state.width,zIndex:10}}>
          {
            point
          }
        </div> */}
      </div>
    )
  }
}
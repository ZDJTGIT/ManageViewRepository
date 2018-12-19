import React,{Component,Fragment} from 'react';
import { Icon,Alert,Row,Col,Button } from 'antd';
import Result from '@/components/Result';
import styles from '../style.less';
import router from 'umi/router';

export default class Confirm extends Component{
  constructor(props){
    super(props);
    this.state={
    }
  }

  getType=(v)=>{
    return v?"success":"error";
  }

  getTitle=(v)=>{
    return v?"操作成功(❤ ω ❤)！":"操作失败(っ °Д °;)っ";
  }

  getDescription=(v)=>{
    return v?"可以前往项目模块中查看区间":"请检查数据重新提交~";
  }

  getAction=(v,back,onceMore)=>{
    if(v){
      return (
      <Fragment>
        <Button type="primary" onClick={()=>{onceMore()}}>
          再创一个
        </Button>
        <Button onClick={v=>{router.push('/monitor/test')}}>查看项目</Button>
      </Fragment>
      )
    }else{
      return(
        <Fragment>
        <Button type="primary" onClick={()=>{back()}}>
          返回重试
        </Button>
        <Button onClick={v=>{router.push('/monitor/startProject')}}>查看项目</Button>
      </Fragment>
      )
    }
  }

  render(){
    const { res,back,onceMore } = this.props;
    const actions = this.getAction(res,back,onceMore);
    return (
      <Result
        type={this.getType(res)}
        title={this.getTitle(res)}
        description={this.getDescription(res)}
        // extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  } 
}
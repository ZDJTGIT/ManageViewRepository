import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Input,Steps,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ProjectInfo from './steps/projectInfo';
import ChargeMan from './steps/chargeMan';
import Confirm from './steps/confirm';

const Step = Steps.Step;
const FormItem = Form.Item;
const { Option } = Select;

// 步骤条
const steps = [{
  title:'区间信息',
  content:'',
},{
  title:'联系人 ',
  content:'',
},{
  title:'完成情况',
  content:'',
}];

@Form.create()
@connect(({ sector }) => ({
  sector,
}))
export default class startProject extends Component{
  constructor(props){
    super(props);
    this.state={
      currentStep:0, // 当前步骤
      projectInfo:{}, // 区间信息
      chargeMan:{}, // 负责人信息
      addResult:true, // 结果页条件
    }
  }
  
  componentWillMount = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'sector/getAddSectorBase',
    })
  }

  // 结果页返回
  back=()=>{
    this.setState({currentStep:0});
  }

  onceMore=()=>{
    this.setState({currentStep:0,projectInfo:{},chargeMan:{}});
  }

  // 下一步
  nextStep = () =>{
    const { currentStep } = this.state;
    switch(currentStep){
      case 0:
        this.saveProjectInfo();
        break;
      case 1:
        this.saveChargeMan();
        break;
    }
    
  }

  // 保存区间信息
  saveProjectInfo = ()=>{
    const { currentStep } = this.state;
    const dom = this.content0;
    dom.validateFields((error,values)=>{
      if(!error){
        this.setState({projectInfo:values});
        const cur = currentStep + 1;
        this.setState({currentStep:cur});
      }else{
        return;
      }
    })
  }

  // 保存区间信息
  // saveInterval=()=>{
  //   const { currentStep } = this.state;
  //   const dom = this.content1;
  //   dom.validateFields((error,values)=>{
  //     if(!error){
  //       this.setState({interval:values});
  //       const cur = currentStep + 1;
  //       this.setState({currentStep:cur});
  //     }else{
  //       return;
  //     }
  //   })
  // }

  // 保存负责人
  saveChargeMan=()=>{
    const { currentStep } = this.state;
    const dom = this.content1;
    dom.validateFields((error,values)=>{
      if(!error){
        this.setState({chargeMan:values});
        const cur = currentStep + 1;
        this.setState({currentStep:cur});
      }else{
        return;
      }
    })
  }

  //保存告警人
  // saveAlarmLinkMan=()=>{
  //   const { currentStep } = this.state;
  //   const dom = this.content3;
  //   dom.validateFields((error,values)=>{
  //     console.log(values);
  //     this.setState({alarmLinkMan:values});
  //     const cur = currentStep - 1;
  //     this.setState({currentStep:cur});
  //   })
  // }

  // 上一步
  prevStep = () =>{
    const { currentStep } = this.state;
    if(currentStep === steps.length - 2){
      const { currentStep } = this.state;
      const dom = this.content1;
      dom.validateFields((error,values)=>{
        if(!error){
          this.setState({chargeMan:values});
          const cur = currentStep - 1;
          this.setState({currentStep:cur});
        }else{
          return;
        }
      })
    }
    const cur = currentStep - 1;
    this.setState({currentStep:cur});
  }

  // 提交
  addProject=()=>{
    const { projectInfo,currentStep } = this.state;
    const { dispatch,sector } = this.props;
    const dom = this.content1;
    dom.validateFields((error,values)=>{
      if(!error){
        this.setState({chargeMan:values});
        // const cur = currentStep - 1;
        dispatch({
          type: 'sector/addProject',
          payload:{
            projectInfo,
            values,
          },
          callback:v=>{
            const cur = currentStep + 1;
            if(v.code===100){
              this.setState({addResult:true});
            }
            this.setState({currentStep:cur});
          }
        });
      }else{
        return;
      }
    })
    
  }

  render(){
    const { currentStep,projectInfo,chargeMan,addResult } = this.state;
    const { form,sector } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <PageHeaderWrapper title="新建区间">
        <Card>
          <Steps current={currentStep}>
            {steps.map(v=>{
              return(<Step key={v.title} title={v.title} description={v.content} />);
            })}
          </Steps>
        </Card>
        <Card style={{marginTop:'10px'}}>
        <Alert 
          message="区间新增须知"
          description="新建区间前请先确认用户或者角色已存在！"
          type="warning"
          showIcon
          closable
        />
        {(()=>{
          switch(currentStep){
            case 0:
              return <ProjectInfo ref={c=>{this.content0 = c}} data={projectInfo} projectStatusData={sector.start.projectStatus} />;
            case 1:
              return <ChargeMan ref={c=>{this.content1 = c}} data={chargeMan} sectorRoleData={sector.start.sectorRole} memberData={sector.start.member} userData={sector.start.user}/>;
            case 2:
              return <Confirm res={addResult} back={()=>{this.back()}} onceMore={()=>{this.onceMore()}}/>
          }
        })()}
          <div className="steps-action">
          {
            currentStep < steps.length - 2
            && <Button type="primary" onClick={() => this.nextStep()} >下一步</Button>
          }
          {
            currentStep === steps.length - 2
            && <Button type="primary" onClick={() => this.addProject()}>提&emsp;交</Button>
          }
          {
            currentStep > 0&&currentStep !==2
            && (
            <Button style={{ marginLeft: 8 }} onClick={() => this.prevStep()}>
              上一步
            </Button>
            )
          }
        </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
import React,{Component} from 'react';
import { Select,Form,Icon } from 'antd';
import '@/pages/config'

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
export default class ChargeMan extends Component{
  constructor(props){
    super(props);
    this.state={
    }
  }

  render(){
    const { form,data,sectorRoleData,memberData,userData } = this.props;
    
    // 区段成员类型数组
    const temp = [];
    for (const key in sectorRoleData) {
      if (key != null) {
        temp.push({ x: key, y: sectorRoleData[key] });
      }
    };

    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      
    };
    return (
      <div>
        <Form layout="horizontal" style={{marginTop:'3%'}}>
          <FormItem label="负&nbsp;责&nbsp;人:" {...formItemLayout}>
            {getFieldDecorator('chargeMan', {
              rules: [
                { required: true, message: '请选择区间负责人' },
                // { validator: this.checkmonitorPoint },
              ],
              initialValue: data.chargeMan,
            })(
              <Select
                mode="multiple"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="区间负责人"
                showSearch
                optionFilterProp="children"
              >
                {userData.map(v=>{
                  return (<Option value={v.userId} key={v.userId}>{v.realName}</Option>);
                })}
              </Select>
            )}
          </FormItem> 
          <FormItem label="告警联系人:" {...formItemLayout}>
            {getFieldDecorator('alarmLinkMan', {
              rules: [
                { required: true, message: '请选择告警联系人' },
                // { validator: this.checkmonitorPoint },
              ],
              initialValue: data.alarmLinkMan,
            })(
              <Select
                mode="multiple"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="告警联系人"
                optionFilterProp="children" 
              >
                {
                  memberData.map(v=>{
                    return (<Option value={v.memberId} key={v.memberId}>{v.memberName}</Option>);
                  })
                }
              </Select>
            )}
          </FormItem> 
          {/* {temp.map(v=>{
            return(
              <FormItem label={v.x} {...formItemLayout}>
                {getFieldDecorator('xx', {
                  rules: [
                    { required: true, message: '请选择告警联系人' },
                    // { validator: this.checkmonitorPoint },
                  ],
                  initialValue: data.xx,
                })(
                  <Select
                    mode="multiple"
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="区间负责人"
                    optionFilterProp="children" 
                  >
                    <Option value="1"></Option>
                    <Option value="2">22号</Option>
                    <Option value="3">33号</Option>
                    <Option value="4">44号</Option>
                    <Option value="5">55号</Option>
                  </Select>
                )}
              </FormItem>
            )
          })} */}
      </Form>
      </div>
    );
  }
}
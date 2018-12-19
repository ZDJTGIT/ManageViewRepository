import React,{Component} from 'react';
import { Form,Row,Col,Input,Icon,Select,DatePicker } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;

@Form.create()
export default class ProjectInfo extends Component{
  constructor(props){
    super(props);
    this.state={

    }
  }

  render(){
    const { form,data,projectStatusData } = this.props;
    const { getFieldDecorator } = form;

    // 区间状态数据转化
    const projectStatusArray = [];
    for (const key in projectStatusData) {
      if (key != null) {
        projectStatusArray.push({ x: key, y: projectStatusData[key] });
      }
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
        md: { span: 6 },
        lg: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 14 },
        md: { span: 14 },
        lg: { span: 14 },
      },
    };
    return (
      <Form layout="horizontal" style={{marginTop:'3%'}}>
      <Row>
      <Col xs={24}  sm={12} md={12} lg={8}>
          <FormItem label="所属项目:" {...formItemLayout}>
            {getFieldDecorator('projectId', {
              rules: [
                { required: true, message: '请选择所属项目' },
                { validator: this.checkmonitorPoint },
              ],
              initialValue: data.projectId,
            })(
              <Select
                placeholder="区间类型"
              >
                <Option value="1">xx项目</Option>
              </Select>
            )}
          </FormItem>   
        </Col>
        <Col xs={24}  sm={12} md={12} lg={8}>
          <FormItem label="区间名:" {...formItemLayout}>
            {getFieldDecorator('sectorName', {
              rules: [
                { required: true, message: '请输入区间名' },
                { validator: this.checkmonitorPoint },
              ],
              initialValue: data.sectorName,
            })(
              <Input
                type="text"
                placeholder="区间名"
              />
            )}
          </FormItem>   
        </Col>
        {/* <Col xs={24}  sm={12} md={12} lg={8}>
          <FormItem label="区间类型:" {...formItemLayout}>
            {getFieldDecorator('sectorType', {
              rules: [
                { required: true, message: '请选择区间类型' },
                { validator: this.checkmonitorPoint },
              ],
              initialValue: data.sectorType,
            })(
              <Select
                
                placeholder="区间类型"
              >
                <Option value="1">xx区间</Option>
              </Select>
            )}
          </FormItem>   
        </Col> */}
        <Col xs={24}  sm={12} md={12} lg={8}>
          <FormItem label="区间地址:" {...formItemLayout}>
            {getFieldDecorator('sectorAddress', {
              rules: [
                { required: true, message: '请输入区间地址' },
                { validator: this.checkmonitorPoint },
              ],
              initialValue: data.sectorAddress,
            })(
              <Input
                type="text"
                
                placeholder="区间地址"
              />
            )}
          </FormItem>   
        </Col>
        <Col xs={24}  sm={12} md={12} lg={8}>
          <FormItem label="区间经度:" {...formItemLayout}>
            {getFieldDecorator('sectorLongitude', {
              rules: [
                { required: true, message: '请输入区间经度' },
                { validator: this.checkmonitorPoint },
              ],
              initialValue: data.sectorLongitude,
            })(
              <Input
                type="text"
                
                placeholder="区间经度"
              />
            )}
          </FormItem>   
        </Col>
        <Col xs={24}  sm={12} md={12} lg={8}>
          <FormItem label="区间纬度:" {...formItemLayout}>
            {getFieldDecorator('sectorLatitude', {
              rules: [
                { required: true, message: '请输入区间纬度' },
                { validator: this.checkmonitorPoint },
              ],
              initialValue: data.sectorLatitude,
            })(
              <Input
                type="text"
                
                placeholder="区间纬度"
              />
            )}
          </FormItem>
        </Col>
        <Col xs={24}  sm={12} md={12} lg={8}>
          <FormItem label="区间时间:" {...formItemLayout}>
            {getFieldDecorator('sectorTime', {
              rules: [
                { required: true, message: '请选择区间起止时间' },
                // { validator: this.checkmonitorPoint },
              ],
              initialValue: data.sectorTime,
            })(
              <RangePicker showTime={{ format:'HH:mm:ss'}} format="YYYY-MM-DD" style={{width:'100%'}}/>
            )}
          </FormItem>
        </Col>
        <Col xs={24}  sm={12} md={12} lg={8}>
          <FormItem label="区间状态:" {...formItemLayout}>
            {getFieldDecorator('sectorStatus', {
              rules: [
                { required: true, message: '请选择区间状态' },
                { validator: this.checkmonitorPoint },
              ],
              initialValue: data.sectorStatus,
            })(
              <Select
                placeholder="区间状态"
              >
                {projectStatusArray.map(v=>{
                  return(<Option value={v.x} key={v.x}>{v.y}</Option>);
                })}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col xs={24}  sm={12} md={12} lg={8}>
          <FormItem label="区间描述:" {...formItemLayout}>
            {getFieldDecorator('sectorDescription', {
              rules: [
                { required: false, message: '请输入区间描述' },
                { validator: this.checkmonitorPoint },
              ],
              initialValue: data.sectorDescription,
            })(
              <TextArea
                rows={3}
                style={{resize:'none'}}
                placeholder="区间描述"
              />
            )}
          </FormItem>   
        </Col>
      </Row>
    </Form>
    );
  }
}
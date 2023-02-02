import './App.css';
import { useEffect, useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import { Form, Input, Typography, Card, Col, Row, Progress, Button, Space} from 'antd';
const { Title, Text } = Typography;
const { TextArea } = Input;

function App() {
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);

  const [form] = Form.useForm();
  const [input, setInput] = useState("");
  const [size, setSize] = useState('large'); // default is 'middle'
  const [percent, setPercent] = useState(0);
  const [isLoading, setIsLoading] = useState(null);
  const [answer, setAnswer] = useState("");
  const [prefix, setPrefix] = useState('On the scale of 1-100 how many number can you evaluate to write this yourself?: "')
  const [suffix, setSuffix] = useState('"')

  const onCheck = async () => {
    try {
      const values = await form.validateFields();
      
      const message = `${prefix}${input}${suffix}`;

      setIsLoading(true);

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${message}`,
        max_tokens: 800,
        temperature: 0.6,
      });

      const p = response.data.choices[0].text
      setPercent(`${p}`);
      
      if (!isNaN(parseInt(p)) && parseInt(p) > 80) {
        setAnswer("Yes, I wrote this.");
      } else {
        setAnswer("No, I didn't write this.");
      }

      setIsLoading(false);
      
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };  

  return (
    <>
      <Form
        form={form}
        name="dynamic_rule"
      ><Row gutter={16}>
          <Col span={12} offset={4}>
            <Title className='text-align-center'>ChatGPT Detector</Title>
            <Card>
              <Card.Grid hoverable={false} className="detector-area">
                <Text className='field-title'>Please input your essay.</Text>
                <Form.Item
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your essay.',
                    },
                  ]}
                >
                  <Input.TextArea 
                    className='field-input-query'
                    placeholder="" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoSize
                  />
                </Form.Item>
                <Text className='field-title'>Have this essay written by OpenAI?</Text>
                <Input placeholder="" value={answer.trimStart()} readOnly/>
                <div
                  style={{
                    margin: '24px 0',
                  }}
                />
                <div style={{display: 'block', textAlign: 'center'}}>
                  <Button shape="round" size={size} className='action-btn' onClick={onCheck} loading={isLoading === true}>
                    Analyze
                  </Button>
                </div>
              </Card.Grid>
              <Card.Grid hoverable={false} className="percentage-area">
                <Progress type="circle" percent={`${percent}`} format={(percent) => `${percent} %`} strokeWidth={8} width={150} strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068'
                }}/>
              </Card.Grid>
            </Card>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default App;

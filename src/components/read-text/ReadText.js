import React, { useState } from 'react';
import './ReadText.css';
import 'antd/dist/antd.css';
import { Select, Input, Upload, Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 18 }} spin />;

const { Option } = Select;
const { TextArea } = Input;
const ReadText = (props) => {
    const [voice, setVoice] = useState('banmai');
    const [speed, setSpeed] = useState(0);
    const [content, setContent] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const [canPlaying, setCanPlaying] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <div style={{ marginTop: 15 }}>
            <div>
                <span className="read-text-select">
                    <span style={{ margin: 10 }}>Voice</span>
                    <Select defaultValue={voice} style={{ width: 220 }} onChange={(value) => setVoice(value)}>
                        <Option value="banmai">Ban Mai (female northern)</Option>
                        <Option value="lannhi">Lan Nhi (female southern)</Option>
                        <Option value="leminh">Lê Minh (male northern)</Option>
                        <Option value="myan">Mỹ An (female middle)</Option>
                        <Option value="thuminh">Thu Minh (female northern)</Option>
                        <Option value="giahuy">Gia Huy (male middle)</Option>
                    </Select>
                </span>

                <span className="read-text-select">
                    <span style={{ margin: 10 }}>Speed</span>
                    <Select defaultValue={speed} onChange={(value) => setSpeed(value)}>
                        <Option value={3}>+3</Option>
                        <Option value={2}>+2</Option>
                        <Option value={1}>+1</Option>
                        <Option value={0}>0</Option>
                        <Option value={-1}>-1</Option>
                        <Option value={-2}>-2</Option>
                        <Option value={-3}>-3</Option>
                    </Select>
                </span>
            </div>

            <div style={{ marginTop: 10 }}>
                <div>
                    <Upload
                        accept=".txt, .csv, .odt"
                        showUploadList={false}
                        beforeUpload={file => {
                            const reader = new FileReader();

                            reader.onload = e => {
                                setContent(e.target.result);
                            };
                            reader.readAsText(file);

                            // Prevent upload
                            return false;
                        }}
                    >
                        <Button>
                            Upload File
                        </Button>
                    </Upload>


                </div>
                <TextArea style={{ height: 250, width: '80%' }} placeholder="Input here" onChange={(e) => { setContent(e.target.value); }} value={content}></TextArea>
            </div>
            <Button onClick={() => {
                setCanPlaying(false);
                setLoading(true);
                fetch('https://api.fpt.ai/hmi/tts/v5', {
                    method: 'POST',
                    headers: {
                        "api-key": "3oT7pAKgs6ryg8Xwe30hSIJftBJG4Q9d",
                        "speed": speed,
                        "voice": voice
                    },
                    body: content
                })
                    .then(res => res.json())
                    .then(async res => {

                        let time = 500;
                        const gt = 1.5;
                        while (true) {
                            try {
                                // eslint-disable-next-line no-loop-func
                                await new Promise((resolve, reject) => {
                                    console.log('current waiting:' + time/1000 + 's');
                                    setAudioUrl(res.async);
                                    setTimeout(() => {
                                        const state = document.getElementById('audi').readyState;
                                        if (state > 0) resolve('ok');
                                        else reject('reject');
                                    }, time);
                                });
                                setCanPlaying(true);
                                setLoading(false);
                                document.getElementById('audi').play();
                                break;
                            } catch (error) {
                                setAudioUrl('');
                                time *= gt;
                                console.log('Error when loading resource. Waiting for next downloading...');
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }}>Generate Audio
            <Spin indicator={antIcon} spinning={loading} />
            </Button>
            {
                <div hidden={!canPlaying}><audio id="audi"
                    src={audioUrl} controls="controls" ></audio>
                </div>
            }

        </div >
    );
}

export default ReadText;
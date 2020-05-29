import React, { useState } from 'react';
import './SpeechToText.css';
import 'antd/dist/antd.css';
import { Select, Input, Upload, Button, Spin } from 'antd';
import Icon, { LoadingOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import recordRTC from 'recordrtc';
const antIcon = <LoadingOutlined style={{ fontSize: 18 }} spin />;

const { TextArea } = Input;
const SpeechToText = (props) => {
    const [content, setContent] = useState('');
    const [canPlaying, setCanPlaying] = useState(false);
    const [loadSuccess, setLoadSucees] = useState(false);
    const [isRecoring, setRecording] = useState(false);
    const [recorder,setRecorder] = useState(null);
    const getRecorder = async()=>{
        try {
            var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            return recordRTC(stream, { type: 'audio' });
        } catch (error) {
            console.log('err' + error);
        }
    
    }
    const fetchData = (data) => {
        return new Promise((resolve, reject) => {
            fetch('https://api.fpt.ai/hmi/asr/general', {
                method: 'POST',
                headers: {
                    "api-key": "3oT7pAKgs6ryg8Xwe30hSIJftBJG4Q9d",
                    "content-type": ""
                },
                body: data
            })
                .then(res => res.json())
                .then(res => {
                    resolve(res.hypotheses[0].utterance);
                })
                .catch(err => {
                    console.log(err);
                    reject('error');
                })
        })
    }

    return (
        <div style={{ marginTop: 15 }}>
            <div style={{ marginTop: 10 }}>
                <div>
                    <Button onClick={async () => {
                        const irecord = isRecoring;
                        if(!irecord){
                            const r = await getRecorder();
                            setRecorder(r);
                            r.startRecording();
                            setCanPlaying(false);
                        }else{
                            console.log(recorder);
                            recorder.stopRecording(async function () {
                                try {
                                    const data = await recorder.getBlob().arrayBuffer();
                                    const arrByte = Uint8Array.from(Buffer.from(data));
                                    console.log(arrByte);
                                    recorder.getDataURL((d) => {
                                        const audio = document.getElementById('audi');
                                        audio.src = d;
                                    });
    
                                    const content = await fetchData(arrByte);
                                    setContent(content);
                                    setCanPlaying(true);
                                    const audio = document.getElementById('audi');
                                    audio.play();
                                } catch (error) {
                                    console.log(error);
                                }
                                finally{
                                    setRecorder(null);
                                }
                                console.log('stop');
                            });    
                        } 
                        setRecording(!irecord);                 
                    }}>
                        {isRecoring ? 'Stop Record' : 'Record'}
                    <Spin indicator={antIcon} spinning={isRecoring} />
                    </Button>
                <Upload
                    accept=".mp3"
                    showUploadList={false}
                    beforeUpload={file => {
                        const reader = new FileReader();
                        const reader2 = new FileReader();
                        setCanPlaying(false);
                        setLoadSucees(false);
                        reader.onload = e => {
                            const arrByte = Uint8Array.from(Buffer.from(e.target.result));
                            setTimeout(async () => {
                                setLoadSucees(true);
                                try {
                                    const content = await fetchData(arrByte);
                                    setContent(content);
                                    setCanPlaying(true);
                                    const audio = document.getElementById('audi');
                                    audio.play();
                                } catch (error) {
                                    console.log(error);
                                }
                            }, 1000)
                        };
                        reader2.onload = e => {
                            const audio = document.getElementById('audi');
                            audio.src = e.target.result;
                        }
                        reader.readAsArrayBuffer(file);
                        reader2.readAsDataURL(file);
                        return false;
                    }}
                >
                    <Button>
                        Upload Audio

                            <CheckCircleTwoTone hidden={!loadSuccess} twoToneColor="#52c41a" />
                    </Button>
                </Upload>


            </div>
            <TextArea disabled={true} style={{ height: 250, width: '80%' }}  value={content}></TextArea>
        </div>
        <audio id="audi" hidden={!canPlaying}
            controls="controls" ></audio>
        </div >
    );
}


export default SpeechToText;
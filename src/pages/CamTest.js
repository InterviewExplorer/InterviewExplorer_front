import React, { useEffect, useRef, useState } from 'react';

const CamTest = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [websocket, setWebsocket] = useState(null);
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);

  const connectWebSocket = () => {
    const ws = new WebSocket('ws://localhost:8000/ws');

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.image) {
        setProcessedImage(data.image);
      }
      setMessage(data.success ? 'Success' : 'Align your face and shoulder');
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setIsConnected(false);
    };

    ws.onclose = (event) => {
      console.log('WebSocket Disconnected:', event.reason);
      setIsConnected(false);
      setTimeout(() => {
        console.log('Attempting to reconnect...');
        connectWebSocket();
      }, 3000);
    };

    setWebsocket(ws);
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  useEffect(() => {
    const getWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setMessage("Error: Unable to access webcam");
      }
    };

    getWebcam();
  }, []);

  useEffect(() => {
    let frameInterval;
    const sendFrame = () => {
      if (videoRef.current && canvasRef.current && isConnected) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);  // JPEG 품질을 0.8로 설정
        websocket.send(imageData);
      }
    };
  
    if (isConnected) {
      frameInterval = setInterval(sendFrame, 1000 / 30); // 30fps
    }
  
    return () => {
      if (frameInterval) clearInterval(frameInterval);
    };
  }, [isConnected, websocket]);

  return (
    <div>
      <h1>Real-time Webcam Test</h1>
      <video ref={videoRef} autoPlay style={{ display: 'none' }} />
      <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />
      {processedImage && (
        <img src={processedImage} alt="Processed frame" style={{ width: '640px', height: '480px' }} />
      )}
      <p>{message}</p>
      <p>WebSocket Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
    </div>
  );
};

export default CamTest;
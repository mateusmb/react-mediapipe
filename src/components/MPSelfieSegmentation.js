import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation/selfie_segmentation";
import { Camera } from "@mediapipe/camera_utils/camera_utils";

const MPSelfieSegmentation = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const selfieSegmentation = new SelfieSegmentation({
      locateFile: (file) => {
        console.log(`${file}`);
        return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
      },
    });
    selfieSegmentation.setOptions({
      modelSelection: 1,
      selfieMode: true
    });
    selfieSegmentation.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await selfieSegmentation.send({ image: webcamRef.current.video });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }
  }, []);

  const onResults = (results) => {
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, videoWidth, videoHeight);
    canvasCtx.drawImage(
      results.segmentationMask,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    // Only overwrite existing pixels.
    canvasCtx.globalCompositeOperation = "source-in";
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    // Only overwrite missing pixels.
    canvasCtx.globalCompositeOperation = "destination-atop";
    canvasCtx.fillStyle = '#0000FF';
    canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.restore();
  };

  return (
    <div>
      <Webcam
        audio={false}
        mirrored={true}
        ref={webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: "0",
          right: "0",
          textAlign: "center",
          zindex: 9,
          width: 1280,
          height: 720,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: "0",
          right: "0",
          textAlign: "center",
          zindex: 9,
          width: 1280,
          height: 720,
        }}
      ></canvas>
    </div>
  );
};

export default MPSelfieSegmentation;

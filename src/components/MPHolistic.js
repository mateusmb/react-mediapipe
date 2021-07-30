import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import {
  Holistic,
  POSE_LANDMARKS,
  POSE_LANDMARKS_LEFT,
  POSE_LANDMARKS_RIGHT,
  POSE_CONNECTIONS,
  HAND_CONNECTIONS,
  FACEMESH_TESSELATION,
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_FACE_OVAL,
  FACEMESH_LIPS
} from "@mediapipe/holistic/holistic";
import {
  drawConnectors,
  drawLandmarks,
  lerp
} from "@mediapipe/drawing_utils/drawing_utils";
import { Camera } from "@mediapipe/camera_utils/camera_utils";

const MPHolistic = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) => {
        console.log(`${file}`);
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });
    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    holistic.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await holistic.send({ image: webcamRef.current.video });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }
  }, []);

  const removeElements = (landmarks, elements) => {
    for (const element of elements) {
      delete landmarks[element];
    }
  };

  const removeLandmarks = (results) => {
    if (results.poseLandmarks) {
      removeElements(
        results.poseLandmarks,
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22]
      );
    }
  };

  const connect = (ctx, connectors) => {
    const canvas = ctx.canvas;
    for (const connector of connectors) {
      const from = connector[0];
      const to = connector[1];
      if (from && to) {
        if (
          from.visibility &&
          to.visibility &&
          (from.visibility < 0.1 || to.visibility < 0.1)
        ) {
          continue;
        }
        ctx.beginPath();
        ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
        ctx.lineTo(to.x * canvas.width, to.y * canvas.height);
        ctx.stroke();
      }
    }
  };

  const onResults = (results) => {
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    removeLandmarks(results);
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, videoWidth, videoHeight);
    canvasCtx.translate(videoWidth, 0);
    canvasCtx.scale(-1, 1);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    canvasCtx.lineWidth = 5;
    if (results.poseLandmarks) {
        if (results.rightHandLandmarks) {
        canvasCtx.strokeStyle = 'white';
        connect(canvasCtx, [[
                    results.poseLandmarks[POSE_LANDMARKS.RIGHT_ELBOW],
                    results.rightHandLandmarks[0]
                ]]);
        }
        if (results.leftHandLandmarks) {
        canvasCtx.strokeStyle = 'white';
        connect(canvasCtx, [[
                    results.poseLandmarks[POSE_LANDMARKS.LEFT_ELBOW],
                    results.leftHandLandmarks[0]
                ]]);
        }
    }

    // Pose...
    drawConnectors(
        canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
        {color: 'white'});
    drawLandmarks(
        canvasCtx,
        Object.values(POSE_LANDMARKS_LEFT)
            .map(index => results.poseLandmarks[index]),
        {visibilityMin: 0.65, color: 'white', fillColor: 'rgb(255,138,0)'});
    drawLandmarks(
        canvasCtx,
        Object.values(POSE_LANDMARKS_RIGHT)
            .map(index => results.poseLandmarks[index]),
        {visibilityMin: 0.65, color: 'white', fillColor: 'rgb(0,217,231)'});

    // Hands...
    drawConnectors(
        canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS,
        {color: 'white'});
    drawLandmarks(canvasCtx, results.rightHandLandmarks, {
        color: 'white',
        fillColor: 'rgb(0,217,231)',
        lineWidth: 2,
        radius: (data) => {
        return lerp(data.from.z, -0.15, .1, 10, 1);
        }
    });
    drawConnectors(
        canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS,
        {color: 'white'});
    drawLandmarks(canvasCtx, results.leftHandLandmarks, {
        color: 'white',
        fillColor: 'rgb(255,138,0)',
        lineWidth: 2,
        radius: (data) => {
        return lerp(data.from.z, -0.15, .1, 10, 1);
        }
    });

    // Face...
    drawConnectors(
        canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
        {color: '#C0C0C070', lineWidth: 1});
    drawConnectors(
        canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYE,
        {color: 'rgb(0,217,231)'});
    drawConnectors(
        canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW,
        {color: 'rgb(0,217,231)'});
    drawConnectors(
        canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYE,
        {color: 'rgb(255,138,0)'});
    drawConnectors(
        canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYEBROW,
        {color: 'rgb(255,138,0)'});
    drawConnectors(
        canvasCtx, results.faceLandmarks, FACEMESH_FACE_OVAL,
        {color: '#E0E0E0', lineWidth: 5});
    drawConnectors(
        canvasCtx, results.faceLandmarks, FACEMESH_LIPS,
        {color: '#E0E0E0', lineWidth: 5});
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

export default MPHolistic;

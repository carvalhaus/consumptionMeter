import { useEffect, useRef } from "react";
import "./style.css";
import camera from "../../assets/camera.svg";
import trash from "../../assets/trash.svg";

interface CameraCaptureProps {
  onCapture: (image: string) => void;
  isCameraOpen: boolean;
  setIsCameraOpen: (open: boolean) => void;
  capturedImage: string | null;
  setCapturedImage: (image: string | null) => void;
}

function CameraCapture({
  onCapture,
  isCameraOpen,
  setIsCameraOpen,
  capturedImage,
  setCapturedImage,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isCameraOpen) {
      const startCamera = async () => {
        try {
          if (videoRef.current) {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play();
            };
          }
        } catch (error) {
          console.error("Erro ao acessar a câmera: ", error);
        }
      };
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOpen]);

  function capturePhoto() {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas?.getContext("2d");

    if (canvas && context && video) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");
      setCapturedImage(imageData);
      onCapture(imageData);
      setIsCameraOpen(false);
    }
  }

  function closeModal() {
    setIsCameraOpen(false);
  }

  return (
    <div className="camera-capture">
      <img
        src={camera}
        alt="Ícone de câmera"
        className="camera-button"
        onClick={() => setIsCameraOpen(true)}
      />

      {isCameraOpen && (
        <div className="modal">
          <div className="modal-content">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              width="300"
              height="200"
            />
            <canvas
              ref={canvasRef}
              width="300"
              height="200"
              style={{ display: "none" }}
            />
            <div className="modal-actions">
              <button type="button" onClick={capturePhoto}>
                Capturar foto
              </button>
              <button type="button" onClick={closeModal}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {capturedImage && (
        <>
          <img
            src={trash}
            className="delete-picture"
            alt="Icone de deletar"
            onClick={() => setCapturedImage(null)}
          />
          <img
            src={capturedImage}
            className="image-captured"
            alt="Imagem Capturada"
          />
        </>
      )}
    </div>
  );
}

export default CameraCapture;

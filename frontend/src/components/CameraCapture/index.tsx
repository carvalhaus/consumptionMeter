import { useEffect, useRef, useState } from "react";
import "./style.css";
import camera from "../../assets/camera.svg";
import trash from "../../assets/trash.svg";

interface CameraCaptureProps {
  onCapture: (image: string) => void;
}

function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isModalOpen) {
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
  }, [isModalOpen]);

  function capturePhoto() {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas?.getContext("2d");

    if (canvas && context && video) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");
      setImage(imageData);
      onCapture(imageData);
      setIsModalOpen(false);
    }
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <div className="camera-capture">
      <img
        src={camera}
        alt="Ícone de câmera"
        className="camera-button"
        onClick={() => setIsModalOpen(true)}
      />

      {isModalOpen && (
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

      {image && (
        <>
          <img
            src={trash}
            className="delete-picture"
            alt="Icone de deletar"
            onClick={() => setImage(null)}
          />
          <img src={image} className="image-captured" alt="Imagem Capturada" />
        </>
      )}
    </div>
  );
}

export default CameraCapture;

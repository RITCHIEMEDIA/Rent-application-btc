import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, X, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface IdPhotoCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
  side: "front" | "back";
}

export const IdPhotoCapture = ({ isOpen, onClose, onCapture, side }: IdPhotoCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setPreview(null);
      return;
    }
    startCamera();
    return () => {
      stopCamera();
    };
  }, [isOpen, side]);

  const startCamera = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(s);
      const video = videoRef.current;
      if (video) {
        video.srcObject = s;
        ensurePlayback();
        attachVideoEvents(video);
      }
      setNeedsGesture(false);
    } catch (err: any) {
      console.error("Camera start error", err);
      toast.error("Could not access camera. Please allow permissions.");
    }
  };

  const stopCamera = () => {
    try {
      stream?.getTracks().forEach((t) => t.stop());
    } catch {}
    setStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const ensurePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.muted = true;
      (video as any).playsInline = true;
      video.setAttribute("autoplay", "true");
      const p = video.play();
      if (p && typeof p.then === "function") {
        p.then(() => setNeedsGesture(false)).catch(() => setNeedsGesture(true));
      }
    } catch {
      setNeedsGesture(true);
    }
  };

  const attachVideoEvents = (video: HTMLVideoElement) => {
    video.onloadedmetadata = ensurePlayback;
    video.oncanplay = ensurePlayback;
    video.onplaying = () => setNeedsGesture(false);
    video.onwaiting = () => {};
    video.onstalled = () => {};
    video.onpause = () => {};
    video.onerror = () => {
      toast.error("Camera error occurred. Try reopening the modal.");
    };
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Guard: ensure video has frames before capture
    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
      ensurePlayback();
      setNeedsGesture(true);
      toast.info("Camera initializing. Please wait a moment and try again.");
      return;
    }

    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setPreview(dataUrl);
    stopCamera();
  };

  const retake = () => {
    setPreview(null);
    startCamera();
  };

  const usePhoto = () => {
    if (!preview) return;
    setIsLoading(true);
    try {
      onCapture(preview);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-xl p-4 md:p-6 relative">
        <button
          type="button"
          aria-label="Close"
          className="absolute top-3 right-3 p-2 rounded hover:bg-muted"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-semibold">Take Photo of ID {side === "front" ? "Front" : "Back"}</h2>
            <p className="text-xs md:text-sm text-muted-foreground">Align the ID within the frame and press Take Photo.</p>
          </div>
        </div>

        {!preview ? (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border bg-black">
              <video
                ref={videoRef}
                className="w-full h-[40vh] object-cover"
                playsInline
                muted
                autoPlay
              />
              {/* Positioning overlay */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="w-[80%] max-w-[520px] h-[50%] border-2 border-white/70 rounded-md shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]"></div>
              </div>
            </div>

            {needsGesture && (
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">Camera paused by browser. Start it, then capture.</p>
                <Button type="button" variant="outline" size="sm" onClick={ensurePlayback}>Start Camera</Button>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="button" className="flex-1 gradient-primary" onClick={takePhoto} disabled={!stream}>
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border p-3 bg-muted/10">
              <img src={preview} alt={`ID ${side} preview`} className="w-full max-h-[50vh] object-contain rounded" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="button" className="sm:flex-1 gradient-success" onClick={usePhoto} disabled={isLoading}>
                Use Photo
              </Button>
              <Button type="button" variant="outline" className="sm:flex-1" onClick={retake}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
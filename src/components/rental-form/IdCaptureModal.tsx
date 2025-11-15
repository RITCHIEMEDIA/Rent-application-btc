import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, X, RotateCcw, Check } from "lucide-react";
import { toast } from "sonner";

interface IdCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (image: string) => void;
  side: "front" | "back";
}

export const IdCaptureModal = ({ isOpen, onClose, onCapture, side }: IdCaptureModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [needsUserGesture, setNeedsUserGesture] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [errorInfo, setErrorInfo] = useState<{ title: string; name?: string; message?: string; context?: string; diagnostics?: any } | null>(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setNeedsUserGesture(false);
    }

    const handleVisibility = () => {
      if (document.visibilityState === "visible" && isOpen && stream) {
        // Re-ensure playback when tab becomes active again
        ensurePlayback();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      stopCamera();
    };
  }, [isOpen]);

  const clearError = () => setErrorInfo(null);

  // Ensure video plays across browsers once the stream is attached
  const ensurePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.muted = true; // required for mobile autoplay
      video.playsInline = true; // prevent fullscreen in iOS Safari
      video.setAttribute("autoplay", "true");
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => setNeedsUserGesture(false))
          .catch(() => setNeedsUserGesture(true));
      }
    } catch (err) {
      // If autoplay policy blocks playback, require user gesture
      setNeedsUserGesture(true);
    }
  };

  const collectDiagnostics = async (extra?: Record<string, any>) => {
    const video = videoRef.current;
    const currentTrack = stream?.getVideoTracks()?.[0];
    let permissionState: string | undefined;
    try {
      const perm: any = await (navigator as any).permissions?.query?.({ name: "camera" as any });
      permissionState = perm?.state;
    } catch {}
    let devicesSummary: any = undefined;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === "videoinput");
      devicesSummary = {
        count: videoInputs.length,
        labels: videoInputs.map((d) => d.label),
      };
    } catch {}
    return {
      supports: {
        mediaDevices: !!navigator.mediaDevices,
        getUserMedia: !!navigator.mediaDevices?.getUserMedia,
        enumerateDevices: !!navigator.mediaDevices?.enumerateDevices,
        secureContext: (window as any).isSecureContext,
      },
      protocol: typeof location !== "undefined" ? location.protocol : undefined,
      permissionState,
      devices: devicesSummary,
      stream: stream
        ? {
            active: stream.active,
            tracks: stream.getTracks().length,
            settings: currentTrack?.getSettings?.(),
            readyState: currentTrack?.readyState,
          }
        : undefined,
      video: video
        ? {
            readyState: video.readyState,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
            muted: video.muted,
            playsInline: (video as any).playsInline,
            srcObjectPresent: !!(video as any).srcObject,
          }
        : undefined,
      extra,
    };
  };

  const reportCameraError = async (err: any, context: string, extra?: Record<string, any>) => {
    const name = err?.name || (typeof err === "string" ? "Error" : undefined);
    const message = err?.message || (typeof err === "string" ? err : undefined);
    const diagnostics = await collectDiagnostics(extra);
    const title = name ? `${name}: ${message || "Unknown error"}` : message || "Unknown camera error";
    setErrorInfo({ title, name, message, context, diagnostics });
    try {
      console.groupCollapsed("IDCapture Camera Error");
      console.error({ name, message, context, err });
      console.log("Diagnostics:", diagnostics);
      console.groupEnd();
    } catch {}
  };

  // Enumerate video input devices and set defaults
  const refreshDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === "videoinput");
      setAvailableDevices(videoInputs);
      const bestId =
        videoInputs.find((d) => /back|rear|environment/i.test(d.label))?.deviceId || videoInputs[0]?.deviceId;
      if (!selectedDeviceId && bestId) setSelectedDeviceId(bestId);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    const handler = () => refreshDevices();
    if (navigator.mediaDevices?.addEventListener) {
      navigator.mediaDevices.addEventListener("devicechange", handler);
    }
    return () => {
      if (navigator.mediaDevices?.removeEventListener) {
        navigator.mediaDevices.removeEventListener("devicechange", handler);
      }
    };
  }, []);

  // Attach stream to the video element
  const attachStreamToVideo = async (mediaStream: MediaStream) => {
    setStream(mediaStream);
    const video = videoRef.current;
    if (!video) return;

    try {
      // Modern browsers
      (video as any).srcObject = mediaStream;
    } catch {
      // Very old Safari fallback (rare): createObjectURL
      try {
        const url = (window as any).URL?.createObjectURL?.(mediaStream);
        if (url) (video as HTMLVideoElement).src = url;
      } catch (e) {
        await reportCameraError(e, "attachStreamToVideo:createObjectURL");
      }
    }

    const track = mediaStream.getVideoTracks()?.[0];
    if (track) {
      track.onended = async () => {
        await reportCameraError(new Error("Video track ended"), "track.onended");
      };
      track.onmute = async () => {
        await reportCameraError(new Error("Video track muted"), "track.onmute");
      };
    }

    if (video.readyState >= 2) {
      ensurePlayback();
    } else {
      video.onloadedmetadata = () => ensurePlayback();
      video.oncanplay = () => ensurePlayback();
      video.onerror = async () => {
        await reportCameraError(new Error("Video element error"), "video.onerror");
      };
    }
  };

  const selectBestDeviceId = async (): Promise<string | undefined> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === "videoinput");
      // Prefer a device labeled "back"/"rear" when side is back/front capture for IDs
      const preferred = videoInputs.find((d) => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("rear"));
      return preferred?.deviceId || videoInputs[0]?.deviceId;
    } catch (e) {
      return undefined;
    }
  };

  const startCameraWithDeviceId = async (deviceId?: string) => {
    try {
      setIsLoading(true);
      clearError();
      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      stopCamera();
      await attachStreamToVideo(newStream);
      await refreshDevices();
      setNeedsUserGesture(false);
    } catch (e) {
      await reportCameraError(e, "startCameraWithDeviceId", { deviceId });
      // Fallback to generic start sequence
      await startCamera();
    } finally {
      setIsLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      setIsLoading(true);
      // Attempt 1: environment camera with ideal resolution
      const primary = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      await attachStreamToVideo(primary);

      // After initial permission, try to select a better specific device
      const bestId = selectedDeviceId || (await selectBestDeviceId());
      if (bestId) {
        try {
          const specific = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: bestId } },
            audio: false,
          });
          // Replace stream with the selected device
          stopCamera();
          await attachStreamToVideo(specific);
          setSelectedDeviceId(bestId);
        } catch {
          // ignore and keep primary stream
        }
      }
    } catch (error) {
      await reportCameraError(error, "startCamera:primary", { step: 1 });
      try {
        // Attempt 2: environment without resolution constraints
        const fallback1 = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        await attachStreamToVideo(fallback1);
      } catch (fallbackError1) {
        await reportCameraError(fallbackError1, "startCamera:fallback1", { step: 2 });
        try {
          // Attempt 3: user/front camera
          const fallback2 = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false,
          });
          await attachStreamToVideo(fallback2);
        } catch (fallbackError2) {
          await reportCameraError(fallbackError2, "startCamera:fallback2", { step: 3 });
          toast.error("Unable to access camera. Please check permissions or device settings.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    const video = videoRef.current;
    if (video) {
      try {
        (video as any).srcObject = null;
      } catch {}
    }
    setStream(null);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        const vw = video.videoWidth || 1280;
        const vh = video.videoHeight || 720;
        canvas.width = vw;
        canvas.height = vh;
        context.imageSmoothingEnabled = true;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(imageData);
      }
    }
  };

  const retakeImage = () => {
    setCapturedImage(null);
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <h3 className="text-base sm:text-lg font-semibold">
            Capture ID {side === "front" ? "Front" : "Back"}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-3 sm:p-4">
          {errorInfo && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-3">
              <div className="font-medium text-sm">Camera error</div>
              <div className="text-xs sm:text-sm mt-1 break-words">{errorInfo.title}</div>
              {errorInfo.context && (
                <div className="text-xs mt-1">Context: {errorInfo.context}</div>
              )}
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => startCameraWithDeviceId(selectedDeviceId)}>
                  Retry
                </Button>
                <Button variant="outline" size="sm" onClick={async () => {
                  try {
                    if (errorInfo?.diagnostics) {
                      await navigator.clipboard.writeText(JSON.stringify(errorInfo.diagnostics, null, 2));
                      toast.success("Diagnostics copied to clipboard");
                    }
                  } catch {}
                }}>
                  Copy diagnostics
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowErrorDetails((v) => !v)}>
                  {showErrorDetails ? "Hide details" : "Show details"}
                </Button>
              </div>
              {showErrorDetails && (
                <pre className="mt-2 text-[10px] sm:text-xs max-h-48 overflow-auto bg-white p-2 rounded border">
                  {JSON.stringify(errorInfo.diagnostics, null, 2)}
                </pre>
              )}
            </div>
          )}
          {isLoading ? (
            <div className="flex items-center justify-center h-48 sm:h-64">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
            </div>
          ) : capturedImage ? (
            <div className="space-y-4">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={capturedImage} 
                  alt="Captured ID" 
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                Make sure all information is clearly visible and readable
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs sm:text-sm text-muted-foreground">Select camera</div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedDeviceId || ""}
                    onChange={async (e) => {
                      const id = e.target.value;
                      setSelectedDeviceId(id);
                      await startCameraWithDeviceId(id);
                    }}
                    className="border rounded px-2 py-1 text-xs sm:text-sm bg-background"
                  >
                    {availableDevices.length === 0 ? (
                      <option value="">No cameras detected</option>
                    ) : (
                      availableDevices.map((d, idx) => (
                        <option key={d.deviceId} value={d.deviceId}>
                          {d.label || `Camera ${idx + 1}`}
                        </option>
                      ))
                    )}
                  </select>
                  <Button variant="outline" size="sm" onClick={refreshDevices}>Refresh</Button>
                </div>
              </div>
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-contain"
                />
                {needsUserGesture && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Button onClick={() => ensurePlayback()} className="">
                      Start Camera
                    </Button>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-2 border-white/50 rounded-lg w-4/5 h-3/5"></div>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
                <h4 className="font-medium mb-2 text-sm sm:text-base">Instructions:</h4>
                <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                  <li>• Hold your ID steady within the frame</li>
                  <li>• Ensure all corners are visible and not cut off</li>
                  <li>• Make sure the image is clear and well-lit</li>
                  <li>• Avoid glare or shadows on the ID</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 border-t flex flex-col sm:flex-row gap-2">
          {capturedImage ? (
            <>
              <Button variant="outline" onClick={retakeImage} className="w-full sm:w-auto">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake
              </Button>
              <Button onClick={confirmCapture} className="w-full sm:w-auto">
                <Check className="w-4 h-4 mr-2" />
                Confirm
              </Button>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={captureImage} disabled={!stream} className="w-full sm:w-auto">
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </Button>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </Card>
    </div>
  );
};
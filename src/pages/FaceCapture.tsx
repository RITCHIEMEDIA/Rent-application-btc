import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, RotateCcw, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const FaceCapture = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const formData = sessionStorage.getItem('rentalFormData');
    if (!formData) {
      navigate('/');
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [navigate]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      toast.error("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmCapture = async () => {
    setIsLoading(true);
    
    try {
      // Get form data from session storage
      const formDataString = sessionStorage.getItem('rentalFormData');
      if (!formDataString) {
        throw new Error('Form data not found');
      }

      const formData = JSON.parse(formDataString);
      formData.faceImage = capturedImage;

      // Submit application to backend
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('submit-application', {
        body: formData
      });

      if (error) throw error;

      // Navigate to payment page with temp ID
      sessionStorage.clear();
      toast.success("Application submitted! Proceeding to payment...");
      navigate(`/payment?tempId=${data.tempId}`);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.message || 'Failed to submit application');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Face Verification
          </h1>
          <p className="text-muted-foreground">
            Capture a clear photo of your face for identity verification
          </p>
        </div>

        {/* Camera/Preview Card */}
        <Card className="p-6 shadow-medium animate-fade-in">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
            {!capturedImage ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-4 border-primary/30 rounded-lg" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-80 border-2 border-accent/50 rounded-full" />
                </div>
              </>
            ) : (
              <img
                src={capturedImage}
                alt="Captured face"
                className="w-full h-full object-cover"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Instructions */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Tips for best results:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Center your face in the frame</li>
                <li>Ensure good lighting without shadows</li>
                <li>Remove sunglasses and hats</li>
                <li>Look directly at the camera</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            {!capturedImage ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate('/form')}
                >
                  Cancel
                </Button>
                <Button
                  onClick={capturePhoto}
                  className="gradient-primary"
                  size="lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Capture Photo
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={retake}
                  size="lg"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Retake
                </Button>
                <Button
                  onClick={confirmCapture}
                  disabled={isLoading}
                  className="gradient-success"
                  size="lg"
                >
                  <Check className="w-5 h-5 mr-2" />
                  {isLoading ? "Processing..." : "Confirm & Submit"}
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Privacy Notice */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          Your photo is securely encrypted and used only for identity verification purposes.
        </p>
      </div>
    </div>
  );
};

export default FaceCapture;
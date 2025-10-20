import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, RotateCcw, Check, AlertCircle, Video, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

type RecordingStep = 'idle' | 'countdown' | 'left' | 'right' | 'up' | 'complete';

const FaceCapture = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recordingStep, setRecordingStep] = useState<RecordingStep>('idle');
  const [countdown, setCountdown] = useState(3);
  const [progress, setProgress] = useState(0);
  const [currentInstruction, setCurrentInstruction] = useState('');

  useEffect(() => {
    const formData = sessionStorage.getItem('rentalFormData');
    if (!formData) {
      navigate('/');
      return;
    }

    startCamera();

    return () => {
      stopCamera();
      // Clean up video URL on unmount
      if (recordedVideoURL) {
        URL.revokeObjectURL(recordedVideoURL);
      }
    };
  }, [navigate]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 },
        audio: false
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

  const startCountdown = () => {
    setRecordingStep('countdown');
    setCountdown(3);
    setCurrentInstruction('Get ready...');
    
    let count = 3;
    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(countdownInterval);
        startRecording();
      }
    }, 1000);
  };

  const startRecording = () => {
    if (!stream) return;

    try {
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedVideo(blob);
        const url = URL.createObjectURL(blob);
        setRecordedVideoURL(url);
        
        // Set the preview video source and play
        setTimeout(() => {
          if (previewVideoRef.current) {
            previewVideoRef.current.src = url;
            previewVideoRef.current.load();
            previewVideoRef.current.play().catch(err => {
              console.error('Error playing preview:', err);
            });
          }
        }, 100);
        
        stopCamera();
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;

      // Guide user through movements over 7 seconds
      executeRecordingSequence();
    } catch (error) {
      console.error('Recording error:', error);
      toast.error('Failed to start recording');
    }
  };

  const executeRecordingSequence = () => {
    // Total 7 seconds: 2.5s left, 2.5s right, 2s up
    let elapsed = 0;
    const totalDuration = 7000;
    
    // Step 1: Turn left (0-2.5s)
    setRecordingStep('left');
    setCurrentInstruction('Turn your head LEFT');
    
    setTimeout(() => {
      // Step 2: Turn right (2.5-5s)
      setRecordingStep('right');
      setCurrentInstruction('Turn your head RIGHT');
    }, 2500);

    setTimeout(() => {
      // Step 3: Look up (5-7s)
      setRecordingStep('up');
      setCurrentInstruction('Look UP');
    }, 5000);

    // Progress animation
    const progressInterval = setInterval(() => {
      elapsed += 100;
      setProgress((elapsed / totalDuration) * 100);
      
      if (elapsed >= totalDuration) {
        clearInterval(progressInterval);
        stopRecording();
      }
    }, 100);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecordingStep('complete');
      setCurrentInstruction('Recording complete!');
      setProgress(100);
      toast.success('Face verification video recorded successfully!');
    }
  };

  const retake = () => {
    // Clean up old video URL
    if (recordedVideoURL) {
      URL.revokeObjectURL(recordedVideoURL);
    }
    
    setRecordedVideo(null);
    setRecordedVideoURL(null);
    setRecordingStep('idle');
    setProgress(0);
    setCurrentInstruction('');
    startCamera();
  };

  const confirmCapture = async () => {
    if (!recordedVideo) return;
    
    setIsLoading(true);
    
    try {
      // Get form data from session storage
      const formDataString = sessionStorage.getItem('rentalFormData');
      if (!formDataString) {
        throw new Error('Form data not found');
      }

      const formData = JSON.parse(formDataString);
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Upload video to Supabase Storage instead of base64 encoding
      const fileName = `face-video-${Date.now()}-${Math.random().toString(36).substring(7)}.webm`;
      toast.info('Uploading face verification video...');
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('faces')
        .upload(fileName, recordedVideo, {
          contentType: 'video/webm',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload verification video');
      }

      // Get public URL of the uploaded video
      const { data: { publicUrl } } = supabase.storage
        .from('faces')
        .getPublicUrl(fileName);

      // Pass video URL instead of base64 data
      formData.faceVideoUrl = publicUrl;

      // Submit application to backend
      toast.info('Submitting application...');
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

  const getInstructionIcon = () => {
    switch (recordingStep) {
      case 'left':
        return <ArrowLeft className="w-12 h-12 animate-pulse" />;
      case 'right':
        return <ArrowRight className="w-12 h-12 animate-pulse" />;
      case 'up':
        return <ArrowUp className="w-12 h-12 animate-pulse" />;
      default:
        return null;
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
            Record a 7-second video following the on-screen instructions
          </p>
        </div>

        {/* Camera/Preview Card */}
        <Card className="p-6 shadow-medium animate-fade-in">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
            {!recordedVideoURL ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-4 border-primary/30 rounded-lg" />
                
                {/* Countdown Overlay */}
                {recordingStep === 'countdown' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center">
                      <div className="text-8xl font-bold text-white animate-bounce">{countdown}</div>
                      <p className="text-2xl text-white mt-4">{currentInstruction}</p>
                    </div>
                  </div>
                )}
                
                {/* Recording Instructions Overlay */}
                {(recordingStep === 'left' || recordingStep === 'right' || recordingStep === 'up') && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="bg-primary/90 rounded-2xl px-8 py-6 text-center backdrop-blur-sm animate-pulse">
                      <div className="text-white mb-4">
                        {getInstructionIcon()}
                      </div>
                      <p className="text-3xl font-bold text-white">{currentInstruction}</p>
                    </div>
                    
                    {/* Recording Indicator */}
                    <div className="mt-6 flex items-center gap-2 bg-red-500 rounded-full px-4 py-2">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                      <span className="text-white font-semibold">RECORDING</span>
                    </div>
                  </div>
                )}
                
                {/* Face Guide Overlay */}
                {recordingStep === 'idle' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-80 border-2 border-accent/50 rounded-full" />
                  </div>
                )}
              </>
            ) : (
              <video
                ref={previewVideoRef}
                src={recordedVideoURL}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
                onLoadedData={() => {
                  console.log('Video loaded successfully');
                }}
                onError={(e) => {
                  console.error('Video playback error:', e);
                  toast.error('Error playing video preview');
                }}
              />
            )}
          </div>

          {/* Progress Bar */}
          {(recordingStep !== 'idle' && recordingStep !== 'complete') && !recordedVideoURL && (
            <div className="mb-6">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground mt-2">
                Recording progress: {Math.round(progress)}%
              </p>
            </div>
          )}

          {/* Instructions */}
          {recordingStep === 'idle' && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Video Recording Instructions:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Position your face within the oval guide</li>
                  <li>Ensure good lighting without shadows</li>
                  <li>Remove sunglasses and hats</li>
                  <li>Follow the on-screen head movement instructions</li>
                  <li className="font-semibold text-foreground">The recording will last 7 seconds</li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Recording Complete Message */}
          {recordedVideoURL && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6 flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-700 dark:text-green-400">Recording Complete!</p>
                <p className="text-muted-foreground mt-1">
                  Review your video above. If you're satisfied, click confirm to submit your application.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            {!recordedVideoURL && recordingStep === 'idle' ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate('/form')}
                >
                  Cancel
                </Button>
                <Button
                  onClick={startCountdown}
                  className="gradient-primary"
                  size="lg"
                  disabled={!stream}
                >
                  <Video className="w-5 h-5 mr-2" />
                  Start Recording
                </Button>
              </>
            ) : recordedVideoURL ? (
              <>
                <Button
                  variant="outline"
                  onClick={retake}
                  size="lg"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Record Again
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
            ) : (
              <div className="text-center text-muted-foreground">
                <p>Recording in progress...</p>
              </div>
            )}
          </div>
        </Card>

        {/* Privacy Notice */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          Your video is securely encrypted and used only for identity verification purposes.
        </p>
      </div>
    </div>
  );
};

export default FaceCapture;
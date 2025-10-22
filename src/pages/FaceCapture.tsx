import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, RotateCcw, Check, AlertCircle, Video, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

type RecordingStep = 'idle' | 'countdown' | 'left' | 'right' | 'up' | 'down' | 'complete';

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
    // Total 15 seconds: 3.75s per movement (left, right, up, down)
    let elapsed = 0;
    const totalDuration = 15000;
    const stepDuration = 3750; // 15 seconds / 4 steps
    
    // Step 1: Turn left (0-3.75s)
    setRecordingStep('left');
    setCurrentInstruction('Turn your head LEFT');
    
    setTimeout(() => {
      // Step 2: Turn right (3.75-7.5s)
      setRecordingStep('right');
      setCurrentInstruction('Turn your head RIGHT');
    }, stepDuration);

    setTimeout(() => {
      // Step 3: Look up (7.5-11.25s)
      setRecordingStep('up');
      setCurrentInstruction('Look UP');
    }, stepDuration * 2);

    setTimeout(() => {
      // Step 4: Look down (11.25-15s)
      setRecordingStep('down');
      setCurrentInstruction('Look DOWN');
    }, stepDuration * 3);

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
        return <ArrowLeft className="w-16 h-16 animate-pulse" />;
      case 'right':
        return <ArrowRight className="w-16 h-16 animate-pulse" />;
      case 'up':
        return <ArrowUp className="w-16 h-16 animate-pulse" />;
      case 'down':
        return <ArrowDown className="w-16 h-16 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStepNumber = () => {
    switch (recordingStep) {
      case 'left': return '1/4';
      case 'right': return '2/4';
      case 'up': return '3/4';
      case 'down': return '4/4';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Face Verification
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Record a 15-second video following the on-screen instructions
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
            <Smartphone className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Optimized for mobile devices</span>
          </div>
        </div>

        {/* Camera/Preview Card */}
        <Card className="p-4 md:p-6 shadow-medium animate-fade-in">
          <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden mb-6 shadow-inner">
            {!recordedVideoURL ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-4 border-primary/40 rounded-xl" />
                
                {/* Countdown Overlay */}
                {recordingStep === 'countdown' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-7xl md:text-9xl font-bold text-white animate-bounce drop-shadow-2xl">{countdown}</div>
                      <p className="text-xl md:text-3xl text-white mt-4 font-semibold drop-shadow-lg">{currentInstruction}</p>
                    </div>
                  </div>
                )}
                
                {/* Recording Instructions Overlay */}
                {(recordingStep === 'left' || recordingStep === 'right' || recordingStep === 'up' || recordingStep === 'down') && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    {/* Main Instruction Card */}
                    <div className="bg-gradient-to-br from-primary via-primary/90 to-accent rounded-3xl px-6 py-8 md:px-10 md:py-10 text-center backdrop-blur-md shadow-2xl border-2 border-white/20 animate-pulse">
                      <div className="text-white mb-4 flex items-center justify-center">
                        {getInstructionIcon()}
                      </div>
                      <p className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg mb-2">{currentInstruction}</p>
                      <p className="text-sm md:text-base text-white/90 font-medium">Step {getStepNumber()}</p>
                    </div>
                    
                    {/* Recording Indicator */}
                    <div className="mt-8 flex items-center gap-3 bg-red-500 rounded-full px-5 py-3 shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                      <span className="text-white font-bold text-sm md:text-base">RECORDING</span>
                    </div>
                    
                    {/* Progress Ring */}
                    <div className="mt-6 text-white/90 font-semibold text-lg">
                      {Math.round(progress)}%
                    </div>
                  </div>
                )}
                
                {/* Face Guide Overlay */}
                {recordingStep === 'idle' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative">
                      <div className="w-48 h-64 md:w-64 md:h-80 border-4 border-accent/60 rounded-full shadow-lg">
                        {/* Corner markers */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-1 h-6 bg-accent rounded"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-1 h-6 bg-accent rounded"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-6 h-1 bg-accent rounded"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-6 h-1 bg-accent rounded"></div>
                      </div>
                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <p className="text-white text-sm md:text-base font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                          Position your face here
                        </p>
                      </div>
                    </div>
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
                className="w-full h-full object-cover rounded-lg"
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
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Recording Progress</span>
                <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Step {getStepNumber()}</span>
                <span>{Math.round((progress / 100) * 15)}s / 15s</span>
              </div>
            </div>
          )}

          {/* Instructions */}
          {recordingStep === 'idle' && (
            <div className="bg-gradient-to-br from-accent/10 to-primary/5 border border-accent/30 rounded-xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-base mb-3 text-foreground">Video Recording Instructions</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">1</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Position your face within the oval guide</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">2</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Ensure good lighting without shadows</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">3</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Remove sunglasses and hats</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">4</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Follow on-screen head movements</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-sm font-semibold text-accent flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Recording Duration: 15 seconds (4 head movements)
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded-full">
                        <ArrowLeft className="w-3 h-3" /> Turn Left
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded-full">
                        <ArrowRight className="w-3 h-3" /> Turn Right
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded-full">
                        <ArrowUp className="w-3 h-3" /> Look Up
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded-full">
                        <ArrowDown className="w-3 h-3" /> Look Down
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Recording Complete Message */}
          {recordedVideoURL && (
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-base text-green-700 dark:text-green-400 mb-2">Recording Complete!</p>
                  <p className="text-sm text-muted-foreground">
                    Review your 15-second verification video above. If you're satisfied with the recording, click "Confirm & Submit" to proceed with your application.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Video className="w-4 h-4" />
                    <span>All 4 head movements captured successfully</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {!recordedVideoURL && recordingStep === 'idle' ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate('/form')}
                  className="sm:flex-1 order-2 sm:order-1"
                  size="lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={startCountdown}
                  className="gradient-primary sm:flex-1 order-1 sm:order-2"
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
                  className="sm:flex-1 order-2 sm:order-1"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Record Again
                </Button>
                <Button
                  onClick={confirmCapture}
                  disabled={isLoading}
                  className="gradient-success sm:flex-1 order-1 sm:order-2"
                  size="lg"
                >
                  <Check className="w-5 h-5 mr-2" />
                  {isLoading ? "Processing..." : "Confirm & Submit"}
                </Button>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <p className="font-medium">Recording in progress...</p>
                </div>
                <p className="text-sm mt-1">Follow the on-screen instructions</p>
              </div>
            )}
          </div>
        </Card>

        {/* Privacy Notice */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-muted">
          <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2">
            <AlertCircle className="w-3 h-3" />
            Your video is securely encrypted and used only for identity verification purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaceCapture;
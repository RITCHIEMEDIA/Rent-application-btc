import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, RotateCcw, Check, AlertCircle, Upload, File, X } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { IdPhotoCapture } from "@/components/rental-form/IdPhotoCapture";

const FaceCapture = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const licenseFrontRef = useRef<HTMLInputElement>(null);
  const licenseBackRef = useRef<HTMLInputElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [capturedPhotoBlob, setCapturedPhotoBlob] = useState<Blob | null>(null);
  const [capturedPhotoURL, setCapturedPhotoURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [licenseFront, setLicenseFront] = useState<File | null>(null);
  const [licenseBack, setLicenseBack] = useState<File | null>(null);
  // Add persistent object URLs for thumbnails
  const [licenseFrontURL, setLicenseFrontURL] = useState<string | null>(null);
  const [licenseBackURL, setLicenseBackURL] = useState<string | null>(null);
  // Autoplay guard and stream coordination
  const [needsGesture, setNeedsGesture] = useState(false);
  // ID modal control
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
  const [currentIdSide, setCurrentIdSide] = useState<'front' | 'back'>('front');

  // Stable object URLs for ID thumbnails
  useEffect(() => {
    if (!licenseFront) {
      setLicenseFrontURL(null);
      return;
    }
    const url = URL.createObjectURL(licenseFront);
    setLicenseFrontURL(url);
    return () => URL.revokeObjectURL(url);
  }, [licenseFront]);

  useEffect(() => {
    if (!licenseBack) {
      setLicenseBackURL(null);
      return;
    }
    const url = URL.createObjectURL(licenseBack);
    setLicenseBackURL(url);
    return () => URL.revokeObjectURL(url);
  }, [licenseBack]);

  useEffect(() => {
    const formData = sessionStorage.getItem('rentalFormData');
    if (!formData) {
      navigate('/');
      return;
    }

    startCamera();

    return () => {
      stopCamera();
      // Clean up photo URL on unmount
      if (capturedPhotoURL) {
        URL.revokeObjectURL(capturedPhotoURL);
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
      setIsCameraActive(true);
      const video = videoRef.current;
      if (video) {
        video.srcObject = mediaStream;
        ensurePlayback();
        attachVideoEvents(video);
      }
      setNeedsGesture(false);
    } catch (error: any) {
      console.error("Camera access error:", error);
      toast.error("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    try {
      stream?.getTracks().forEach((track) => track.stop());
    } catch {}
    setStream(null);
    setIsCameraActive(false);
    const video = videoRef.current;
    if (video) {
      video.srcObject = null;
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
      toast.error("Camera error occurred. Try reopening the page.");
    };
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) {
      toast.error('Camera not ready');
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPhoto(dataUrl);
      
      // Convert to blob for upload
      canvas.toBlob((blob) => {
        if (blob) {
          setCapturedPhotoBlob(blob);
          const url = URL.createObjectURL(blob);
          setCapturedPhotoURL(url);
        }
        stopCamera();
        toast.success('Face photo captured successfully!');
      }, 'image/jpeg', 0.9);
    }
  };

  const retake = () => {
    // Clean up old photo URL
    if (capturedPhotoURL) {
      URL.revokeObjectURL(capturedPhotoURL);
    }
    
    setCapturedPhoto(null);
    setCapturedPhotoBlob(null);
    setCapturedPhotoURL(null);
    startCamera();
  };

  const handleFileChange = (field: 'front' | 'back', file: File | null) => {
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    if (file && !file.type.startsWith('image/')) {
      toast.error("Only image files are accepted");
      return;
    }
    
    if (field === 'front') {
      setLicenseFront(file);
    } else {
      setLicenseBack(file);
    }
  };

  // Convert dataURL from modal to File for preview/consistency
  const dataURLToFile = async (dataUrl: string, filename: string) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const mime = blob.type || 'image/jpeg';
    
    // Simple fallback approach - create a blob and add file properties
    const fileLike = blob as any;
    fileLike.name = filename;
    fileLike.lastModified = Date.now();
    return fileLike as File;
  };

  const openIdCamera = (side: 'front' | 'back') => {
    setCurrentIdSide(side);
    try { stopCamera(); } catch {}
    setIsIdModalOpen(true);
  };

  const handleIdCaptured = async (imageData: string) => {
    const fname = `id-${currentIdSide}-${Date.now()}.jpg`;
    const file = await dataURLToFile(imageData, fname);
    if (currentIdSide === 'front') {
      setLicenseFront(file);
      // Auto-continue to back if not captured yet
      if (!licenseBack) {
        toast.info('Front captured. Now capture the BACK side.');
        setCurrentIdSide('back');
        setIsIdModalOpen(true);
        return;
      }
    } else {
      setLicenseBack(file);
    }
    setIsIdModalOpen(false);
    // Restart main camera after ID capture is complete
    startCamera();
  };

  const confirmCapture = async () => {
    if (!capturedPhotoBlob) return;
    
    setIsLoading(true);
    
    try {
      // Get form data from session storage
      const formDataString = sessionStorage.getItem('rentalFormData');
      if (!formDataString) {
        throw new Error('Form data not found. Please complete the rental form first.');
      }

      const formData = JSON.parse(formDataString);
      
      // Log form data for debugging (remove sensitive info)
      console.log('Form data before submission:', {
        hasFirstName: !!formData.firstName,
        hasLastName: !!formData.lastName,
        hasDob: !!formData.dob,
        hasDepositAmount: !!formData.securityDepositAmount,
        hasPhone: !!formData.phone,
        hasEmail: !!formData.email
      });
      
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'dob', 'securityDepositAmount'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}. Please complete the rental form first.`);
      }
      
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Upload photo to Supabase Storage
      const fileName = `face-photo-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      toast.info('Uploading face photo...');
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('faces')
        .upload(fileName, capturedPhotoBlob, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        // Provide more detailed error information
        let errorMessage = 'Failed to upload face photo';
        if (uploadError.message && uploadError.message.includes('fetch')) {
          errorMessage = 'Network error: Unable to connect to Supabase storage. Please check your internet connection and try again.';
        } else if (uploadError.message && uploadError.message.includes('Unauthorized')) {
          errorMessage = 'Authentication error: Invalid Supabase credentials. Please contact support.';
        } else if (uploadError.message && uploadError.message.includes('timeout')) {
          errorMessage = 'Database timeout error: The connection to Supabase timed out. This may be due to storage configuration issues. Please try again or contact support.';
        } else if (uploadError.message && uploadError.message.includes('Bucket not found')) {
          errorMessage = 'Storage configuration error: The faces bucket was not found. Please contact support.';
        } else if (uploadError.message) {
          errorMessage = `Failed to upload face photo: ${uploadError.message}`;
        }
        throw new Error(errorMessage);
      }

      console.log('Photo uploaded successfully:', fileName);

      // Get public URL of the uploaded photo
      const { data: { publicUrl } } = supabase.storage
        .from('faces')
        .getPublicUrl(fileName);

      console.log('Photo public URL:', publicUrl);

      // Pass photo URL instead of base64 data
      formData.faceVideoUrl = publicUrl;

      // Submit application to backend
      toast.info('Submitting application...');
      console.log('Submitting application with face photo URL');
      
      const { data, error } = await supabase.functions.invoke('submit-application', {
        body: formData
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to submit application to server');
      }

      console.log('Application submitted successfully:', data);

      // Navigate to payment page with temp ID
      sessionStorage.clear();
      toast.success("Application submitted! Proceeding to payment...");
      navigate(`/payment?tempId=${data.tempId}`);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      
      // Provide user-friendly error messages
      let userMessage = 'Failed to submit application';
      if (error.message) {
        userMessage = error.message;
      }
      
      toast.error(userMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full gradient-primary flex items-center justify-center">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold bg-gradient-primary ">
              Face Photo Capture
            </h1>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg">
            Upload your ID and capture your face photo for verification
          </p>
        
        </div>

        {/* Document Upload Section */}
        <Card className="p-4 md:p-6 shadow-medium animate-fade-in mb-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Government ID
              </h2>
              <p className="text-sm text-muted-foreground">
                Please upload clear images of your driver's license or government-issued ID
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ID Front */}
              <div>
                <Label className="mb-2 block text-sm font-medium">ID Front *</Label>
                <input
                  ref={licenseFrontRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange('front', e.target.files?.[0] || null)}
                />
                
                {!licenseFront ? (
                  <div className="space-y-3">
                   
                    <Button type="button" variant="secondary" className="w-full text-sm sm:text-base" onClick={() => openIdCamera('front')}>Take Photo</Button>
                  </div>
                ) : (
                  <div className="border rounded-lg p-3 sm:p-4 flex items-center justify-between bg-accent/5">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {licenseFrontURL && (
                        <img src={licenseFrontURL} alt="ID front preview" className="w-12 h-8 sm:w-16 sm:h-10 object-cover rounded border" loading="lazy" />
                      )}
                      <div>
                        <p className="font-medium text-xs sm:text-sm">{licenseFront.name}</p>
                        <p className="text-xs text-muted-foreground">{(licenseFront.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLicenseFront(null)}
                      className="p-1 sm:p-2 hover:bg-destructive/10 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
                    </button>
                  </div>
                )}
              </div>

              {/* ID Back */}
              <div>
                <Label className="mb-2 block text-sm font-medium">ID Back *</Label>
                <input
                  ref={licenseBackRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange('back', e.target.files?.[0] || null)}
                />
                
                {!licenseBack ? (
                  <div className="space-y-3">
                   
                    <Button type="button" variant="secondary" className="w-full text-sm sm:text-base" onClick={() => openIdCamera('back')}>Take Photo</Button>
                  </div>
                ) : (
                  <div className="border rounded-lg p-3 sm:p-4 flex items-center justify-between bg-accent/5">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {licenseBackURL && (
                        <img src={licenseBackURL} alt="ID back preview" className="w-12 h-8 sm:w-16 sm:h-10 object-cover rounded border" loading="lazy" />
                      )}
                      <div>
                        <p className="font-medium text-xs sm:text-sm">{licenseBack.name}</p>
                        <p className="text-xs text-muted-foreground">{(licenseBack.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLicenseBack(null)}
                      className="p-1 sm:p-2 hover:bg-destructive/10 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                <strong>Important:</strong> Ensure your ID is clearly visible and all information is readable. 
                Blurry images may delay your application.
              </p>
            </div>
          </div>
        </Card>

        {/* Camera/Preview Card */}
        <Card className="p-4 md:p-6 shadow-medium animate-fade-in">
          <div className="relative aspect-square sm:aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden mb-6 shadow-inner">
            {!capturedPhotoURL ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-4 border-primary/40 rounded-xl sm:rounded-xl" />
                {/* Mobile face guide overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none md:hidden">
                  <div className="relative w-32 h-40 xs:w-40 xs:h-52 sm:w-48 sm:h-64 border-4 border-accent/60 rounded-full shadow-lg">
                    {/* Corner markers for mobile */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-1 h-4 xs:h-6 bg-accent rounded"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-1 h-4 xs:h-6 bg-accent rounded"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-4 xs:w-6 h-1 bg-accent rounded"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-4 xs:w-6 h-1 bg-accent rounded"></div>
                  </div>
                </div>
                {needsGesture && (
                  <div className="absolute bottom-3 right-3 z-10">
                    <Button variant="outline" size="sm" onClick={ensurePlayback} className="bg-black/40 backdrop-blur text-white border-white/30">
                      Start Camera
                    </Button>
                  </div>
                )}
                
                {/* Face Guide Overlay (desktop only) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none hidden md:flex">
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
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
                {capturedPhoto ? (
                  <img 
                    src={capturedPhoto} 
                    alt="Captured face" 
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-white text-center p-4">
                    <p>Photo captured successfully!</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Hidden canvas for photo capture */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Instructions */}
          {!capturedPhotoURL && (
            <div className="bg-gradient-to-br from-accent/10 to-primary/5 border border-accent/30 rounded-xl p-4 sm:p-5 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-base sm:text-lg mb-3 text-foreground">Face Photo Capturing Instructions</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">1</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Position your face within the oval guide</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">2</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Ensure good lighting without shadows</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">3</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Remove sunglasses and hats</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">4</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Click "Capture Photo" when ready</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-sm font-semibold text-accent flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Simple Photo Capture
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground italic">
                      Just position your face in the circle and click the capture button
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Recording Complete Message */}
          {capturedPhotoURL && (
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-xl p-4 sm:p-5 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-base sm:text-lg text-green-700 dark:text-green-400 mb-2">Photo Captured Successfully!</p>
                  <p className="text-sm text-muted-foreground">
                    Review your face photo above. If you're satisfied with the capture, click "Confirm & Submit" to proceed with your application.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {!capturedPhotoURL ? (
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
                  onClick={capturePhoto}
                  className="gradient-primary sm:flex-1 order-1 sm:order-2"
                  size="lg"
                  disabled={!isCameraActive}
                >
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Capture Photo
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={retake}
                  size="lg"
                  className="sm:flex-1 order-2 sm:order-1"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Capture Again
                </Button>
                <Button
                  onClick={confirmCapture}
                  disabled={isLoading}
                  className="gradient-success sm:flex-1 order-1 sm:order-2"
                  size="lg"
                >
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {isLoading ? "Processing..." : "Confirm & Submit"}
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Privacy Notice */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-muted">
          <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2">
            <AlertCircle className="w-3 h-3" />
            Your ID is securely encrypted and used only for identity verification purposes.
          </p>
        </div>
        <IdPhotoCapture isOpen={isIdModalOpen} side={currentIdSide} onClose={() => {
          setIsIdModalOpen(false);
          // Restart main camera when ID modal is closed
          startCamera();
        }} onCapture={handleIdCaptured} />
      </div>
    </div>
  );
};

export default FaceCapture;
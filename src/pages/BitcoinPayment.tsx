import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Copy, CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface InvoiceData {
  invoiceId: string;
  invoiceUrl: string;
  address: string;
  amountBtc: string;
  amountUsd: number;
  expiresAt: string | number;
  applicationId: string;
}

const BitcoinPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const tempId = searchParams.get('tempId');

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'expired' | 'failed'>('pending');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [checking, setChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch or create invoice
  useEffect(() => {
    if (!tempId) {
      console.error('No tempId found in URL');
      navigate('/form');
      return;
    }

    console.log('Creating invoice for tempId:', tempId);

    const createInvoice = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('create-payment', {
          body: { tempId }
        });

        // Log the raw response for debugging
        console.log('create-payment response:', { data, error });

        if (error) {
          // Try to get more details from the error
          console.error('create-payment error details:', error);
          throw error;
        }

        // Validate invoice data
        if (!data || !data.address || !data.amountBtc) {
          console.error('Invalid invoice data received:', data);
          throw new Error('Invalid payment invoice data. Missing address or amount.');
        }

        console.log('Invoice created successfully:', data);
        setInvoice(data);
        setPaymentStatus('pending');
      } catch (error: any) {
        console.error('Error creating invoice:', error);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        const rawMsg = (error?.message as string) || '';
        let specific = rawMsg;
        
        if (rawMsg.includes('No wallet has been linked')) {
          specific = 'BTCPay store is not linked to a wallet. Please connect a wallet to your store on Coincharge BTCPay and try again.';
        } else if (rawMsg.includes('not configured') || rawMsg.includes('configuration missing')) {
          specific = 'Payment system is not configured. Please set up BTCPay API credentials (BTCPAY_API_KEY and BTCPAY_STORE_ID) in Supabase Edge Function secrets.';
        } else if (rawMsg.includes('Invalid payment invoice data')) {
          specific = 'Payment invoice was created but is missing required information. Please check BTCPay server configuration.';
        } else if (rawMsg.includes('Application not found')) {
          specific = 'Application data not found. Please try submitting your application again from the beginning.';
        } else if (!rawMsg) {
          specific = 'Failed to create payment invoice. Please check browser console for details and try again.';
        }
        
        setErrorMsg(specific);
        toast({
          title: 'Error',
          description: specific,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    createInvoice();
  }, [tempId, navigate, toast]);

// Countdown timer
useEffect(() => {
  if (!invoice) return;

  const getExpiryMs = () => {
    const v: any = invoice.expiresAt as any;
    if (typeof v === 'number') {
      return v > 1e12 ? v : v * 1000; // seconds -> ms
    }
    const parsed = Date.parse(v);
    return isNaN(parsed) ? 0 : parsed;
  };

  const updateTimer = () => {
    const now = Date.now();
    const expiry = getExpiryMs();
    const remaining = Math.max(0, expiry - now);
    setTimeRemaining(remaining);

    if (remaining === 0 && paymentStatus === 'pending') {
      setPaymentStatus('expired');
    }
  };

  updateTimer();
  const interval = setInterval(updateTimer, 1000);
  return () => clearInterval(interval);
}, [invoice, paymentStatus]);

  // Poll payment status
  useEffect(() => {
    if (!invoice || paymentStatus !== 'pending') return;

    const pollStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('payment-status', {
          body: { invoiceId: invoice.invoiceId }
        });

        if (error) throw error;

        if (data.status === 'paid') {
          setPaymentStatus('paid');
          toast({
            title: 'Payment Confirmed!',
            description: 'Your rental application payment has been confirmed.',
          });
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate(`/dashboard?appId=${invoice.applicationId}`);
          }, 2000);
        } else if (data.status === 'expired' || data.status === 'failed') {
          setPaymentStatus(data.status);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };

    const interval = setInterval(pollStatus, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [invoice, paymentStatus, navigate, toast]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Bitcoin address copied to clipboard',
    });
  };

  const manualCheck = async () => {
    if (!invoice) return;
    
    setChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('payment-status', {
        body: { invoiceId: invoice.invoiceId }
      });

      if (error) throw error;

      setPaymentStatus(data.status);
      
      if (data.status === 'paid') {
        toast({
          title: 'Payment Confirmed!',
          description: 'Your payment has been verified.',
        });
      } else {
        toast({
          title: 'Status Updated',
          description: `Payment status: ${data.status}`,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to check payment status',
        variant: 'destructive',
      });
    } finally {
      setChecking(false);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'pending': return 'bg-yellow-500';
      case 'paid': return 'bg-green-500';
      case 'expired': return 'bg-red-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'paid': return <CheckCircle2 className="h-5 w-5" />;
      case 'expired': return <AlertCircle className="h-5 w-5" />;
      case 'failed': return <AlertCircle className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Creating payment invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>{errorMsg || 'Failed to create payment invoice'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/form')} className="w-full">
              Return to Form
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Bitcoin Payment
          </h1>
          <p className="text-muted-foreground">Complete your rental application deposit</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* QR Code Section */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
                </svg>
                Scan to Pay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center p-6 bg-white rounded-lg">
                <QRCodeSVG
                  value={invoice.address && invoice.amountBtc ? `bitcoin:${invoice.address}?amount=${invoice.amountBtc}` : (invoice.invoiceUrl || invoice.address)}
                  size={256}
                  level="H"
                  includeMargin
                />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">Deposit Amount</p>
                <p className="text-2xl font-bold text-primary">
                  {invoice.amountBtc || '0.00000000'} BTC
                </p>
                <p className="text-lg text-muted-foreground">
                  ≈ ${invoice.amountUsd?.toLocaleString() || '0.00'} USD
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Send exact amount to complete payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge className={`${getStatusColor()} text-white`}>
                  <span className="flex items-center gap-2">
                    {getStatusIcon()}
                    {paymentStatus.toUpperCase()}
                  </span>
                </Badge>
              </div>

              {/* Bitcoin Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Bitcoin Address</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={invoice.address || 'Address not available'}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted font-mono"
                    placeholder="Generating address..."
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(invoice.address)}
                    disabled={!invoice.address}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {!invoice.address && (
                  <p className="text-xs text-destructive">⚠️ Bitcoin address is missing. Please check BTCPay configuration.</p>
                )}
              </div>

              {/* Timer */}
              {paymentStatus === 'pending' && timeRemaining > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Time Remaining</span>
                    <span className="text-primary font-mono">{formatTime(timeRemaining)}</span>
                  </div>
                  <Progress 
                    value={(timeRemaining / (15 * 60 * 1000)) * 100} 
                    className="h-2"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={manualCheck}
                  disabled={checking || paymentStatus !== 'pending'}
                  className="w-full"
                  variant="outline"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
                  {checking ? 'Checking...' : "I've Paid"}
                </Button>

                {paymentStatus === 'expired' && (
                  <Button
                    onClick={() => window.location.reload()}
                    className="w-full"
                  >
                    Create New Invoice
                  </Button>
                )}

                {paymentStatus === 'paid' && (
                  <Button
                    onClick={() => navigate(`/dashboard?appId=${invoice.applicationId}`)}
                    className="w-full"
                  >
                    View Dashboard
                  </Button>
                )}
              </div>

              {/* Info */}
              <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
                <p>• Payment is confirmed after blockchain settlement (usually &lt; 10 minutes)</p>
                <p>• Invoice expires in 15 minutes</p>
                <p>• Send exact amount to the address above</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BitcoinPayment;

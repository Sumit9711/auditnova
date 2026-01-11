import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Brain,
  Sliders,
  UploadCloud,
  CheckCircle,
  File,
  Cog,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type StoredModel = {
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
};

type ModelFiles = {
  model: StoredModel | null;
  scaler: StoredModel | null;
};

const ModelConfig: React.FC = () => {
  const navigate = useNavigate();

  const [modelFile, setModelFile] = useState<File | null>(null);
  const [scalerFile, setScalerFile] = useState<File | null>(null);
  const [activeModels, setActiveModels] = useState<ModelFiles>({ model: null, scaler: null });
  const [threshold, setThreshold] = useState<number>(75);
  const [isUploading, setIsUploading] = useState<{ model: boolean; scaler: boolean }>({ model: false, scaler: false });

  // Load saved models from localStorage
  useEffect(() => {
    const savedModel = localStorage.getItem("ml-model-file");
    const savedScaler = localStorage.getItem("ml-scaler-file");
    
    if (savedModel) {
      setActiveModels(prev => ({ ...prev, model: JSON.parse(savedModel) as StoredModel }));
    }
    if (savedScaler) {
      setActiveModels(prev => ({ ...prev, scaler: JSON.parse(savedScaler) as StoredModel }));
    }

    const savedThreshold = localStorage.getItem("risk-threshold");
    if (savedThreshold) {
      setThreshold(Number(savedThreshold));
    }
  }, []);

  // Save threshold when changed
  useEffect(() => {
    localStorage.setItem("risk-threshold", threshold.toString());
  }, [threshold]);

  // Activate model
  const activateModel = async (): Promise<void> => {
    if (!modelFile) {
      toast.error("Please select a model file");
      return;
    }

    setIsUploading(prev => ({ ...prev, model: true }));

    try {
      // Store model file as base64 in localStorage (for demo - in production use proper storage)
      const reader = new FileReader();
      reader.onload = () => {
        const storedModel: StoredModel = {
          name: modelFile.name,
          type: "ML Model (pkl)",
          size: `${(modelFile.size / 1024 / 1024).toFixed(2)} MB`,
          uploadedAt: new Date().toLocaleString(),
        };

        // Store model metadata and data
        localStorage.setItem("ml-model-file", JSON.stringify(storedModel));
        localStorage.setItem("ml-model-data", reader.result as string);

        setActiveModels(prev => ({ ...prev, model: storedModel }));
        setModelFile(null);
        toast.success("Model activated successfully!");
        setIsUploading(prev => ({ ...prev, model: false }));
      };
      reader.readAsDataURL(modelFile);
    } catch (error) {
      toast.error("Failed to activate model");
      setIsUploading(prev => ({ ...prev, model: false }));
    }
  };

  // Activate scaler
  const activateScaler = async (): Promise<void> => {
    if (!scalerFile) {
      toast.error("Please select a scaler file");
      return;
    }

    setIsUploading(prev => ({ ...prev, scaler: true }));

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const storedScaler: StoredModel = {
          name: scalerFile.name,
          type: "Scaler (pkl)",
          size: `${(scalerFile.size / 1024 / 1024).toFixed(2)} MB`,
          uploadedAt: new Date().toLocaleString(),
        };

        localStorage.setItem("ml-scaler-file", JSON.stringify(storedScaler));
        localStorage.setItem("ml-scaler-data", reader.result as string);

        setActiveModels(prev => ({ ...prev, scaler: storedScaler }));
        setScalerFile(null);
        toast.success("Scaler activated successfully!");
        setIsUploading(prev => ({ ...prev, scaler: false }));
      };
      reader.readAsDataURL(scalerFile);
    } catch (error) {
      toast.error("Failed to activate scaler");
      setIsUploading(prev => ({ ...prev, scaler: false }));
    }
  };

  const bothModelsActive = activeModels.model && activeModels.scaler;

  return (
    <div className="min-h-screen p-6 md:p-10 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-hero opacity-30" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-amber/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-muted transition cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Brain className="h-6 w-6 text-amber" />
            Model Configuration
          </h1>
          <p className="text-sm text-muted-foreground">
            Upload your ML model and scaler for fraud detection
          </p>
        </div>
      </div>

      {/* Status Alert */}
      {!bothModelsActive && (
        <div className="relative z-10 mb-6 p-4 rounded-xl glass-card border border-amber/30 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Both model.pkl and scaler.pkl are required for fraud analysis. 
            {!activeModels.model && !activeModels.scaler && " Please upload both files below."}
            {activeModels.model && !activeModels.scaler && " Please upload the scaler file."}
            {!activeModels.model && activeModels.scaler && " Please upload the model file."}
          </p>
        </div>
      )}

      {bothModelsActive && (
        <div className="relative z-10 mb-6 p-4 rounded-xl glass-card border border-emerald/30 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-emerald flex-shrink-0" />
          <p className="text-sm text-foreground">
            Both model files are loaded and ready for fraud analysis!
          </p>
        </div>
      )}

      {/* Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Upload Card */}
        <Card className="glass-card hover-glow transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-primary" />
              ML Model (model.pkl)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeModels.model ? (
              <div className="p-4 rounded-lg bg-secondary/50 space-y-2 text-sm">
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{activeModels.model.name}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span>{activeModels.model.size}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">Uploaded:</span>
                  <span>{activeModels.model.uploadedAt}</span>
                </p>
                <div className="flex items-center gap-2 text-emerald mt-3 pt-3 border-t border-border">
                  <CheckCircle className="h-4 w-4" />
                  Active & Loaded
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-muted/50 text-center text-muted-foreground text-sm">
                No model file uploaded
              </div>
            )}

            <label className={cn(
              "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all",
              "hover:bg-muted/50 hover:border-primary/50",
              modelFile ? "border-primary bg-primary/5" : "border-muted-foreground/30"
            )}>
              <input
                type="file"
                accept=".pkl,.joblib"
                className="hidden"
                onChange={(e) => setModelFile(e.target.files?.[0] || null)}
              />
              <UploadCloud className={cn("h-8 w-8 mb-2", modelFile ? "text-primary" : "text-muted-foreground")} />
              <p className="text-sm font-medium">
                {modelFile ? modelFile.name : "Click or drop model.pkl"}
              </p>
              {modelFile && (
                <p className="text-xs text-muted-foreground mt-1">
                  {(modelFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </label>

            <Button
              onClick={activateModel}
              disabled={!modelFile || isUploading.model}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isUploading.model ? "Uploading..." : "Activate Model"}
            </Button>
          </CardContent>
        </Card>

        {/* Scaler Upload Card */}
        <Card className="glass-card hover-glow transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Cog className="h-5 w-5 text-amber" />
              Scaler (scaler.pkl)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeModels.scaler ? (
              <div className="p-4 rounded-lg bg-secondary/50 space-y-2 text-sm">
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{activeModels.scaler.name}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span>{activeModels.scaler.size}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">Uploaded:</span>
                  <span>{activeModels.scaler.uploadedAt}</span>
                </p>
                <div className="flex items-center gap-2 text-emerald mt-3 pt-3 border-t border-border">
                  <CheckCircle className="h-4 w-4" />
                  Active & Loaded
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-muted/50 text-center text-muted-foreground text-sm">
                No scaler file uploaded
              </div>
            )}

            <label className={cn(
              "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all",
              "hover:bg-muted/50 hover:border-amber/50",
              scalerFile ? "border-amber bg-amber/5" : "border-muted-foreground/30"
            )}>
              <input
                type="file"
                accept=".pkl,.joblib"
                className="hidden"
                onChange={(e) => setScalerFile(e.target.files?.[0] || null)}
              />
              <UploadCloud className={cn("h-8 w-8 mb-2", scalerFile ? "text-amber" : "text-muted-foreground")} />
              <p className="text-sm font-medium">
                {scalerFile ? scalerFile.name : "Click or drop scaler.pkl"}
              </p>
              {scalerFile && (
                <p className="text-xs text-muted-foreground mt-1">
                  {(scalerFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </label>

            <Button
              onClick={activateScaler}
              disabled={!scalerFile || isUploading.scaler}
              className="w-full bg-amber hover:bg-amber/90 text-black"
            >
              {isUploading.scaler ? "Uploading..." : "Activate Scaler"}
            </Button>
          </CardContent>
        </Card>

        {/* Risk Threshold Card */}
        <Card className="glass-card hover-glow transition-all duration-300 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sliders className="h-5 w-5 text-purple" />
              Risk Threshold Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-xl mx-auto space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Transactions with anomaly scores above this threshold will be flagged as suspicious.
              </p>
              
              <input
                type="range"
                min={0}
                max={100}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-purple"
              />

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Low (0%)</span>
                <span className={cn(
                  "font-bold text-lg px-4 py-1 rounded-full",
                  threshold < 30 ? "bg-emerald/20 text-emerald" :
                  threshold < 60 ? "bg-amber/20 text-amber" :
                  "bg-coral/20 text-coral"
                )}>
                  {threshold}%
                </span>
                <span className="text-muted-foreground">High (100%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <div className="relative z-10 mt-8 p-6 rounded-xl glass-card">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <File className="h-5 w-5 text-muted-foreground" />
          How it works
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>1. Upload your trained <code className="px-1.5 py-0.5 bg-muted rounded text-foreground">model.pkl</code> file (XGBoost, Random Forest, etc.)</li>
          <li>2. Upload the corresponding <code className="px-1.5 py-0.5 bg-muted rounded text-foreground">scaler.pkl</code> file used during training</li>
          <li>3. Adjust the risk threshold based on your fraud detection sensitivity needs</li>
          <li>4. Go to Dashboard and upload transaction data for analysis</li>
          <li className="pt-2 text-amber">⚠️ Note: The model will be stored locally. For production use, consider hosting the model on a dedicated ML server.</li>
        </ul>
      </div>
    </div>
  );
};

export default ModelConfig;

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Brain,
  Sliders,
  UploadCloud,
  CheckCircle,
  File
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type StoredModel = {
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
};

const ModelConfig: React.FC = () => {
  const navigate = useNavigate();

  const [modelFile, setModelFile] = useState<File | null>(null);
  const [modelType, setModelType] = useState<string>("XGBoost");
  const [activeModel, setActiveModel] = useState<StoredModel | null>(null);
  const [threshold, setThreshold] = useState<number>(75);

  // Load saved model from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("active-ml-model");
    if (saved) {
      setActiveModel(JSON.parse(saved) as StoredModel);
    }

    const savedThreshold = localStorage.getItem("risk-threshold");
    if (savedThreshold) {
      setThreshold(Number(savedThreshold));
    }
  }, []);

  // Activate model (UI-only)
  const activateModel = (): void => {
    if (!modelFile) return;

    const storedModel: StoredModel = {
      name: modelFile.name,
      type: modelType,
      size: `${(modelFile.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedAt: new Date().toLocaleString(),
    };

    localStorage.setItem("active-ml-model", JSON.stringify(storedModel));
    localStorage.setItem("risk-threshold", threshold.toString());

    setActiveModel(storedModel);
    setModelFile(null);
  };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-muted transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Brain className="h-6 w-6 text-amber" />
            Model Configuration
          </h1>
          <p className="text-sm text-muted-foreground">
            Local ML model management (No API)
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Model */}
        <div className="glass-card p-6 rounded-xl">
          <h2 className="font-medium mb-4 flex items-center gap-2">
            <File className="h-4 w-4 text-amber" />
            Active Model
          </h2>

          {activeModel ? (
            <div className="space-y-2 text-sm">
              <p><b>Name:</b> {activeModel.name}</p>
              <p><b>Type:</b> {activeModel.type}</p>
              <p><b>Size:</b> {activeModel.size}</p>
              <p><b>Uploaded:</b> {activeModel.uploadedAt}</p>
              <div className="flex items-center gap-2 text-green-500 mt-3">
                <CheckCircle className="h-4 w-4" />
                Active & Loaded
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No model activated
            </p>
          )}
        </div>

        {/* Threshold */}
        <div className="glass-card p-6 rounded-xl">
          <h2 className="font-medium mb-4 flex items-center gap-2">
            <Sliders className="h-4 w-4 text-amber" />
            Risk Threshold
          </h2>

          <input
            type="range"
            min={0}
            max={100}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full accent-amber"
          />

          <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Low</span>
            <span className="font-medium text-amber">{threshold}%</span>
            <span className="text-muted-foreground">High</span>
          </div>
        </div>

        {/* Upload */}
        <div className="glass-card p-6 rounded-xl md:col-span-2">
          <h2 className="font-medium mb-4 flex items-center gap-2">
            <UploadCloud className="h-4 w-4 text-amber" />
            Upload New Model
          </h2>

          <label className="flex flex-col items-center justify-center border border-dashed rounded-xl p-6 cursor-pointer hover:bg-muted transition">
            <input
              type="file"
              accept=".pkl,.joblib,.onnx"
              className="hidden"
              onChange={(e) =>
                setModelFile(e.target.files ? e.target.files[0] : null)
              }
            />

            <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
              {modelFile ? modelFile.name : "Click or drop model file"}
            </p>
          </label>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              className="rounded-lg border bg-background px-3 py-2 text-sm"
            >
              <option>XGBoost</option>
              <option>Random Forest</option>
              <option>Logistic Regression</option>
              <option>Neural Network</option>
            </select>

            <button
              onClick={activateModel}
              disabled={!modelFile}
              className="rounded-lg bg-amber text-black font-medium px-4 py-2 
                         hover:opacity-90 transition disabled:opacity-50"
            >
              Activate Model
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelConfig;

import React, { useRef, useState } from "react";
import { UploadCloud, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

const MAX_BYTES = 5 * 1024 * 1024;

const ImageDropzone = ({ value, onChange, label = "Drop image or click to browse", height = "h-32", testid = "image-dropzone", onUploaded }) => {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (!/^image\/(jpe?g|png|webp)$/i.test(file.type)) {
      toast.error("Please upload a JPG, PNG, or WebP image");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("File is too large (max 5MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      onChange(dataUrl);
      onUploaded && onUploaded({ name: file.name, size: file.size, dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  if (value) {
    return (
      <div data-testid={testid} className={`relative ${height} rounded-lg overflow-hidden border border-slate-200 group`}>
        <img src={value} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button data-testid={`${testid}-replace`} type="button" onClick={() => ref.current?.click()} className="bg-white text-slate-900 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
            <Pencil size={12} /> Replace
          </button>
          <button data-testid={`${testid}-remove`} type="button" onClick={() => onChange("")} className="bg-rose-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
            <Trash2 size={12} /> Remove
          </button>
        </div>
        <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>
    );
  }

  return (
    <div
      data-testid={testid}
      onClick={() => ref.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      className={`${height} cursor-pointer rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center px-3 transition-colors ${drag ? "border-rose-400 bg-rose-50" : "border-slate-300 hover:border-slate-400 bg-slate-50"}`}
    >
      <UploadCloud size={20} className="text-slate-400" />
      <div className="text-xs text-slate-600 mt-1">{label}</div>
      <div className="text-[10px] text-slate-400 mt-0.5">JPG / PNG / WebP · max 5MB</div>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  );
};

export default ImageDropzone;

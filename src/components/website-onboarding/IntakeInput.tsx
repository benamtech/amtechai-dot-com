import { useState, useRef, useCallback, useEffect } from 'react';
import type { ScriptNode } from './intakeScript';

interface IntakeInputProps {
  node: ScriptNode | null;
  onSubmit: (key: string, value: string | null, files?: File[]) => void;
}

function TextInput({
  node,
  onSubmit,
}: {
  node: ScriptNode;
  onSubmit: (key: string, value: string) => void;
}) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(node.key!, trimmed);
    setValue('');
  };

  return (
    <div className="input-row">
      <input
        ref={inputRef}
        className="t-field"
        type="text"
        placeholder={node.placeholder || ''}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
        }}
        autoComplete="off"
      />
      <button className="send-btn" onClick={handleSubmit}>
        SEND
      </button>
    </div>
  );
}

function TextareaInput({
  node,
  onSubmit,
}: {
  node: ScriptNode;
  onSubmit: (key: string, value: string | null) => void;
}) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed && !node.optional) return;
    onSubmit(node.key!, trimmed || null);
    setValue('');
  };

  const handleSkip = () => {
    onSubmit(node.key!, null);
    setValue('');
  };

  return (
    <>
      <div className="input-row">
        <textarea
          ref={textareaRef}
          className="t-field"
          rows={3}
          placeholder={node.placeholder || ''}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <button className="send-btn" onClick={handleSubmit}>
          SEND
        </button>
      </div>
      {node.optional && (
        <button className="skip-btn" onClick={handleSkip}>
          [ skip ]
        </button>
      )}
    </>
  );
}

function ChoiceInput({
  node,
  onSubmit,
}: {
  node: ScriptNode;
  onSubmit: (key: string, value: string) => void;
}) {
  return (
    <div className="choices">
      {node.options!.map((opt) => (
        <button
          key={opt}
          className="cbtn"
          onClick={() => onSubmit(node.key!, opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function FileInput({
  node,
  onSubmit,
}: {
  node: ScriptNode;
  onSubmit: (key: string, value: string | null, files?: File[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const arr = Array.from(fileList);
      setFiles((prev) => (node.multiple ? [...prev, ...arr] : [arr[0]].filter(Boolean)));
    },
    [node.multiple]
  );

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (!files.length && !node.optional) return;
    const label = files.length ? files.map((f) => f.name).join(', ') : null;
    onSubmit(node.key!, label, files.length ? files : undefined);
    setFiles([]);
  };

  const handleSkip = () => {
    onSubmit(node.key!, null);
    setFiles([]);
  };

  return (
    <>
      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={node.accept || '*'}
          multiple={node.multiple}
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
        />
        <div className="upload-label">
          <span className="upload-icon">&#x2B06;</span>
          {node.multiple ? 'DRAG FILES OR CLICK TO BROWSE' : 'DRAG FILE OR CLICK TO BROWSE'}
        </div>
      </div>

      {files.length > 0 && (
        <div className="file-chips">
          {files.map((f, i) => (
            <div key={i} className="chip">
              {f.name}
              <button className="chip-x" onClick={() => removeFile(i)}>
                &#x2715;
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <button className="send-btn" style={{ marginTop: 8 }} onClick={handleConfirm}>
          CONFIRM FILES
        </button>
      )}

      {node.optional && (
        <button className="skip-btn" onClick={handleSkip}>
          [ no files to upload ]
        </button>
      )}
    </>
  );
}

export default function IntakeInput({ node, onSubmit }: IntakeInputProps) {
  if (!node) return null;

  switch (node.type) {
    case 'text':
      return <TextInput node={node} onSubmit={onSubmit} />;
    case 'textarea':
      return <TextareaInput node={node} onSubmit={onSubmit} />;
    case 'choice':
      return <ChoiceInput node={node} onSubmit={onSubmit} />;
    case 'file':
      return <FileInput node={node} onSubmit={onSubmit} />;
    default:
      return null;
  }
}

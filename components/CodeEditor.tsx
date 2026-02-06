import React from 'react';

interface CodeEditorProps {
  code: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code }) => {
  return (
    <div className="h-full w-full bg-[#1e1e1e] text-gray-300 font-mono text-sm overflow-auto p-4 shadow-inner">
      <pre className="whitespace-pre-wrap break-words">
        {code}
      </pre>
    </div>
  );
};
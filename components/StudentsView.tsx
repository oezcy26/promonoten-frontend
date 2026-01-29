
import React, { useState } from 'react';
import { Student } from '../types';
import { Icons } from '../constants';

interface StudentsViewProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onDeleteStudent: (id: string) => void;
}

const StudentsView: React.FC<StudentsViewProps> = ({ students, onAddStudent, onDeleteStudent }) => {
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelected = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    handleFileSelected(file);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);

    const file = e.dataTransfer.files && e.dataTransfer.files.length > 0 ? e.dataTransfer.files[0] : null;
    handleFileSelected(file);
    e.dataTransfer.clearData();
  };

  const handleFileDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  };

  const handleFileDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  const handleImportClick = async () => {
    if (!selectedFile) return;
    try {
      const formData = new FormData();
      formData.append('selectedFile', selectedFile);

      const response = await fetch('/api/schueler', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const result = await response.json().catch(() => null);
      console.log('Upload success:', result);
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">


      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Schülerliste importieren</h2>
        <input
          id="students-file-upload"
          type="file"
          className="hidden"
          onChange={handleFileInputChange}
        />
        <label
          htmlFor="students-file-upload"
          onDrop={handleFileDrop}
          onDragOver={handleFileDragOver}
          onDragLeave={handleFileDragLeave}
          className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            isDraggingFile ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
          }`}
        >
          <span className="text-sm font-medium text-gray-700">
            Datei hierher ziehen oder klicken, um eine Datei auszuwÃ¤hlen
          </span>
          <span className="text-xs text-gray-400">Exportierte Datei aus Lehreroffice (Schülerdaten \ Schüler \ Exportieren \ als Textdatei )</span>
          {selectedFile ? (
            <span className="text-sm text-blue-600 font-medium">{selectedFile.name}</span>
          ) : null}
        </label>
        <button
          type="button"
          onClick={handleImportClick}
          className="mt-4 w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedFile}
        >
          Importieren
        </button>
      </div>

  
    </div>
  );
};

export default StudentsView;

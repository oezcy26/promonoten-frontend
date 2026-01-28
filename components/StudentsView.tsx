
import React, { useState } from 'react';
import { Student } from '../types';
import { Icons } from '../constants';

interface StudentsViewProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onDeleteStudent: (id: string) => void;
}

const StudentsView: React.FC<StudentsViewProps> = ({ students, onAddStudent, onDeleteStudent }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [splitted, setSplitted] = useState<string[]>([]);
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
      const content = await selectedFile.text();
      content.split('\n').forEach(line => {
        const columns = line.split(';');
        console.log(line);
        /* if (columns.length >= 3) {
          const firstName = columns[0].trim();
          const lastName = columns[1].trim();
          const email = columns[2].trim();
          if (firstName && lastName && email) {
            onAddStudent({ firstName, lastName, email });
          }
        } */
      })
      
          console.log('Import file content:', content);
    } catch (error) {
      console.error('Failed to read file:', error);
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
          <span className="text-xs text-gray-400">Exportierte Datei aus Lehreroffice</span>
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

  {/* 
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Schülerliste</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Vorname</th>
              <th className="px-6 py-4">Nachname</th>
              <th className="px-6 py-4">E-Mail</th>
              <th className="px-6 py-4 text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                  Noch keine Schüler hinzugefügt.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{student.firstName}</td>
                  <td className="px-6 py-4">{student.lastName}</td>
                  <td className="px-6 py-4 text-gray-500">{student.email}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDeleteStudent(student.id)}
                      className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-all"
                    >
                      <Icons.Trash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      */}
    </div>
  );
};

export default StudentsView;

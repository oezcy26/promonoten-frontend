
import React, { useState } from 'react';
import { Student, Grade } from '../types';
import { Icons } from '../constants';
import { generateEmailFeedback } from '../services/geminiService';

interface MailGeneratorViewProps {
  students: Student[];
  grades: Grade[];
}

const MailGeneratorView: React.FC<MailGeneratorViewProps> = ({ students, grades }) => {
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [generatedMail, setGeneratedMail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!selectedGradeId) return;
    const grade = grades.find(g => g.id === selectedGradeId);
    const student = students.find(s => s.id === grade?.studentId);
    
    if (!grade || !student) return;

    setIsLoading(true);
    setGeneratedMail('');
    try {
      const mail = await generateEmailFeedback(student, grade);
      setGeneratedMail(mail);
    } catch (error) {
      setGeneratedMail("Fehler beim Generieren.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMail);
    alert("In die Zwischenablage kopiert!");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Icons.Mail /> KI Mail-Generator
        </h2>
        
        <div className="max-w-xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wählen Sie eine Bewertung aus</label>
            <select
              value={selectedGradeId}
              onChange={(e) => setSelectedGradeId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Bewertung auswählen...</option>
              {grades.map(g => {
                const s = students.find(st => st.id === g.studentId);
                return (
                  <option key={g.id} value={g.id}>
                    {s?.lastName}, {s?.firstName} - {g.subject} (Note: {g.grade})
                  </option>
                );
              })}
            </select>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={!selectedGradeId || isLoading}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
              isLoading || !selectedGradeId 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                KI denkt nach...
              </>
            ) : (
              <>
                <Icons.Mail /> Mail generieren
              </>
            )}
          </button>
        </div>
      </div>

      {generatedMail && (
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 animate-slideUp">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Vorschau</h3>
            <button
              onClick={copyToClipboard}
              className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 border border-blue-100"
            >
              Text kopieren
            </button>
          </div>
          <div className="prose prose-blue max-w-none">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 whitespace-pre-wrap text-gray-800 font-serif leading-relaxed">
              {generatedMail}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MailGeneratorView;

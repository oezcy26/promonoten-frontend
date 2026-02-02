
import React, { useEffect, useState } from 'react';
import { Student, Grade } from '../types';
import { Icons } from '../constants';
import { generateEmailFeedback } from '../services/geminiService';

interface MailGeneratorViewProps {
  students: Student[];
  grades: Grade[];
}

const MailGeneratorView: React.FC<MailGeneratorViewProps> = ({ students, grades }) => {
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [generatedMail, setGeneratedMail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [classesError, setClassesError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const normalizeClasses = (data: unknown) => {
      if (!Array.isArray(data)) return [];
      return data
        .map((item) => {
          if (typeof item === 'string') {
            return { id: item, name: item };
          }
          if (item && typeof item === 'object') {
            const record = item as Record<string, unknown>;
            const id =
              typeof record.id === 'string'
                ? record.id
                : typeof record.value === 'string'
                  ? record.value
                  : typeof record.klasse === 'string'
                    ? record.klasse
                    : '';
            const name =
              typeof record.name === 'string'
                ? record.name
                : typeof record.label === 'string'
                  ? record.label
                  : typeof record.klasse === 'string'
                    ? record.klasse
                    : '';
            if (id && name) return { id, name };
          }
          return null;
        })
        .filter((item): item is { id: string; name: string } => Boolean(item));
    };

    const loadClasses = async () => {
      setIsLoadingClasses(true);
      setClassesError('');
      try {
        const response = await fetch('/api/klassen');
        if (!response.ok) {
          throw new Error('Failed to load classes');
        }
        const data = await response.json();
        const normalized = normalizeClasses(data);
        if (isMounted) {
          setClasses(normalized);
        }
      } catch (error) {
        if (isMounted) {
          setClasses([]);
          setClassesError('Klassen konnten nicht geladen werden.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingClasses(false);
        }
      }
    };

    loadClasses();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleGenerate = async () => {
    if (!selectedClassId || !selectedSemester) {
      alert('Bitte Klasse und Semester auswaehlen.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/mails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedClassId,
          selectedSemester,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate mail');
      }

      const data = await response.json();
      console.log('Mail generation response:', data);

    } catch (error) {
      setGeneratedMail('');
      alert('Mail konnte nicht generiert werden.');
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Waehlen Sie eine Klasse</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoadingClasses}
            >
              <option value="">
                {isLoadingClasses ? 'Klassen werden geladen...' : 'Klasse auswaehlen...'}
              </option>
              {classes.map((klass) => (
                <option key={klass.id} value={klass.id}>
                  {klass.name}
                </option>
              ))}
            </select>
            {classesError && (
              <p className="mt-1 text-sm text-red-600">{classesError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Waehlen Sie das Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semester auswaehlen...</option>
              {['1', '2', '3', '4', '5', '6'].map((semester) => (
                <option key={semester} value={semester}>
                  Semester {semester}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
              isLoading 
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

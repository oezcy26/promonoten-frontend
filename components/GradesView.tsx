
import React, { useState } from 'react';
import { Student, Grade } from '../types';
import { SUBJECTS, Icons } from '../constants';

interface GradesViewProps {
  students: Student[];
  grades: Grade[];
  onAddGrade: (grade: Omit<Grade, 'id'>) => void;
}

const GradesView: React.FC<GradesViewProps> = ({ students, grades, onAddGrade }) => {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [gradeValue, setGradeValue] = useState<number>(1);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    
    onAddGrade({
      studentId: selectedStudentId,
      subject: selectedSubject,
      grade: gradeValue,
      comment,
      date: new Date().toLocaleDateString('de-DE'),
    });

    setComment('');
  };

  const getStudentName = (id: string) => {
    const student = students.find(s => s.id === id);
    return student ? `${student.firstName} ${student.lastName}` : 'Unbekannt';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Icons.Plus /> Note eintragen
        </h2>
        
        {students.length === 0 ? (
          <div className="p-8 text-center bg-yellow-50 rounded-xl border border-yellow-100 text-yellow-800">
            Bitte fügen Sie zuerst Schüler unter "Schüler einfügen" hinzu.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Schüler</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Wählen...</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fach</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SUBJECTS.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note (1-6)</label>
              <input
                type="number"
                min="1"
                max="6"
                step="0.1"
                value={gradeValue}
                onChange={(e) => setGradeValue(parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Kommentar</label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="z.B. Sehr gute Beteiligung in der letzten Klausur."
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm h-[42px]"
              >
                Note speichern
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Zuletzt eingetragene Noten</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Schüler</th>
                <th className="px-6 py-4">Fach</th>
                <th className="px-6 py-4">Note</th>
                <th className="px-6 py-4">Kommentar</th>
                <th className="px-6 py-4">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {grades.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    Noch keine Noten eingetragen.
                  </td>
                </tr>
              ) : (
                [...grades].reverse().map((grade) => (
                  <tr key={grade.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{getStudentName(grade.studentId)}</td>
                    <td className="px-6 py-4 text-gray-600">{grade.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${
                        grade.grade <= 2 ? 'bg-green-500' : grade.grade <= 4 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                        {grade.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 italic">"{grade.comment}"</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{grade.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GradesView;

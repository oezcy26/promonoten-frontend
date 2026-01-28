
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     fetch("api/hello")
      .then(r => r.json())
      .then(data => console.log(data));
    if (!firstName || !lastName || !email) return;
   
    onAddStudent({ firstName, lastName, email });
    setFirstName('');
    setLastName('');
    setEmail('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Icons.Plus /> Neuen Schüler hinzufügen
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vorname</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="z.B. Max"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nachname</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="z.B. Mustermann"
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail Eltern</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="eltern@beispiel.de"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors h-[42px]"
            >
              Hinzufügen
            </button>
          </div>
        </form>
      </div>

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
    </div>
  );
};

export default StudentsView;

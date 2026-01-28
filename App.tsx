
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import StudentsView from './components/StudentsView';
import GradesView from './components/GradesView';
import MailGeneratorView from './components/MailGeneratorView';
import { Page, Student, Grade } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.NOTEN_EINFUEGEN);
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('la_students');
    return saved ? JSON.parse(saved) : [];
  });
  const [grades, setGrades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem('la_grades');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('la_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('la_grades', JSON.stringify(grades));
  }, [grades]);

  const addStudent = (s: Omit<Student, 'id'>) => {
    const newStudent = { ...s, id: crypto.randomUUID() };
    setStudents([...students, newStudent]);
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    setGrades(grades.filter(g => g.studentId !== id));
  };

  const addGrade = (g: Omit<Grade, 'id'>) => {
    const newGrade = { ...g, id: crypto.randomUUID() };
    setGrades([...grades, newGrade]);
  };

  const renderContent = () => {
    switch (currentPage) {
      case Page.NOTEN_EINFUEGEN:
        return <GradesView students={students} grades={grades} onAddGrade={addGrade} />;
      case Page.MAILS_GENERIEREN:
        return <MailGeneratorView students={students} grades={grades} />;
      case Page.SCHUELER_EINFUEGEN:
        return <StudentsView students={students} onAddStudent={addStudent} onDeleteStudent={deleteStudent} />;
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case Page.NOTEN_EINFUEGEN: return "Noten Einfügen";
      case Page.MAILS_GENERIEREN: return "KI Mail-Generator";
      case Page.SCHUELER_EINFUEGEN: return "Schülerverwaltung";
      default: return "";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <main className="flex-1 ml-64 p-10">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Lehrer-Assistent Pro</p>
            <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
          </div>
          
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-gray-800">Lehrer Account</span>
              <span className="text-xs text-green-500 font-medium">Online</span>
            </div>
            <img 
              src="https://picsum.photos/seed/teacher/40/40" 
              className="w-10 h-10 rounded-full border-2 border-blue-50"
              alt="Avatar"
            />
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;


export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subject: string;
  grade: number;
  comment: string;
  date: string;
}

export enum Page {
  NOTEN_EINFUEGEN = 'noten-einfuegen',
  MAILS_GENERIEREN = 'mails-generieren',
  SCHUELER_EINFUEGEN = 'schueler-einfuegen'
}

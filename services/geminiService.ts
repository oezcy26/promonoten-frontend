
import { GoogleGenAI, Type } from "@google/genai";
import { Student, Grade } from "../types";

export const generateEmailFeedback = async (student: Student, grade: Grade): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Erstelle eine professionelle und freundliche E-Mail von einem Lehrer an die Eltern des Schülers ${student.firstName} ${student.lastName}.
    Fach: ${grade.subject}
    Note: ${grade.grade}
    Lehrerkommentar: ${grade.comment}
    Datum der Bewertung: ${grade.date}
    
    Die E-Mail sollte:
    1. Den Empfänger höflich grüßen.
    2. Den aktuellen Leistungsstand im Fach ${grade.subject} erläutern.
    3. Die Note ${grade.grade} einordnen.
    4. Den spezifischen Kommentar "${grade.comment}" einbeziehen.
    5. Hilfestellung oder Lob anbieten, je nach Note.
    6. Mit einer professionellen Grußformel enden.
    Sprache: Deutsch.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "Fehler beim Generieren der E-Mail.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Entschuldigung, beim Generieren der E-Mail ist ein Fehler aufgetreten.";
  }
};

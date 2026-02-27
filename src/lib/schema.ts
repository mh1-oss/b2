import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const studentsSelections = pgTable('students_selections', {
    id: serial('id').primaryKey(),
    studentName: text('student_name').notNull().unique(),
    seminarChoice: text('seminar_choice').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

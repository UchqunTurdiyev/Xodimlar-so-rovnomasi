// lib/schema.ts
import { z } from "zod";

export const FormSchema = z.object({
  fullName: z.string().min(3, "Ism-familya kamida 3 ta belgi"),
  phone: z
    .string()
    .min(7, "Telefon raqam noto‘g‘ri")
    .regex(/^[0-9+\-()\s]+$/, "Faqat raqam va + - ( ) bo‘lsin"),
  // coerce.number() => input: unknown (odatda string), output: number
  age: z.coerce.number().int("Butun son kiriting").min(14).max(80),
  experienceYears: z.coerce.number().int("Butun son kiriting").min(0).max(50),
  address: z.string().min(3, "Manzil kamida 3 ta belgi"),
  // optional (formdan kelishi mumkin), lekin defaultValues bilan bo'sh string beramiz
  camera: z.string().optional(),
  laptop: z.string().optional(),
  skills: z.string().min(3, "Nimalarni bilishingizni yozing"),
  advantages: z.string().min(3, "Afzalliklaringizni yozing"),
});

// RHF bilan moslash uchun input va output turlarni alohida oling:
export type FormFields = z.input<typeof FormSchema>;   // formdan keladigan xom qiymatlar
export type FormValues = z.output<typeof FormSchema>;  // parse/validate qilingandan keyingi qiymatlar

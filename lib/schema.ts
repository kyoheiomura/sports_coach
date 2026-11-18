import { z } from "zod";
import { findCity } from "@/data/areas";
import {
  FEATURES,
  FEEDBACKS,
  FORMATS,
  GOAL_SLUGS,
  ROLES,
  SPORT_SLUGS,
  TARGETS,
  TONES,
  VENUE_KINDS,
  WEEKDAYS,
} from "@/data/vocab";

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "半角英小文字・数字・ハイフンで書く（例: mogi-aoi）");
const text = (max: number) =>
  z.string().trim().min(1, "空にしない").max(max, `${max}字以内で書く`);
const kana = z.string().regex(/^[ぁ-んー 　]+$/, "ひらがなで書く");
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "HH:MM で書く");
const yen = z.number().int().nonnegative();

export const PhotoSchema = z.object({
  src: z.string().startsWith("/images/", "public/images/ 以下のパスを書く"),
  alt: z.string().min(10, "写真の内容が分かる alt を10字以上で書く"),
});

export const CoachSchema = z
  .object({
    slug,
    name: text(20),
    nameKana: kana,
    photo: PhotoSchema,
    catchphrase: text(32),
    /** 記事の冒頭に置く導入文。編集部の言葉で、どんな人・どんな場所かを紹介する */
    lead: text(400).optional(),
    sports: z.array(z.enum(SPORT_SLUGS)).min(1),
    /** 指導者資格。団体名も含めてそのまま書く。選手としての戦績はここに書かない */
    qualifications: z.array(text(40)).default([]),
    startedYear: z.number().int().min(1950).max(2100),
    venues: z
      .array(z.object({ slug, role: z.enum(ROLES), days: text(30).optional() }))
      .min(1, "教えている場所を1つ以上書く"),

    // 比較項目。並び順は lib/compare-fields.ts で決める
    compare: z
      .object({
        feature: text(24), // 教え方の特徴（ひとことで）
        message: text(60), // 読者へのメッセージ
        why: text(60),
        belief: text(60),
        approach: text(80), // できないことへの向き合い方
        targets: z.array(z.enum(TARGETS)).min(1),
        tone: z.enum(TONES),
        feedback: z.enum(FEEDBACKS),
        formats: z.array(z.enum(FORMATS)).min(1),
        methods: z.array(text(30)).min(1).max(6),
        explanation: text(60),
        firstLesson: z.object({
          hearingMin: z.number().int().positive(),
          practiceMin: z.number().int().positive(),
        }),
        pace: text(60),
        homework: z.boolean(),
        goals: z.array(z.enum(GOAL_SLUGS)).min(1).max(5),
        notFor: text(80),
        gender: z.enum(["女性", "男性"]).optional(),
        price: z.object({ trial: yen, regular: yen, note: text(60).optional() }),
      })
      .strict(),

    interviewedAt: z.coerce.date(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    verifiedAt: z.coerce.date(),
    interviewer: text(30),
    photographer: text(30).optional(),
    listing: z.enum(["free", "paid"]).default("free"),
    draft: z.boolean().default(false),
  })
  .strict()
  .superRefine((s, ctx) => {
    if (s.publishedAt < s.interviewedAt) {
      ctx.addIssue({ code: "custom", path: ["publishedAt"], message: "取材日より前になっている" });
    }
  });

export const VenueSchema = z
  .object({
    slug,
    name: text(40),
    nameKana: kana,
    kind: z.enum(VENUE_KINDS),
    address: z.object({
      prefSlug: z.string(),
      citySlug: z.string(),
      line: text(60),
      building: text(40).optional(),
    }),
    stations: z
      .array(z.object({ line: text(20), name: text(20), walkMin: z.number().int().positive() }))
      .min(1),
    hours: z
      .array(z.object({ days: z.array(z.enum(WEEKDAYS)).min(1), open: time, close: time }))
      .min(1),
    hoursNote: text(80).optional(),
    booking: z
      .object({
        phone: z.string().regex(/^[0-9-]+$/, "数字とハイフンで書く").optional(),
        url: z.url().optional(),
        line: z.url().optional(),
      })
      .refine((b) => b.phone || b.url || b.line, "申し込みの窓口を1つ以上書く"),
    features: z.array(z.enum(FEATURES)).default([]),
    verifiedAt: z.coerce.date(),
  })
  .strict()
  .superRefine((c, ctx) => {
    if (!findCity(c.address.prefSlug, c.address.citySlug)) {
      ctx.addIssue({
        code: "custom",
        path: ["address"],
        message: `data/areas.ts にない地域: ${c.address.prefSlug}/${c.address.citySlug}`,
      });
    }
  });

export type Coach = z.infer<typeof CoachSchema>;
export type Venue = z.infer<typeof VenueSchema>;

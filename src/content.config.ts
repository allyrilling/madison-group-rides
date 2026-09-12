import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Shared vocab so schemas and filter UI stay in sync.
export const TERRAIN_TYPES = ['road', 'gravel', 'mountain', 'trail', 'mixed'] as const;
export const PACE_CATEGORIES = ['casual', 'moderate', 'brisk', 'fast', 'varies'] as const;
export const DROP_STYLES = ['no-drop', 'drop', 'varies'] as const;
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;
export const RECURRENCE_TYPES = ['weekly', 'biweekly', 'monthly', 'seasonal', 'varies'] as const;

const startLocationSchema = z.object({
  name: z.string(),
  address: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

const paceRangeSchema = z
  .object({
    min: z.number().optional(),
    max: z.number().optional(),
  })
  .optional();

const organizers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/organizers' }),
  schema: z.object({
    name: z.string(),
    type: z.enum(['shop', 'club', 'team', 'nonprofit', 'informal-group']),
    website: z.string().url().optional(),
    social: z
      .object({
        facebook: z.string().url().optional(),
        instagram: z.string().url().optional(),
        strava: z.string().url().optional(),
        meetup: z.string().url().optional(),
      })
      .optional(),
    logo: z.string().optional(),
    address: z.string().optional(), // shops: street address
    lat: z.number().optional(), // shops: geocoded from `address`, for map pins
    lng: z.number().optional(),
    phone: z.string().optional(), // shops: contact phone
    hours: z.string().optional(), // shops: human-readable store hours
    sourceUrl: z.string().url().optional(),
    lastVerified: z.coerce.date().optional(),
  }),
});

// `rides`: evergreen, recurring group rides (weekly shop rides, club rides, etc.)
const rides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rides' }),
  schema: z.object({
    name: z.string(),
    organizer: reference('organizers').optional(),
    organizerName: z.string().optional(), // fallback free-text when no organizer entry exists yet
    description: z.string(),
    recurrence: z.enum(RECURRENCE_TYPES),
    daysOfWeek: z.array(z.enum(DAYS_OF_WEEK)).optional(),
    startTime: z.string().optional(), // e.g. "6:00 PM"
    seasonStart: z.string().optional(), // e.g. "April"
    seasonEnd: z.string().optional(), // e.g. "October"
    distanceMiles: paceRangeSchema,
    paceMph: paceRangeSchema,
    paceCategory: z.enum(PACE_CATEGORIES),
    dropStyle: z.enum(DROP_STYLES),
    terrain: z.array(z.enum(TERRAIN_TYPES)).min(1),
    startLocation: startLocationSchema,
    cost: z.string().optional(),
    website: z.string().url().optional(),
    sourceUrl: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    active: z.boolean().default(true),
    lastVerified: z.coerce.date().optional(),
    notes: z.string().optional(), // e.g. "unconfirmed for 2026 season"
  }),
});

// `events`: one-time or annual dated rides (fondos, centuries, charity rides)
const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    name: z.string(),
    organizer: reference('organizers').optional(),
    organizerName: z.string().optional(),
    description: z.string(),
    date: z.coerce.date().optional(), // specific known date, if confirmed
    dateLabel: z.string().optional(), // human label when exact date isn't set, e.g. "Early June 2026"
    startTime: z.string().optional(), // e.g. "7:00 AM"
    isAnnual: z.boolean().default(false),
    distanceMiles: paceRangeSchema,
    paceCategory: z.enum(PACE_CATEGORIES).optional(),
    terrain: z.array(z.enum(TERRAIN_TYPES)).min(1),
    startLocation: startLocationSchema,
    cost: z.string().optional(),
    registrationUrl: z.string().url().optional(),
    website: z.string().url().optional(),
    sourceUrl: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    active: z.boolean().default(true),
    lastVerified: z.coerce.date().optional(),
    notes: z.string().optional(),
  }),
});

export const collections = { organizers, rides, events };

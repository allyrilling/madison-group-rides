import { getEntry } from 'astro:content';

type OrganizerRef = { collection: 'organizers'; id: string };

interface HasOrganizer {
  organizer?: OrganizerRef;
  organizerName?: string;
}

export async function resolveOrganizerEntry(data: HasOrganizer) {
  if (data.organizer) {
    return await getEntry(data.organizer);
  }
  return undefined;
}

export async function resolveOrganizerName(data: HasOrganizer): Promise<string | undefined> {
  const entry = await resolveOrganizerEntry(data);
  return entry?.data.name ?? data.organizerName;
}

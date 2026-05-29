export type GroupSlug = "ai" | "mechatronics";

/**
 * Track a meeting belongs to. Superset of GroupSlug with a meeting-only
 * "general" (lab-wide) option. Intentionally NOT a real Group — membership,
 * the /groups pages, and the email mailer stay keyed on GroupSlug only.
 */
export type MeetingTrack = GroupSlug | "general";

export interface Lab {
  name: string;
  shortName: string;
  mission: string;
  institution: string;
  meetingCadence: string;
  professor: {
    name: string;
    email: string;
  };
  discordInviteUrl: string;
  calendarEmbedUrl: string;
  formUrls: {
    join: string;
    contact: string;
    submitResource: string;
  };
}

export interface Group {
  slug: GroupSlug;
  name: string;
  shortName: string;
  description: string;
}

export interface Subgroup {
  slug: string;
  parentGroup: GroupSlug;
  name: string;
  description: string;
  discordChannel: string;
  projects: { name: string; blurb: string }[];
}

export interface Member {
  slug: string;
  name: string;
  email?: string;
  photo?: string;
  status?: "active" | "graduated" | "high-school";
  groups: GroupSlug[];
  subgroups: string[];
  interests: string[];
  links?: {
    website?: string;
    linkedin?: string;
    github?: string;
  };
  isAdmin?: boolean;
  adminRole?: string;
  /**
   * Subgroup slugs this member is the admin/lead for. UI-invisible; reserved for
   * routing resource-submission notifications to the right subgroup admin once
   * Discord subgroup admins are named. Unused until then. See resources-submission.md.
   */
  subgroupAdminOf?: string[];
}

export type ResourceType = "Paper" | "Video" | "Project" | "Tutorial" | "Dataset";

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  description: string;
  tags: string[];
  recommendedBy: string;
  dateAdded: string;
  /** Subgroup this resource belongs to. Omitted for general / lab-wide resources. */
  subgroupSlug?: string;
  beginnerFriendly?: boolean;
}

export interface Meeting {
  id: string;
  date: string;
  presenter: string;
  topic: string;
  paperUrl?: string;
  location: string;
  zoomUrl?: string;
  /** Optional Zoom meeting ID + passcode, for joining without the link. */
  zoomMeetingId?: string;
  zoomPasscode?: string;
  parentGroup: MeetingTrack;
  subgroupSlug?: string;
  slidesUrl?: string;
  recordingUrl?: string;
}

export interface Admin {
  memberSlug: string;
  role: string;
  email?: string;
  discordHandle?: string;
}

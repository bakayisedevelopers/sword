import { slugify } from '../utils/slugify.js';

const rawGroups = [
  {
    title: 'Core visitor pages',
    items: ['Home', 'About Us', 'Locations', 'Watch', 'Care', 'Give', 'Contact Us', 'Privacy Policy'],
  },
  {
    title: 'People and discipleship',
    items: [
      'Prayer',
      'Counseling',
      'Ministries',
      'Partner',
      'Be a Partner',
      'Baptism',
      'Fellowship',
      'Follow Jesus',
      'Youth',
      'Welfare',
      'Couples',
      'For Men',
      'For Women',
      'Young Adults',
      'Singles',
      'School of Ministry',
      'Super Kids',
    ],
  },
  {
    title: 'Branches and campuses',
    items: ['Boksburg', 'E Malahleni', 'Hlutsi', 'Lagos', 'Ludzeludze', 'Mbabane', 'Online', 'Orange Farm', 'Siteki'],
  },
  {
    title: 'Events and campaigns',
    items: ['Events', 'Register', 'Camp Yolo', 'Fire Conference', 'Superman Conference', 'Branch Template', 'Youth Template', 'Socials'],
  },
  {
    title: 'Resources and giving',
    items: ['E Resources Center', 'Podcasts', 'Branch Give', 'Beyond Tithe'],
  },
];

export const churchBlueprint = rawGroups.map((group) => ({
  ...group,
  items: group.items.map((item) => ({
    title: item,
    slug: `/${slugify(item)}`,
  })),
}));

export function buildChurchBlueprint() {
  return churchBlueprint;
}

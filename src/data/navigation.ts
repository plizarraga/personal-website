export interface NavLink {
  href: string;
  label: string;
}

/** Main navigation: in the site header on wide screens, in the home page hero on small screens. */
export const mainNav: NavLink[] = [
  { href: '/experience', label: 'Experience' },
  { href: '/blog', label: 'Blog' },
];

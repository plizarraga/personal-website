export interface NavLink {
  href: string;
  label: string;
}

/** Main navigation: in the site header on wide screens, in the home page hero on small screens, and in every footer. */
export const mainNav: NavLink[] = [
  { href: '/experience', label: 'Experience' },
  { href: '/blog', label: 'Blog' },
];

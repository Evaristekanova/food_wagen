export interface FooterLink {
  label: string;
  links: {
    label: string;
    href: string;
  }[];
}

export const footerLinks: FooterLink[] = [
  {
    label: "Company",
    links: [
      {
        label: "About Us",
        href: "#",
      },
      {
        label: "Team",
        href: "#",
      },
      {
        label: "Careers",
        href: "#",
      },
      {
        label: "Blog",
        href: "#",
      },
    ],
  },
  {
    label: "Contact",
    links: [
      {
        label: "Help & Support",
        href: "#",
      },
      {
        label: "Partner with us",
        href: "#",
      },
      {
        label: "Ride with us",
        href: "#",
      },
    ],
  },
  {
    label: "Legal",
    links: [
      {
        label: "Terms & Conditions",
        href: "#",
      },
      {
        label: "Refund & Cancellation",
        href: "#",
      },
      {
        label: "Privacy Policy",
        href: "#",
      },
      {
        label: "Cookie Policy",
        href: "#",
      },
    ],
  },
];

// Notifications dropdown

interface notificationType {
  avatar: string;
  title: string;
  subtitle: string;
}

const notifications: notificationType[] = [

];

//
// Profile dropdown
//
interface ProfileType {
  href: string;
  title: string;
  subtitle: string;
  icon: any;
}
const profile: ProfileType[] = [
  {
    href: "/profile",
    title: "My Profile",
    subtitle: "Account Settings",
    icon: "/images/svgs/icon-account.svg",
  },
];

// apps dropdown

interface appsLinkType {
  href: string;
  title: string;
  subtext: string;
  avatar: string;
}

const appsLink: appsLinkType[] = [

];

interface LinkType {
  href: string;
  title: string;
}

const pageLinks: LinkType[] = [

];

export { notifications,  profile, pageLinks, appsLink };

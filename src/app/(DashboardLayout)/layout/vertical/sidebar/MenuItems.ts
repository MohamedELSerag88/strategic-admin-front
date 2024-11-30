import { uniqueId } from "lodash";
import {
  IconLayoutDashboard,
  IconUsers,
  IconMap2,
  IconLayout,
  IconBinaryTree2,
  IconCamera,
  Icon360View,
  IconBadgeHd,
  IconArticle,
  IconReportAnalytics,
  IconHeartHandshake,
  IconBrandAppgallery,
  IconBolt,
  IconBriefcase,
  IconListCheck,
  IconSend, IconPoint,
} from "@tabler/icons-react";
interface MenuitemsType {
  id?: string;
  title?: string;
  icon?: any;
  href?: string;
  chipColor?: string;
  subheader?: string;
}

const Menuitems: (MenuitemsType | undefined)[] = [

  {
    id: uniqueId(),
    title: "Admins",
    icon: IconBolt,
    href: "/admins",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Roles",
    icon: IconListCheck,
    href: "/roles",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Users",
    icon: IconUsers,
    href: "/users",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Pages",
    icon: IconUsers,
    href: "/pages",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Categories",
    icon: IconUsers,
    href: "/categories",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Experts",
    icon: IconPoint,
    href: "/experts",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Consultations",
    icon: IconPoint,
    href: "/consultations",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Events",
    icon: IconPoint,
    href: "/events",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "News",
    icon: IconPoint,
    href: "/news",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Studies",
    icon: IconPoint,
    href: "/studies",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Discussion Forums",
    icon: IconPoint,
    href: "/forums",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Membership",
    icon: IconPoint,
    href: "/membership",
    chipColor: "secondary",
  }
  ,
  {
    id: uniqueId(),
    title: "Consultation Requests",
    icon: IconPoint,
    href: "/consultation-request",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Event Requests",
    icon: IconPoint,
    href: "/event-request",
    chipColor: "secondary",
  }
];

export default Menuitems;

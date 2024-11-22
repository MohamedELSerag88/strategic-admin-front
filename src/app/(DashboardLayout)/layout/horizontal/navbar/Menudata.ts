import {
  IconHome, IconPoint
} from '@tabler/icons-react';
import { uniqueId } from 'lodash';

const Menuitems = [
  {
    id: uniqueId(),
    title: "Admins",
    icon: IconPoint,
    href: "/admins",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Roles",
    icon: IconPoint,
    href: "/roles",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Users",
    icon: IconPoint,
    href: "/users",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Pages",
    icon: IconPoint,
    href: "/pages",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Categories",
    icon: IconPoint,
    href: "/categories",
    chipColor: "secondary",
  }
  ,
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
  }
  ,
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
    title: "Opinion Measurements",
    icon: IconPoint,
    href: "/measurements",
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

];
export default Menuitems;

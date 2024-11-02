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
  }

];
export default Menuitems;

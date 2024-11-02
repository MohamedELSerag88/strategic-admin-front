import Menuitems from './MenuItems';
import { usePathname } from "next/navigation";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from '@/store/hooks';
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import NavGroup from './NavGroup/NavGroup';
import { AppState } from '@/store/store'
import { toggleMobileSidebar } from '@/store/customizer/CustomizerSlice';
import {array} from "yup";


const SidebarItems = () => {
  const  pathname  = usePathname();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  const customizer = useSelector((state: AppState) => state.customizer);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const hideMenu: any = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const dispatch = useDispatch();
  const userDataString = localStorage.getItem('user');
  var features:any[] = [];
  if (userDataString !== null) {
     const features = JSON.parse(userDataString).menus;
  }


  const filteredMenuItems = Menuitems.filter(function (menuItem): boolean {
    // const menuItemTyped = menuItem;
    // if (!menuItemTyped) return false;
    // const href = menuItemTyped.href?.replace('ies', 'ys').slice(0, -1).replace('-', '').replace('/', '');
    // return features.includes(href);
    return true;
  });

  function checkMenu(menuItem:object): boolean  {
    return true;
  }

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {filteredMenuItems.map((item) => {
          if(item){
              return (
                  <NavItem item={item} key={item.id} pathDirect={pathDirect} hideMenu={hideMenu} onClick={() => dispatch(toggleMobileSidebar())} />
              );
          }

        })}
      </List>
    </Box>
  );
};
export default SidebarItems;

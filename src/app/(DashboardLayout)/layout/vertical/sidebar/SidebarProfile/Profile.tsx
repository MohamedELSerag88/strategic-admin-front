import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { useSelector } from '@/store/hooks';
import { IconPower } from '@tabler/icons-react';
import { AppState } from '@/store/store';
import Link from 'next/link';
import {useEffect, useState} from "react";

export const Profile = () => {
  const [userData, setUserData] = useState({
    name: undefined,
    photo: "",
    role: undefined
  });
  useEffect(() => {
    // @ts-ignore
    var user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')):{
      photo:"",
      name:"",
      email:"",
      role:{name:""}
    }
    setUserData(user)
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/auth/login'
  };
  const customizer = useSelector((state: AppState) => state.customizer);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';

  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${'secondary.light'}` }}
    >
      {!hideMenu ? (
        <>
          <Avatar alt="Remy Sharp" src={userData.photo} sx={{height: 40, width: 40}} />

          <Box>
            <Typography variant="h6">{userData.name}</Typography>
            <Typography variant="caption">{userData.role?.name}</Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton
                color="primary"
                aria-label="logout"
                size="small"
                onClick={handleLogout}
              >
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ''
      )}
    </Box>
  );
};

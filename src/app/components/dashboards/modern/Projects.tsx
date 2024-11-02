import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Box } from '@mui/material';
import {IconArrowDownRight, IconArrowUpLeft} from '@tabler/icons-react';

import DashboardCard from '../../shared/DashboardCard';
import SkeletonProjectCard from "../skeleton/ProjectCard";
import {useEffect, useState} from "react";
import ApiService from "@/services/apiService";


interface ProjectCardProps {
  isLoading: boolean;
}

const Projects = ({ isLoading }: ProjectCardProps) => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const successlight = theme.palette.success.light;
  const errorlight = theme.palette.error.light;
  // chart
  const optionscolumnchart: any = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 80,
      resize: true,
      barColor: '#fff',
      sparkline: {
        enabled: true,
      },
    },
    colors: [primary],
    grid: {
      show: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        startingShape: 'flat',
        endingShape: 'flat',
        columnWidth: '60%',
        barHeight: '20%',
        borderRadius: 3,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2.5,
      colors: ['rgba(0,0,0,0.01)'],
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    axisBorder: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      x: {
        show: false,
      },
    },
  };
  const seriescolumnchart = [
    {
      name: '',
      data: [4, 10, 9, 7, 9, 10, 11, 8, 10],
    },
  ];
  const [projectsCounts, setProjectsCounts] = useState(0);
  const [projectsCountsByMonth, setProjectsCountsByMonth] = useState([]);
  const [growUp, setGrowUp] = useState(0);

  useEffect(() => {
    // Fetch data from the API endpoint
    const fetchUsersAsync = async () => {
      const data = await ApiService('get', '/admin/v1/dashboard/projectCounts',null,{
        'Authorization': 'Bearer '+localStorage.getItem('token')
      });
      let counts = data.data
      let monthAccounts = [
        {
          name: '',
          data: counts.projectCountsByMonth,
        },
      ];
      setProjectsCounts(counts.projectsCount)
      setProjectsCountsByMonth(monthAccounts)
      setGrowUp(counts.growUp)
    };
    fetchUsersAsync();
  }, []);
  return (
    <>
      {
        isLoading ? (
          <SkeletonProjectCard />
        ) : (
          <DashboardCard>
            <>
              <Typography variant="subtitle2" color="textSecondary">
                Projects
              </Typography>
              <Typography variant="h4">{projectsCounts}</Typography>
              <Stack direction="row" spacing={1} my={1} alignItems="center">
                { growUp - 100 > 0 ?
                    <Avatar sx={{ bgcolor: successlight, width: 24, height: 24 }}>
                      <IconArrowUpLeft width={18} color="#FA896B" />
                    </Avatar>
                    :
                    <Avatar sx={{ bgcolor: errorlight, width: 24, height: 24 }}>
                      <IconArrowDownRight width={18} color="#FA896B" />
                    </Avatar>
                }
                <Typography variant="subtitle2" fontWeight="600">
                  +{growUp - 100}%
                </Typography>
              </Stack>
              <Box height="80px">
                <Chart options={optionscolumnchart} series={projectsCountsByMonth} type="bar" height={80} width={"100%"} />
              </Box>
            </>
          </DashboardCard>
        )}
    </>

  );
};

export default Projects;

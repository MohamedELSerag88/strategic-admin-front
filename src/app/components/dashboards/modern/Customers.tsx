import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Avatar, Box } from "@mui/material";
import { IconArrowDownRight, IconArrowUpLeft } from "@tabler/icons-react";
import DashboardCard from "../../shared/DashboardCard";
import SkeletonCustomersCard from "../skeleton/CustomersCard";
import { useEffect, useState } from "react";
import ApiService from "@/services/apiService";

interface CustomersCardProps {
  isLoading: boolean;
}

const Customers = ({ isLoading }: CustomersCardProps) => {
  // chart color
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = theme.palette.secondary.light;
  const errorlight = theme.palette.error.light;
  const successlight = theme.palette.success.light;
  // chart
  const optionscolumnchart: any = {
    chart: {
      type: "area",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 80,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      colors: [secondarylight],
      type: "solid",
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      x: {
        show: false,
      },
    },
  };

  const [usersCounts, setUsersCounts] = useState(0);
  const [usersCountsByMonth, setUsersCountsByMonth] = useState([]);
  const [growUp, setGrowUp] = useState(0);

  useEffect(() => {
    // Fetch data from the API endpoint
    const fetchUsersAsync = async () => {
      const data = await ApiService(
        "get",
        "/admin/v1/dashboard/userCounts",
        null,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      let counts = data.data;
      let monthAccounts = [
        {
          name: "",
          color: secondary,
          data: counts.userCountsByMonth,
        },
      ];
      setUsersCounts(counts.usersCount);
      setUsersCountsByMonth(monthAccounts);
      setGrowUp(counts.growUp);
    };
    fetchUsersAsync();
  }, [secondary]);

  // @ts-ignore
  // @ts-ignore
  return (
    <>
      {isLoading ? (
        <SkeletonCustomersCard />
      ) : (
        <DashboardCard
          footer={
            <Box height="80px">
              <Chart
                options={optionscolumnchart}
                series={usersCountsByMonth}
                type="area"
                height={75}
                width={"100%"}
              />
            </Box>
          }
        >
          <>
            <Typography variant="subtitle2" color="textSecondary">
              Customers
            </Typography>
            <Typography variant="h4">{usersCounts}</Typography>
            <Stack direction="row" spacing={1} mt={1} alignItems="center">
              {growUp - 100 > 0 ? (
                <Avatar sx={{ bgcolor: successlight, width: 24, height: 24 }}>
                  <IconArrowUpLeft width={18} color="#FA896B" />
                </Avatar>
              ) : (
                <Avatar sx={{ bgcolor: errorlight, width: 24, height: 24 }}>
                  <IconArrowDownRight width={18} color="#FA896B" />
                </Avatar>
              )}

              <Typography variant="subtitle2" fontWeight="600">
                {growUp - 100}%
              </Typography>
            </Stack>
          </>
        </DashboardCard>
      )}
    </>
  );
};

export default Customers;

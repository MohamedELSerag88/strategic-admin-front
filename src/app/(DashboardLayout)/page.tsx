"use client";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";

import PageContainer from "@/app/components/container/PageContainer";
// components
import TopCards from "@/app/components/dashboards/modern/TopCards";
import Customers from "@/app/components/dashboards/modern/Customers";
import Projects from "@/app/components/dashboards/modern/Projects";
import WeeklyStats from "@/app/components/dashboards/modern/WeeklyStats";
import TopPerformers from "@/app/components/dashboards/modern/TopPerformers";

export default function Dashboard() {
  if (localStorage.getItem("token") == null) {
    window.location.href = "/auth/login";
  }
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box mt={3}>
        <Grid container spacing={3}>
          {/* column */}

        </Grid>
      </Box>
    </PageContainer>
  );
}

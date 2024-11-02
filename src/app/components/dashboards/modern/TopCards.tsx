import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Box, CardContent, Grid, Typography } from "@mui/material";

import icon1 from "/public/images/svgs/icon-connect.svg";
import icon2 from "/public/images/svgs/icon-user-male.svg";
import icon3 from "/public/images/svgs/icon-briefcase.svg";
import icon4 from "/public/images/svgs/icon-mailbox.svg";
import icon5 from "/public/images/svgs/icon-favorites.svg";
import ApiService from "@/services/apiService";
import Loader from "@/app/components/shared/Loader";

const TopCards = () => {
  const [topcards, setTopcards] = useState([
    {
      icon: icon2,
      title: "Users",
      digits: null,
      bgcolor: "primary",
    },
    {
      icon: icon3,
      title: "Clients",
      digits: null,
      bgcolor: "warning",
    },
    {
      icon: icon4,
      title: "Projects",
      digits: null,
      bgcolor: "secondary",
    },
    {
      icon: icon5,
      title: "Galleries",
      digits: null,
      bgcolor: "primary",
    },
    {
      icon: icon4,
      title: "Tickets",
      digits: null,
      bgcolor: "error",
    },
    {
      icon: icon1,
      title: "Reports",
      digits: null,
      bgcolor: "info",
    },
  ]);

  useEffect(() => {
    // Fetch data from the API endpoint
    const fetchTopCardsAsync = async () => {
      const data = await ApiService(
        "get",
        "/admin/v1/dashboard/topCards",
        null,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      let counts = data.data;
      let cards = [
        {
          icon: icon2,
          title: "Users",
          digits: counts.users_count,
          bgcolor: "primary",
        },
        {
          icon: icon3,
          title: "Clients",
          digits: counts.clients_count,
          bgcolor: "warning",
        },
        {
          icon: icon4,
          title: "Projects",
          digits: counts.projects_count,
          bgcolor: "secondary",
        },
        {
          icon: icon5,
          title: "Galleries",
          digits: counts.gallery_count,
          bgcolor: "primary",
        },
        {
          icon: icon4,
          title: "Tickets",
          digits: counts.ticket_count,
          bgcolor: "error",
        },
        {
          icon: icon1,
          title: "Reports",
          digits: counts.report_count,
          bgcolor: "info",
        },
      ];
      setTopcards(cards);
    };
    fetchTopCardsAsync();
  }, []);
  return (
    <Grid container spacing={3} mt={1}>
      {topcards.map((topcard, i) => (
        <Grid item xs={12} sm={4} lg={2} key={i}>
          <Box bgcolor={topcard.bgcolor + ".light"} textAlign="center">
            <CardContent>
              <Image
                src={topcard.icon}
                alt={"topcard.icon"}
                width="50"
                height="50"
              />
              <Typography
                color={topcard.bgcolor + ".main"}
                mt={1}
                variant="subtitle1"
                fontWeight={600}
              >
                {topcard.title}
              </Typography>
              {topcard.digits === null ? (
                <Loader size={20} marginTop="0px" borderSize="1px" />
              ) : (
                <Typography
                  color={topcard.bgcolor + ".main"}
                  variant="h4"
                  fontWeight={600}
                >
                  {topcard.digits}
                </Typography>
              )}
            </CardContent>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCards;

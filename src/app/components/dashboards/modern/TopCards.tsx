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
      title: "Event",
      digits: null,
      bgcolor: "secondary",
    },
    {
      icon: icon4,
      title: "Event Request",
      digits: null,
      bgcolor: "secondary",
    },
    {
      icon: icon5,
      title: "Studies",
      digits: null,
      bgcolor: "secondary",
    },
    {
      icon: icon4,
      title: "Membership",
      digits: null,
      bgcolor: "secondary",
    },
    {
      icon: icon1,
      title: "Consultation",
      digits: null,
      bgcolor: "info",
    },
    {
      icon: icon1,
      title: "Consultation Request",
      digits: null,
      bgcolor: "info",
    },
    {
      icon: icon1,
      title: "Expert",
      digits: null,
      bgcolor: "info",
    },
    {
      icon: icon1,
      title: "Forum",
      digits: null,
      bgcolor: "info",
    },
    {
      icon: icon1,
      title: "Opinion Measurement",
      digits: null,
      bgcolor: "info",
    },
    {
      icon: icon1,
      title: "News",
      digits: null,
      bgcolor: "info",
    },
  ]);

  useEffect(() => {
    // Fetch data from the API endpoint
    const fetchTopCardsAsync = async () => {
      const data = await ApiService(
        "get",
        "/admin/v1/dashboard",
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
          title: "Event",
          digits: counts.event_count,
          bgcolor: "secondary",
        },
        {
          icon: icon4,
          title: "Event Request",
          digits: counts.event_request_count,
          bgcolor: "secondary",
        },
        {
          icon: icon5,
          title: "Studies",
          digits: counts.studies_count,
          bgcolor: "secondary",
        },
        {
          icon: icon4,
          title: "Membership",
          digits: counts.membership_count,
          bgcolor: "secondary",
        },
        {
          icon: icon1,
          title: "Consultation",
          digits: counts.consultation_count,
          bgcolor: "info",
        },
        {
          icon: icon1,
          title: "Consultation Request",
          digits: counts.consultation_request_count,
          bgcolor: "info",
        },
        {
          icon: icon1,
          title: "Expert",
          digits: counts.expert_count,
          bgcolor: "info",
        },
        {
          icon: icon1,
          title: "Forum",
          digits: counts.forum_count,
          bgcolor: "info",
        },
        {
          icon: icon1,
          title: "Opinion Measurement",
          digits: counts.opinion_count,
          bgcolor: "info",
        },
        {
          icon: icon1,
          title: "News",
          digits: counts.news_count,
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

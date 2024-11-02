import {
  Box,
  Typography,
  Avatar,
  Stack,
  ButtonGroup,
  Button,
} from "@mui/material";
import Link from "next/link";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useSelector, useDispatch } from "@/store/hooks";
import emptyCart from "/public/images/products/empty-shopping-cart.svg";

import { AppState } from "@/store/store";
import Image from "next/image";

const CartItems = () => {
  const dispatch = useDispatch();

  // Get Products



  return (
    <Box px={3}>
    </Box>
  );
};

export default CartItems;

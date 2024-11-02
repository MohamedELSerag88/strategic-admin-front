import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { SetStateAction, useState} from 'react';
import {loginType} from "@/app/(DashboardLayout)/types/auth/auth";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import ApiService from "@/services/apiService";
import AuthSocialButtons from "./AuthSocialButtons";

const ResetPassword = ({title, subtitle, subtext}: loginType) => {
    const [reset_password, setResetPassword] = useState('')
    const [new_password, setNewPassword] = useState('')
    const [new_password_confirmation, setNewPassworConfirmation] = useState('')

    if (localStorage.getItem('token') != null) {
        window.location.href = '/'
    }

    const handleResetPassword = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // @ts-ignore
        const result = await ApiService('post', '/admin/v1/reset-password', {
            reset_password,
            new_password,
            new_password_confirmation
        });

        window.location.href = '/auth/login'

    };
    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h3" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <Box mt={3}>
                <Divider>
                    <Typography
                        component="span"
                        color="textSecondary"
                        variant="h6"
                        fontWeight="400"
                        position="relative"
                        px={2}
                    >
                        sign in
                    </Typography>
                </Divider>
            </Box>

            <Stack>
                <Box>
                    <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
                    <CustomTextField id="resetCode"
                                     value={reset_password}
                                     onChange={(e: { target: { value: SetStateAction<string>; }; }) => setResetPassword(e.target.value)}
                           variant="outlined" fullWidth />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
          <CustomTextField
              id="new_password"
              type="password"
              variant="outlined"
              value={new_password}
              onChange={(e: { target: { value: SetStateAction<string>; }; }) => setNewPassword(e.target.value)}
              fullWidth
          />
        </Box>
          <Box>
          <CustomFormLabel htmlFor="password">Confirm Password</CustomFormLabel>
          <CustomTextField
              id="new_password"
              type="password"
              variant="outlined"
              value={new_password_confirmation}
              onChange={(e: { target: { value: SetStateAction<string>; }; }) => setNewPassworConfirmation(e.target.value)}
              fullWidth
          />
        </Box>
        <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            my={2}
        >
          <FormGroup>

            <Typography
                component={Link}
                href="/auth/forgot-password"
                fontWeight="500"
                sx={{
                  textDecoration: "none",
                  color: "primary.main",
                }}
            >
              Login
            </Typography>
          </FormGroup>
        </Stack>
      </Stack>
      <Box>
        <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            onClick={handleResetPassword}
            type="button"
        >
          Reset Password
        </Button>
      </Box>
      {subtitle}
    </>
  );

};

export default ResetPassword;

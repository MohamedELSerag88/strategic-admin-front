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

const AuthLogin = ({title, subtitle, subtext}: loginType) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    if (localStorage.getItem('token') != null) {
        window.location.href = '/'
    }

    const handleLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // @ts-ignore
        const result = await ApiService('post', '/admin/v1/login', {email, password});

        localStorage.setItem('user', JSON.stringify(result.data));
        localStorage.setItem('token', result.data.token)
        window.location.href = '/'

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
                    <CustomTextField id="email"
                                     value={email}
                                     onChange={(e: { target: { value: SetStateAction<string>; }; }) => setEmail(e.target.value)}
                           variant="outlined" fullWidth />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
          <CustomTextField
              id="password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e: { target: { value: SetStateAction<string>; }; }) => setPassword(e.target.value)}
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
              Forgot Password ?
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
            onClick={handleLogin}
            type="button"
        >
          Sign In
        </Button>
      </Box>
      {subtitle}
    </>
  );

};

export default AuthLogin;

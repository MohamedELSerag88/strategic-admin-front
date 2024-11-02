import { Button, Stack } from "@mui/material";
import Link from "next/link";
import { SetStateAction, useState} from 'react';
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import ApiService from "@/services/apiService";

export default function AuthForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');


    const handleForgetPassword = async () => {
        if (email == '') {
            setError("Enter required fields !");
        } else {
            try {
                // @ts-ignore
                const result = await ApiService('post', '/admin/v1/forget-password', {email});
                window.location.href = '/auth/reset-password'
            } catch (error: any) {
                setError(error);
            }

        }


    }
    return (
        <>
            <Stack mt={4} spacing={2}>
                <CustomFormLabel htmlFor="reset-email">Email Adddress</CustomFormLabel>
                <CustomTextField id="reset-email" value={email} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setEmail(e.target.value)} variant="outlined" fullWidth />

      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        type="button"
        onClick={handleForgetPassword}
      >
        Forgot Password
      </Button>
      <Button
        color="primary"
        size="large"
        fullWidth
        component={Link}
        href="/auth/login"
      >
        Back to Login
      </Button>
    </Stack>
  </>
)};

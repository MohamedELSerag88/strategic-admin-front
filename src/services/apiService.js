import axios from 'axios';
import {toast} from "react-toastify";


const ApiService = async (method, endpoint, data= null, headers = {}) => {
    const url = process.env.BackEndPoint+`${endpoint}`;

    try {
        const response = await axios({
            method,
            url,
            data,
            headers,
        });
        var result = response.data.response;
        if(result.status === "OK"){
            if(result.message){
                // alert(result.message)
                toast.success(result.message)
            }
            return result;
        }
        else{
            toast.error(result.message)
            // alert(result.message)
            throw result.message;
        }
    } catch (error) {
        // alert(error?.data?.response?.message)
            // window.location.href = "/auth/login"
            toast.error(error)
    }
};

export default ApiService;
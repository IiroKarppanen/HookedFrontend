import { useState, useEffect } from 'react';
import axios from "axios";

// Custom data fetch hook

const useFetch = (url) => {

    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        axios({
            method: "GET",
            url: url,
            }).then((response)=>{
            setData(response.data)
            }).catch((error) => {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            })
            setIsPending(false)
        } ,[url])   

    return { data, isPending }
}

export default useFetch;
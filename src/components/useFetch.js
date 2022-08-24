import { useState, useEffect } from 'react';
import axios from "axios";

// Custom data fetch hook

const useFetch = (url) => {

    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {

        // Check if movies are already in local storage and if they are expired or not
        let retrievedObject = JSON.parse(localStorage.getItem('movies'));
        let currentDate = new Date()
        if(retrievedObject !== null && (currentDate.getTime() / 1000) < retrievedObject.expiry){
            setIsPending(false)
            setData(retrievedObject.value)
        }

        // If movies are not in local storage or expired, fetch data from api and delete expired movie data
        else{

            if(retrievedObject !== null){
                localStorage.removeItem("movies")
            }

            axios({
                method: "GET",
                url: url,
                }).then((response)=>{
                setData(response.data)
                console.log("FETCH COMPLETE!");

                let currentDate = new Date()
                const item = {
                    value: response.data,
                    expiry: (currentDate.getTime() / 1000) + 604800, // Current time in seconds + one week in seconds
                }
                localStorage.setItem('movies', JSON.stringify(item))
                }).catch((error) => {
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                })
                setIsPending(false)
        }
        } ,[url])   

    return { data, isPending }
}

export default useFetch;
import axios from "axios";
import Cookies from 'universal-cookie';

const UseWatchlist = function(method, id) {

    const cookies = new Cookies();

    console.log(id)

    axios({
        method: "POST",
        url:`https://hookedbackend.onrender.com/api/watchlist${method}`,
        data:{
            name: cookies.get('name'),
            watchlist: id
        }
        }).then((response)=>{
            cookies.set("watchlist", response.data.watchlist);
            
        }).catch((response) => {
            console.log(response);
        })

    }

export default UseWatchlist;
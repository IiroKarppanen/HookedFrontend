import axios from "axios";
import Cookies from 'universal-cookie';

const UseWatchlist = function(method, movie_id) {

    const cookies = new Cookies();

    axios({
        method: "POST",
        url:`https://hooked-to-movies.herokuapp.com/api/watchlist${method}`,
        data:{
            name: cookies.get('name'),
            watchlist: movie_id
        }
        }).then((response)=>{
            cookies.set("watchlist", response.data.watchlist);
        }).catch((response) => {
            console.log(response);
        })
    }

export default UseWatchlist;
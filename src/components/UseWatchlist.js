import axios from "axios";
import Cookies from 'universal-cookie';

const UseWatchlist = function(method, e) {

    const cookies = new Cookies();

    let movie_id = e.target.parentNode.getAttribute("id");
    if(movie_id === null){
    movie_id = e.target.getAttribute("id");
    }
      
    axios({
        method: "POST",
        url:`https://hooked-to-movies.herokuapp.com/api/watchlist${method}`,
        data:{
            name: cookies.get('name'),
            watchlist: movie_id
        }
        }).then((response)=>{
            cookies.set("watchlist", response.data.watchlist);
            console.log(response.data.watchlist);
     
            
        }).catch((response) => {
            console.log(response);
        })

    }

export default UseWatchlist;
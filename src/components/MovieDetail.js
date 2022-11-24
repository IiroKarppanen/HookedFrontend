import Spinner from "./Spinner";
import './styles/MovieDetail.css';
import useFetch from "./useFetch";
import UseWatchlist  from "./UseWatchlist";
import React, { useState } from "react";
import Cookies from 'universal-cookie';
import { Login } from "./Login";
import NavBar from "./Navbar";

export const MovieDetail = () => {

    const { data } = useFetch("https://hookedbackend.onrender.com/movies/")
    const [ loaded, setLoaded ] = useState(false);
    const [ loginMenu, setLoginMenu] = useState(false); 
    const [ watchlist, setWatchlist ] = useState(null);
    const [ loading, setLoading ] = useState(false)

    const cookies = new Cookies();

    // Get movie ID from URL
    const url = window.location.href;
    const getLastItem = (thePath) => thePath.substring(thePath.lastIndexOf('/') + 1)
    let movieID = parseInt(getLastItem(url)); 

    // Filter movie from database
    let movie = data && (data.filter(x => x.id === movieID))[0];

    // Detect when bg image has finished loading
    const handleImageLoaded = () => {
        setLoaded(true);
    }

    // Run watchlist add/delete function
    const handleWatchlist = (method) => {
        setLoading(true)

        UseWatchlist(method, movie.movie_id);

        // Wait 500ms for watchlist to update before re-rendering
        setTimeout(() => {
            setWatchlist(cookies.get('watchlist'))
            setLoading(false)
        }, 500);
    } 

    // If login menu is active and user clicks wrapper, close menu
    const handleClick = (e) => {
        if(e.target.className.includes("login-wrapper")){
            setLoginMenu(false)
        }
    }

    return (
        <div>
            <div onMouseDown={handleClick}>
                {loginMenu === true && <Login />}
            </div>
            <NavBar/>
            <div> 

            {data ? 

                <div className="detail-page">
                 
                <img className = "bg-image" src={`${movie.image_url}`} onLoad={handleImageLoaded} alt="failed to load" style={loaded ? {} : {display: 'none'}}/>

                {loaded ? (
                    <div className="detail-page-info-section font-roboto">
                
                    <h1>{movie.title}</h1>

                    <div className="info-box">
                        {movie.runtime != "undefined" && <p>{movie.runtime}</p>}
                        {movie.age != "undefined" && <p>{movie.age}</p>}
                        <p>{movie.start_year}</p>
                    </div>

                    <p>{movie.plot}</p>

                    <div className="rating-section">
                        <h2>Rating</h2>

                        <div className="rating-row flex h-[20px] align-middle">
                            <div className="bg-[#66cc33] mr-3 w-[20px] h-[20px] text-center">
                                <h4 className="text-sm m-auto">83</h4>
                            </div>
                            <div className="inline-flex align-middle border-l border-[#5a5a5a73] h-[20px]">
                                <img className="inline cover ml-3" src={require(`./img/star.png`)} alt=""/>
                                <h3 className="inline text-sm ml-1 mb-0 p-[1px]">{movie.rating}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="cast">
                        <h2>Cast</h2>
                        <p>{JSON.parse(movie.cast)}</p>
                    </div>

                    {movie.revenue.parseInt > 0 
                    ? <div className="revenue">
                    <h2>Revenue</h2>
                    <p>${movie.revenue}</p>
                    </div>
                    :
                    <div className="revenue"></div>}
                    
                    {cookies.get('watchlist') === undefined

                    ? <button type="button" disabled={loading} className="btn btn-outline-light" onClick={() => setLoginMenu(true)}>Add To Watchlist</button>
                    :   cookies.get('watchlist').includes(movie.movie_id)
                        ? <button type="button" disabled={loading} className="btn btn-outline-light" onClick={(e) => handleWatchlist('/delete', e)}>Delete From Watchlist</button>
                        : <button type="button" disabled={loading} className="btn btn-outline-light" onClick={(e) => handleWatchlist('/add', e)}>Add To Watchlist</button>
                    }
                                    
                </div>
                ) : (
                    <div className="loading-screen">
                        <div className="spinner">
                            <Spinner />
                        </div>
                    </div>
                )}

                </div>  
                
                :
                <div className="detail-page">
                    <div className="loading-screen">
                        <div className="spinner">
                            <Spinner />
                        </div>
                    </div>
                </div>
            }
            </div>
        </div>
    )

}

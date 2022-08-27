import React, { useState, useEffect, useRef } from "react";
import { BsSearch } from 'react-icons/bs';
import useFetch from "./useFetch";
import { BsFillBookmarkFill } from "react-icons/bs";
import { Link } from 'react-router-dom';
import UseWatchlist  from "./UseWatchlist";
import Spinner from "./Spinner";
import useWindowDimensions from "./useWindowDimensions";
import Cookies from 'universal-cookie';
import { Login } from "./Login";
import NavBar from "./Navbar";

export const Search = () => {

    const [ inputValue, setInputValue ] = useState('');
    const [ searchResults, setSearchResults ] = useState(null);
    const [ insideButton, setInsideButton ] = useState(false);
    const [ loginMenu, setLoginMenu] = useState(false); 
    const [ imagesLoaded, setImagesLoaded ] = useState(false);
    const { data } = useFetch("https://hooked-to-movies.herokuapp.com/movies/")

    const { width } = useWindowDimensions();
    const cookies = new Cookies();
    const gridRef = useRef()

    useEffect(() => {

        // Turn words first letters uppercase to match movie title words (they have uppaercase chars)
        const uppercaseWords = inputValue => inputValue.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());
        setInputValue(uppercaseWords)

        // Order movies by votes and filter with input value
        if(inputValue !== '' && inputValue !== null){
            let obj = data && data.sort((a,b)=> (parseInt(a.votes) < parseInt(b.votes) ? 1 : -1))
            data && setSearchResults((Object.values(obj).filter(movie => movie.title.includes(inputValue))).slice(0,20))
            data && console.log((Object.values(obj).filter(movie => movie.title.includes(inputValue))).slice(0,20));
        }
    }, [inputValue])

    
    useEffect(() => {
        // Check how many items watchlist has, if not enough to fill one row change justify-center to justify-left
        if(searchResults !== null){

            let columns = Math.floor(((width * 0.9) + 15) / 175);

            if(searchResults.length < columns){
                const grid = gridRef.current;
                grid.className = "movie-grid justify-left";
            }
            else{
                const grid = gridRef.current;
                grid.className = "movie-grid justify-center";
            }
        }
        
    }, [searchResults])

    // If login menu is active and user clicks wrapper, close menu
    const handleClick = (e) => {
        if(e.target.className.includes("login-wrapper")){
            setLoginMenu(false)
        }
    }

    const handleLink = (e) => {
        // If user click add to watchlist button don't disable movie link
        if(insideButton === true){e.preventDefault()}
    }

    const handleLoad = (e) => {

        let gridItems = Object.values(gridRef.current.children);

        // Remove last item (pagination box)
        gridItems.pop();

        // Set movie box id loaded when image is loaded
        e.target.parentNode.parentNode.id = 'loaded';

        // Check if every item in grid has id "loaded", if true display grid
        if(gridItems.every(item => item.id === "loaded")){
            setImagesLoaded(true)
        }
        else{
            setImagesLoaded(false)
        }
    }


    const movies = searchResults && searchResults
        .map((movie)=>
        
        <div key={movie.movie_id} className="movie-box animate-fade"> 
            <Link to={`/detail/${movie.id}`} onClick={handleLink}>      
                <img
                src={require(`./posters/${movie.movie_id}.jpg`)} 
                onLoad={(e) => {handleLoad(e)}}
                />

                <span>
                
                <div className="add-icon" id={movie.movie_id} onClick={(e) => cookies.get('name') === undefined ? setLoginMenu(true) : UseWatchlist('/add', e)}
                    onMouseEnter={() => setInsideButton(true)}
                    onMouseLeave={() => setInsideButton(false)}
                    >  
                        <BsFillBookmarkFill id={movie.movie_id} size='14'/>
                </div>
                
                <div className="movie-info">
                    <h2>{movie.title}</h2>
                    <h3>{movie.start_year}</h3>
                    <div className="rating">
                    <img src={require(`./img/star.png`)} />
                    <h1>{movie.rating}</h1>
                    </div>
                </div>
                </span>
            </Link>  
        </div>

        );

    return (
        <div className="m-auto w-11/12 tb:w-10/12 pt-10">
            <div onMouseDown={handleClick}>
                {loginMenu === true && <Login />}
            </div>

            <div class="wrapper relative font-roboto text-primary-100 ml-auto mr-auto tb:ml-0 lp:ml-0 dp:ml-0 mb-8 w-[90%] dp:w-72 lp:w-72 tb:w-72 h-10 bg-transparent">
                <div class="absolute top-1/2 left-2 -translate-y-1/2 text-opacity-40">
                    <BsSearch size='14'/>
                </div>
                <input onChange={(e) => setInputValue(e.target.value)} type="text" class="bg-primary-700 rounded-xl w-full h-10 hover:bg-primary-600 pl-8 ring-none border-0 focus:ring-[#3c2ab0]" placeholder="Search"></input>
            </div>  
            <div className="mt-12 border-t border-[#cfd0d02c]">
                <div className="movie-container w-11/12 tb:w-10/12 lp:w-10/12 dp:w-10/12">
                    {imagesLoaded === false && movies !== null && movies.length !== 0
                        && (
                            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <Spinner />
                            </div>
                            
                            )
                    }
                    <div style={imagesLoaded ? {} : {display: 'none'}}>
        
                        <div className="movie-grid justify-center" ref={gridRef}>
                            {movies}
                        </div>

                    </div>
        
                </div>
            
            </div>
        </div>
    )
    }

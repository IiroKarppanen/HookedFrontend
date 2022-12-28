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
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { VscClose } from "react-icons/vsc";
import NavBar from "./Navbar";

export const Search = () => {

    const [ inputValue, setInputValue ] = useState('');
    const [ searchResults, setSearchResults ] = useState(null);
    const [ insideButton, setInsideButton ] = useState(false);
    const [ loginMenu, setLoginMenu] = useState(false); 
    const [ imagesLoaded, setImagesLoaded ] = useState(false);
    const [ updatePage, setUpdatePage ] = useState('');
    const [ updatePage2, setUpdatePage2 ] = useState('');
    const [ boxStyle, setBoxStyle ] = useState('movie-box animate-fade');
    const [ iconStyle, setIconStyle ] = useState('');
    const { data } = useFetch("https://hookedbackend.onrender.com/movies/")

    const { width } = useWindowDimensions();
    const cookies = new Cookies();
    const watchlist = cookies.get('watchlist');
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

    const handleLink = (e, id) => {
        // Don't follow link if user clicked save/unsave movie button
        console.log(e.target.parentNode);
        console.log(e.target);
        if((e.target.parentNode.id) === id){
            e.preventDefault()
            setUpdatePage(id)
            setBoxStyle('movie-box')
            setIconStyle('animate-spin')
            
            setTimeout(function() { 
                setUpdatePage('') 
                setIconStyle('')  
                setUpdatePage2(id) 
                setTimeout(() => {setUpdatePage2('')}, 1000) 
            }, 500);
        }
        if((e.target.className) === 'add-icon'){
            e.preventDefault()
            setUpdatePage(id)
            setBoxStyle('movie-box')
            setIconStyle('animate-spin')

            setTimeout(function() { 
                setUpdatePage('') 
                setIconStyle('')  
                setUpdatePage2(id) 
                setTimeout(() => {setUpdatePage2('')}, 1000) 
             }, 500);
                    
        }
    }


    const movies = searchResults && searchResults
        .map((movie)=>
        
        <div key={movie.movie_id} className={updatePage2 === movie.movie_id ? 'movie-box animate-save' : `${boxStyle}`}> 
            <Link to={`/detail/${movie.id}`} onClick={(e) => handleLink(e, movie.movie_id)}>      
                <img
                src={`${movie.poster_url}`}
                onLoad={(e) => {handleLoad(e)}}
                />

                <span>
                
                {watchlist !== undefined && watchlist.includes(movie.movie_id) 
                ? 
                <div className="add-icon" id={movie.movie_id} onClick={(e) => cookies.get('watchlist') === undefined ? setLoginMenu(true) : UseWatchlist('/delete', e)}> 
                {updatePage === movie.movie_id
                ? <AiOutlineLoading3Quarters className={iconStyle} id={movie.movie_id} size='18'/>
                : <VscClose id={movie.movie_id} size='24'/>
                }
                </div>
                :
                <div className="add-icon" id={movie.movie_id} data-tooltip-target="tooltip-default" onClick={(e) => cookies.get('watchlist') === undefined ? setLoginMenu(true) : UseWatchlist('/add', e)}>  
                {updatePage === movie.movie_id
                ? <AiOutlineLoading3Quarters className={iconStyle} id={movie.movie_id} size='18'/>
                : <BsFillBookmarkFill id={movie.movie_id} size='14'/>
                }
                </div>
                }

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
        <div>
        
        <div onMouseDown={handleClick}>
            {loginMenu === true && <Login />}
        </div>
        <NavBar/>
        <div className="m-auto w-11/12 tb:w-10/12 pt-10">
            

            

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
        </div>
    )
    }

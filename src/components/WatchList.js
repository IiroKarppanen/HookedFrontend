import React, { useState, useEffect, useRef } from "react";
import useFetch from "./useFetch";
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import NavBar from "./Navbar";
import { Login } from "./Login";
import { VscClose } from "react-icons/vsc";
import axios from "axios";
import Spinner from "./Spinner";
import useWindowDimensions from "./useWindowDimensions";

export const WatchList = () => {

  const { data } = useFetch("https://hookedbackend.onrender.com/movies/")
  const [ movies, setMovies ] = useState(null);
  const [ boxStyle, setBoxStyle ] = useState('movie-box animate-fade');
  const [ isLoggedIn, setIsLoggedIn ] = useState(true);
  const [ loginMenu, setLoginMenu ] = useState(false);
  const [ imagesLoaded, setImagesLoaded ] = useState(false);

  const { width } = useWindowDimensions();
  const cookies = new Cookies();
  const gridRef = useRef();

  useEffect(() => {
    console.log("MOVIES CHANGED");
    if(movies !== null && movies !== "null"){
      if(movies.length == 0){
        setImagesLoaded(true)
      }
    }
    
    // Check how many items watchlist has, if not enough to fill one row change justify-center to justify-left
    if(movies !== null && movies !== 'null'){

      let columns = Math.floor(((width * 0.9) + 15) / 175);

      if(movies.length < columns){
        const grid = gridRef.current;
        grid.className = "movie-grid justify-left";
      }
    }
  }, [movies])

  useEffect(() => {
    let watchlist = cookies.get('watchlist');
    if(watchlist === undefined){
      setIsLoggedIn(false)
    }

    if(typeof watchlist === 'string'){
      watchlist = watchlist.replace(/\'/g, '"');
      watchlist = JSON.parse("[" + watchlist + "]")[0];
    }

    if(watchlist === null){
      setIsLoggedIn(true)
    }

    if(watchlist !== null && watchlist !== undefined){
      setIsLoggedIn(true)
      setLoginMenu(false)
      let objectList = [];
      data && watchlist.forEach(function (item) {
      objectList.push((data.filter((movie) => movie.movie_id === item))[0])
      });
      data && setMovies(objectList);
      }
    } ,[data])


  const deleteItem = (e) => {

    // Start fadeOut animation for deleted movie
    e.target.parentNode.parentNode.parentNode.parentNode.className = 'movie-box animate-fadeOut';
    

    // Get movie id
    let id = e.target.parentNode.getAttribute("id");
    if(id === null){
      id = e.target.getAttribute("id");
    }

    setTimeout(() => {

    setMovies(movies.filter(movie => movie.movie_id !== id))

    // Stop animation
    e.target.parentNode.parentNode.parentNode.parentNode.className = 'movie-box';
    //setBoxStyle('movie-box animate-reorder')

    //setTimeout(() => {setBoxStyle('movie-box')}, 1000)

    }, 450)

    // Remove movie from database watchlist
    axios({
      method: "POST",
      url:"https://hookedbackend.onrender.com/api/watchlist/delete",
      data:{
        name: cookies.get('name'),
        watchlist: id
       }
    }).then((response) => {
      // Update cookies
      cookies.set("watchlist", response.data.watchlist);     
      console.log(movies); 
    })
  }

  // Close login popup if user click wrapper
  const handleClick = (e) => {
    if(e.target.className.includes("login-wrapper")){
        setLoginMenu(false)
    }
  }

  const handleLoad = (e) => {

    let gridItems = Object.values(gridRef.current.children);

    // Remove last item from grid items list (pagination box)
    gridItems.pop();

    // Set movie box id to "loaded" when image is loaded
    e.target.parentNode.parentNode.id = 'loaded';

    // Check if all movie boxes have id "loaded", if true set imagesloaded true and show grid
    if(gridItems.every(item => item.id === "loaded") === true){
        setImagesLoaded(true)
    }
    if(gridItems.every(item => item.id === "loaded") === false){
        setImagesLoaded(false)
    }
  }

  // If cursor is inside button in movie box ignore link to movie page
  const handleLink = (e, id) => {
    // Don't follow link if user clicked save/unsave movie button
    if((e.target.parentNode.id) === id){
        e.preventDefault()
    }
    if((e.target.className) === 'delete-icon'){
        e.preventDefault()
    }
}

  const currentPageData = movies !== null && movies.map((movie) => 
    <div key={movie.movie_id} className={`movie-box ${boxStyle}`}> 
      <Link to={`/detail/${movie.id}`} onClick={(e) => handleLink(e, movie.movie_id)}>      
          <img
          src={require(`./posters/${movie.movie_id}.jpg`)} 
          id={'none'}
          onLoad={e => handleLoad(e)} 
          />

          <span>
          
          <div className="delete-icon" id={movie.movie_id} onClick={deleteItem}>  
                  <VscClose id={movie.movie_id} size='28'
                  />
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
  )

  return (
    <div>
        <title>Hooked</title>

        <div onMouseDown={handleClick}>
          {loginMenu === true && <Login />}
        </div>
        <NavBar />

        <div className='w-10/12 m-auto pt-4 font-roboto'>
            <h1 className='text-[#cfd0d0] border-b border-[#cfd0d02c] text-xl'>Your Watchlist</h1>
            {isLoggedIn === false &&
            <div>
              <h1 className="text-[#cfd0d0] mt-4 text-base">Log in to use watch list!</h1>
              <button type="button" className="btn btn-outline-light inline mt-4" onClick={() => setLoginMenu(true)}>Log In</button>
            </div>
            }
        </div>

        <div className="movie-container w-11/12 tb:w-10/12 lp:w-10/12 dp:w-10/12">
  
            {imagesLoaded === false && isLoggedIn === true
                && (
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <Spinner />
                  </div>  
                  )
              }


            <div className="movie-grid justify-center" ref={gridRef} style={imagesLoaded ? {} : {display: 'none'}}>
              {currentPageData}
            </div>
            
        </div>
    </div>
  )
}

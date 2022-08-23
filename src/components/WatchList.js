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

  const { data } = useFetch("https://hooked-to-movies.herokuapp.com/movies/")
  const [ movies, setMovies ] = useState(null);
  const [ isLoggedIn, setIsLoggedIn ] = useState(true);
  const [ loginMenu, setLoginMenu ] = useState(false);
  const [ insideButton, setInsideButton ] = useState(false);
  const [ imagesLoaded, setImagesLoaded ] = useState(false);

  const { width } = useWindowDimensions();
  const cookies = new Cookies();
  const gridRef = useRef();

  useEffect(() => {
    // Check how many items watchlist has, if not enough to fill one row change justify-center to justify-left
    if(movies !== null){

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

    let id = e.target.parentNode.getAttribute("id");
    if(id === null){
      id = e.target.getAttribute("id");
    }
    let watchlist = cookies.get('watchlist');

    if(typeof watchlist === 'string'){
      watchlist = watchlist.replace(/\'/g, '"');
      watchlist = JSON.parse("[" + watchlist + "]")[0];
    }

    for( var i = 0; i < watchlist.length; i++){ 
    
      if ( watchlist[i] === id) { 
  
          watchlist.splice(i, 1); 
      }
  
    }

    axios({
      method: "POST",
      url:"https://hooked-to-movies.herokuapp.com/api/watchlist/delete",
      data:{
        name: cookies.get('name'),
        watchlist: id
       }
    }).then((response) => {
      cookies.set("watchlist", response.data.watchlist);

      let objectList = [];
      watchlist.forEach(function (item) {
      objectList.push((data.filter((movie) => movie.movie_id === item))[0])
      });
      setMovies(objectList);
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

    // Remove last item (pagination box)
    gridItems.pop();

    // Set movie box id loaded when image is loaded
    e.target.parentNode.parentNode.id = 'loaded';

    //console.log(gridItems.every(item => item.innerHTML.includes('loaded')));
    if(gridItems.every(item => item.id === "loaded") === true){
        setImagesLoaded(true)
    }
    if(gridItems.every(item => item.id === "loaded") === false){
        setImagesLoaded(false)
    }
  }

  // If cursor is inside button in movie box ignore link to movie page
  const handleLink = (e) => {
    if(insideButton === true){e.preventDefault()}
  }

  const currentPageData = movies && movies
    .map((movie)=>
    
    <div key={movie.movie_id} className="movie-box animate-fade"> 
        <Link to={`/detail/${movie.id}`} onClick={handleLink}>      
            <img
            src={require(`./posters/${movie.movie_id}.jpg`)} 
            id={'none'}
            onLoad={e => handleLoad(e)}
            />

            <span>
            
            <div className="delete-icon" id={movie.movie_id} onClick={deleteItem}>  
                    <VscClose id={movie.movie_id} size='28'
                     onMouseEnter={() => setInsideButton(true)}
                     onMouseLeave={() => setInsideButton(false)}
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

    );

  return (
    <div>
        <title>Hooked</title>

        <div onClick={handleClick}>
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

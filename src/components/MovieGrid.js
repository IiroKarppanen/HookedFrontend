import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import useFetch from "./useFetch";
import  { MdFilterListAlt } from 'react-icons/md';
import { BiSortAlt2 } from 'react-icons/bi';
import { BsFillBookmarkFill, BsArrowRight, BsArrowLeft } from 'react-icons/bs';
import { BiFirstPage } from 'react-icons/bi'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Spinner from "./Spinner";
import NavBar from "./Navbar";
import { Login } from "./Login";  
import UseWatchlist  from "./UseWatchlist";
import useWindowDimensions from "./useWindowDimensions";
import Cookies from 'universal-cookie';
import { VscClose } from "react-icons/vsc";



axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"


function Movie() {
    const [filteredMovies, setFilteredMovies] = useState(null);
    const [selectState, setSelectState] = useState("undefined");
    const [reverseState, setReverseState] = useState(false);
    const [ loginMenu, setLoginMenu] = useState(false); 
    const [ imagesLoaded, setImagesLoaded ] = useState(false);

    const [ updatePage, setUpdatePage ] = useState('');
    const [ updatePage2, setUpdatePage2 ] = useState('');
    const [ boxStyle, setBoxStyle ] = useState('movie-box animate-fade');
    const [ iconStyle, setIconStyle ] = useState('');

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemCount, setItemCount ] = useState(0);
    const { width } = useWindowDimensions();
    

    const { data, isPending } = useFetch("https://hookedbackend.onrender.com/movies/")

    const gridRef = useRef()
    const cookies = new Cookies();

    const watchlist = cookies.get('watchlist');

    useEffect(() => {
        console.log("PENDING DATA: ", isPending);
    }, [isPending])

    useEffect(() => {
        // Calculate how many columns container can fit with 90% width
        let columns = Math.floor(((width * 0.9) + 15) / 175);
        // Calculate how many items grid can have with 5 rows
        let items = 5 * columns     
        setItemCount(items)

    }, [width])

    useEffect(() => {
        console.log("PAGE ", currentPage);
        setImagesLoaded(false)
    }, [currentPage])


    useEffect(() => {
        if(filteredMovies === null){
            var obj = data && data.reduce((r, o) => (o.votes < (r[o.movie_id] || {}).votes || (r[o.movie_id] = o), r), {});
            data && setFilteredMovies(Object.values(obj))
        }
        } ,[data])


    const filterMovies = e => {
 
        // Reset sort select when changing to different genre page
        setSelectState("undefined")

        // Filter movies with selected genre or attribute

        if(e.target.text === "Popular"){
            var obj = data.reduce((r, o) => (o.votes < (r[o.movie_id] || {}).votes || (r[o.movie_id] = o), r), {});
            setFilteredMovies(Object.values(obj))
        }
        else if(e.target.text !== "Popular"){
  
            let filtered = data && data.filter(movie => {
                return movie.genres.includes(e.target.text)})

            let obj = filtered.reduce((r, o) => (o.votes < (r[o.movie_id] || {}).votes || (r[o.movie_id] = o), r), {});
            setFilteredMovies(Object.values(obj))
        }
    };


        const sortBy = e => {

            setSelectState(e.target.value)

            if(e.target.value === "Rating"){
                var obj = filteredMovies.sort((a, b) => (a.rating > b.rating  ? -1 : 1))
                setFilteredMovies(Object.values(obj))
            }
            if(e.target.value === "Votes"){
                var obj = filteredMovies.sort((a, b) => (a.votes > b.votes  ? -1 : 1))
                setFilteredMovies(Object.values(obj))
            }
            if(e.target.value === "Revenue"){
                var obj = filteredMovies.sort((a, b) => (a.revenue > b.revenue  ? -1 : 1))
                setFilteredMovies(Object.values(obj))    
            }
            if(e.target.value === "Year"){
                var obj = filteredMovies.sort((a, b) => (a.start_year > b.start_year  ? -1 : 1))
                setFilteredMovies(Object.values(obj))    
            }
        }

        const reverseSort = e => {
            if(reverseState === false){
                if(selectState === "Year"){
                    var obj = filteredMovies.sort((a, b) => (a.start_year > b.start_year  ? 1 : -1))
                    setFilteredMovies(Object.values(obj))
                }
                if(selectState === "Votes"){
                    var obj = filteredMovies.sort((a, b) => (a.votes > b.votes  ? 1 : -1))
                    setFilteredMovies(Object.values(obj))
                }
                if(selectState === "Rating"){
                    var obj = filteredMovies.sort((a, b) => (a.rating > b.rating  ? 1 : -1))
                    setFilteredMovies(Object.values(obj))
                }
                if(selectState === "Revenue"){
                    var obj = filteredMovies.sort((a, b) => (a.revenue > b.revenue  ? 1 : -1))
                    setFilteredMovies(Object.values(obj))
                }

            setReverseState(true)
            }
            else{
                if(selectState === "Year"){
                    var obj = filteredMovies.sort((a, b) => (a.start_year > b.start_year  ? -1 : 1))
                    setFilteredMovies(Object.values(obj))
                }
                if(selectState === "Votes"){
                    var obj = filteredMovies.sort((a, b) => (a.votes > b.votes  ? -1 : 1))
                    setFilteredMovies(Object.values(obj))
                }
                if(selectState === "Rating"){
                    var obj = filteredMovies.sort((a, b) => (a.rating > b.rating  ? -1 : 1))
                    setFilteredMovies(Object.values(obj))
                }
                if(selectState === "Revenue"){
                    var obj = filteredMovies.sort((a, b) => (a.revenue > b.revenue  ? -1 : 1))
                    setFilteredMovies(Object.values(obj))
                }
                setReverseState(false)
            }
            
        }

        const handleLink = (e, id) => {
            // Don't follow link if user clicked save/unsave movie button
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

        const handleLoad = (e, id) => {

            let gridItems = Object.values(gridRef.current.children);

            // Remove last item (pagination box)
            gridItems.pop();

            // Set movie box id loaded when image is loaded
            e.target.parentNode.parentNode.id = `loaded ${id}`;

            // Check if every item in grid has id "loaded", if true display grid
            if(gridItems.every(item => item.id.includes("loaded"))){
                setImagesLoaded(true)
            }
            else{
                setImagesLoaded(false)
            }
        }

        // If login menu is active and user clicks wrapper, close menu
        const handleClick = (e) => {
            if(e.target.className.includes("login-wrapper")){
                setLoginMenu(false)

            }
        }

        // Update current page value when user click pagination buttons
        const handlePageChange = (e) => {   
            if(e === 'previous'){
                // Return if already on first page
                if(currentPage === 1){
                    return;
                }
                setCurrentPage(currentPage - 1)
                setImagesLoaded(false)
            }
            if(e === 'next'){
                // Return if already on last page
                if((itemCount * (currentPage + 1)) > filteredMovies.length){
                    return;
                }
                setCurrentPage(currentPage + 1)
                setImagesLoaded(false)
            }
            if(e === 'home'){
                setCurrentPage(1)
                setImagesLoaded(false)
            }
        }

        const currentPageData = filteredMovies && filteredMovies
        .slice((itemCount * currentPage) - itemCount , (itemCount * currentPage))
        .map((movie)=>
     
        <div key={movie.movie_id} className={updatePage2 === movie.movie_id ? 'movie-box animate-save' : `${boxStyle}`}> 
        
            <Link onClick={(e) => handleLink(e, movie.movie_id)} to={`/detail/${movie.id}`}>  

                <img
                    src={require(`./posters/${movie.movie_id}.jpg`)}
                    id={'none'}
                    onLoad={e => handleLoad(e, movie.movie_id)}
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

            <div className="content">

                <div className="options m-auto h-28 w-11/12 tb:w-10/12 lp:w-10/12 dp:w-10/12 mt-3">
                    <div className="filters">
                        <a className="genre-link" onClick={filterMovies}>Popular</a>
                        <a className="genre-link" onClick={filterMovies}>Action</a>
                        <a className="genre-link" onClick={filterMovies}>Drama</a>
                        <a className="genre-link" onClick={filterMovies}>Comedy</a> 
                        <a className="genre-link" onClick={filterMovies}>Sci-Fi</a> 
                        <a className="genre-link" onClick={filterMovies}>Crime</a>
                        <a className="genre-link" onClick={filterMovies}>Thriller</a> 
                        <a className="genre-link" onClick={filterMovies}>Romance</a>
                        <a className="genre-link" onClick={filterMovies}>Fantasy</a>
                        <a className="genre-link" onClick={filterMovies}>Adventure</a>
                        <a className="genre-link" onClick={filterMovies}>Animation</a>
                    </div>
                    
                    <div className="flex w-80 h-10 mt-8">
                        <div className="h-9 w-9 ml-0 mr-4">
                            <MdFilterListAlt className="text-primary-700 h-9 w-9"/>
                        </div>
                        <select value={selectState} onChange={sortBy} className="bg-primary-700 border-0 text-primary-100 text-sm rounded-lg focus:bg-primary-600 focus:ring-[#3c2ab0] placeholder-gray-400 focus:outline-none block w-30 h-9 duration-500 ease-in-out hover:shadow-lg hover:shadow-[#3c2ab0]/30">
                            <option value="undefined" disabled selected hidden>Sort By</option>
                            <option value="Rating">IMDB Rating</option>
                            <option value="Votes">IMDB Votes</option>
                            <option value="Year">Release Year</option>
                            <option value="Revenue">Revenue</option>
                        </select>

                        <div className="icon" onClick={reverseSort}>
                            <BiSortAlt2 size='24'/>
                        </div>
                    </div>
                </div>

                <div className="movie-container w-[90%]" id="grid">
                    {imagesLoaded === false
                    && (
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Spinner />
                        </div>
                        
                        )
                    }
                    <div className="movie-grid justify-center" ref={gridRef} style={imagesLoaded ? {} : {display: 'none'}}>
                        
                        {currentPageData}
                        
                        <div className={`flex h-full w-full align-middle justify-center mb-28 mt-8 pt-8 col-span-full border-t border-[#5a5a5a73]`}>
                            <div className="inline">
                                <div className="pagination-icon" onClick={() => {handlePageChange('previous')}}> 
                                    <BsArrowLeft />
                                </div>
                            </div>
                            <div className="inline pl-6 pr-6">
                                <div className="pagination-icon" onClick={() => {handlePageChange('home')}}> 
                                    <BiFirstPage size='20'/>
                                </div>
                            </div>
                            <div className="inline">
                                <div className="pagination-icon" onClick={() => {handlePageChange('next')}}> 
                                    <BsArrowRight />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>    
            );   
    }

export default Movie;


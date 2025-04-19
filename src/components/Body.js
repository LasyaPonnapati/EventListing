import {useEffect, useState} from "react";
import '../styles/body.css';

const Body = () => {
    const[eventDetails,setEventDetails] = useState([]);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);      
    const itemsPerPage = 6;

    const [searchText, setSearchText] = useState("");
    const [filteredListOnSearch, setFilteredListOnSearch] = useState([])

    const totalPages=Math.ceil(filteredListOnSearch.length/itemsPerPage);
    const startIndex=(currentPage-1)*itemsPerPage;
    const currentPageItems=filteredListOnSearch.slice(startIndex,startIndex+itemsPerPage);

    const fetchData=async()=>{
        try{
        let data= await fetch("https://67ff48fa58f18d7209f09751.mockapi.io/v1/events");
        let json=await data.json();
        console.log(json)
        setEventDetails(json);
        setFilteredListOnSearch(json);
        }
        catch(err){
            setError('Failed to fetch details');
        }
    }
    useEffect(()=>{
        fetchData();
    },[]);

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const pageNumbers = () => {
        let numbers = [];
        for (let i = 1; i <= totalPages; i++) {
            numbers.push(i);
        }
        return numbers;
    };

    const goToPage = (pageNum) => {
        setCurrentPage(pageNum);
    };

    return (
        <>
        <div id="main-body-container">
            <h1 id="main-heading">Events</h1>
            <p id="sub-heading">Lorem ipsum dolor sit amet, consect adipi elit.
            Sed do eiusmod tempor inci ut labore et dolore magna aliqua.</p>
            {eventDetails.length!=0 && <div id="search-container">
                <input placeholder="Search for Event name" id="search-input" type="text" value={searchText} onChange={(evt)=>{
                setSearchText(evt.target.value);
                }}></input>
                <button id="search-button" onClick={()=>{
                    const filteredList = eventDetails.filter((event) => event.eventName.toLowerCase().includes(searchText.toLowerCase()));
                    filteredList.length === 0 ? setError('No such events are conducted for now') : setError("");
                    setFilteredListOnSearch(filteredList);
                }}>Search</button>
            </div>} 
            {error ? <div id="error-container"><p id="error-text">{error}</p></div>
            : eventDetails.length===0 ? <p id="loading-text">Loading....</p> 
            : currentPageItems.map((event) => {
                return <div id="event-card">
                    <img src="https://img.freepik.com/premium-photo/night-lights_31748-27.jpg?semt=ais_hybrid&w=740" alt="event-img" height='200px' width='200px'/>
                    <div style={{display:"flex", justifyContent:'space-between'}} id="event-name-container">
                    <p style={{whiteSpace:'nowrap',overflow:'hidden', textOverflow:'ellipsis'}}>{event.eventName}</p>
                    <p>FREE</p>
                    </div>
                    <p id="event-description">Lorem ipsum dolor sit amet, consect adipi elit.
                    Sed do eiusmod tempor inci ut labore et dolore magna aliqua.</p>
                    <p className="event-details"><span class="dot red"></span>Location  :  {event.location}</p>
                    <p className="event-details"><span class="dot black"></span>Date  :  {event.date.split("T")[0]}</p>
                    <p className="event-details"><span class="dot green"></span>Organizer  :  {event.organizer}</p>
                </div>
            })}
            {filteredListOnSearch.length!=0 && <div id="pagination-container">
                <button onClick={goToPrevPage} disabled={currentPage === 1} className={`pagination-button ${currentPage === 1 ? 'disabled-button' : ''}`}><span className="material-symbols-outlined">chevron_left</span> Previous</button>
                {pageNumbers().map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`${pageNum === currentPage ? 'active-page':'' } pages`}
                        >
                            {pageNum}
                        </button>
                    ))}
                <button onClick={goToNextPage} disabled={currentPage === totalPages} className={`pagination-button ${currentPage === totalPages | 0 ? 'disabled-button' : ''}`}>Next <span className="material-symbols-outlined" style={{transform: 'rotate(180deg)'}}>chevron_left</span></button>
            </div>}
        </div>
        </>
    );
    
}

export default Body;
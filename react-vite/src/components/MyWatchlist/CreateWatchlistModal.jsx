// import { useState } from "react";
// import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import CreateNewWatchListForm from "./CreateNewWatchlistForm";
import './CreateWatchlist.css';
import { fetchGetMyWatchlists } from "../../redux/watchlist";


function CreateWatchlistModal() {
    const { openModal } = useModal();
    const dispatch = useDispatch();

    const refreshWatchlists = () => {
        dispatch(fetchGetMyWatchlists());
    };
    
    return (
        <div>
        <button className="create-wl-btn" onClick={() => openModal(<CreateNewWatchListForm onSuccess={refreshWatchlists} />)}>
            Create New Watchlist
        </button>
    </div>
    )
}

export default CreateWatchlistModal;


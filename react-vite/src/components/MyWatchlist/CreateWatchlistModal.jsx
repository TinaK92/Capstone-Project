// import { useState } from "react";
// import React from "react";
// import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
// import { fetchCreateNewWatchlist } from "../../redux/watchlist";
import CreateNewWatchListForm from "./CreateNewWatchlistForm";


function CreateWatchlistModal() {
    const { openModal } = useModal();
    
    return (
        <div>
        <button onClick={() => openModal(<CreateNewWatchListForm />)}>
            Create New Watchlist
        </button>
    </div>
    )
}

export default CreateWatchlistModal;


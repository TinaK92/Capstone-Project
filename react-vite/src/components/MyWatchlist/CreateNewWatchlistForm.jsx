import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchGetMyWatchlists,
  fetchCreateNewWatchlist,
  fetchDeleteWatchlist,
} from "../../redux/watchlist";
import { useModal } from "../../context/Modal";
import { Link } from "react-router-dom";
import './CreateNewWatchlistForm.css';

export const CreateNewWatchListForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const watchlists = useSelector((state) => state.watchlist.myWatchlists);
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeModal } = useModal();

  useEffect(() => {
    dispatch(fetchGetMyWatchlists());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (user) {
      const serverResponse = await dispatch(
        fetchCreateNewWatchlist({
          name: name,
        })
      );

      if (serverResponse?.errors) {
        setErrors(serverResponse.errors);
        setIsSubmitting(false);
      } else {
        setName("");
        closeModal();
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async (watchlist) => {
    const confirmation = window.confirm(
      `Are you sure you want to delete the watchlist "${watchlist.name}"?`
    );
    if (confirmation) {
      const result = await dispatch(fetchDeleteWatchlist(watchlist.id));
      if (result?.message) {
        alert(result.message);
        // Update the UI by refetching the watchlists
        dispatch(fetchGetMyWatchlists());
      } else {
        alert(result?.error || "Failed to delete watchlist");
      }
    }
  };

  return (
    <>
      <div className="create-watchlist-div">
      <h1 className="create-wl">Create New Watchlist!</h1>
      <form className="create-wl-form" onSubmit={handleSubmit}>
        <label className="choose-name">
          Choose a name for your Watchlist
          <input
            type="text"
            className="input-box"
            placeholder="Watchlist Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        {errors.name && <p className="error">{errors.name}</p>}
        <button
          className="create-watchlist-btn"
          type="submit"
          disabled={isSubmitting}
        > 
          {isSubmitting ? "Creating..." : "Create"}
        </button>
      </form>
      </div>
      <div className="watchlist-div">
        <h2 className="watchlist-title">Your Watchlists:</h2>
        <div className="list-wl">
        <ul className="watchlist-ul">
          {watchlists && watchlists.length > 0 ? (
            watchlists.map((watchlist) => (
              <ul key={watchlist.id}>
                <Link className="watchlist-link" to={`/watchlists/${watchlist.id}`}>{watchlist.name}</Link>
                <button className="delete-btn" onClick={() => handleDelete(watchlist)}>
                  Delete Watchlist
                </button>
              </ul>
            ))
          ) : (
            <p className="no-watchlist-message">No watchlists currently exist</p>
          )}
        </ul>
        </div>
      </div>
    </>
  );
};

export default CreateNewWatchListForm;

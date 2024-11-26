import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchGetMyWatchlists,
  fetchCreateNewWatchlist,
  fetchDeleteWatchlist,
} from "../../redux/watchlist";
import { useModal } from "../../context/Modal";
import { Link } from "react-router-dom";

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
      <h1>Create New Watchlist!</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Choose a name for your Watchlist
          <input
            type="text"
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
      <div>
        <h2>Your Watchlists:</h2>
        <ul>
          {watchlists && watchlists.length > 0 ? (
            watchlists.map((watchlist) => (
              <li key={watchlist.id}>
                <Link to={`/watchlists/${watchlist.id}`}>{watchlist.name}</Link>
                <button onClick={() => handleDelete(watchlist)}>
                  Delete Watchlist
                </button>
              </li>
            ))
          ) : (
            <p>No watchlists currently exist</p>
          )}
        </ul>
      </div>
    </>
  );
};

export default CreateNewWatchListForm;




const DeleteMovieModal = ({ onConfirm, onCancel }) => {

    return (
        <div>
            <h2>Are you sure you want to delete this movie?</h2>
            <div>
                <button
                    className="cancel-delete-btn"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    className="confirm=delete-btn"
                    onClick={onConfirm}
                >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default DeleteMovieModal;
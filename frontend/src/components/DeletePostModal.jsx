// BlockModal.js
const DeletePostModal = ({isOpen, onClose, onConfirm}) => {
    return (
        <dialog className="modal" open={isOpen} onClick={(e) => e.stopPropagation()}>
            <form method="dialog" className="modal-box bg-base-200 rounded-lg p-6 flex flex-col text-center">
                <h3 className="font-bold text-lg mb-4">Are you sure you want to delete this post?</h3>
                <div className="modal-action justify-center">
                    <button type="button" className="btn btn-secondary" onClick={(e) => { e.stopPropagation(); onClose(e); }}>Cancel</button>
                    <button type="button" className="btn btn-error" onClick={(e) => { e.stopPropagation(); onConfirm(e); }}>Delete</button>
                </div>
            </form>
        </dialog>
    );
};

export default DeletePostModal;


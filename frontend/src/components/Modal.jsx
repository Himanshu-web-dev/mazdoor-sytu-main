function Modal({ open, title, children, onClose }) { if (!open) return null; return <div className="modal-backdrop" role="dialog" aria-modal="true"><section className="modal"><button type="button" onClick={onClose} aria-label="Close">Close</button><h2>{title}</h2>{children}</section></div> }
export default Modal

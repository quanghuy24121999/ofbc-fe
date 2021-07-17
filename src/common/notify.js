import { toast } from 'react-toastify';

export function Notify(message, type, position) {
    if (type === 'success') {
        return toast.success(message, {
            position: position,
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    } else if (type === 'warning') {
        return toast.warn(message, {
            position: position,
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    } else if (type === 'error') {
        return toast.error(message, {
            position: position,
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    }
}

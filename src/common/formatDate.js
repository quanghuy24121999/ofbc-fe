export function formatDate(dateInput) {
    let date = new Date(dateInput);
    let month = (
        (date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))
    )
    return ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/'
        + month + '/' + date.getFullYear();
}

export function formatDateForInput(dateInput) {
    let date = new Date(dateInput);
    let day = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()));
    let month = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)));
    let year = date.getFullYear()
    return year + '-' + month + '-' + day;
}

export function formatDateForNotify(dateInput) {
    let date = new Date(dateInput);
    let day = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()));
    let month = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)));
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();
    return hour + 'g' + minute + 'p (' + day + '/' + month + '/' + year + ')';
}
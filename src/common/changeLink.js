export function onChangeRate(rate) {
    let element1 = document.getElementById('1');
    let element2 = document.getElementById('2');
    let element3 = document.getElementById('3');
    let element4 = document.getElementById('4');
    let element5 = document.getElementById('5');
    let elementAll = document.getElementById('all');
    switch (rate) {
        case 1:
            element1.classList.add("active");
            element2.classList.remove("active");
            element3.classList.remove("active");
            element4.classList.remove("active");
            element5.classList.remove("active");
            elementAll.classList.remove("active");
            break;
        case 2:
            element1.classList.remove("active");
            element2.classList.add("active");
            element3.classList.remove("active");
            element4.classList.remove("active");
            element5.classList.remove("active");
            elementAll.classList.remove("active");
            break;
        case 3:
            element1.classList.remove("active");
            element2.classList.remove("active");
            element3.classList.add("active");
            element4.classList.remove("active");
            element5.classList.remove("active");
            elementAll.classList.remove("active");
            break;
        case 4:
            element1.classList.remove("active");
            element2.classList.remove("active");
            element3.classList.remove("active");
            element4.classList.add("active");
            element5.classList.remove("active");
            elementAll.classList.remove("active");
            break;
        case 5:
            element1.classList.remove("active");
            element2.classList.remove("active");
            element3.classList.remove("active");
            element4.classList.remove("active");
            element5.classList.add("active");
            elementAll.classList.remove("active");
            break;
        case 0:
            element1.classList.remove("active");
            element2.classList.remove("active");
            element3.classList.remove("active");
            element4.classList.remove("active");
            element5.classList.remove("active");
            elementAll.classList.add("active");
            break;

        default:
            element1.classList.remove("active");
            element2.classList.remove("active");
            element3.classList.remove("active");
            element4.classList.remove("active");
            element5.classList.remove("active");
            elementAll.classList.add("active");
            break;
    }
}

export function onChangeLinkStatus(status) {
    let element1 = document.getElementById('1');
    let element2 = document.getElementById('2');
    let element3 = document.getElementById('3');
    let element4 = document.getElementById('4');
    switch (status) {
        case 1:
            element1.classList.add("active");
            element2.classList.remove("active");
            element3.classList.remove("active");
            element4.classList.remove("active");
            break;
        case 2:
            element1.classList.remove("active");
            element2.classList.add("active");
            element3.classList.remove("active");
            element4.classList.remove("active");
            break;
        case 3:
            element1.classList.remove("active");
            element2.classList.remove("active");
            element3.classList.add("active");
            element4.classList.remove("active");
            break;
        case 4:
            element1.classList.remove("active");
            element2.classList.remove("active");
            element3.classList.remove("active");
            element4.classList.add("active");
            break;

        default:
            element1.classList.add("active");
            element2.classList.remove("active");
            element3.classList.remove("active");
            element4.classList.remove("active");
            break;
    }
}
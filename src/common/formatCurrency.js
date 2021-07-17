export function formatCurrency(money) {
    money = money + '';
    return money.split('').reverse().reduce((prev, next, index) => {
        return ((index % 3) ? next : (next + ',')) + prev
    })
}
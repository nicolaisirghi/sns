export const getData = (data, page, itemsCount) => {
    const numbersOfPages = Math.ceil(data.length / itemsCount);

    return  (page <= numbersOfPages) ? data.slice((page - 1) * itemsCount, page * itemsCount)
        : data.slice((numbersOfPages - 1) * itemsCount)
}
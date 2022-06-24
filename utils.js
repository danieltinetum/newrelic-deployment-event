

const chunk = (array, chunkSize) => {
    const chunk_array = [];

    for (i = 0; i < array.length; i += chunkSize) {
        chunk_array.push(array.slice(i, i + chunkSize));
    }

    return chunk_array;
}


module.exports = {
    chunk
} 
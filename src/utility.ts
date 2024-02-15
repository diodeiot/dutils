

export function hexClean(str: string) {
    str = str.replace(/[^0-9a-fA-F]+/g, "");
    return str.toUpperCase();
}

export function hex2Bytes(bytes: Buffer) {
    let arr = "";
    for (let b of bytes) {
        arr += "0x" + b.toString(16).toUpperCase() + ", ";
    }
    return arr.slice(0, arr.length - 2);
}

export function bytesToCArray(bytes: Buffer) {
    const content = hex2Bytes(bytes);
    return `const uint8_t dummy[${bytes.length}] = {${content}};`;
}
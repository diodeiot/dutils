

export function hexClean(str: string) {
    str = str.replace(/0x/gi, ""); //remove all 0x occurences
    str = str.replace(/[^0-9a-f]+/gi, ""); //remove all non-hex chars
    return str.toLowerCase();
}

export function hex2Bytes(bytes: Buffer) {
    let arr = "";
    for (let b of bytes) {
        arr += "0x" + b.toString(16).padStart(2, "0").toLowerCase() + ", ";
    }
    return arr.slice(0, arr.length - 2);
}

export function bytesToCArray(bytes: Buffer) {
    const content = hex2Bytes(bytes);
    return `const uint8_t dummy[${bytes.length}] = {${content}};`;
}

export function normalize(str: string, reversed: boolean = false): string {
    const hex = hexClean(str);
    let b = Buffer.from(hex, "hex");
    if (reversed) {
        b = b.reverse();
    }
    return b.toString("hex").toLowerCase();
}
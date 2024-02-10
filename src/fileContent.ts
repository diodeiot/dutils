import { FileLang, FileType } from "./models/types/file";

export const fileName2CppClassName = (name: string) => {
    let cname = name
        .split(/[^a-zA-Z0-9]/g)
        .map((word, index) => {
            if (index === 0) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join("");
    return cname.charAt(0).toUpperCase() + cname.slice(1);
};

export const fileName2MacroName = (name: string) => {
    let macroName = name.toUpperCase();
    macroName = macroName.replace(/[^a-zA-Z0-9]/g, "_");
    return macroName;
};

export function getFileContent(name: string, lang: FileLang, fileType: FileType) {
    if (lang === "C" && fileType === "Header") {
        const m = fileName2MacroName(name + ".h");
        return `#ifndef ${m}
#define ${m}

#endif /*${m}*/`;
    }
    else if (lang === "C" && fileType === "Source") {
        return `#include "${name}.h"
`;
    }
    if (lang === "C++" && fileType === "Header") {
        const m = fileName2MacroName(name + ".h");
        const classname = fileName2CppClassName(name);
        return `#ifndef ${m}
#define ${m}

class ${classname}
{
public:
    ${classname}();
    ~${classname}();

private:
};

#endif /*${m}*/`;
    }
    else if (lang === "C++" && fileType === "Source") {
        const classname = fileName2CppClassName(name);
        return `#include "${name}.h"

${classname}::${classname}()
{
}

${classname}::~${classname}()
{
}
`;
    }
    return "";
}
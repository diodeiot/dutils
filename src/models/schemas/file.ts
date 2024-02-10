import { z } from "zod";

export const FileNameSchema = z
    .string()
    .trim()
    .min(1, { message: "File name can't be empty" })
    .max(255, { message: "File name is too long" })
    .refine((filename) => {
        return !/[\\/:*?"<>|]/.test(filename);
    }, { message: "Invalid file name" });
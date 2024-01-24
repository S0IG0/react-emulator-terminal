import {ReactNode} from "react";

export interface File {
    text: string,
    name: string,
    create: Date,
}

export interface Directory {
    files: File[],
    directories: Directory[],
    name: string,
    parent: Directory | null,
    create: Date,
}

export enum ResponseType {
    ERROR = "error",
    SUCCESS = "success",
    HIDDEN = "hidden",
}

export interface Response {
    element: ReactNode | undefined,
    _type: ResponseType
}

export interface History {
    request: string,
    response: Response,
    user: ReactNode
}

export type CommandFunction = (...arg: string[]) => Response;
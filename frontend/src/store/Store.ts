import {makeAutoObservable} from "mobx";
import {Directory, File, History} from "./type.ts"

const HOME_NAME = "~"

class Store {
    constructor() {
        makeAutoObservable(this);
    }

    private _historyCommands: History[] = [];
    private _currentDirectory: Directory = {
        name: HOME_NAME,
        directories: [],
        files: [],
        parent: null,
        create: new Date()
    };
    private _user: string = `user@react-terminal`;
    private _historyLineCommands: string[] = [];
    private _currentIndexHistoryLineCommands = 0;

    public addHistoryLineCommands(line: string) {
        this._historyLineCommands.push(line);
        this._currentIndexHistoryLineCommands++;
    }

    public addDirectory(name: string) {
        if (name === HOME_NAME) {
            throw new Error(`You cant create directory with name ${HOME_NAME}`)
        }

        if (this._currentDirectory.directories.find(directory => directory.name === name)) {
            throw new Error(`Directory "${name}" already exist`)
        }

        this._currentDirectory.directories.push({
            name: name,
            directories: [],
            files: [],
            parent: this._currentDirectory,
            create: new Date(),
        })
    }

    public moveUp() {
        if (this._currentDirectory.parent) {
            this._currentDirectory = this._currentDirectory.parent;
        }
    }

    public removeDirectoryByName(name: string) {
        if (name === HOME_NAME) {
            throw new Error(`You cant delete directory with name ${HOME_NAME}`)
        }

        const index = this.findIndexDirectoryByName(name);

        if (index === -1) {
            throw new Error(`Directory "${name}" not found`)
        }

        this._currentDirectory.directories.splice(index, 1);
    }

    public move(name: string) {
        const index = this.findIndexDirectoryByName(name);

        if (index === -1) {
            throw new Error(`Directory "${name}" not found`)
        }

        this._currentDirectory = this._currentDirectory.directories[index];
    }

    public addFileByName(name: string) {
        if (this._currentDirectory.files.find(file => file.name === name)) {
            throw new Error(`File "${name}" already exist`)
        }

        this._currentDirectory.files.push({
            name: name,
            create: new Date(),
            text: "",
        });
    }

    public getFileByName(name: string): File {
        const file = this._currentDirectory.files.find(file => file.name === name);

        if (file) {
            return file;
        } else {
            throw new Error(`File "${name}" not found`)
        }
    }

    public removeFileByName(name: string): void {
        const index = this._currentDirectory.files.findIndex(file => file.name === name);
        if (index !== -1) {
            this._currentDirectory.files.splice(index, 1);
        } else {
            throw new Error(`File "${name}" not found`)
        }
    }

    private findIndexDirectoryByName(name: string) {
        return this._currentDirectory.directories.findIndex(directory => directory.name === name);
    }


    public addHistory(history: History): void {
        this._historyCommands.push(history);
    }

    public clearHistory(): void {
        this._historyCommands = [];
    }


    get user(): string {
        return this._user;
    }

    get historyCommands(): History[] {
        return this._historyCommands;
    }

    get directory() {
        return this._currentDirectory;
    }

    get files() {
        return this._currentDirectory.files;
    }

    get directories() {
        return this._currentDirectory.directories;
    }

    get historyLineCommands(): string[] {
        return this._historyLineCommands;
    }


    get currentIndexHistoryLineCommands(): number {
        return this._currentIndexHistoryLineCommands;
    }

    set currentIndexHistoryLineCommands(value: number) {
        const length = this.historyLineCommands.length
        if (value > length || value < 0) {
            return
        }

        this._currentIndexHistoryLineCommands = value;
    }
}


export const store = new Store();
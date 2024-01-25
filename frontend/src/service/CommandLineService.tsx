import {store} from "../store/Store.ts";
import {CommandFunction, Response, ResponseType} from "../store/type.ts";

const UP_DIRECTORY = ".."

class CommandLineService {
    clear() {
        store.clearHistory();
        return {_type: ResponseType.HIDDEN} as Response;
    }

    echo(text: string, operation: string, name: string) {
        if (!text) {
            return {
                element: (<span>echo take one require argument: text</span>),
                _type: ResponseType.ERROR
            }
        }

        if (text && !operation && !name) {
            return {
                element: (<div>{text}</div>),
                _type: ResponseType.SUCCESS
            }
        }

        if ([">",].includes(operation)) {

            if (!name) {
                return {
                    element: (<span>echo take require argument: name</span>),
                    _type: ResponseType.ERROR
                }
            }

            try {
                const file = store.getFileByName(name);
                file.text = text
                return {_type: ResponseType.HIDDEN} as Response
            } catch (error) {
                return {
                    element: (<span>{(error as Error).message}</span>),
                    _type: ResponseType.ERROR
                }
            }
        }

        return {
            element: (<span>ERROR</span>),
            _type: ResponseType.ERROR
        }
    }

    cat(name: string) {
        if (!name) {
            return {
                element: (<span>cat take one require argument: name</span>),
                _type: ResponseType.ERROR
            }
        }

        try {
            const file = store.getFileByName(name);
            return {
                element: (<div className="file-text">{file.text}</div>),
                _type: ResponseType.SUCCESS
            }
        } catch (error) {
            return {
                element: (<span>{(error as Error).message}</span>),
                _type: ResponseType.ERROR
            }
        }
    }

    rm(name: string) {
        if (!name) {
            return {
                element: (<span>rm take one require argument: name</span>),
                _type: ResponseType.ERROR
            }
        }
        try {
            store.removeFileByName(name);
            return {
                element: (<span>File "{name}" delete</span>),
                _type: ResponseType.SUCCESS
            }
        } catch (error) {
            return {
                element: (<span>{(error as Error).message}</span>),
                _type: ResponseType.ERROR
            }
        }
    }

    rmdir(name: string) {
        if (!name) {
            return {
                element: (<span>rmdir take one require argument: name</span>),
                _type: ResponseType.ERROR
            }
        }

        try {
            store.removeDirectoryByName(name);
            return {
                element: (<span>Directory "{name}" delete</span>),
                _type: ResponseType.SUCCESS
            }
        } catch (error) {
            return {
                element: (<span>{(error as Error).message}</span>),
                _type: ResponseType.ERROR
            }
        }
    }

    touch(name
              :
              string
    ) {
        if (!name) {
            return {
                element: (<span>touch take one require argument: name</span>),
                _type: ResponseType.ERROR
            }
        }


        try {
            store.addFileByName(name);
            return {
                element: (<span>Create file: "{name}" success</span>),
                _type: ResponseType.SUCCESS
            }
        } catch (error) {
            return {
                element: (<span>{(error as Error).message}</span>),
                _type: ResponseType.ERROR
            }
        }
    }

    ls() {
        if (store.files.length === 0 && store.directories.length === 0) {
            return {
                element: (
                    <div>Not files or directories</div>
                ),
                _type: ResponseType.ERROR
            }
        }

        return {
            element: (
                <>
                    {store.directories.length > 0 && (<>
                        <span>Your directories: </span>
                        <ul>
                            {store.directories.map((directory, index) => (
                                <ol className="directory" key={index}>
                                    <div className="name">{index + 1}) {directory.name}</div>
                                    <div
                                        className="create">{directory.create.toDateString()} {directory.create.toLocaleTimeString()}
                                    </div>
                                </ol>
                            ))}
                        </ul>
                    </>)}
                    {store.files.length > 0 && (<>
                        <span>Your files: </span>
                        <ul>
                            {store.files.map((file, index) => (
                                <ol className="file" key={index}>
                                    <div className="name">{index + 1}) {file.name}</div>
                                    <div
                                        className="create">{file.create.toDateString()} {file.create.toLocaleTimeString()}
                                    </div>
                                </ol>
                            ))}
                        </ul>
                    </>)}
                </>
            ),
            _type: ResponseType.SUCCESS
        }
    }

    cd(name
           :
           string
    ) {
        if (!name) {
            return {
                element: (<span>cd take one require argument: name</span>),
                _type: ResponseType.ERROR
            }
        }

        try {

            if (name === UP_DIRECTORY) {
                store.moveUp();
            } else {
                store.move(name)
            }

            console.log(store.directory)

            return {
                _type: ResponseType.HIDDEN
            }
        } catch (error) {
            return {
                element: (<span>{(error as Error).message}</span>),
                _type: ResponseType.ERROR
            }
        }
    }

    mkdir(name
              :
              string
    ) {
        if (!name) {
            return {
                element: (<span>mkdir take one require argument: name</span>),
                _type: ResponseType.ERROR
            }
        }

        try {
            store.addDirectory(name);
            return {
                element: (<span>Create directory: "{name}" success</span>),
                _type: ResponseType.SUCCESS
            }
        } catch (error) {
            return {
                element: (<span>{(error as Error).message}</span>),
                _type: ResponseType.ERROR
            }
        }
    }

    help() {
        const methods = Object.getOwnPropertyNames(CommandLineService.prototype)
            .filter(item => !["constructor", "help"].includes(item))
        return {
            element: (
                <>
                    <span>Allowed commands: </span>
                    <ul>
                        {methods.map((name, index) => (
                            <ol className="file" key={index}>
                                <div className="name">{index + 1}) {name}</div>
                            </ol>
                        ))}
                    </ul>
                </>
            ),
            _type: ResponseType.SUCCESS
        };
    }
}


export const commandLineService = new CommandLineService() as unknown as Record<string, CommandFunction>;
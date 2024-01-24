import {FC} from 'react';
import {store} from "../store/Store.ts";

const UserCommandLine: FC = () => {
    const directory = store.directory;
    const user = store.user;
    return (
        <div className="user">
            {`${user}:${directory.name}$`}
        </div>
    );
};

export default UserCommandLine;
import {store} from "./store/Store.ts";
import {FC} from "react";
import {ResponseType} from "./store/type.ts";

const HistoryCommandsList: FC = () => {
    const history = store.historyCommands;
    return (
        <div className="history-list">
            {history.filter(item => item.response._type !== ResponseType.HIDDEN)
                .map((item, index) => (
                    <div className="history-card" key={index}>
                        <div className="message">
                            {item.user}
                            <div className="input-line">{item.request}</div>
                        </div>
                        <div className="response">
                            <div className={item.response._type}>
                                {item.response.element}
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default HistoryCommandsList;
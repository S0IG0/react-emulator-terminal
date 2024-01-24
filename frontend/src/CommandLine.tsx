import {useState, ChangeEvent, KeyboardEvent, FC, useRef} from 'react';
import HistoryCommandsList from "./HistoryCommandsList.tsx";
import {store} from "./store/Store.ts";
import {commandLineService} from "./service/CommandLineService.tsx";
import {ResponseType, Response} from "./store/type.ts";
import UserCommandLine from "./ui/UserCommandLine.tsx";


const CommandLine: FC = () => {
    const bottom = useRef<HTMLDivElement | null>(null);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const [input, setInput] = useState<string>('');
    const handleCommandSubmit = (response: Response): void => {
        store.addHistory({
            user: <UserCommandLine/>,
            request: input,
            response: response,
        });
    };
    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        setInput(e.target.value.replace("\n", ""));
    };
    const handleInputKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.key === 'Enter' && input) {
            store.addHistoryLineCommands(input)
            const [command, ...args] = input.split(" ").filter(item => item !== "")
            try {
                handleCommandSubmit(commandLineService[command.toLowerCase()](...args))
            } catch (error) {
                handleCommandSubmit({
                    element: (<span>{`Command: "${command}" not found`}</span>),
                    _type: ResponseType.ERROR,
                })
            }
            setInput("");
            store.currentIndexHistoryLineCommands = store.historyLineCommands.length;
        }
        if (["ArrowUp", "ArrowDown"].includes(e.key)) {
            if (e.key === "ArrowUp") {
                store.currentIndexHistoryLineCommands--
            }
            if (e.key === "ArrowDown" && !((store.currentIndexHistoryLineCommands + 1) >= store.historyLineCommands.length)) {
                store.currentIndexHistoryLineCommands++
            }
            setInput(store.historyLineCommands[store.currentIndexHistoryLineCommands]);
        }
    };

    const handleInputKeyUp = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
        if (!input) {
            return
        }

        if (["ArrowUp", "ArrowDown"].includes(e.key)) {
            const length = input.length;
            textAreaRef.current?.setSelectionRange(length, length);
            textAreaRef.current?.focus();
        }
    }

    bottom.current?.scrollIntoView()
    return (
        <>
            <HistoryCommandsList/>
            <div className="command-line">
                <UserCommandLine/>
                <textarea
                    className="input-line"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onKeyUp={handleInputKeyUp}
                    rows={5}
                    ref={textAreaRef}
                />
            </div>
            <div
                ref={bottom}
                className="bottom"
            />
        </>
    );
};

export default CommandLine;

import { Header } from "./components/header";
import { useState, useEffect } from "react";
import { TrashIcon } from "@phosphor-icons/react"

interface ChecklistItem {
    text: string;
    checked: boolean;
}

interface Task {
    title: string;
    checklist: ChecklistItem[];
}

export function App() {
    const [itemList, setItemList] = useState<Task[]>(() => {
        const saved = localStorage.getItem("tarefas");
        return saved ? JSON.parse(saved) : [];
    });
    const [inputText, setInputText] = useState("");

    useEffect(() => {
        localStorage.setItem("tarefas", JSON.stringify(itemList));
    }, [itemList]);

    function handleAdicionarItem() {
        const textoSemEspaco = inputText.trim();
        if (textoSemEspaco == '') return;

        setItemList([...itemList, { title: textoSemEspaco, checklist: [{ text: "", checked: false }] }]);
        setInputText("");
    }

    function handleEliminarItem(index: number) {
        setItemList(prevList => prevList.filter((_, i) => i !== index));
    }

    function handleChecklistTextChange(taskIndex: number, checklistIndex: number, value: string) {
        setItemList(prevList => prevList.map((task, i) => {
            if (i !== taskIndex) return task;
            const newChecklist = task.checklist.map((item, j) =>
                j === checklistIndex ? { ...item, text: value } : item
            );

            if (
                checklistIndex === task.checklist.length - 1 &&
                value.trim() !== '' &&
                !task.checklist.some((item, idx) => idx > checklistIndex && item.text === "")
            ) {
                newChecklist.push({ text: "", checked: false });
            }

            const filteredChecklist = newChecklist.filter((item, idx, arr) =>
                item.text !== '' || idx === arr.length - 1
            );
            return { ...task, checklist: filteredChecklist };
        }));
    }


    function handleToggleChecklistItem(taskIndex: number, checklistIndex: number) {
        setItemList(prevList => prevList.map((task, i) => {
            if (i !== taskIndex) return task;
            return {
                ...task,
                checklist: task.checklist.map((item, j) =>
                    j === checklistIndex ? { ...item, checked: !item.checked } : item
                )
            };
        }));
    }

    function handleRemoveChecklistItem(taskIndex: number, checklistIndex: number) {
        setItemList(prevList => prevList.map((task, i) => {
            if (i !== taskIndex) return task;

            if (task.checklist.length === 1 && task.checklist[0].text === "") return task;
            return {
                ...task,
                checklist: task.checklist.filter((_, j) => j !== checklistIndex)
            };
        }));
    }

    return (
        <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-teal-600 to-teal-100">
             <input type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Qual é a sua tarefa de hoje?"
                className="rounded-none m-5 w-60 h-15 text-center border-2 border-teal-700 " />
            <button className="Adicionar bg-teal-700 rounded-none m-10 w-30 h-10"
                onClick={handleAdicionarItem}>Adicionar</button>

            <ul className="m-top-10">
                {itemList.map((task, i) => (
                <li className=" bg-teal-50 m-5 p-5 w-90 h-20 flex flex-col" key={i}>
                <div className="flex justify-between items-center w-full">
                <div className="flex items-center w-full">
                <ul className="flex flex-row items-center flex-wrap gap-2 ml-2">

                   {task.checklist.map((item, j) => (
                        <li key={j} className="flex items-center mb-0">
                        <input type="checkbox" checked={item.checked} onChange={() => handleToggleChecklistItem(i, j)} />
                        <input 
                        type="text"
                        value={j === 0 ? task.title : item.text}
                        onChange={e => {
                            if (j === 0) {
                                setItemList(prevList => prevList.map((t, idx) => idx === i ? { ...t, title: e.target.value } : t));
                            } else {
                                handleChecklistTextChange(i, j, e.target.value)}
                        }}
                        placeholder={j === 0 ? "Tarefa" : "Item do checklist"}
                        className={"ml-2 bg-transparent outline-none flex-1 min-w-0 w-64 text-lg px-2 py-1" + (item.checked ? " line-through" : "")}
                        style={j === 0 ? {whiteSpace: 'normal'} : {}}
                         />

                        {j !== 0 && item.text !== '' && (
                        <button className="ml-2 text-red-500" onClick={() => handleRemoveChecklistItem(i, j)}>x</button>
                        )}
                        </li>
                        ))}

                        </ul>
                            </div>
                            <button className="rounded-none bg-red-300 mask-direita ml-4" onClick={() => handleEliminarItem(i)}>
                                <TrashIcon size={20} />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

        </div>
           
        </>
    )
}


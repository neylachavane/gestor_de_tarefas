import { useState } from "react";
import { TrashIcon } from "@phosphor-icons/react"

export function App () {
    const [itemList, setItemList] = useState ([]);
    const [inputText, setInputText] = useState ("");

    function handleAdicionarItem () {
        const textoSemEspaco = inputText.trim()
        if (textoSemEspaco == '') return;

        setItemList ([...itemList, textoSemEspaco]);
        setInputText ("");
    }


    function handleEliminarItem (item: never) {
        setItemList (prevList => prevList.filter(lista => lista !==item))

    }

    return (
        <>
        <div className="h-100vh flex justify-center items-center bg-cyan-50" >
        <div className=" bg-cyan-300 m-20 p-30">
            <input type="text " 
            value={inputText} 
            onChange={(e) => setInputText (e.target.value)} 
            placeholder="Qual é a sua tarefa de hoje?"
            className="rounded-none bg-white w-60 h-20 text-center" /> 
            <button className="Adicionar bg-green-500 rounded-none m-10 w-30 h-10" 
            onClick={handleAdicionarItem}>Adicionar</button>
            

            <ul className="m-top-10 ">
                {itemList.map((item, i) => (
                    <li className="bg-cyan-50 m-5 p-5 w-90 h-20 flex justify-between" key={i}>{item} 
                    <div></div>

                    <button className="rounded-none  bg-red-300 mask-direita " onClick={()=> handleEliminarItem (item)}> 
                        <TrashIcon size= {30} />
                    </button>
                    </li>
                ))}
            </ul>
            </div>
            
        
        </div>
        
        
        </>
    )
}


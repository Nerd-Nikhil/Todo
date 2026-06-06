import React, { useEffect, useRef, useState } from "react";
import "../index.css";
import gsap from "gsap"
import {useGSAP} from "@gsap/react";

const Todo = () => {
  
  const [add, setAdd] = useState(()=>{
    const savedData = localStorage.getItem("todos");
    return savedData ? JSON.parse(savedData):[];
  });
  const prevLength = useRef(add.length);
  useGSAP(()=>{
    if (add.length > prevLength.current) {
    const cards = document.querySelectorAll(".card-container");
    gsap.from(cards[cards.length - 1],{
      y:-50,
      opacity:0,
      duration:0.5,
      ease:"power3.out"
    });
  }
  prevLength.current = add.length;
  },{dependencies:[add]});
    
    
    const [text, setText] = useState("");
    const [edit, setEdit] = useState(null);
    const [editText, setEditText] = useState("");


    useEffect(()=>{
        localStorage.setItem("todos",JSON.stringify(add));
    },[add]);

    
      useGSAP(()=>{
        gsap.from(".card-container",{
          y:-100,
          opacity:0,
          stagger:0.2,
          duration:1,
        })
      },{dependencies:[]}
    );

  const handleInput = (e) => {
    setText(e.target.value);
  };
  const handleAdd = () => {
    if (!text.trim()) return
    setAdd((prev) => [...prev, text]);
    setText("");
  };
  const handledelete = (index) => {
    setAdd((prev) => prev.filter((_, d) => d !== index));
  };
  const handleEdit = (todo, index) => {
    setEdit(index);
    setEditText(todo);
  };
  const handleSave = () => {
    setAdd((prev) =>
      prev.map((todo, index) => (index === edit ? editText : todo)),
    );
    setEdit(null);
    setEditText("");
  };

  return (
    <div  className="todo-container">
      <h1 className="todo-title">Todo List</h1>
      <hr className="w-[90vw]" />
      <input
        value={text}
        placeholder="add item..."
        className="todo-input"
        onChange={handleInput}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAdd();
          }
        }}
      />
      <button
        className="todo-add-btn"
        onClick={handleAdd}
      >
        ADD
      </button>

      <div className="card">
        {add.map((todo, index) => (
          <div
            key={index}
            className="card-container"
            
          >
            <div>
              {edit === index ? (
                <input
                  autoFocus
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="card-title"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSave();
                    }
                  }}
                />
              ) : (
                <p>
                  {todo}
                </p>
              )}
            </div>
            <div className="card-action">
              <button
                className="card-dlt-btn"
                onClick={() => handledelete(index)}
              >
                Delete
              </button>
              {edit === index ? (
                <button
                  className="card-edt-btn"
                  onClick={() => handleSave()}
                >
                  Save
                </button>
              ) : (
                <button
                  className="card-edt-btn"
                  onClick={() => handleEdit(todo, index)}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;

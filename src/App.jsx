import { useEffect, useState } from "react";
import './App.css'

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");  

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    // json-server 데이터 받기
    fetch('http://localhost:4000/todos')
    .then(response => response.json())
    .then(data => setTodos(data))
    .catch(e => console.log("error =>", e))
  }, []);

  const addTodos = (newTodo) => {
    fetch("http://localhost:4000/todos", {
      // POST를 사용하여, 새로운 데이터를 전송함
      method: 'POST',
      // 헤더 설정: 아래의 body(본문)가 JSON 형식임을 알려야한다캄
      headers: {
        // JSON 데이터임을 명시
        'Content-Type': 'application/json'
      },

      // 데이터를 JSON 문자열로 변환해 전송
      body: JSON.stringify(newTodo) 
    })
     // 서버로부터 응답을 받으면 JSON으로 변환.
    .then(response => response.json())
    // 변환된 JSON 데이터를 처리함
    .then(data => {
      // 위에서 body로 전송해서 값이 추가되었으니 기존 배열을 유지한 채 새로운 데이터를 추가해줌
      setTodos([...todos, data]);
    })
    .catch(e => console.log("error =>", e));
  }


  const saveTodos = () => {
    const newTodo = {
      // state에 저장된 값 => 입력한 값
      title, 
      content
    }
    // addTodo 에게 전달해쥼
    addTodos(newTodo);

    // 상태 초기화 => 입력 값 초기화
    setTitle("");
    setContent("");
  }

  const deleteTodo = (id) => {
    // url에 삭제하려는 todo의 id를 포함시켜서 DELETE 요청을 보냄
    fetch(`http://localhost:4000/todos/${id}`, {
      method: "DELETE"
    })
    .then(() => {
      // set함수를 사용해서 선택한 todo를 제외함
      setTodos(todos.filter(todo => todo.id !== id));
    })
    .catch(e => console.log("error =>", e));
  }

  const editTodo = (todo) => {
    setEditId(todo.id);
    setEditTitle(todo.title);
    setEditContent(todo.content);
  }

  const updateTodo = () => {
    const updatedTodo = {
      title: editTitle,
      content: editContent
    }

    fetch(`http://localhost:4000/todos/${editId}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTodo)
    })
    .then(response => response.json())
    .then(data => {
      setTodos(todos.map(todo => todo.id === editId ? data : todo));
      setEditId(null);
      setEditTitle("");
      setEditContent("");
    })
    .catch(e => console.log("업데이트 에러", e));
  }

  return (
    <>
      <h1>json-server todoList</h1>
      title: 
      <input 
        value={editId ? editTitle : title} 
        onChange={(e) => 
          {editId ? setEditTitle(e.target.value) : setTitle(e.target.value)}
        }
      /><br/>

      content: 
      <input 
        value={editId ? editContent : content} 
        onChange={(e) => 
          {editId ? setEditContent(e.target.value) : setContent(e.target.value)}          
        }
      /><br/>

      <button 
        type="button" 
        onClick={editId ? updateTodo : saveTodos}
      >
        {editId ? "수정" : "저장"}
      </button>
      {        
        todos.map(todo => {
          return(
            <div key={todo.id}>
              <strong>{todo.title}</strong>
              <p>{todo.content}</p>
              <button type="button" onClick={() => editTodo(todo)}>수정</button>              
              <button type="button" onClick={() => deleteTodo(todo.id)}>삭제</button>
            </div>
          )
        })
      }
    </>
  )
}

export default App

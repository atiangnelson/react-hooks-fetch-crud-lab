import React, { useEffect, useState } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions,setQuestions]=useState([])
  useEffect(()=>{
    fetch('http://localhost:4000/questions')
    .then((res)=>res.json())
    .then((data)=>setQuestions(data))
    .catch((err)=>console.error('Error fetching:',err))


  },[])
  function addQuestion(newQuestion){
    setQuestions([...questions,newQuestion])
  }
  function handleDelete(id){
    fetch(`http://localhost:4000/questions/${id}`,{
      method: 'DELETE'
    })
    .then((res)=>{
      if(res.ok) {
        setQuestions((prevQuestions)=>prevQuestions.filter((questions)=>questions.id!==id));
      } else {
        console.error("Failed to delete the question");
      }
    })
  }
  function answerChange(questionId,newCorrectIndex){
    setQuestions((prevQuestions)=>
      prevQuestions.map((question)=>question.id===questionId?{...question,correctIndex:newCorrectIndex}:question))
    
    fetch(`http://localhost:4000/questions/${questionId}`,{
      method:'PATCH',
      headers:{'Content-type':'application/json'},
      body:JSON.stringify({correctIndex:newCorrectIndex})
    })
    .then((res)=>res.json())
    .catch((err)=>console.error('Error Fetching:',err));
  }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? <QuestionForm onAddQuestion={addQuestion}/> : <QuestionList questions={questions} onDelete={handleDelete} onAnswerChange={answerChange}/>}
      
      
    </main>
  );
}

export default App;

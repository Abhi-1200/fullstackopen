// const http = require('http')

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes));
// })

// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)

const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.static("dist"))
app.use(cors());
app.use(express.json());

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger);

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

app.get("/notes",(req,res)=>{
    res.json(notes);
})
app.get("/notes/:id",(req,res)=>{
  const numId = Number(req.params.id);
  const note = notes.find(n=>n.id===numId);
  if(note)res.json(note);
  else res.status(404).end();
})

const getId = ()=>{
  return Math.max(...notes.map(n=>n.id));
}

app.post("/notes",(req,res)=>{
  const note = req.body;
  if(!note.content){
    res.status(400).json({error : "content missing"})
  }
  else{
    note.id = getId()+1;
    notes = [...notes,note];
    res.json(note);
  }
})

app.delete("/notes/:id",(req,res)=>{
  const numId = Number(req.params.id);
  notes =  notes.filter(n=>n.id!==numId);
  res.status(204).end();
})

const unknownEndPoint = (req,res)=>{
  res.status(404).send({"error" : "unknown endpoint"})
}
app.use(unknownEndPoint);

const PORT = 3001
app.listen(PORT,()=>{
    console.log(`Server serving on port ${PORT}`);
})
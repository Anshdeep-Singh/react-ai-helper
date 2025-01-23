const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
export const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              {text: "[{\"content\":\"Create a TODO App\",\"role\":\"user\"}]'You are a AI Assistant and experience in React Development.\nGUIDELINES:\n- Tell user what your are building\n- response less than 15 lines. \n- Skip code examples and commentary'"},
            ],
          },
          {
            role: "model",
            parts: [
              {text: "```json\n[\n  {\n    \"response\": \"I'm creating a simple TODO app using React. It will allow you to add, remove, and mark tasks as complete.\"\n  }\n]\n```"},
            ],
          },
        ],
      });

export const chatSessionAiFiles = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Create a ToDo App #### \nGenerate a programming code structure for a React project using Vite. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, without any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from \"lucide-react\" and use it in JSX as <Heart className=\"\" />.\n\nReturn the response in JSON format with the following schema:\n\njson\nCopy code\n{\n  \"projectTitle\": \"\",\n  \"explanation\": \"\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"\"\n    },\n    ...\n  },\n  \"generatedFiles\": []\n}\nEnsure the files field contains all created files, and the generatedFiles field lists all the filenames. Each file's code should be included in the code field, following this example:\nfiles:{\n  \"/App.js\": {\n    \"code\": \"import React from 'react';\\nimport './styles.css';\\nexport default function App() {\\n  return (\\n    <div className='p-4 bg-gray-100 text-center'>\\n      <h1 className='text-2xl font-bold text-blue-500'>Hello, Tailwind CSS with Sandpack!</h1>\\n      <p className='mt-2 text-gray-700'>This is a live code editor.</p>\\n    </div>\\n  );\\n}\"\n  }\n}\n  Additionally, include an explanation of the project's structure, purpose, and functionality in the explanation field. Make the response concise and clear in one paragraph.\n  - When asked then only use this package to import, here are some packages available to import and use (date-fns,react-chartjs-2,\"firebase\",\"@google/generative-ai\" ) only when it required\n  \n  - For placeholder images, please use a https://archive.org/download/placeholder-image/placeholder-image.jpg\n  -Add Emoji icons whenever needed to give good user experinence\n  - all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\n- By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\n- Use icons from lucide-react for logos.\n\n- Use stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags. ##### Past File History #####\n \n"},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n{\n  \"projectTitle\": \"ToDo App\",\n  \"explanation\": \"This project implements a simple ToDo application using React with Vite, styled using Tailwind CSS. It features components for managing a list of tasks, adding new tasks, marking tasks as complete, and deleting tasks. Icons from lucide-react are used for visual cues, enhancing the user interface. The app is designed to be functional and visually appealing, adhering to the specified requirements for production-ready quality.\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"import React, { useState, useEffect } from 'react';\\nimport TaskList from './components/TaskList';\\nimport AddTask from './components/AddTask';\\nimport Header from './components/Header';\\nimport Footer from './components/Footer';\\n\\nfunction App() {\\n  const [tasks, setTasks] = useState(() => {\\n    const savedTasks = localStorage.getItem('tasks');\\n    return savedTasks ? JSON.parse(savedTasks) : [];\\n  });\\n\\n  useEffect(() => {\\n    localStorage.setItem('tasks', JSON.stringify(tasks));\\n  }, [tasks]);\\n\\n  const addTask = (text) => {\\n    setTasks([...tasks, { id: Date.now(), text, completed: false }]);\\n  };\\n\\n  const toggleComplete = (id) => {\\n    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));\\n  };\\n\\n  const deleteTask = (id) => {\\n    setTasks(tasks.filter(task => task.id !== id));\\n  };\\n\\n  return (\\n    <div className=\\\"min-h-screen bg-gray-100 flex flex-col\\\">\\n     <Header />\\n      <div className=\\\"container mx-auto p-4 flex-grow\\\">\\n        <AddTask onAddTask={addTask} />\\n        <TaskList tasks={tasks} onToggleComplete={toggleComplete} onDeleteTask={deleteTask} />\\n      </div>\\n     <Footer />\\n    </div>\\n  );\\n}\\n\\nexport default App;\"\n    },\n    \"/components/TaskList.js\": {\n      \"code\": \"import React from 'react';\\nimport { Trash, Check } from 'lucide-react';\\n\\nfunction TaskList({ tasks, onToggleComplete, onDeleteTask }) {\\n  if (tasks.length === 0) {\\n    return <p className=\\\"text-center mt-4 text-gray-500\\\">No tasks yet. Add some!</p>;\\n  }\\n  \\n  return (\\n    <ul className=\\\"mt-4\\\">\\n      {tasks.map((task) => (\\n        <li key={task.id} className=\\\"flex justify-between items-center bg-white shadow rounded p-4 mb-2\\\">\\n          <div className=\\\"flex items-center\\\">\\n            <input type=\\\"checkbox\\\" checked={task.completed} onChange={() => onToggleComplete(task.id)} className=\\\"mr-2\\\"/>\\n            <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-800'}>{task.text}</span>\\n          </div>\\n          <button onClick={() => onDeleteTask(task.id)} className=\\\"text-red-500 hover:text-red-700 focus:outline-none\\\">\\n            <Trash className=\\\"h-5 w-5\\\"/>\\n          </button>\\n        </li>\\n      ))}\\n    </ul>\\n  );\\n}\\n\\nexport default TaskList;\"\n    },\n    \"/components/AddTask.js\": {\n      \"code\": \"import React, { useState } from 'react';\\nimport { Plus } from 'lucide-react';\\n\\nfunction AddTask({ onAddTask }) {\\n  const [text, setText] = useState('');\\n\\n  const handleSubmit = (e) => {\\n    e.preventDefault();\\n    if (text.trim()) {\\n      onAddTask(text);\\n      setText('');\\n    }\\n  };\\n\\n  return (\\n    <form onSubmit={handleSubmit} className=\\\"flex mt-4\\\">\\n      <input\\n        type=\\\"text\\\"\\n        value={text}\\n        onChange={(e) => setText(e.target.value)}\\n        placeholder=\\\"Add a task...\\\" \\n        className=\\\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2\\\"\\n      />\\n      <button type=\\\"submit\\\" className=\\\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline\\\">\\n       <Plus className=\\\"h-5 w-5 inline-block\\\"/>\\n        Add\\n      </button>\\n    </form>\\n  );\\n}\\n\\nexport default AddTask;\"\n    },\n     \"/components/Header.js\": {\n      \"code\": \"import React from 'react';\\nimport {  CheckSquare } from 'lucide-react';\\n\\nfunction Header() {\\n  return (\\n    <header className=\\\"bg-blue-600 p-4 text-white shadow-md\\\">\\n      <div className=\\\"container mx-auto flex items-center justify-between\\\">\\n        <h1 className=\\\"text-xl font-bold flex items-center\\\">\\n        <CheckSquare className=\\\"h-6 w-6 mr-2\\\"/> ToDo App\\n        </h1>\\n      </div>\\n    </header>\\n  );\\n}\\n\\nexport default Header;\"\n    },\n     \"/components/Footer.js\": {\n      \"code\": \"import React from 'react';\\n\\nfunction Footer() {\\n  return (\\n    <footer className=\\\"bg-gray-800 text-white text-center p-4 mt-8\\\">\\n      <p>&copy; {new Date().getFullYear()} ToDo App. All rights reserved.</p>\\n    </footer>\\n  );\\n}\\n\\nexport default Footer;\"\n    }\n  },\n    \"generatedFiles\": [\n      \"/App.js\",\n      \"/components/TaskList.js\",\n      \"/components/AddTask.js\",\n      \"/components/Header.js\",\n       \"/components/Footer.js\"\n  ]\n}\n```"},
      ],
    },
  ],
});
  

const InputChat = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");
const chatBotToggler = document.querySelector(".chatbot-toggler");
const chatBotCloseBtn = document.querySelector(".close-btn");

let userMessage;
// get API Key from https://aistudio.google.com/app/apikey
const API_KEY = "AIzaSyAQEriUQOtA_cxVz9Ck50Ygo0yiQNeVSrU";

const createChatLi = (message, className) =>{

    //creating the new list with the message and classname.
    const ChatList = document.createElement("li");
    ChatList.classList.add("chat",className);
    let chatContent = className === "outgoing" ? `<p></p>`:`<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    ChatList.innerHTML = chatContent;
    ChatList.querySelector("p").textContent = message; //now the message will be set as a text of the paragraph irrespective of whether it contains a html tag or not.
    return ChatList;
}

const generateResponse = (incomingChatLi)=> {
    //google Gemini API
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
    const chatMessage = incomingChatLi.querySelector("p"); 

 const requestOptions = {
    method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ 
    contents: [{ 
      role: "user", 
      parts: [{ text: userMessage }] 
    }] 
  }),
 }

 //sending request to API and getting response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        chatMessage.textContent = data.candidates[0].content.parts[0].text; // Update message text with API response
    }).catch((error) => {
        chatMessage.textContent = "Ohh ho ho...Kuch to gadbad ho gyi, Try Again";
    }).finally(() =>     chatBox.scrollTo(0,chatBox.scrollHeight));
}

const handleChat = () => {
    userMessage = InputChat.value.trim();
    if(!userMessage) return;

    InputChat.value = "";
    // append the user's message to the chatBox
    chatBox.appendChild(createChatLi(userMessage,"outgoing"));
    chatBox.scrollTo(0,chatBox.scrollHeight);

    setTimeout(() => {
        // Display "Thinking..." message while thinking for the response
        const incomingChatLi = createChatLi("Thinking...","incoming");
        chatBox.appendChild(incomingChatLi);
        chatBox.scrollTo(0,chatBox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatBotToggler.addEventListener("click",() => document.body.classList.toggle("show-chatbot"));
chatBotCloseBtn.addEventListener("click",() => document.body.classList.remove("show-chatbot"));
sendChatBtn.addEventListener("click", handleChat);

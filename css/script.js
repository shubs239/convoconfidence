//document.addEventListener("DOMContentLoaded", function() {

const scenarios = [
    {
        "id": "coffeeShop",
        "name": "Coffee Shop",
        "description": "You're in a cozy coffee shop and notice someone sitting alone. Strike up a casual conversation!",
        "starterMessages": [
            "Isn't the coffee here just amazing?",
            "I can never decide what to order here. Any recommendations?",
            "Do you mind if I join you while I wait for my order?"
        ],
        "isFree": true,
        "languages": ["English", "Hindi", "Spanish"]
    },
    {
        "id": "bookstore",
        "name": "Bookstore",
        "description": "You find yourself in a bookstore and see someone browsing your favorite genre.",
        "starterMessages": [
            "Have you read any of these authors? I'm looking for recommendations.",
            "I noticed you're checking out books I love. Any all-time favorites?",
            "I'm trying to find a good read, any suggestions?"
        ],
        "isFree": false,
        "languages": ["English", "German", "French"]
    },
    {
        "id": "dogpark",
        "name": "Dog Park",
        "description": "You're at a dog park and see someone with an adorable dog.",
        "starterMessages": [
            "Your dog looks so friendly! What's his name?",
            "Do you come here often? I'm looking for tips on dog socializing.",
            "I love your dog's energy! What breed is he?"
        ],
        "isFree": true,
        "languages": ["English", "Italian", "Japanese"]
    },
    {
        "id": "gym",
        "name": "Gym",
        "description": "You're at the gym and see someone who seems to know their workout routine well.",
        "starterMessages": [
            "I see you're into intense workouts. Got any tips for a beginner?",
            "How do you stay so motivated for fitness?",
            "Do you recommend any specific exercises for building stamina?"
        ],
        "isFree": false,
        "languages": ["English", "Russian", "Mandarin"]
    },
    {
        "id": "public-transport",
        "name": "Public Transport",
        "description": "You're on a bus or train and sit next to someone interesting.",
        "starterMessages": [
            "Long journey ahead? What's a good way to pass the time?",
            "I can't help but notice the book you're reading. Is it as good as it looks?",
            "Do you know if this route has any interesting stops along the way?"
        ],
        "isFree": true,
        "languages": ["English", "Portuguese", "Dutch"]
    },
    {
        "id": "social-event",
        "name": "Social Event",
        "description": "You're at a social event and find an opportunity to talk to someone new.",
        "starterMessages": [
            "This event has been great so far. What brings you here?",
            "Have you tried the food? The appetizers are amazing!",
            "I'm here to meet new people, what about you?"
        ],
        "isFree": false,
        "languages": ["English", "Swedish", "Korean"]
    }
]
let timerStarted = false;
let countdown;
let timerPaused= false;
let remainingTime = 5;
let activeScenario = null;
let timer = null;
let chatHistories = {};
let loggedIn=false;
let onceDone = false;

//

function openScenarioModal(scenarioId) {
    if (activeScenario !== scenarioId) {
        // New scenario selected, reset timer and load new content
        //chatHistories={}
        if (! loggedIn) {
            document.getElementById('signup-form').style.display = 'none';
        
    // Optionally disable the message input and send button
            document.getElementById('chat-input').disabled = false;
            document.getElementById('send-message').disabled = false;
        }
        else if(loggedIn){
            document.getElementById('chat-input').disabled = false;
            document.getElementById('send-message').disabled = false;
        }
        
        resetTimer();
        updateModalContent(scenarioId);
        activeScenario = scenarioId;
        timerStarted=false;
    } else if (timerPaused) {
        // Resuming the same scenario
        startTimer(remainingTime);
        timerPaused = false;
    }
    
    // Show the modal
    //new bootstrap.Modal(document.getElementById('staticBackdrop')).show();
}
//console.log(getChatHistory(),"login h kya?")

// function loadScenarioContent(scenarioId) {
//     // Find the scenario data (you need to implement getScenarioData)
//     const scenarioData = scenarios.find(selectedScenario => selectedScenario.id === scenarioId);

//     // Populate the modal with scenario details and starter messages
//     // Update modal's DOM elements accordingly
// }


document.querySelectorAll('.start-chatting').forEach(button => {
    button.addEventListener('click', function() {
      const scenario = this.getAttribute('data-scenario');
      //timerPaused = false;
      console.log(timerPaused,"start chatting wala")
      //console.log(isAuthenticated);
      console.log(remainingTime);
      if (timerPaused) {
        timerPaused = true
      } 
      openScenarioModal(scenario);
      document.getElementById("feedback-button").style.display='none';
      //updateModalContent(scenario);
      
    });
  });
  function setModalBackground(scenarioId) {
    const modal = document.querySelector('.modal-content');
    modal.style.backgroundImage = `url('./css/img/${scenarioId}-background.jpg')`;

    modal.style.backgroundSize = 'cover';
    modal.style.backgroundPosition = 'center';
  }
  function updateModalContent(scenario) {
    // Based on the scenario, update the modal's content
    //const modalBody = document.querySelector('#staticBackdrop .modal-body');
    
    const scenarioId = scenarios.find(selectedScenario => selectedScenario.id === scenario);
    setModalBackground(scenarioId.id);
    //console.log(scenarioId)
    //console.log(`${scenarioId.id}-background.jpg`)
    document.getElementById('suggested-messages').style.display = 'block';
    document.querySelector('.scenario-name').innerHTML = scenarioId.name;
    //console.log(document.querySelector("p.scenario-details").innerHTML)
    document.querySelector("p.scenario-details").innerHTML = scenarioId.description
    populateSuggestions(scenario)
    //console.log(scenario)
    
    document.getElementById('chat-area').style.display='none'; 
    //modalBody.innerHTML = '<p>Chat content for ' + scenario + ' will go here...</p>';
    // Update other parts of the modal as needed
  }





//Add comments here

document.getElementById('send-message').addEventListener('click', function() {
    // if (remainingTime<=0) {
    //     document.getElementById('send-message').disabled = true;
    // }else{
    //     document.getElementById('send-message').disabled = false;
    //const scenario = this.getAttribute('data-scenario');
    //console.log(getChatHistory(),"chathistory h")
    // }
    
    if(loggedIn && timerStarted){
        document.getElementById('chat-input').disabled = false;
    document.getElementById('send-message').disabled = false;
    }
    
    document.getElementById('suggested-messages').style.display = 'none';
    
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    //remainingTime=30
    //console.log(remainingTime)
    
    if (message !== "") {
        // Add user message
        if (!timerStarted) {
            console.log("timerStarted")
            startTimer(remainingTime); // 5 minutes
            timerStarted = true;
        }
         else if (timerPaused) {
            // Resume the timer
            startTimer(remainingTime);
            timerPaused = false;
            console.log("paused")
        }
        
        addUserMessage(message);
        
        // Clear the input field
        chatInput.value = "";

        // For demonstration, let's simulate an AI response
        // In a real application, this would be handled by your backend
        setTimeout(() => {
            const chatHistory = getChatHistory();
            chatHistory.push({ role: 'user', content: message });
            //addAiMessage("This is a response from AI.");
            callBackendApi(message, chatHistory, activeScenario).then(aiMessage => {
                addAiMessage(aiMessage);
                //console.log(scenario)
            });
        }, 1000); // Simulated delay
    }
});
function pauseTimer() {
    clearInterval(countdown);
    timerPaused = true;
}
function startTimer(time) {
    remainingTime = time;
    console.log(remainingTime)
    clearInterval(countdown); // Clear any existing timer

    countdown = setInterval(function () {
        remainingTime--;
        let minutes = parseInt(time / 60, 10);
        let seconds = parseInt(time % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById('timer').textContent = minutes + ":" + seconds;

        if (--time < 0) {
            clearInterval(countdown);
            if (!loggedIn) {
            document.getElementById('signup-form').style.display = 'block';
    // Optionally disable the message input and send button
            document.getElementById('chat-input').disabled = true;
            document.getElementById('send-message').disabled = true;
            }
        else if(loggedIn){
            console.log("timer off h")
            //startTimer(300);
            document.getElementById('chat-input').disabled = true;
            document.getElementById('send-message').disabled = true;
            document.getElementById("feedback-button").style.display='block';
        }
            
            
            
            // Handle what happens when the timer reaches 0
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    if(loggedIn){
        remainingTime = 60;
        document.getElementById('timer').textContent = "10:00";
    }
    else if(!loggedIn){
        remainingTime = 30;
        document.getElementById('timer').textContent = "05:00";
    }
     // Reset to 5 minutes
    timerPaused = false;
    // Reset timer display to 05:00
    
}
function addUserMessage(message) {
    const chatArea = document.getElementById('chat-area');
    chatArea.style.display='block';
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'user-message');
    const img = document.createElement('img');
    img.src = "ai_image.jpg"; // Replace with your AI image path
    img.alt = "AI";
    img.classList.add('message-img');
    messageDiv.appendChild(img);

    const messageTextDiv = document.createElement('div');
    messageTextDiv.classList.add('message-text');
    messageTextDiv.textContent = message;
    messageDiv.appendChild(messageTextDiv);
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    
    

    
}

function addAiMessage(message) {
    const chatArea = document.getElementById('chat-area');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'ai-message');

    const img = document.createElement('img');
    img.src = "ai_image.jpg"; // Replace with your AI image path
    img.alt = "AI";
    img.classList.add('message-img');
    messageDiv.appendChild(img);

    const messageTextDiv = document.createElement('div');
    messageTextDiv.classList.add('message-text');
    messageTextDiv.textContent = message;
    messageDiv.appendChild(messageTextDiv);
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}
// ... (Existing JavaScript code)

document.getElementById('ok-button').addEventListener('click', function() {
    // Stop the timer
    //clearInterval(countdown);

    // Optionally reset the timer display or handle other logic
    //document.getElementById('timer').textContent = "05:00";
    const chatArea = document.getElementById('chat-area');
    chatArea.innerHTML = '';
    chatArea.style.display='block';
    pauseTimer()
    timerPaused = true;
    console.log(timerPaused,"close wala")
});



function populateSuggestions(id) {
    const suggestionList = document.getElementById('suggestion-list');
    // Clear existing suggestions
   
    const scenarioId = scenarios.find(scenario => scenario.id === id);
   //console.log(scenarioId.description)
     
   suggestionList.innerHTML = ''; 
   const suggestions = scenarioId ? scenarioId.starterMessages : [];
    suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        li.addEventListener('click', () => useSuggestedMessage(suggestion));
        suggestionList.appendChild(li);
        // const chatArea = document.getElementById('chat-area');
        // chatArea.style.display='block';
        // console.log("open chatArea")
    });
    //console.log(scenarioId.description)
}

function useSuggestedMessage(message) {
    const chatArea = document.getElementById('chat-area');
        chatArea.style.display='block';
        console.log("open chatArea")
    const chatInput = document.getElementById('chat-input');
    chatInput.value = message;
    // Simulate a message send click
    document.getElementById('send-message').click();
    startTimer(remainingTime)
    
    // Hide the suggested messages
   
    
}
  
// document.getElementById('submit-auth').addEventListener('click', function() {
//     // Handle the sign-up/login process here
//     console.log('Sign-up/login button clicked');
    

//     document.getElementById('signup-form').style.display = 'none';
//     document.getElementById('chat-input').disabled = false;
//     document.getElementById('send-message').disabled = false;
//     loggedIn = true;
//     // Restart the timer for another 5 minutes
//     startTimer(300);
//     document.getElementById("signup-navbar").innerHTML = document.getElementById("floatingInput").value;
//     // On successful sign-up/login, close the current modal and restart the chat timer
//     // Example: 
//      //new bootstrap.Modal(document.getElementById('signupLoginModal')).hide();
//     //  const signupLoginModal = new bootstrap.Modal(document.getElementById('signupLoginModal'));

//     //  // Hide the modal
//     //  signupLoginModal.hide();
//      //console.log(new bootstrap.Modal(signupLoginModal))
//     //startTimer(remainingTime+30); // Restart the timer for another 5 minutes
// });
async function callBackendApi(userInput, chatHistory,scenario) {
    try {
        const response = await fetch('http://localhost:7071/api/convoConfidenceMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify({
                user_input: userInput,
                chat_history: chatHistory,
                scenario: scenario
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.reply;
    } catch (error) {
        console.error('Error:', error);
        return "Sorry, something went wrong. Please try again.";
    }
}
async function callGetFeedback(chat_history){
    chat_history=getChatHistory();
    try {
        const response = await fetch('http://localhost:7071/api/getFeedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify({
                
                chat_history: chat_history
                
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data['feedback'];
    } catch (error) {
        console.error('Error:', error);
        return "Sorry, something went wrong. Please try again.";
    }
}


function getChatHistory() {
    const chatArea = document.getElementById('chat-area');
    const messages = chatArea.getElementsByClassName('message');
    const chatHistory = [];

    for (let message of messages) {
        const messageText = message.getElementsByClassName('message-text')[0].textContent;
        const role = message.classList.contains('user-message') ? 'user' : 'assistant';
        chatHistory.push({ role, content: messageText });
    }

    return chatHistory;
}

document.addEventListener("DOMContentLoaded", async () => {
    const auth0Client = await auth0.createAuth0Client({
        domain: "dev-06vpf2i8o7qo8p2r.us.auth0.com",
        clientId: "ef2jEI8EaScAS34hBvymnG9Kii15YA5Y",
        authorizationParams: {
            redirect_uri: "http://localhost:8000"// Use your application's URL here
        }
    });

       // Function to handle authentication callback
    async function handleAuthCallback() {
    if (location.search.includes("state=") && (location.search.includes("code=") || location.search.includes("error="))) {
        await auth0Client.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/");
    }
}

    // Call the function to handle the callback
    await handleAuthCallback();


    // Handle the authentication state
    const loginButton = document.getElementById("submit-auth");
    const loginButtonNavbar = document.getElementById("signup-navbar")

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        auth0Client.loginWithRedirect();
        loggedIn = true;
        console.log(loggedIn,"kjhhfcggh")
        //document.getElementById('signup-form').style.display = none;
        
    });
   
    loginButtonNavbar.addEventListener("click", (e) => {
        e.preventDefault();
        auth0Client.loginWithRedirect();
        loggedIn=true;
        console.log(loggedIn,"navbar walaa")
        document.getElementById('signup-form').style.display = none;
        remainingTime=600;
        startTimer(remainingTime);
        
    });
    // if (window.location.search.includes("state=") &&
    //     (window.location.search.includes("code=") ||
    //      window.location.search.includes("error="))) {
    //     await auth0Client.handleRedirectCallback();
    //     window.history.replaceState({}, document.title, window.location.pathname);
    // }

    const logoutButton = document.getElementById("logout");
    logoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        auth0Client.logout({ returnTo: "http://localhost:8000" });
    });

    const isAuthenticated = await auth0Client.isAuthenticated();
    //const userProfile = await auth0Client.getUser();

    const profileElement = document.getElementById("profile");
    //console.log(isAuthenticated)
    if (isAuthenticated) {
        const userProfile = await auth0Client.getUser();
        profileElement.style.display = "block";
        // profileElement.innerHTML = `
           
        //     <img src="${userProfile.picture}" alt="Profile Picture"/>
        // `;
        logoutButton.style.display = "block";
        
        // Update the navbar with the user's name
        signupNavbar = document.getElementById("signup-navbar")
        //console.log(signupNavbar)
        loggedIn=true;
        signupNavbar.textContent = userProfile.name;
    } else {
        signupNavbar = document.getElementById("signup-navbar")
        profileElement.style.display = "none";
        logoutButton.style.display = "none";
        
        // Ensure the default text is shown if the user is not authenticated
        signupNavbar.textContent = "Sign Up/Login";
    }
});
document.getElementById("call-feedback-button").addEventListener('click',async function(){

    try {
        const chatHistory = getChatHistory();
        const feedbackResponse = await callGetFeedback(chatHistory);
        
        // Assuming the feedback is in the 'feedback' property of the response
        document.getElementById("feedback-info").innerHTML = feedbackResponse;
        
        console.log("Feedback received:", feedbackResponse.feedback);
    } catch (error) {
        console.error("Error getting feedback:", error);
        document.getElementById("feedback-info").innerHTML = "Error retrieving feedback. Please try again.";
    }
});
//});
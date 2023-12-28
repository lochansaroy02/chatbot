
// collecting dom

const sendBtn = document.getElementById('button');
const inputBox = document.getElementById('inputBox');
const chatBox = document.getElementById('chatBox');
const statusBtn = document.getElementById('status');
const recordButton = document.getElementById('recordButton');
const audioPlayer = document.createElement('audio')


let mediaRecorder;
let recordedChunks = [];







const userData = { message: "" }


//check if bot is online or not 
const statusCheck = () => {
    var status = true;

    addEventListener("offline", () => {
        status = false
    });
    addEventListener("online", () => {
        status = true
    });

    status ? statusBtn.innerHTML = "online"
        : console.log("offline")
}
statusCheck();

// sample database 

let arrayOfPossibleAnswers = [
    {
        message: "hello",
        response: "Hii"
    },
    {
        message: "how are you?",
        response: "I am good"
    },
    {
        message: "who are you",
        response: "I am chatbot created by Lochan "
    },
    {
        message: "what can you do",
        response: "I can record audio! to test click on the mic "
    },
    {
        message: "record an audio",
        response: "sure! click on the mic and start recording"
    },
    {
        message: "record audio",
        response: "sure! click on the mic and start recording"
    }

]


//welcome messege logic 

function initialBotResponse() {
    const messgeBox = document.createElement('div')
    messgeBox.id = 'botMessageBox';
    messgeBox.innerHTML = "<h1> Hello! I'm your friendly chatbot. How can I assist you today? </h1>"
    chatBox.appendChild(messgeBox)

}
window.addEventListener('load', initialBotResponse);


//user messege box 

const sendMsg = (userMsg) => {
    const msgDiv = document.createElement('div')
    const messgeBox = document.createElement('div')

    msgDiv.id = 'msgDiv'
    messgeBox.id = 'userMessageBox';


    messgeBox.innerHTML = "<h1>" + userMsg + "</h1>"
    chatBox.appendChild(msgDiv)
    msgDiv.appendChild(messgeBox)


    chatBox.scrollTop = chatBox.scrollHeight;

}





//chat messege box

const chatBotResponse = (userMsg) => {
    let botMessage = "I'm sorry, I didn't understand that.";


    const result = arrayOfPossibleAnswers.find(item =>
        item.message && typeof item.message === 'string' &&
        item.message.toLowerCase() === userMsg.toLowerCase()
    );

    if (result) {
        botMessage = result.response;
    }

    const messageBox = document.createElement('div');
    messageBox.id = 'botMessageBox';
    messageBox.innerHTML = "<h1>" + botMessage + "</h1>";

    setTimeout(() => {
        chatBox.appendChild(messageBox);
    }, 2000);

    chatBox.scrollTop = chatBox.scrollHeight;
}


//  event fire when user click the send button 
sendBtn.addEventListener('click', (e) => {

    const text = inputBox.value;
    if (text == "") {
        alert("enter text ")
    } else {
        let userMsg = text.trim()
        userData.message = userMsg;
        inputBox.value = ""
        sendMsg(userMsg);

        chatBotResponse(userMsg);


    }
})

//event fire when user press enter key 
inputBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {

        const text = inputBox.value;
        if (text == "") {
            alert("enter text ")
        } else {
            let userMsg = text.trim()
            userData.message = userMsg;
            inputBox.value = ""
            sendMsg(userMsg);
            chatBotResponse(userMsg);
        }
    }
});


// recording audio logic 

recordButton.addEventListener('click', toggleRecording);

async function toggleRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        // Stop recording
        mediaRecorder.stop();
        console.log(mediaRecorder.state)
    } else {
        // Start recording
        recordedChunks = [];
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'audio/wav' });
            const userAudioUrl = URL.createObjectURL(blob);
            const userMsg = "Audio sent";
            sendMsg(userMsg);

            // Display the user's recorded audio


            const userAudio = document.createElement('audio');
            userAudio.src = userAudioUrl;
            userAudio.controls = true;

            setTimeout(() => {
                const messgeBox = document.createElement('div')
                messgeBox.innerHTML = "Audio message"
                messgeBox.id = 'botMessageBox'
                messgeBox.appendChild(userAudio)
                chatBox.appendChild(messgeBox);
                chatBox.scrollTop = chatBox.scrollHeight;
            }, 2000);


            chatBox.scrollTop = chatBox.scrollHeight;
        };

        mediaRecorder.start();
    }

    if (mediaRecorder.state === 'recording') {
        recordButton.style.background = '#3B82F6'
    }
    if (mediaRecorder.state === 'inactive') {
        recordButton.style.background = "#1F4586"
    }

}

const sendBtn = document.getElementById('button');
const inputBox = document.getElementById('inputBox');
const chatBox = document.getElementById('chatBox');
const statusBtn = document.getElementById('status');
const recordButton = document.getElementById('recordButton');
const audioPlayer = document.createElement('audio')


let mediaRecorder;
let recordedChunks = [];





const userData = { message: "" }



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
        response: "I am chatbot created By Lochan "
    },
    {
        message: "what can you do",
        response: "I can assist you with "
    },
    {

    }

]

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




function initialBotResponse() {
    const messgeBox = document.createElement('div')
    messgeBox.id = 'botMessageBox';
    messgeBox.innerHTML = "<h1>Welcome to the chatbot! How can I help you? </h1>"
    chatBox.appendChild(messgeBox)

}


window.addEventListener('load', initialBotResponse);



const chatBotResponse = (userMsg) => {

    let botMessege = ""
    if (userMsg.length > 4) {
        let result = arrayOfPossibleAnswers.filter(val => val.message.includes(userMsg.toLowerCase()));
        if (result.length > 0) {
            let response = result[0].response;
            botMessege = response;
        }
    }

    const messgeBox = document.createElement('div')
    messgeBox.id = 'botMessageBox';


    messgeBox.innerHTML = "<h1>" + botMessege + "</h1>"



    setTimeout(() => {
        chatBox.appendChild(messgeBox)

    }, 2000);

    chatBox.scrollTop = chatBox.scrollHeight;
}


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
            }, 2000);


            chatBox.scrollTop = chatBox.scrollHeight;
        };

        mediaRecorder.start();
        console.log(mediaRecorder.state)
    }

    if (mediaRecorder.state === 'recording') {
        recordButton.style.background = '#3B82F6'
    }
    if (mediaRecorder.state === 'inactive') {
        recordButton.style.background = "#1F4586"
    }

}

let timer;
let defaultMinutes = 1;
let defaultSeconds = 0;
let maximumStages = 4;
let minutes = 1;
let seconds = 0;
let isPaused = true;
let timerElement = document.getElementById('timer');
const pauseResumeButton = document.querySelector(".timer__clock-menu--play")
const playButton = document.querySelector(".play")
const pauseButton = document.querySelector(".stop")
let startCounter = 0;
let messageInput = document.getElementById("message");
let messageBlock = document.getElementById("messageBlock");
let stageItem = document.querySelector('.timer__clock-stage')
let stageItemElement = Array.from(stageItem.children)
let currentStage = 1;
let currentStageStatus = 'Focus';

let color = 0;

let messageArr = [];
let statusArr = [];

window.onload = () => {
    timerElement.innerText = defaultMinutes + ":" + defaultSeconds + "0";
}

let startTimer = () => {
    if (isPaused != true) {
    timer = setInterval(updateTimer, 1000)
    timer.textContent = minutes;
    }
}

let updateTimer = () => {
    timerElement.innerText = formatTime(minutes, seconds);

    if (minutes === 0 && seconds === 0) {
        clearInterval(timer);
        statusArr.push('Таймер #' + currentStage + " завершен")
        if (currentStage != maximumStages){
            stageItemElement[currentStage-1].classList.remove('inprogress')
            stageItemElement[currentStage-1].classList.add('complete')
            currentStage++;
            stageItemElement[currentStage-1].classList.add('inprogress')
        } else{
            statusArr.push('Сессия завершена')
            chatMessage(statusArr);
            stageItemElement[currentStage-1].classList.remove('inprogress')
            stageItemElement[currentStage-1].classList.add('complete')

            for (let i = 0; i < currentStage; i++){
                stageItemElement[i].classList.remove('complete')
            }
            currentStage = 1;
        }
    } else if (!isPaused){
        if (seconds > 0){
            seconds--;
        } else{
            seconds = 1;
            minutes--;
        }
    }
    chatMessage(statusArr);
}

function formatTime(minutes, seconds) {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}


let togglePauseResume = () => {
    isPaused = !isPaused;
    if (isPaused) {
        statusArr.push('Таймер поставлен на паузу')
        clearInterval(timer);
        playButton.classList.add('visually-hidden');
        pauseButton.classList.remove('visually-hidden');
    } else {
        statusArr.push('Таймер запущен')
        startTimer();
        playButton.classList.remove('visually-hidden');
        pauseButton.classList.add('visually-hidden');
    }
    chatMessage(statusArr);
}

function restartTimer() {
    clearInterval(timer);
    minutes = defaultMinutes;
    seconds = 0;
    isPaused = true;
    const timerElement = document.getElementById('timer');
    timerElement.innerText = formatTime(minutes, seconds);
    startTimer();
    statusArr.push('Таймер обнулен')
    chatMessage(statusArr);
}


startTimer();

let sendMessage = () => {
    let time = currentDate();
    let currentMessage;
    if (messageInput.value != ''){
        currentMessage =  time + ' - ' + messageInput.value;
    }
    let newMessage = document.createElement('li');
    newMessage.textContent = currentMessage;
    messageBlock.appendChild(newMessage);
    messageInput.value = '';
    messageArr.push(currentMessage);
    localStorage.setItem('localArray', JSON.stringify(messageArr));
}

document.getElementById('message').addEventListener('keydown', (event)=> {
    if (event.key === 'Enter'){
        sendMessage()
    }
})

let chatMessage = (chatArr) => {
    chatArr.map((chatArrElement)=>{
        let newChatBlock = document.createElement('li');
        newChatBlock.textContent = chatArrElement;
        messageBlock.appendChild(newChatBlock);
        if (chatArrElement === 'Таймер запущен'){
            newChatBlock.classList.add('lime');
        } else if(chatArrElement === 'Таймер обнулен'){
            newChatBlock.classList.add('error');
        } else {
            newChatBlock.classList.add('configMessage');
        }
    })
    statusArr = [];
}

let reloadMessages = () => {
    messageArr.map((messageArrElement) => {
        let newMessage = document.createElement('li');
        newMessage.textContent = messageArrElement;
        messageBlock.appendChild(newMessage);
    })
}

let reloadBlock = () => {
    const storedArray = localStorage.getItem('localArray');
    if (storedArray){
        messageArr = JSON.parse(storedArray);
        reloadMessages();
    } else{
    }
}

reloadBlock()

let currentDate = () => {
    let currentDate = new Date();
    return formatTime(currentDate.getHours(), currentDate.getMinutes())
}

let clearChat = () => {
    messageBlock.innerHTML = ''
    localStorage.clear('localArray');
}


let colorMode = () => {
    if (color == 1){
        lightMode();
        color--;
    } else {
        darkMode();
        color++;
    }
    localStorage.setItem('colorMode', JSON.stringify(color));
}

let lightMode = () => {
    document.documentElement.style.setProperty('--color-background', "#FAFAFA");
    document.documentElement.style.setProperty('--color-border', "#E4E4E7");
    document.documentElement.style.setProperty('--color-border-2', "#F4F4F5");
    document.documentElement.style.setProperty('--color-light-1', "#27272A");
    document.documentElement.style.setProperty('--color-light-2', "#52525B");
    document.documentElement.style.setProperty('--color-light-3', "#71717A");
}

let darkMode = () => {
    document.documentElement.style.setProperty('--color-background', "#18181B");
    document.documentElement.style.setProperty('--color-border', "#27272A");
    document.documentElement.style.setProperty('--color-border-2', "#3F3F46");
    document.documentElement.style.setProperty('--color-light-1', "#E4E4E7");
    document.documentElement.style.setProperty('--color-light-2', "#A1A1AA");
    document.documentElement.style.setProperty('--color-light-3', "#71717A");
}

let checkMode = () => {
    color = localStorage.getItem('colorMode')
    console.log(color)

    if (color == 0){
        lightMode();
    } else {
        darkMode();
    }
}

checkMode()
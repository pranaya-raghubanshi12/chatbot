document.getElementById("platform-select").addEventListener("change", (event) => {
    switch (event.target.value) {
        case 'claude':
            document.getElementById('claude-model-select').style.display = 'block';
            document.getElementById('openai-model-select').style.display = 'none';
            break;

        case 'openai':
            document.getElementById('claude-model-select').style.display = 'none';
            document.getElementById('openai-model-select').style.display = 'block';
            break;

        default:
            break;
    }
});

document.getElementById("user-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") { // Check if the pressed key is "Enter"
        sendMessage();
    }
});

function getSelectedAIModel() {
    const modelElements = document.getElementsByClassName("model-select");
    const selectedModelElements = Array.from(modelElements).filter((element) => {
        return element.style.display !== "none" && element.offsetParent !== null;
    });
    if (selectedModelElements.length == 0) return;
    const selectedModelElement = selectedModelElements[0];
    return selectedModelElement.value;
}

function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput !== "") {
        // Display user message
        displayMessage(userInput, 'user');

        // Clear the input field
        document.getElementById('user-input').value = "";

        // Get selected model
        const loadingMessageElement = displayLoadingBotMessage();
        // Make a POST request to the server
        fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userInput,
                model: getSelectedAIModel()
            })
        })
            .then(response => response.json())
            .then(data => {
                // Display bot response
                loadingMessageElement.remove();
                displayMessage(data.message, 'bot');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

function displayMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    if (sender === 'user') {
        messageElement.classList.add('user-message');
        messageElement.textContent = message;
    } else {
        messageElement.classList.add('bot-message');
        messageElement.textContent = message;
    }

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
}

function displayLoadingBotMessage() {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('loader');

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
    return messageElement;
}
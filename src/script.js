document.addEventListener('DOMContentLoaded', function () {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.scripting.executeScript(
			{
				target: { tabId: tabs[0].id },
				function: getTextFromTextarea,
			},
			function (results) {
				const text = results[0].result;
				sendDataToServer(text);
			}
		);
	});
});

function getTextFromTextarea() {
	const textarea = document.getElementById('prompt-textarea');
	if (!textarea) {
		return '';
	}
	const prompt = textarea.value.split('\n')[0];
	return prompt;
}

function sendDataToServer(text) {
	console.log(text);

	const promptBox = document.getElementById('user-prompt-box');
	promptBox.innerText = text;
	fetch('http://213.173.98.21:8000/optimize-prompt-llm/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ prompt: text }),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			document.getElementById('optimized-prompt-box').innerText =
				data.optimizedPrompt;
		})
		.catch((error) => {
			console.error('Error:', error);
			document.getElementById('error-box').innerText =
				'Error fetching from API.';
		});
}

document.getElementById('replace-btn').addEventListener('click', function () {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		const optimizedPrompt = document.getElementById(
			'optimized-prompt-box'
		).innerText;
		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			function: (optimizedPrompt) => {
				const textarea = document.getElementById('prompt-textarea');
				const prompts = textarea.value.split('\n');
				prompts[0] = optimizedPrompt;
				textarea.value = prompts.join('\n');
			},
			args: [optimizedPrompt],
		});
	});
});

// function replacePrompt() {
// 	console.log('HERHERBAEIJBRAEIUOBT');
// 	const textarea = document.getElementById('prompt-textarea');
// 	console.log(textarea);
// 	const optimizedPrompt = document.getElementById(
// 		'optimized-prompt-box'
// 	).innerText;

// 	let originalPrompt = textarea.value;
// 	originalPrompt = originalPrompt.split('\n');
// 	originalPrompt[0] = optimizedPrompt;
// 	textarea.value = originalPrompt.join('\n');
// };

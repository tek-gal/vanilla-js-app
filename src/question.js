class Question {
  static create(question) {
    return fetch('https://vanilla-js-app-7ffa1.firebaseio.com/questions.json', {
      method: 'POST',
      body: JSON.stringify(question),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        question.id = response.name;
        return question;
      })
      .then(addToLocalStorage)
      .then(Question.renderList);
  }

  static renderList() {
    const questions = getQuestionsFromLocalStorage();
    const html = questions.length
      ? questions.map(toCard).join('')
      : '<div class="mui--text-headline">No questions yet</div>';
    const list = document.getElementById('list');
    list.innerHTML = html;
  }

  static fetch(token) {
    if (!token) {
        return Promise.resolve(`<p class="error">No token</p>`);
    }

    const url = `https://vanilla-js-app-7ffa1.firebaseio.com/questions.json?auth=${token}`;
    return fetch(url)
      .then((response) => response.json())
      .then((response) => {
        if (response && response.error) {
          return `<p class="error">${response.error}</p>`;
        }

        return response
          ? Object.keys(response).map((key) => ({
            ...response[key],
            id: key,
          }))
          : [];
      })
  }

  static listToHTML(questions) {
    return questions.length
      ?  `<ul>${questions.map((q) => `<li>${q.text}</li>`).join('')}</ul>`
      : '<p>No questions yet</p>';
  }
}


function addToLocalStorage(question) {
  const allQuestions = getQuestionsFromLocalStorage();
  allQuestions.push(question);
  localStorage.setItem('questions', JSON.stringify(allQuestions));
}

function getQuestionsFromLocalStorage() {
  const data = localStorage.getItem('questions');
  const parsed = JSON.parse(data || '[]');
  return parsed;
}

function toCard(question) {
  return `
  <div class="mui--text-black-54">
  ${new Date(question.date).toLocaleDateString()}
  ${new Date(question.date).toLocaleTimeString()}
  </div>
  <div>${question.text}</div>
  <br>
  `;
}

export { Question };

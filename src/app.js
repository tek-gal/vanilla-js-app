import './styles.css';
import { Question } from './question';
import { isValid, createModal } from './utils';
import { getAuthForm, authWithEmailAndPassword } from './auth';

const form = document.getElementById('form');
const modalBtn = document.getElementById('modal-btn');
const input = form.querySelector('#question-input');
const submit = form.querySelector('#submit');

window.addEventListener('load', Question.renderList);
form.addEventListener('submit', handleSubmitForm);
input.addEventListener('input', () => {
  submit.disabled = !isValid(input.value);
});
modalBtn.addEventListener('click', openModal);


function handleSubmitForm(event) {
  event.preventDefault();
  const text = input.value.trim();

  if (isValid(text)) {
    const question = {
      text,
      date: new Date().toJSON(),
    };

    submit.disabled = true;
    Question
      .create(question)
      .then((response) => {
        input.value = '';
        submit.disabled = false;
      });
  }
}

function openModal() {
  createModal('Authorization', getAuthForm());
  document
    .getElementById('auth-form')
    .addEventListener('submit', handleAuthForm, { once: true });
}

function handleAuthForm(event) {
  event.preventDefault();

  const btn = event.target.querySelector('button');
  btn.disabled = true;

  const email = event.target.querySelector('#email').value;
  const password = event.target.querySelector('#password').value;

  authWithEmailAndPassword(email, password)
    .then(Question.fetch)
    .then(renderModalAfterAuth)
    .then(() => btn.disabled = false);
}

function renderModalAfterAuth(content) {
  if (typeof content === 'string') {
    createModal('error', content);
  } else {
    createModal('Questions', Question.listToHTML(content));
  }
}

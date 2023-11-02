import { VacancyPosting, Candidate, VacancyApplication } from "../module";
import { lookupCEPAndProcessResponse } from "../cep_api";
import * as check from "../validations";
import axios from 'axios';

// ********* intro_candidate.html *********


const modal = document.getElementById("modal");
const behindModal = document.getElementById("behind-modal");
const btnRegisterC = document.getElementById("register-c");
const btnShowProfileC = document.getElementById("show-profile-c");
const btnExitModal = document.getElementById("exitModal");

function redirectToCandidateRegistration() {
  window.location.href = "candidate_registration.html";
}

function showModal() {
  if (modal) modal.style.display = "flex";

  if (behindModal) behindModal.classList.add("modalBlur");
}

function hideModal() {
  if (modal) modal.style.display = "none";

  if (behindModal) behindModal.classList.remove("modalBlur");
}

if (btnRegisterC)
  btnRegisterC.addEventListener("click", redirectToCandidateRegistration);

if (btnShowProfileC)
  btnShowProfileC.addEventListener("click", showModal);

if (btnExitModal)
  btnExitModal.addEventListener("click", hideModal);

async function handleSignInClick() {
  // let candCheck: any = localStorage.getItem("candidateLocal");
  let userName: HTMLInputElement = check.getInput("userName") as HTMLInputElement;
  let userPass: HTMLInputElement = check.getInput("userPass") as HTMLInputElement;

  if (!userName || !userPass) {
    alert("Error: campo vazio");
    return;
  }

  const username = userName.value;
  const password = userPass.value;
  const url = "/app/loginCandidate";

  try {
    const loginResult = await check.isLoginValid(username, password, url);

    if (!loginResult) {
      alert("Error: login ou senha inválido");
      return;
    }

    window.location.href = "candidate_profile.html";
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

const btnSignIn = document.getElementById("sigIn");

if (btnSignIn)
  btnSignIn.addEventListener("click", handleSignInClick);


// ********* candidate_registration.html *********


const btnRegister = document.getElementById("register");

function handleRegisterButtonClick() {
  if (saveCandidateData())
    redirectToCandidateProfile();
}

function redirectToCandidateProfile() {
  window.location.href = "candidate_profile.html";
}

if (btnRegister) {
  btnRegister.addEventListener("click", handleRegisterButtonClick);
}

var isValidCep = false;

const cepInput = check.getInput("cep");
if (cepInput) {
  cepInput.addEventListener('focusout', async () => {
    isValidCep = await lookupCEPAndProcessResponse(processCEPData);

  });
}

function validateInputFields(): boolean {

  const nameInput = check.getInput("name");
  const emailInput = check.getInput("email");
  const skillsInput = check.getInput("skills");
  const ageInput = check.getInput("age");
  const cpfInput = check.getInput("cpf");
  const stateInput = check.getInput("uf");
  const cepInput = check.getInput("cep");
  const passwordInput = check.getInput("password");
  const descriptionInput = check.getInput("description");


  if (
      check.isEmpty(nameInput) ||
      check.isEmpty(emailInput) ||
      check.isEmpty(skillsInput) ||
      check.isEmpty(ageInput) ||
      check.isEmpty(cpfInput) ||
      check.isEmpty(cepInput) ||
      check.isEmpty(passwordInput) ||
      check.isEmpty(descriptionInput) ||
      check.isEmpty(stateInput)
  ) {

    alert("Error: Nenhum campo pode estar vazio");

    return false;
  }

  const isSuccessful =
      check.validateInput(nameInput, "nome") &&
      check.validateCpf(cpfInput) &&
      check.validateAge(ageInput) &&
      isValidCep &&
      check.validateDescription(descriptionInput) &&
      check.validateEmail(emailInput);

  if (!check.validatePasswordLength(passwordInput))
    return false;

  return isSuccessful;
}

function clearAddressFields(): void {
  let neighborhoodInput: HTMLInputElement | null = document
      .getElementById('neighborhood') as HTMLInputElement | null;
  let stateInput: HTMLInputElement | null = document
      .getElementById('uf') as HTMLInputElement | null;

  if (neighborhoodInput && stateInput) {
    neighborhoodInput.value = "";
    stateInput.value = "";
  }
}

function processCEPData(content: any) {
  if (!content.hasOwnProperty('erro')) {
    let neighborhoodInput: HTMLInputElement | null = document
        .getElementById('neighborhood') as HTMLInputElement | null;
    let stateInput: HTMLInputElement | null = document
        .getElementById('uf') as HTMLInputElement | null;

    if (neighborhoodInput && stateInput) {
      neighborhoodInput.value = content.bairro;
      stateInput.value = content.uf;
      return true;
    }
  }
  else {
    clearAddressFields();
    alert("Error: CEP não encontrado.");
    return false;
  }
}

function saveCandidateData(): boolean {
  if (validateInputFields()) {

    const nameInput = check.getInput("name");
    const emailInput = check.getInput("email");
    const skillsInput = check.getInput("skills");
    const ageInput = check.getInput("age");
    const cpfInput = check.getInput("cpf");
    const cepInput = check.getInput("cep");
    const stateInput = check.getInput("uf");
    const passwordInput = check.getInput("password");
    const descriptionInput = check.getInput("description");

    const skills = check.parseSkillsInput(skillsInput);

    if (
        !nameInput || !emailInput || !skillsInput ||
        !ageInput || !cpfInput || !cepInput ||
        !passwordInput || !descriptionInput || !stateInput
    ) {
      alert("Error: campo vazio");
      return false;
    }

    const candidateLocal = {
      "name": nameInput.value,
      "age": parseInt(ageInput.value, 10),
      "email": emailInput.value,
      "skills": Array.from(skills)
          .join()
          .toLowerCase()
          .trim()
          .split(/[;, ]+/),
      "description": descriptionInput.value,
      "state": stateInput.value,
      "cpf": cpfInput.value,
      "cep": parseInt(cepInput.value, 10),
      "password": passwordInput.value,
      // applications: null,
    };

    sendRegisterCandidate(JSON.stringify(candidateLocal));

    localStorage.setItem("candidateLocal", JSON.stringify(candidateLocal));

    return true;
  }
  return false;
}

function sendRegisterCandidate(data: any) {
  axios.post('/app/registerCandidate', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        if (response.status === 201) {
          console.log("Cadastro realizado!");
        } else {
          throw new Error('Request Error');
        }
      })
      .catch(error => {
        alert(error.message);
      });
}



// ********* candidate_vacancies *********


function updateVacancy() {
  const companyLocal = localStorage.getItem("companyLocal");
  const candidateLocal = localStorage.getItem("candidateLocal");
  const parentDiv = document.querySelector(".grid");

  if (!companyLocal || !candidateLocal)
    return;

  const compObj = JSON.parse(companyLocal);
  const candiObj = JSON.parse(candidateLocal);

  if (!compObj.vacancy || !compObj.vacancy.skills || !candiObj.skills)
    return;

  const matchingSkills = compObj.vacancy.skills.filter((skill: string) =>
      candiObj.skills.includes(skill)
  );


  if (parentDiv) {
    var matchPercentage: number = (matchingSkills.length / compObj.vacancy.skills.length) * 100
    parentDiv.innerHTML = ` <div id="vacancies">
      <div class="vacancies-detail">
        <div class="title">
          <h3 id="titleVacancy">${compObj.vacancy.name}</h3>
          <p id="dateVacancy">${compObj.vacancy.date}</p>
        </div>
        <p id="match">Match: ${matchPercentage.toFixed(2).toString()}%</p>
        <!-- <i class="ph-fill ph-heart"></i> -->
      </div>
    </div>`
  }
}

updateVacancy();

document.addEventListener('DOMContentLoaded', function() {
  let vacancyLink: HTMLElement | null = document.getElementById("vacancyLink");

  if (vacancyLink) {
    vacancyLink.addEventListener('click', function() {
      updateVacancy();
    });
  }
});


// ********* candidate_profile *********


function generateTable() {
  let tbody: HTMLTableSectionElement | null = document.querySelector("tbody");
  let row: Element | null = document.querySelector("tbody tr");
  let table: HTMLTableElement | null = document.querySelector("table")

  let c0: HTMLTableCellElement = document.createElement('td');
  let c1: HTMLTableCellElement = document.createElement('td');
  let c2: HTMLTableCellElement = document.createElement('td');

  let company: string | null = localStorage.getItem("companyLocal");

  if (company)
    var compObj = JSON.parse(company);

  if (compObj.vacancy) {

    c0.innerText = compObj.vacancy.name;
    c1.innerText = "x";
    c2.innerText = compObj.vacancy.skills;

    row?.appendChild(c0);
    row?.appendChild(c1);
    row?.appendChild(c2);

    if (row && tbody) {
      tbody?.appendChild(row);
      table?.appendChild(tbody);
    }
  }
}

generateTable();
import { VacancyPosting, Company } from "../module";
import ApexCharts from 'apexcharts';
import * as check from "../validations";
import { lookupCEPAndProcessResponse } from "../cep_api";
import axios from 'axios';


// ******* intro_company.html *******


let registerCompanyButton = document.getElementById("register-comp");
let showProfileCompanyButton = document.getElementById("show-prof-comp");
let exitModalButton = document.getElementById("exitModal");

registerCompanyButton?.addEventListener("click", redirectToCompanyRegistration);
showProfileCompanyButton?.addEventListener("click", showModal);
exitModalButton?.addEventListener("click", hideModal);

function redirectToCompanyRegistration() {
    window.location.href = "./company_registration.html";
}

function showModal() {
    let modalElement = document.getElementById("modal");
    let behindModalElement = document.getElementById("behind-modal");

    if (modalElement)
        modalElement.style.display = "flex";

    if (behindModalElement)
        behindModalElement.classList.add("modalBlur");
}

function hideModal() {
    let modalElement = document.getElementById("modal");
    let behindModalElement = document.getElementById("behind-modal");

    if (modalElement)
        modalElement.style.display = "none";

    if (behindModalElement)
        behindModalElement.classList.remove("modalBlur");
}

async function handleSignInClick(){
    // let compCheck = localStorage.getItem("companyLocal");
    let compName = check.getInput("companyUser") as HTMLInputElement;
    let compPass = check.getInput("companyPass") as HTMLInputElement;

    if (!compName || !compPass) {
        alert("Error: campo vazio");

        return;
    }
    // const compObj = JSON.parse(compCheck);

    const username = compName.value;
    const password = compPass.value;
    const url = "/app/loginCompany";

    try {
        const loginResult = await check.isLoginValid(username, password, url);

        if (!loginResult) {
            alert("Error: login ou senha inválido");
            return;
        }

        window.location.href = "./company_profile.html";
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

const btnSignIn = document.getElementById("sigIn");

if (btnSignIn)
    btnSignIn.addEventListener("click", handleSignInClick);


// ******* company_registration.html *******


let btnRegister = document.getElementById("register");

function handleRegisterClick(): void {

    if (saveCompanyData())
        window.location.href = "./company_profile.html";
}

btnRegister?.addEventListener("click", handleRegisterClick);

var isValidCep = false;

function validateInputFields() {

    let nameInput = check.getInput("name") as HTMLInputElement;
    let emailInput = check.getInput("email") as HTMLInputElement;
    let skillsInput = check.getInput("skills") as HTMLInputElement;
    let countryInput = check.getInput("country") as HTMLInputElement;
    let cnpjInput = check.getInput("cnpj") as HTMLInputElement;
    let stateInput = check.getInput("state") as HTMLInputElement;
    let cepInput = check.getInput("cep") as HTMLInputElement;
    let passwordInput = check.getInput("password") as HTMLInputElement;
    let descriptionInput = check.getInput("description") as HTMLInputElement;


    if (check.isEmpty(nameInput) || check.isEmpty(emailInput) ||
        check.isEmpty(skillsInput) || check.isEmpty(countryInput) ||
        check.isEmpty(cnpjInput) || check.isEmpty(stateInput) ||
        check.isEmpty(cepInput) || check.isEmpty(passwordInput) ||
        check.isEmpty(descriptionInput)) {
        alert("Error: Nenhum campo pode estar vazio");
        return false;
    }

    const isSuccessful = check.validateInput(nameInput, "nome") &&
        check.validateInput(countryInput, "país") &&
        check.validateInput(stateInput, "estado") &&
        check.validateCnpj(cnpjInput) &&
        isValidCep &&
        check.validateEmail(emailInput);

    if (!check.validatePasswordLength(passwordInput))
        return false;

    return isSuccessful;

}

const cepInput = check.getInput("cep");
if (cepInput) {
    cepInput.addEventListener('focusout', async () => {
        isValidCep = await lookupCEPAndProcessResponse(processCEPData);

    });
}

function clearAddressFields(): void {
    let stateInput: HTMLInputElement | null = document
        .getElementById('state') as HTMLInputElement | null;

    if (stateInput) {
        stateInput.value = "";
    }
}

function processCEPData(content: any) {
    if (!content.hasOwnProperty('erro')) {
        let stateInput: HTMLInputElement | null = document
            .getElementById('state') as HTMLInputElement | null;

        if (stateInput) {
            stateInput.value = content.localidade;
            return true;
        }
    }
    else {
        clearAddressFields();
        alert("Error: CEP não encontrado.");
        return false;
    }
}

function saveCompanyData() {
    if (validateInputFields()) {
        let nameInput = check.getInput("name") as HTMLInputElement;
        let emailInput = check.getInput("email") as HTMLInputElement;
        let skillsInput = check.getInput("skills") as HTMLInputElement;
        let countryInput = check.getInput("country") as HTMLInputElement;
        let cnpjInput = check.getInput("cnpj") as HTMLInputElement;
        let stateInput = check.getInput("state") as HTMLInputElement;
        let cepInput = check.getInput("cep") as HTMLInputElement;
        let passwordInput = check.getInput("password") as HTMLInputElement;
        let descriptionInput = check.getInput("description") as HTMLInputElement;

        let skills = check.parseSkillsInput(skillsInput)

        const companyLocal = {
           "name": nameInput.value,
            "email": emailInput.value,
            "skills": Array.from(skills).join().toLowerCase().trim().split(/[;, ]+/),
            "country": countryInput.value,
            "cnpj": cnpjInput.value,
            "state": stateInput.value,
            "cep": Number.parseInt(cepInput.value),
            "password": passwordInput.value,
            "description": descriptionInput.value
            // vacancy: null
        };

        sendRegisterCompany(JSON.stringify(companyLocal))

        localStorage.setItem("companyLocal", JSON.stringify(companyLocal));

        return true;
    }
    return false;
}

function sendRegisterCompany(data: any) {
    axios.post('/app/registerCompany', data, {
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



// ******* company_vacancies.html *******


let registerVacancyButton = document.getElementById("registerVacancy");

function registerVacancy() {
    let nameVacancyInput = check.getInput("nameVacancy") as HTMLInputElement;
    let skillsVacancyInput = check.getInput("skillsVacancy") as HTMLInputElement;
    let descriptionVacancyInput = check.getInput("descriptionVacancy") as HTMLInputElement;

    let companyLocal = localStorage.getItem("companyLocal");
    let companyObj = companyLocal ? JSON.parse(companyLocal) : null;

    if (!nameVacancyInput.value || !skillsVacancyInput.value ||
        !descriptionVacancyInput.value || !companyObj) {

        alert("Error: campo vazio");
        return;
    }

    let skills = check.parseSkillsInput(skillsVacancyInput);

    let now = new Date();
    let day = now.getDate().toString().padStart(2, '0');
    let month = (now.getMonth() + 1).toString().padStart(2, '0');
    let year = now.getFullYear();

    const vacancyPosting: VacancyPosting = {
        company: companyObj,
        name: nameVacancyInput.value,
        description: descriptionVacancyInput.value,
        date: `${day}/${month}/${year}`,
        skills: Array.from(skills).join()
            .toLowerCase().trim().split(/[;, ]+/)
    };

    companyObj.vacancy = JSON.parse(JSON.stringify(vacancyPosting));
    localStorage.setItem("companyLocal", JSON.stringify(companyObj));

    window.location.href = "./company_profile.html";
}

registerVacancyButton?.addEventListener("click", registerVacancy);


// ******* company_profile.html *******


function generateGraph() {

    var options = {
        chart: {
            type: "bar",
        },
        series: [
            {
                name: "candidatos",
                data: [30, 40, 10, 5, 18, 40],
            },
        ],
        xaxis: {
            categories: ["python", "c", "c++", "java", "php", "groovy"],
        },
        colors: ['#457350'],
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);

    chart.render();
}

function generateTable() {
    let tbody = document.querySelector("tbody");
    let table = document.querySelector("table");

    let company = localStorage.getItem("companyLocal");
    let candidate = localStorage.getItem("candidateLocal");

    if (!company || !candidate)
        return;

    let compObj = JSON.parse(company);
    let candiObj = JSON.parse(candidate);

    if (!compObj.vacancy)
        return;

    if (!compObj.vacancy.skills || !candiObj.skills)
        return;

    let c0 = createTableCell(compObj.vacancy.name);
    let c1 = createTableCell("x");
    let c2 = createTableCell("Engenheiro de software");
    let c3 = createTableCell(candiObj.skills.join(", "));
    let c4 = createTableCell(calculateMatchPercentage(compObj.vacancy.skills,
        candiObj.skills));

    let row = generateTableRow([c0, c1, c2, c3, c4]);

    if (tbody) {

        tbody.appendChild(row);

        if (table)
            table.appendChild(tbody);
    }
}

function createTableCell(text: string): HTMLTableCellElement {
    let cell = document.createElement('td');

    cell.innerText = text;

    return cell;
}

function generateTableRow(cells: HTMLTableCellElement[]): HTMLTableRowElement {
    let row = document.createElement('tr');

    cells.forEach((cell) => {

        row.appendChild(cell);
    });

    return row;
}

function calculateMatchPercentage(vacancySkills: string[], candidateSkills: string[]): string {

    let matchingSkills = vacancySkills.filter((skill: string) => candidateSkills.includes(skill));

    let matchPercentage = (matchingSkills.length / vacancySkills.length) * 100;

    return `${matchPercentage.toFixed(2)}%`;
}

generateGraph();

generateTable();
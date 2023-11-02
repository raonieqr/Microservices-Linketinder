//index.html
var btnCompany = document.getElementById("company");
var btnCandidate = document.getElementById("candidate");
btnCompany === null || btnCompany === void 0 ? void 0 : btnCompany.addEventListener("click", function () {
    window.location.href = "./business/intro_company.html";
});
btnCandidate === null || btnCandidate === void 0 ? void 0 : btnCandidate.addEventListener("click", function () {
    window.location.href = "./candidate/intro_candidate.html";
});

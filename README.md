# Microservices-Linketinder

This microservice is a simple implementation of a registration and login system using the Groovy language. It provides HTTP endpoints for registering new users and authenticating existing users.

# Endpoints
- /registerCandidate:
Purpose: This endpoint allows candidates to register with the system. Candidates provide personal information such as name, email address, password, skills.
Usage: Candidates can use this endpoint to create an account on the system, allowing them to apply for jobs and store information relevant to their professional profile.

- /registerCompany:
Purpose: This endpoint allows companies or employers to register with the system. Companies provide information about their organization such as name, corporate email address, password, company description.
Usage: Companies use this endpoint to create an account that will allow them to post job openings, access candidate resumes, and manage the recruiting process.

- /loginCandidate:
Purpose: This endpoint is used by candidates to log into their existing accounts. Candidates provide their name and password for authentication.
Usage: Candidates use this endpoint to access their account and perform activities related to searching for jobs, applying for vacancies.

- /loginCompany:
Purpose: Companies use this endpoint to log into their existing accounts. They provide the name and associated password for authentication.
Usage: Companies use this endpoint to access their accounts and perform actions such as posting new job openings and viewing candidate resumes.

- /registerVacancy:
Purpose: This endpoint allows companies to register a new job vacancy in the system. Companies provide details about the vacancy, such as title, description.
Usage: Companies use this endpoint to post new job opportunities, making them available for candidates to view and apply.

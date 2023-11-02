package api.microservices.model.entities

class Company extends Person {

//    int id
    String cnpj
    String description
    String state
    String country
    String password
    int cep
//    ArrayList<MatchVacancy> matchVacancies = new ArrayList<>()

    Company() {
        super()
    }

    Company(String name, String email, String cnpj, String country,
            String description, String state,
            int cep, String password) {

        super(name, email)
//        this.id = id
        this.password = password
        this.cnpj = cnpj
        this.country = country
        this.description = description
        this.state = state
        this.cep = cep
    }

    String getPassword() {
        return password
    }

    void setPassword(String password) {
        this.password = password
    }

    int getId() {
        return id
    }

    void setId(int id) {
        this.id = id
    }

    String getCnpj() {
        return cnpj
    }

    void setCnpj(String cnpj) {
        this.cnpj = cnpj
    }

    String getPais() {
        return country
    }

    void setPais(String country) {
        this.country = country
    }

    String getDescription() {
        return description
    }

    void setDescription(String description) {
        this.description = description
    }

    int getCep() {
        return cep
    }

    void setCep(int cep) {
        this.cep = cep
    }

    Vacancy getVacancy() {
        return vacancy
    }

    void setVacancy(Vacancy vacancy) {
        this.vacancy = vacancy
    }

//    ArrayList<MatchVacancy> getMatchVacancies() {
//        return matchVacancies
//    }
//
//    void setMatchVacancies(ArrayList<MatchVacancy> matchVacancies) {
//        this.matchVacancies = matchVacancies
//    }

//    static void getMatch(ArrayList<Candidate> candidates,
//                         ArrayList<Company> companies) {
//
//        candidates.each {it ->
//
//            it.getMatchVacancies().each {mv ->
//                 {
//                    companies.each {cp ->
//                    if (mv.getVacancy().getCompany().getId() == cp.getId())
//                        cp.getMatchVacancies().add(mv)
//                    }
//                }
//            }
//        }
//    }

    @Override
    void showInfo() {
        println("Nome: $name")
        println("Email: $email")
        println("CNPJ: $cnpj")
        println("País: $country")
        println("Estado: $state")
        println("CEP: $cep")
        println("Descrição: $description")

    }
}

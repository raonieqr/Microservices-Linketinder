package api.microservices.model.entities

class EntityFactory {

  static Candidate createCandidate(String name, String email,
                                          ArrayList<String> skills, int age,
                                   String state, String description, String cpf,
                                   int cep, String password) {
    return new Candidate(name, email, skills, age, state, description, cpf,
      cep, password)
  }

  static Company createCompany(String name, String email,
                                      String cnpj, String country,
                                      String description, String state,
                               int cep, String password) {
    return new Company(name, email, cnpj, country, description, state, cep,
      password)
  }
}

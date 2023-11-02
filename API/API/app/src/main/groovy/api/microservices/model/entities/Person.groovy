package api.microservices.model.entities

import api.microservices.service.PersonService


class Person implements PersonService{

    String name
    String email
    EntityFactory entityFactory

    Person() {}

    Person(String name, String email) {
        this.name = name
        this.email = email
        this.entityFactory = new EntityFactory()
    }

    String getName() {
       return name
    }

    void setName(String name) {
        this.name = name
    }

    String getEmail() {
       return email
    }

    void setEmail(String email) {
        this.email = email
    }

    @Override
    void showInfo() {}

    @Override
    Candidate createCandidateFactory(int idCandidate, String name,
                                  String email, ArrayList<String> skills,
                                  int age, String state, String description,
                                     String cpf, int cep, String password){

        return EntityFactory.createCandidate(name, email, skills,
          age, state, description, cpf, cep, password)
    }

    @Override
    Company createCompanyFactory(int idCompany, String name,
                                        String email, String cnpj,
                                        String country, String description,
                                 String state, int cep, String password) {

        return EntityFactory.createCompany(name, email, cnpj,
          country, description, state, cep, password)
    }
}
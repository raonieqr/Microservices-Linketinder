package api.microservices.dao

import api.microservices.model.entities.Company

interface CompanyDAO {

    void insertCompany(Company company)

}
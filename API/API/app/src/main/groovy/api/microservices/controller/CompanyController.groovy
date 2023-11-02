package api.microservices.controller

import api.microservices.dao.impl.CandidateDAOImpl
import api.microservices.dao.impl.CompanyDAOImpl
import api.microservices.model.entities.Company


class CompanyController {

    static void addCompany(Company company, CompanyDAOImpl companyDAOImpl) {

        companyDAOImpl.insertCompany(company)
    }

    static boolean checkCompany(String name, String password,
                                  CompanyDAOImpl companyDAOImpl) {

        return companyDAOImpl.checkCompanyExistence(name, password)
    }

}

package api.microservices.dao.impl

import api.microservices.dao.CompanyDAO
import api.microservices.db.DBHandler
import api.microservices.model.entities.Company
import groovy.sql.GroovyRowResult
import groovy.sql.Sql

class CompanyDAOImpl implements CompanyDAO{
    static CompanyDAOImpl instance

    DBHandler dbHandler = DBHandler.getInstance()
    Sql sql = dbHandler.getSql()

    static CompanyDAOImpl getInstance() {
        if (instance == null)
            instance = new CompanyDAOImpl()
        return instance
    }

    @Override
    void insertCompany(Company company) {

        try {

            sql.executeInsert("""
                INSERT INTO companies (NAME, CEP, CNPJ, STATE, 
                DESCRIPTION, EMAIL, COUNTRY, PASSWORD) 
                VALUES (${company.getName()}, ${company.getCep()},
                ${company.getCnpj()}, ${company.getState()},
                ${company.getDescription()}, ${company.getEmail()},
                ${company.getCountry()}, ${company.getPassword()})
            """)
        }
        catch (Exception e) {
            e.printStackTrace()
        }
    }

    @Override
    boolean checkCompanyExistence(String name, String password) {
        try {
            boolean result = sql.firstRow("""
            SELECT name, password
            FROM companies
            WHERE name = $name AND password = $password
           """)

            return result
        }
        catch (Exception e) {
            e.printStackTrace()
        }
    }

}

package api.microservices.dao.impl

import api.microservices.dao.VacancyDAO
import api.microservices.db.DBHandler
import api.microservices.model.entities.Company
import api.microservices.model.entities.Vacancy
import groovy.sql.GroovyRowResult
import groovy.sql.Sql

class VacancyDAOImpl implements VacancyDAO{

    static VacancyDAOImpl instance

    DBHandler dbHandler = DBHandler.getInstance()
    Sql sql = dbHandler.getSql()

    static VacancyDAOImpl getInstance() {
        if (instance == null)
            instance = new VacancyDAOImpl()
        return instance
    }

    @Override
    void insertVacancy(Vacancy vacancy) {

        sql.executeInsert("""
            INSERT INTO roles (NAME, DESCRIPTION, ID_COMPANY,
            DATE)
            VALUES (${vacancy.getName()}, ${vacancy.getDescription()},
            ${vacancy.getIdCompany()}, current_date)
        """)

        int idVacancy = sql.firstRow('SELECT currval(\'roles_id_seq\') ' +
          'as id')?.id as int

        vacancy.getSkills().each { skill ->

            GroovyRowResult containsSkill = sql.firstRow("""
                SELECT id, COUNT(*)
                FROM skills
                WHERE description = $skill
                GROUP BY id
            """)

            int idSkill

            if (containsSkill != null && containsSkill.count > 0) {
                idSkill = containsSkill.id as int
            } else {
                def result = sql
                    .firstRow("""
                        INSERT INTO skills (DESCRIPTION) VALUES (
                        $skill) RETURNING id
                     """)
                idSkill = result.id as int
            }

            sql.executeInsert("""
                            INSERT INTO roles_skills (ID_ROLE, ID_SKILL)
                            VALUES ($idVacancy, $idSkill)
            """)
        }
    }
}

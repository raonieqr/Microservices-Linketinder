package api.microservices.dao.impl

import api.microservices.dao.CandidateDAO
import api.microservices.db.DBHandler
import api.microservices.model.entities.Candidate
import groovy.sql.GroovyRowResult
import groovy.sql.Sql


class CandidateDAOImpl implements  CandidateDAO {

    static CandidateDAOImpl instance

    DBHandler dbHandler = DBHandler.getInstance()
    Sql sql = dbHandler.getSql()

    static CandidateDAOImpl getInstance() {
        if (instance == null)
            instance = new CandidateDAOImpl()
        return instance
    }

    @Override
    void insertCandidate(Candidate candidate) {

        try {

            sql.executeInsert("""
                INSERT INTO candidates (NAME, CEP, CPF, STATE,
                AGE, DESCRIPTION, EMAIL, PASSWORD) 
                VALUES (${candidate.getName()}, ${candidate.getCep()},
                ${candidate.getCpf()}, ${candidate.getState()}, 
                ${candidate.getAge()}, ${candidate.getDescription()},
                ${candidate.getEmail()}, ${candidate.getPassword()})
            """)

            int idCandidate = sql
              .firstRow('SELECT currval(\'candidates_id_seq\') as id')?.id as int

            candidate.getSkills().each { skill ->

                GroovyRowResult containsSkill = sql.firstRow("""
                    SELECT id, COUNT(*)
                    FROM skills 
                    WHERE description = $skill
                    GROUP BY id
                """)

                int idSkill

                if (containsSkill != null && containsSkill.count > 0)
                    idSkill = containsSkill.id as int
                else {

                    GroovyRowResult result = sql.firstRow("""
                       INSERT INTO skills (DESCRIPTION) VALUES (
                        $skill) RETURNING id
                    """)
                    idSkill = result.id as int

                }

                sql.executeInsert("""
                    INSERT INTO candidate_skills (ID_CANDIDATE, ID_SKILL) 
                    VALUES ($idCandidate, $idSkill)
                """)
            }
        }
        catch (Exception e) {
            e.printStackTrace()
        }
    }

    boolean checkCandidateExistence(String name, String password) {
        try {
            boolean result = sql.firstRow("""
            SELECT name, password
            FROM candidates
            WHERE name = $name AND password = $password
           """)

            return result
        }
        catch (Exception e) {
            e.printStackTrace()
        }
    }

}

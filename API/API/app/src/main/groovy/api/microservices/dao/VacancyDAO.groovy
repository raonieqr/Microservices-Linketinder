package api.microservices.dao

import api.microservices.model.entities.Vacancy


interface VacancyDAO {

    void insertVacancy(Vacancy vacancy)

}
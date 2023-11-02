package api.microservices.controller

import api.microservices.dao.impl.VacancyDAOImpl
import api.microservices.model.entities.Vacancy


class VacancyController {

    static void addVacancy(Vacancy vacancy, VacancyDAOImpl vacancyDAOImpl) {

        vacancyDAOImpl.insertVacancy(vacancy)
    }
}

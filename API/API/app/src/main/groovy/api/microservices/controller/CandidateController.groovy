package api.microservices.controller

import api.microservices.dao.impl.CandidateDAOImpl
import api.microservices.dao.impl.CompanyDAOImpl
import api.microservices.model.entities.Candidate


class CandidateController {

    static void addCandidate(Candidate candidate,
                             CandidateDAOImpl candidateDAOImpl) {

        candidateDAOImpl.insertCandidate(candidate)
    }

    static boolean checkCandidate(String name, String password,
                                CandidateDAOImpl candidateDAOImpl) {

        return candidateDAOImpl.checkCandidateExistence(name, password)
    }
}

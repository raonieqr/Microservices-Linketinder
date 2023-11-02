package api.microservices.dao

import api.microservices.model.entities.Candidate


interface CandidateDAO {

    void insertCandidate(Candidate candidate)

}
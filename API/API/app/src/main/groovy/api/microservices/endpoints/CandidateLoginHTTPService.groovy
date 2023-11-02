package api.microservices.endpoints

import api.microservices.controller.CandidateController
import api.microservices.dao.impl.CandidateDAOImpl
import api.microservices.utils.BufferReader
import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.http.HttpServlet
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.json.JSONException

class CandidateLoginHTTPService extends HttpServlet{
  @Override
  protected void doPost(HttpServletRequest request,
                        HttpServletResponse response) {

    StringBuffer stringBuffer = BufferReader.readToBuffer(request)

    try {

      ObjectMapper objectMapper = new ObjectMapper()
      Map<String, Object> map = objectMapper.readValue(stringBuffer.toString(),
        Map.class)

      String name = (String) map.get("name")
      String password = (String) map.get("password")

      if (name == null || password == null)
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST)
      else {
        try {
          boolean loginResult = CandidateController.checkCandidate(name,
            password,
            CandidateDAOImpl.getInstance())

          if (loginResult)
            response.setStatus(HttpServletResponse.SC_OK)
          else
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST)

        } catch (Exception e) {
          response.setStatus(HttpServletResponse.SC_BAD_REQUEST)

          e.printStackTrace()
        }
      }
    } catch (JSONException e) {
      throw new IOException("Error parsing JSON request string")
    }
  }
}

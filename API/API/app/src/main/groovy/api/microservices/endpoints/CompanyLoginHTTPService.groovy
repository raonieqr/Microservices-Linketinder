package api.microservices.endpoints

import api.microservices.controller.CompanyController
import api.microservices.dao.impl.CompanyDAOImpl
import api.microservices.model.entities.Company
import api.microservices.utils.BufferReader
import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.http.HttpServlet
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.json.JSONException

class CompanyLoginHTTPService extends HttpServlet{
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
          boolean loginResult = CompanyController.checkCompany(name, password,
            CompanyDAOImpl.getInstance())

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

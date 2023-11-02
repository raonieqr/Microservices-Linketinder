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

public class CompanyHTTPService extends HttpServlet {
  @Override
  protected void doPost(HttpServletRequest request,
                        HttpServletResponse response) {

    StringBuffer stringBuffer = BufferReader.readToBuffer(request)

    try {

      ObjectMapper objectMapper = new ObjectMapper()
      Map<String, Object> map = objectMapper.readValue(stringBuffer.toString(),
        Map.class)

      String name = (String) map.get("name")
      String description = (String) map.get("description")
      String country = (String) map.get("country")
      String state = (String) map.get("state")
      String password = (String) map.get("password")
      String email = (String) map.get("email")
      String cnpj = (String) map.get("cnpj")
      String cep = (String) map.get("cep")

      if (name == null || description == null ||
        country == null || password == null || email == null ||
        cnpj == null || cep == null || state == null || description == null)
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST)
      else {
        try {

          Company company = new Company(name, email, cnpj,
            country, description, state, Integer.parseInt(cep), password)

          CompanyController.addCompany(company, CompanyDAOImpl.getInstance())

          response.setStatus(HttpServletResponse.SC_CREATED)
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

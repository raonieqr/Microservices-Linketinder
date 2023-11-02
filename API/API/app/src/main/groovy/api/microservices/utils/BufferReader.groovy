package api.microservices.utils

import jakarta.servlet.http.HttpServletRequest

class BufferReader {
  static StringBuffer readToBuffer(HttpServletRequest request) {
    StringBuffer stringBuffer = new StringBuffer()
    String line = null

    try {
      BufferedReader reader = request.getReader()
      while ((line = reader.readLine()) != null) {
        stringBuffer.append(line)
      }
    } catch (Exception e) {
      e.printStackTrace()
    }
    return stringBuffer
  }

}

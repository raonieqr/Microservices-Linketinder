package api.microservices.utils

class InputValidator {

    static processSkills(String skills) {
        skills = skills.replaceAll("\\s", "")
          .replace("[", "").replace("]", "")

        ArrayList<String> skillSplited = skills.split("[;,]+")
        skillSplited = skillSplited.collect { it.toLowerCase() }
        skillSplited = skillSplited.collect { it.capitalize() }

        return skillSplited
    }

}

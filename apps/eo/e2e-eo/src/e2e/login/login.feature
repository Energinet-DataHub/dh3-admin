Feature: Login

  Background: When using the demo environment, we use an OIDC mock service to login, which provides us with logins
based on personas. Currently we have Charlotte CSR, Thomas Tesla and Ivan Iværksætter. They should all potentially
provide different mocked data, based on their production/consumption.

# DISABLED UNTIL MOCK LOGINS WORK AGAIN
# Scenario: Login as Charlotte CSR is allowed
#   Given I am on the landing page
#   When I click the first start button to login
#   And I see Charlotte CSRs login button and click it
#   Then I can see the dashboard page

# DISABLED UNTIL PRIVATE LOGINS ARE ALLOWED
# Scenario: Login as Thomas Tesla is allowed
#   Given I am on the landing page
#   When I click the first start button to login
#   And I see Thomas Tesla's login button and click it
#   Then I can see the dashboard page

# DISABLED UNTIL MOCK LOGINS WORK AGAIN
# Scenario: Login as Ivan Iværksætter is allowed
#   Given I am on the landing page
#   When I click the first start button to login
#   And I see Ivan Iværksætters login button and click it
#   Then I can see the dashboard page

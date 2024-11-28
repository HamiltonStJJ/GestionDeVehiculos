import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support.ui import Select
options = webdriver.ChromeOptions()
driver = webdriver.Chrome(options=options)

driver.get("http://localhost:3000/")

# Login
driver.find_element(By.ID, "email-intput")
.send_keys("de
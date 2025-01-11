import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC

options = webdriver.EdgeOptions()
driver = webdriver.Edge(options=options)
driver.get("http://localhost:3000/")


register_link = driver.find_element(By.LINK_TEXT, "¿Olvidaste tu contraseña?")
register_link.click()
time.sleep(2)

email = driver.find_element(By.ID, "correo")
email.send_keys("kami26guatumillo@gmail.com")
time.sleep(2)

register_btn = driver.find_element(By.ID, "recuperar-btn")
register_btn.click()
time.sleep(5);

back_login = driver.find_element(By.LINK_TEXT, "Volver a iniciar sesión")
back_login.click()
time.sleep(2);

import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC

options = webdriver.EdgeOptions()
driver = webdriver.Edge(options=options)
driver.get("http://localhost:3000/")

# INICIO DE SESION
email_input = driver.find_element(By.ID, "email-input")
password_input = driver.find_element(By.ID, "password")
login_button = driver.find_element(By.ID, "login-btn")
        
email_input.send_keys("karenguatumillo@gmail.com")
password_input.send_keys("karen123")
login_button.click()
time.sleep(4);  

# Reservar un auto
reservar_btn = driver.find_element(By.ID, "reservar-btn")
reservar_btn.click()
time.sleep(4);
close_window = driver.find_element(By.ID, "close")
close_window.click()
time.sleep(3);

#Probar filtros
comboMarca = driver.find_element(By.ID, "filterBrand")
select = Select(comboMarca)
select.select_by_visible_text("Honda")
time.sleep(4)
select.select_by_visible_text("Todas las marcas")
time.sleep(4)
price_input = driver.find_element(By.ID, "price-input")
price_input.send_keys("70")
time.sleep(3)
price_input.send_keys("120")
status_cmbx=driver.find_element(By.ID, "status-cmbx")
#status_cmbx.


driver.quit()


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
time.sleep(2);  

# Reservar un auto
reservar_btn = driver.find_element(By.ID, "reservar-btn")
reservar_btn.click()
time.sleep(2);
close_window = driver.find_element(By.ID, "close")
close_window.click()
time.sleep(3);

#Probar filtros
brandcmbx = driver.find_element(By.ID, "filterBrand")
select = Select(brandcmbx)
todas_las_opciones = select.options
for opcion in todas_las_opciones:
    select.select_by_visible_text(opcion.text)
    time.sleep(2)
select.select_by_visible_text("Todas las marcas")
time.sleep(2)

price_input = driver.find_element(By.ID, "price-input")
price_input.send_keys("70")
time.sleep(3)
price_input.clear()
price_input.send_keys("120")
time.sleep(2)

status_cmbx=driver.find_element(By.ID, "status-cmbx")
select = Select(status_cmbx)
opciones_estado = select.options
for opcion in opciones_estado:
    select.select_by_visible_text(opcion.text)
    time.sleep(2)

year_cmbx=driver.find_element(By.ID, "year-cmbx")
select = Select(year_cmbx)
select.select_by_visible_text("2024")
time.sleep(2)
select.select_by_visible_text("2000")
time.sleep(2)

#Borrar filtros
clear_filter = driver.find_element(By.ID, "clear-btn")
clear_filter.click()
time.sleep(2)

log_out = driver.find_element(By.ID, "logout-btn")
log_out.click()
time.sleep(2)



driver.quit()


import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select

# Configuración del driver
options = webdriver.EdgeOptions()
driver = webdriver.Edge(options=options)
driver.get("http://localhost:3000/")

# Paso 1: Inicio de sesión
email_input = driver.find_element(By.ID, "email-input")
password_input = driver.find_element(By.ID, "password")
login_button = driver.find_element(By.ID, "login-btn")

# Ingresar credenciales
time.sleep(1)
email_input.send_keys("programas2017hax@gmail.com")
password_input.send_keys("123")
login_button.click()

# Esperar a que cargue la página después del inicio de sesión
time.sleep(3)
'''
# Paso 2: Acceder al formulario de agregar vehículo
add_vehicle_button = driver.find_element(By.ID, "addVehicle")
add_vehicle_button.click()

# Esperar a que el formulario esté disponible
time.sleep(3)

# Paso 3: Llenar el formulario

driver.find_element(By.ID, "nombre").send_keys("Toyota Corolla")
selectMarca = driver.find_element(By.ID, "marca")
select = Select(selectMarca)
select.select_by_visible_text("Toyota")
driver.find_element(By.ID, "modelo").send_keys("2021")
driver.find_element(By.ID, "anio").send_keys("2021")
selectColor = driver.find_element(By.ID, "color")
select = Select(selectColor)
select.select_by_visible_text("Azul")
driver.find_element(By.ID, "imagen").send_keys("https://example.com/car.jpg")
driver.find_element(By.ID, "placa").send_keys("ABC-1234")
driver.find_element(By.ID, "kilometraje").send_keys("15000")
selectCombustible =driver.find_element(By.ID, "tipoCombustible")
select = Select(selectCombustible)
select.select_by_visible_text("Gasolina")
Select(driver.find_element(By.ID, "transmision")).select_by_visible_text("Automatica")
driver.find_element(By.ID, "numeroAsientos").send_keys("4")
Select(driver.find_element(By.ID, "estado")).select_by_visible_text("Disponible")
driver.find_element(By.ID, "UltimoChequeo").send_keys("28112024")
Select(driver.find_element(By.ID, "tarifas")).select_by_index(1)

time.sleep(2)

submit_button = driver.find_element(By.ID, "submit-button")
submit_button.click()
'''
time.sleep(3)

#Editar vehiculo
edit_vehicle_buttons = driver.find_elements(By.ID, "edit-button")
edit_vehicle_buttons[-1].click()
time.sleep(2)


# Modificar los datos del vehículo
driver.find_element(By.ID, "nombre").clear()
driver.find_element(By.ID, "nombre").send_keys("Honda Civic")
driver.find_element(By.ID, "modelo").clear()
driver.find_element(By.ID, "modelo").send_keys("2022")
driver.find_element(By.ID, "kilometraje").clear()
driver.find_element(By.ID, "kilometraje").send_keys("12000")
selectColor = driver.find_element(By.ID, "color")
select = Select(selectColor)
select.select_by_visible_text("Rojo")

time.sleep(2)

# Enviar los cambios
submit_button = driver.find_element(By.ID, "submit-button")
submit_button.click()

time.sleep(3)

# Eliminar vehículo
delete_vehicle_buttons = driver.find_elements(By.ID, "delete-button")
delete_vehicle_buttons[-1].click()
time.sleep(2)



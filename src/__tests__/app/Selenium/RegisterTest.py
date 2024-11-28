import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC

options = webdriver.EdgeOptions()
driver = webdriver.Edge(options=options)
driver.get("http://localhost:3000/")

register_link = driver.find_element(By.LINK_TEXT, "¿No tienes cuenta? Registrarse")
register_link.click()
time.sleep(2)
cedula = driver.find_element(By.ID, "cedula")
cedula.send_keys("1803064490")
time.sleep(2)
nombre = driver.find_element(By.ID, "nombre")
nombre.send_keys("Karen")
time.sleep(2)
apellido = driver.find_element(By.ID, "apellido")
apellido.send_keys("Guatumillo")
time.sleep(2)
direccion = driver.find_element(By.ID, "direccion")
direccion.send_keys("Ambato")
time.sleep(2)
telefono = driver.find_element(By.ID, "telefono")
telefono.send_keys("0995461235")
time.sleep(2)
email = driver.find_element(By.ID, "email")
email.send_keys("kami26guatumillo@gmail.com")
time.sleep(2)
password = driver.find_element(By.ID, "password")
password.send_keys("karen12345")
time.sleep(2)
register_btn = driver.find_element(By.ID, "register-btn")
register_btn.click()
time.sleep(3);

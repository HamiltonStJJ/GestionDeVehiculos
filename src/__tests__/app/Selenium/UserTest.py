import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

options = webdriver.EdgeOptions()
driver = webdriver.Edge(options=options)
driver.get("http://localhost:3000/")

# Encontrar los elementos del formulario
email_input = driver.find_element(By.ID, "email-input")
password_input = driver.find_element(By.ID, "password")
login_button = driver.find_element(By.ID, "login-btn")
        
# Ingresar credenciales
email_input.send_keys("karenguatumillo@gmail.com")
password_input.send_keys("karen123")
login_button.click()
        
time.sleep(3);

'''
        # Esperar a que se complete el login (ajusta según tu aplicación)
        # Por ejemplo, esperar a que aparezca un elemento que solo existe post-login
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "elemento-dashboard"))
        )
        
        # Verificar que estamos en la página correcta post-login
        assert "dashboard" in self.driver.current_url
        

    def test_login_invalid_credentials(self):
        self.driver.get("tu_url_aquí")
        
        # Encontrar los elementos del formulario
        email_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='email']")
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        login_button = self.driver.find_element(By.CSS_SELECTOR, "button")
        
        # Ingresar credenciales inválidas
        email_input.send_keys("usuario_invalido@example.com")
        password_input.send_keys("contraseña_incorrecta")
        
        # Hacer clic en el botón de ingresar
        login_button.click()
        
        # Esperar y verificar que aparece un mensaje de error
        error_message = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "error-message"))
        )
        
        assert "Credenciales inválidas" in error_message.text
        
    def test_forgot_password_link(self):
        self.driver.get("tu_url_aquí")
        
        # Encontrar y hacer clic en el enlace de "¿Olvidaste tu contraseña?"
        forgot_password_link = self.driver.find_element(By.LINK_TEXT, "¿Olvidaste tu contraseña?")
        forgot_password_link.click()
        
        # Verificar que estamos en la página de recuperación de contraseña
        assert "recuperar-contraseña" in self.driver.current_url

        '''
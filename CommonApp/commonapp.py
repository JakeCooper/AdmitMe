# Credentials 
login_email = "otherwise.known.as.chanceme@gmail.com"
login_password = "Chanceme2016!"

from pyvirtualdisplay import Display
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

import json
import re
from bs4 import BeautifulSoup as BS

# Setup Chrome

display = Display(visible=0, size=(800, 600))
display.start()
browser = webdriver.Chrome()
browser.get('https://apply.commonapp.org/login')
print browser.title


# Logging in

element = browser.find_element_by_name('UserName')
element.send_keys(login_email)

element = browser.find_element_by_name('Password')
element.send_keys(login_password + Keys.RETURN)

browser.save_screenshot('screenshot.png')

entries = {}
for index in ['2', '3', '4', '5', '7']:
    browser.get('https://apply.commonapp.org/ca4app/CommonScreen/ScreenPreview?screenId=' + index)
    text = browser.find_element_by_tag_name("body").text
    content = json.loads(text)['PopupView']
    
    html = BS(content, 'html5lib')
    body = html.body.find('div', attrs={'class' : 'ca-pdf-wrap ca-pdf-spm'})
    
    sections = body.find_all('div', attrs={'class' : 'ca-pdf-section'})
    for section in sections:
        content_dictionary = {}
        title = section.find('div', attrs={'class' : 'ca-pdf-h2'}).text
        
        rows = section.find_all('div', attrs={'class' : 'ca-pdf-row'}) + section.find_all('div', attrs={'class' : 'ca-pdf-h3'})
        for row in rows:
            try:
                subtitle = row.find('div', attrs={'class' : 'ca-pdf-title'}).text
            except:
                subtitle = "N/A"
            
            
            try:
                contents = row.find('div', attrs={'class' : 'ca-pdf-content'}).text.replace('\n', '')
                content_list = re.sub(r'\([^)]*\)', '', contents).replace("        ", ",").split(",")
            except:
                try:
                    content_list = section.find_all('div', attrs={'class' : 'ca-pdf-h3'}, recursive = True)
                    content_list = [content.text.replace('\n', '').split(",") for content in content_list]
                    content_list = sum(content_list, [])
                except:
                    content_list = row.find_all('div', attrs={'class' : 'ca-pdf-li'}, recursive = True)
                    content_list = [content.text for content in content_list]
            
            content_list = [content.replace('\n', '').lstrip().rstrip() for content in content_list]
            content_list = [value for value in content_list if value != '']
            
            content_dictionary[subtitle] = content_list
            
        entries[title] = content_dictionary
        
        
mapping = {
  # 'Weighted_GPA', 'Unweighted_GPA', 'Senior_Courses', 'Awards and ECs'
  # Not included: Income Bracket, 
  # Done on the front end: 'SAT' (composite), SAT 2 number and average
    'SAT_Math': ['SAT (before March 2016)', 'Math', 0],
    'SAT_Reading': ['SAT (before March 2016)', 'Critical Reading', 0],
    'SAT_Writing': ['SAT (before March 2016)', 'Writing', 0],
    'ACT': ['ACT', 'Composite', 0],
    'GPA': ['Grades', 'GPA', 0],
    'GPA_Weighting': ['Grades', 'GPA', 1],
    'Rank': ['Grades', 'Rank', 0],
    'School_Type': ['Current or Most Recent School', 'N/A', -2],
    'Ethnicity': ['Demographics', 'Race', 0],
    'Gender': ['Personal Information', 'Sex, Birthdate', 0],
    'SAT IIs': ['SAT Subject Tests', "list"],
    'APs': ['AP Subject Tests', "list"],
}

print mapping
data = {}
for column, map in mapping.iteritems():
    if map[-1] == "list":
        data[column] = entries[map[0]]
    else:
        data[column] = entries[map[0]][map[1]][map[2]].lower()

print data
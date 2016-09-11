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
from collections import Counter

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
                content_list = section.find_all('div', attrs={'class' : 'ca-pdf-li'}, recursive = True) + section.find_all('div', attrs={'class' : 'ca-pdf-three-quarter'})
                content_list = [content.text.replace('\n', '').split(",") for content in content_list]
                content_list = sum(content_list, [])
                
                if len(content_list) == 0:
                    try:
                        content_list = row.text.replace('\n', '').split(",")
                    except:
                        pass

            content_list = [content.replace('\n', '').lstrip().rstrip() for content in content_list]
            content_list = [value for value in content_list if value != '']
            
            content_dictionary[subtitle] = content_list
            
        entries[title] = content_dictionary
        
# print entries

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
    'Senior_Courses': ['Current or Most Recent Year Courses', "list"],
    'Rank': ['Grades', 'Rank', 0],
    'Senior_Courses': ['Current or Most Recent Year Courses', "list"],
    'School_Type': ['Current or Most Recent School', 'N/A', -2],
    'Ethnicity': ['Demographics', 'Race', 0],
    'Gender': ['Personal Information', 'Sex, Birthdate', 0],
    'SAT IIs': ['SAT Subject Tests', "list"],
    'APs': ['AP Subject Tests', "list"],
}

data = {}
for column, map in mapping.iteritems():
    try:
        if map[-1] == "list":
            data[column] = entries[map[0]]
        else:
            data[column] = entries[map[0]][map[1]][map[2]]
    except:
        print "ERROR on " + column

activity_types = [
    'Academic',
    'Art',
    'Athletics: Club',
    'Athletics: JV/Varsity',
    'Career Oriented',
    'Community Service (Volunteer)',
    'Computer/Technology',
    'Cultural',
    'Dance',
    'Debate/Speech',
    'Environmental',
    'Family Responsibilities',
    'Foreign Exchange',
    'Foreign Language',
    'Journalism/Publication',
    'Junior R.O.T.C.',
    'LGBT',
    'Music: Instrumental',
    'Music: Vocal',
    'Religious',
    'Research',
    'Robotics',
    'School Spirit',
    'Science/Math',
    'Student Govt./Politics',
    'Theater/Drama',
    'Work (Paid)',
    'Other Club/Activity',
    ]
    
text = ""
for value in entries["Honors"].values():
    text += value[0] + ": " + value[1] + "\n"
for column in entries.keys():
    if column in activity_types:
        text += column + ": " + entries[column]['N/A'][-1].replace('          ', ' ') + "\n"

data["Awards and ECs"] = text

data['GPA'] = data['GPA'][: data['GPA'].find(' ')]
data['Rank'] = data['Rank'][ : data['Rank'].find('%')].replace("Top ", "")
data['Senior_Courses'] = data['Senior_Courses']['N/A']

print json.dumps(data, sort_keys = True)
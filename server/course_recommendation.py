import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import pymongo
import pickle
import sys



data=pd.read_csv("CourseSheet.csv", encoding='latin1')
data.head()
data.to_csv("original_course_data.csv", index=False)
data[['Course Name', 'Duration']].head(25)

data.info()

redundantValues = data.duplicated()
redundantValues.sum()

nullValues = data.isnull()
nullValues.sum()

data = data.dropna(how='any',axis=0)
nullValues = data.isnull()
nullValues.sum()

#Removing the word 'weeks' from duration for better analysis
data['Duration'] = data['Duration'].str.replace('weeks', '', case=False, regex=False).str.strip().astype(int)
data[['Duration']].head(10)

topDuration = data.groupby('Course Name')['Duration'].mean().reset_index()
topDuration.sort_values('Duration', ascending=False, inplace=True)
topDuration.head(10)

topDuration.tail(10)


courseDurations=data['Duration'].value_counts()
##plt.bar(courseDurations.index, courseDurations.values)
##plt.xlabel('Duration')
##plt.ylabel('Count')
##plt.title('Number of courses in each duration')
##plt.show()

"""# *Data Preprocessing*"""

# Seperate all the words in 'About' column by a comma

data['About'] = data['About'].str.replace('_','')
data['About'] = data['About'].str.replace(':','')
data['About'] = data['About'].str.replace('(','')
data['About'] = data['About'].str.replace(')','')
data['About'] = data['About'].str.replace(' ',',')
data['About'] = data['About'].str.replace(',,',',')

# Seperate all the words in 'Prerequiste' column by a comma

data['Prerequiste'] = data['Prerequiste'].str.replace('_','')
data['Prerequiste'] = data['Prerequiste'].str.replace(':','')
data['Prerequiste'] = data['Prerequiste'].str.replace('(','')
data['Prerequiste'] = data['Prerequiste'].str.replace(')','')
data['Prerequiste'] = data['Prerequiste'].str.replace(' ',',')
data['Prerequiste'] = data['Prerequiste'].str.replace(',,',',')

# Seperate all the words in 'Course Name' column by a comma

data['Course Name'] = data['Course Name'].str.replace(':','')
data['Course Name'] = data['Course Name'].str.replace(' ',',')
data['Course Name'] = data['Course Name'].str.replace(',,',',')

# Create a new dataframe and copy 'Course Name' column into it
courseData = data[['Course Name']].copy()

data['Duration'] = data['Duration'].astype(str)
courseData['Tokens'] = data['Course Name']+data['About']+data['Prerequiste']+data['Industry support']
courseData['Tokens'] = courseData['Tokens'].str.replace(',',' ')
courseData['Course Name'] = courseData['Course Name'].str.replace(',',' ')
courseData['Tokens'] = courseData['Tokens'].apply(lambda x:x.lower())
courseData

"""# *Stemming*"""

import nltk
from nltk.stem.porter import PorterStemmer
stm = PorterStemmer()
def stemming(token):
    tk=[]
    # For each word in 'Token' column extract the root or stem word of each word
    for i in token.split():
        tk.append(stm.stem(i))
    return " ".join(tk)
courseData['Tokens'] = courseData['Tokens'].apply(stemming)

courseData.head(10)

"""# *Text Vectorization*"""

from sklearn.feature_extraction.text import CountVectorizer

# Initiate a CountVectorizer object with a maximum of 10,000 features (words)

cv = CountVectorizer(max_features=20000,stop_words='english')

# Fit the vectorizer to the 'Tokens' column in the 'courseData' DataFrame and convert it into a document-term matrix

vectors = cv.fit_transform(courseData['Tokens']).toarray()
xxx = 0;
for i in vectors[0]:
##    if(i == 1):
##        print(xxx);
    xxx=xxx+1
cv.get_feature_names_out()[124]

"""# *Cosine Similarity*"""

from sklearn.metrics.pairwise import cosine_similarity
# Calculate the cosine similarity between the document-term matrix stored in the vectors variable
similarity = cosine_similarity(vectors)
courseData.rename(columns = {'Course Name':'CourseName'}, inplace = True)
courseData

processed_data = courseData[['CourseName', 'Tokens']]
processed_data.to_csv("processed_course_data.csv", index=False)

data.rename(columns={'Course Name': 'CourseName'}, inplace=True)
# Export the similarity matrix and the dataframe containing course names and tokens

pickle.dump(similarity,open('similarity.pkl','wb'))
pickle.dump(courseData,open('courses.pkl','wb'))
pickle.dump(data,open('coursesFull.pkl','wb'))
# similarity
# data
courseData

import pandas as pd
from difflib import get_close_matches


def recommend(course, n_recommendations=6):
    if course in courseData['CourseName'].values:
        course_index = courseData[courseData['CourseName'] == course].index[0]
    else:
        close_matches = get_close_matches(course, courseData['CourseName'], n=1, cutoff=0.5)
        if close_matches:
            course_index = courseData[courseData['CourseName'] == close_matches[0]].index[0]
        else:

            return courseData['CourseName'].head(n_recommendations).tolist()

    distances = similarity[course_index]

    course_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:n_recommendations + 1]

    recommended_courses = [courseData.iloc[i[0]].CourseName for i in course_list]

    return recommended_courses

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["Project"]
mycol = mydb["professionalinformations"]
faculty_data = pd.DataFrame(list(mycol.find()))
recommendations_list = []
recommendations=[]

for index, faculty_row in faculty_data.iterrows():
    combined_info = f"{faculty_row['designation']} {faculty_row['department']} {faculty_row['specialization']}".strip()
    recommended_courses = recommend(combined_info)
    recommendations.append(recommended_courses)
    recommendations_list.append({
        'No.': index + 1,
        'Faculty details': combined_info,
        'Recommended Courses': recommended_courses
    })


recommendations_df = pd.DataFrame(recommendations_list)
recommendations_df.to_csv("faculty_recommendations.csv", index=False)


print(recommendations)

for index, faculty_row in faculty_data.iterrows():
    combined_info = f"{faculty_row['designation']} {faculty_row['department']} {faculty_row['specialization']}".strip()
    recommended_courses = recommendations[index]
    
    mycol.update_one(
        {'_id': faculty_row['_id']},  # Match document by its ID
        {'$set': {'Recommendations': recommended_courses}}
    )

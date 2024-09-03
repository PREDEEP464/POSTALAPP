import pandas as pd
from pymongo import MongoClient

# Load the cleaned dataset
df = pd.read_csv('C:/Users/dell/Desktop/post/Postal-pincode-problem-SIH/backend/all_india_PO_list1.csv')




# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['post_office_db']  # Replace with your DB name
collection = db['post_offices']  # Replace with your collection name

# Convert DataFrame to dictionary and insert into MongoDB
data_dict = df.to_dict(orient='records')
collection.insert_many(data_dict)

print("Data inserted into MongoDB successfully.")

# import pandas as pd
# from pymongo import MongoClient

# # Load the cleaned dataset
# df = pd.read_csv('C:/Users/Sarath/OneDrive/Desktop/SIH 2024/post/Postal-pincode-problem-SIH/backend/Coimbatore_Post_Offices.csv')




# # Connect to MongoDB
# client = MongoClient('mongodb://localhost:27017/')
# db = client['post_office_db']  # Replace with your DB name
# collection = db['post_offices']  # Replace with your collection name

# # Convert DataFrame to dictionary and insert into MongoDB
# data_dict = df.to_dict(orient='records')
# collection.insert_many(data_dict)

# print("Data inserted into MongoDB successfully.")


import pandas as pd
from pymongo import MongoClient

# Load the updated dataset
df = pd.read_csv('D:/SIH PROJECT/post/Postal-pincode-problem-SIH/backend/po.csv')

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['new_post_office_db']
collection = db['new_post_offices']

# Clear the existing collection to avoid duplicates
collection.delete_many({})

# Convert DataFrame to dictionary and insert into MongoDB
data_dict = df.to_dict(orient='records')
collection.insert_many(data_dict)

print("Updated data inserted into MongoDB successfully.")
